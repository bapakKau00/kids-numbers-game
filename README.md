# Misi Kelas Ceria (Let's Learn Numbers!)

An interactive, web-based educational game designed to help children learn numbers and counting through engaging visual feedback, audio instructions, and fun animations. 

## 🎮 Game Modes

### 1. Kenali Nombor (Number Recognition)
Learn numbers 1 through 5 with interactive pop-ups. Each number triggers a custom particle burst and transitions into a dedicated learning page explaining the number with visual examples.

### 2. Belajar Mengira (Counting Practice)
A multiple-choice quiz game where players count random objects (e.g., apples, books, bags) and select the correct answer. Features immediate visual/audio feedback for right and wrong answers.

### 3. Bantu Kawan (Multiplayer Co-op)
A unique two-player networked mode built with **PeerJS** where:
*   **Player 1 (Builder):** Drags and drops school items onto an interactive desk workspace.
*   **Player 2 (Counter):** Watches the items appear in real-time on their screen and must correctly count them.
*   *Note: Operates entirely via WebRTC P2P connections using simple room IDs.*

### 4. Bantu Nono (Kelas Awak | Saya)
A side-by-side interactive experience where the player (kid) is placed next to a virtual robot companion (Nono) who mimics their actions:
*   A random number of items auto-spawn on both desks.
*   The player clicks items to count them aloud (with voice audio).
*   The bot accurately mimics the player's clicks and announces the total at the end via a dynamic speech bubble.

## 🛠️ Features

*   **Responsive UI:** Tailored to work cleanly on various screen resolutions.
*   **Immersive Audio:** Includes background classroom ambience, button popping sounds, correct/wrong chimes, and spoken voice lines for counting.
*   **Modern CSS Animations:** Uses flexbox, smooth 3D CSS transforms (for the interactive tables), dragging animations, drop shadows, and particle bursts.
*   **No Backend Required:** The game runs entirely locally as static HTML/CSS/JS files. Multiplayer uses a public PeerJS signaling server.

## 🚀 How to Run

1.  Clone or download the repository.
2.  Since some browsers restrict file-loading for modules and audio due to CORS policies, it is recommended to run this project through a local web server. 
    *   If using VS Code, use the **Live Server** extension.
    *   Alternatively, using Python: `python -m http.server 8000`
    *   Using Node/npx: `npx serve .`
3.  Open `http://localhost:8000/index.html` in your web browser.

## 📂 File Structure

*   `/assets` - Images, UI objects, and audio files.
*   `/css` - Stylesheets representing general aesthetics (`style.css`), desk positioning (`desk.css`), and more.
*   `/js` - Core logic for different modes (`main.js`, `counting.js`, `bantu.js`, `kelas_awak.js`).
*   `/workflows` & Root HTML files represent individual components and screens.

## 📚 Libraries Used

*   **[PeerJS](https://peerjs.com/)** - Used for simple peer-to-peer connection in the "Bantu Kawan" multiplayer game mode.
