# Speech-to-Text Web Application

## Overview

This project is a **simple web application** that records audio from the user’s microphone, converts the speech to text in **real-time**, and displays the transcript live on the web page. The app supports multiple languages including **Arabic**, **English**, **French**, **Spanish**, and **German**.

This solution is built using:

- **Web Speech API (SpeechRecognition)** for speech-to-text conversion.
- **HTML, CSS, and JavaScript** for frontend user interface.
- Responsive and interactive UI with buttons for start, stop, reset, and download transcript.
- Live streaming of interim and final recognized speech without losing any part of the spoken input.

---

## Features

- **Real-time speech recognition** with continuous streaming.
- Supports **multiple languages** selectable from a dropdown.
- Visual feedback during recording with animated microphone icon.
- Buttons to **start**, **stop**, **reset** the transcript, and **download** the final text.
- Error handling and user-friendly status messages.
- Responsive design with Arabic (RTL) and English (LTR) support.
- Transcript accumulates all recognized speech without dropping initial parts.
- Compatible with modern browsers (Google Chrome recommended).

---

## File Structure

project-root/
│
├── index.html # Main webpage with UI controls and transcript area
├── styles.css # Stylesheet for layout, colors, icons, and animations
├── script.js # JavaScript logic for speech recognition and UI interaction
├── assets/ # Folder for images, icons, and background assets
│ └── background.jpg
└── README.md # This documentation file


---

## How to Run the Project

1. **Clone or download** the repository to your local machine.

2. Open the project folder in your favorite code editor (e.g., VS Code).

3. Open the `index.html` file in a **modern web browser** (preferably Google Chrome).

4. Allow the webpage to access your **microphone** when prompted.

5. Select the desired **language** from the dropdown menu.

6. Click the **Start Recording** button (microphone icon) to begin speech recognition.

7. The live transcript will appear instantly as you speak.

8. Click **Stop Recording** to end the session.

9. Use the **Reset** button to clear the transcript and start fresh.

10. Use the **Download Text** button to save the transcript as a `.txt` file.

---

## Important Notes

- The app requires microphone permission to function.
- Continuous recording is enabled; however, some browsers may auto-stop recognition after a short silence. The app automatically restarts recognition if recording is ongoing.
- Make sure to use Google Chrome or any browser that supports the Web Speech API.
- The transcript supports both interim (partial) and final results displayed with visual differentiation.
- The app interface automatically switches between **RTL** and **LTR** layouts based on the selected language.

---

## Development Details

- The speech recognition instance is configured to run in continuous mode with interim results enabled.
- A global variable accumulates all finalized transcript parts to ensure no text is lost.
- The UI updates dynamically to reflect recording state and availability of actions.
- The microphone icon animates while recording to give visual feedback.
- Language changes dynamically adjust the recognition language and UI direction without resetting the transcript.
- Error messages are displayed clearly to the user in the selected language.
- Download functionality creates a plain text file with the transcript content.
- The design includes a semi-transparent background overlay for better readability and aesthetics.

---

## Future Improvements (Optional)

- Add live translation of speech to other languages.
- Implement speaker diarization (distinguish between different speakers).
- Integrate speech emotion recognition.
- Add more UI themes and customization options.
- Support saving transcripts to the cloud or database.
- Add voice commands for controlling the app.

---

## License

This project is for **educational purposes only** and is not intended for commercial use.

---

## Author

Mahmoud Ahmad Mohammed Hamam  
Intelligent Systems Engineering Student  
Email: Mahoudhamam892@gmail.com

---

## Contact

Feel free to reach out for questions, feedback, or collaboration opportunities.

---

