// script.js — streaming, no early cut, stable resume
const startBtn     = document.getElementById("startBtn");
const stopBtn      = document.getElementById("stopBtn");
const resetBtn     = document.getElementById("resetBtn");
const downloadBtn  = document.getElementById("downloadBtn");
const output       = document.getElementById("output");
const statusEl     = document.getElementById("status");
const langSelect   = document.getElementById("lang");
const htmlEl       = document.documentElement;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isRecording = false;
// Accumulates *all* finalized text so nothing is lost between result events
let finalTranscriptAgg = "";

// Basic sanitizer for safety in innerHTML
function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initialize recognition instance with current language & streaming config
function initRecognition() {
  recognition = new SpeechRecognition();
  recognition.lang = langSelect.value || "ar-SA";
  recognition.continuous = true;     // keep engine running
  recognition.interimResults = true; // stream partials

  recognition.onstart = () => {
    // UI updates at the moment engine actually starts
    statusEl.textContent = langSelect.value.startsWith("ar") ? "يتم التسجيل..." : "Recording...";
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = true; // prevent wiping mid-stream (user can stop then reset)
    downloadBtn.disabled = true;
    startBtn.classList.add("recording");
  };

  recognition.onresult = (event) => {
    // Keep a fresh interim buffer, *do not* re-init final aggregate here
    let interim = "";

    // Walk through results from current index
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      const text = res[0].transcript;
      if (res.isFinal) {
        // Append finals to the global aggregate so nothing is lost
        finalTranscriptAgg += text + " ";
      } else {
        interim += text;
      }
    }

    // Render agg + interim (interim is styled lighter via CSS .interim)
    output.innerHTML =
      escapeHtml(finalTranscriptAgg) +
      (interim ? `<span class="interim">${escapeHtml(interim)}</span>` : "");

    // Enable downloading once we have any text
    if (finalTranscriptAgg.trim() || interim.trim()) {
      downloadBtn.disabled = false;
    }
  };

  recognition.onerror = (e) => {
    console.error("Speech error:", e);
    statusEl.textContent = (langSelect.value.startsWith("ar") ? "خطأ: " : "Error: ") + (e.error || "Unknown");
    // Do not clear finalTranscriptAgg on errors; allow user to stop/reset if needed
  };

  recognition.onend = () => {
    // Chrome may auto-end after short silence; if user is still recording, restart seamlessly
    if (isRecording) {
      try { recognition.start(); } catch (err) { console.warn("Restart failed:", err); }
    } else {
      // Normal end (user pressed Stop)
      statusEl.textContent = langSelect.value.startsWith("ar") ? "متوقف" : "Stopped";
      startBtn.disabled = false;
      stopBtn.disabled = true;
      resetBtn.disabled = !output.textContent.trim(); // enable reset when there is text
      startBtn.classList.remove("recording");
    }
  };
}

async function startRecording() {
  // Proactively ask for mic to avoid first-utterance drop on some setups
  try { await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch {
    statusEl.textContent = langSelect.value.startsWith("ar")
      ? "يرجى السماح بالوصول للميكروفون"
      : "Please allow microphone access";
    return;
  }

  if (!recognition) initRecognition();
  recognition.lang = langSelect.value;

  // IMPORTANT: do not clear finalTranscriptAgg here — user can use Reset to clear
  isRecording = true;
  try { recognition.start(); } catch (e) { console.warn("start() called too soon", e); }
}

function stopRecording() {
  isRecording = false;
  try { recognition && recognition.stop(); } catch (e) { console.warn("stop() issue", e); }
}

function resetTranscript() {
  finalTranscriptAgg = "";
  output.textContent = "";
  resetBtn.disabled = true;
  downloadBtn.disabled = true;
  statusEl.textContent = langSelect.value.startsWith("ar") ? "مستعد" : "Ready";
}

function downloadTranscript() {
  const text = output.textContent;
  if (!text) return;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transcript.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// Event: Start
startBtn.addEventListener("click", () => {
  startRecording();
});

// Event: Stop
stopBtn.addEventListener("click", () => {
  stopRecording();
  // Allow user to reset or download after stop
  resetBtn.disabled = !output.textContent.trim();
  downloadBtn.disabled = !output.textContent.trim();
});

// Event: Reset
resetBtn.addEventListener("click", () => {
  resetTranscript();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Event: Download
downloadBtn.addEventListener("click", () => {
  downloadTranscript();
});

// Language change: switch UI direction and engine language without losing accumulated text
langSelect.addEventListener("change", () => {
  if (langSelect.value.startsWith("ar")) {
    htmlEl.lang = "ar";
    htmlEl.dir = "rtl";
    statusEl.textContent = "مستعد";
  } else {
    htmlEl.lang = "en";
    htmlEl.dir = "ltr";
    statusEl.textContent = "Ready";
  }

  const wasRecording = isRecording;
  if (recognition && wasRecording) {
    // Soft-restart with new language; keep aggregated text intact
    try { recognition.stop(); } catch {}
    // onend will auto-restart because isRecording is still true
  } else if (recognition) {
    recognition.lang = langSelect.value;
  }
});
