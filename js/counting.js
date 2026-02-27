document.addEventListener('DOMContentLoaded', () => {
    const objectsDisplay = document.getElementById('objectsDisplay');
    const optionsContainer = document.getElementById('options');
    const scoreElement = document.getElementById('score');
    const feedbackOverlay = document.getElementById('feedbackOverlay');
    const feedbackEmoji = document.getElementById('feedbackEmoji');
    const feedbackText = document.getElementById('feedbackText');
    const nextBtn = document.getElementById('nextBtn');

    let currentScore = 0;
    let correctAnswer = 0;

    const emojis = ['📖', '✏️', '🎒', '🚌', '✂️', '🎨', '📐', '🖍️', '🏫', '🧪'];
    const feedbackSuccess = [
        { emoji: '🌟', text: 'Hebat!' },
        { emoji: '🎉', text: 'Betul!' },
        { emoji: '👍', text: 'Bagus!' },
        { emoji: '🌈', text: 'Pandai!' }
    ];

    const yaySound = new Audio('assets/audio/yayyy-sound.mp3');
    const awwSound = new Audio('assets/audio/awww-sound.mp3');

    function generateQuestion() {
        // Clear previous
        objectsDisplay.innerHTML = '';
        optionsContainer.innerHTML = '';
        feedbackOverlay.classList.remove('active');

        // Random number 1-10 (or 1-5 if preferred for younger kids)
        correctAnswer = Math.floor(Math.random() * 5) + 1; // Keeping it 1-5 for now
        const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Track objects counted in this round
        let objectsChecked = 0;

        // Display objects
        for (let i = 0; i < correctAnswer; i++) {
            const span = document.createElement('span');
            span.innerText = selectedEmoji;
            span.className = 'counting-object';
            span.style.animation = `float ${2 + Math.random()}s infinite ease-in-out`;

            span.onclick = () => {
                if (!span.classList.contains('counted')) {
                    objectsChecked++;
                    span.classList.add('counted');

                    // Play sequential voice sound
                    const ext = objectsChecked === 4 ? 'ogg' : 'mp3';
                    const voice = new Audio(`assets/audio/bunyi no/no${objectsChecked}.${ext}`);
                    voice.play();

                    // Optional: Small pop animation on click
                    span.style.transform = 'scale(1.5)';
                    setTimeout(() => {
                        span.style.transform = '';
                    }, 200);
                }
            };

            objectsDisplay.appendChild(span);
        }

        // Generate options
        let options = [correctAnswer];
        while (options.length < 3) {
            let wrong = Math.floor(Math.random() * 6) + 1;
            if (!options.includes(wrong)) {
                options.push(wrong);
            }
        }

        // Shuffle options
        options.sort(() => Math.random() - 0.5);

        // Create buttons
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => checkAnswer(opt, btn);
            optionsContainer.appendChild(btn);
        });
    }

    function checkAnswer(selected, btn) {
        const allButtons = document.querySelectorAll('.option-btn');
        allButtons.forEach(b => b.style.pointerEvents = 'none');

        if (selected === correctAnswer) {
            btn.classList.add('correct');
            currentScore += 10;
            scoreElement.innerText = currentScore;

            yaySound.play();

            setTimeout(() => {
                showFeedback(true);
            }, 500);
        } else {
            btn.classList.add('wrong');
            awwSound.play();

            // Show correct answer too
            allButtons.forEach(b => {
                if (parseInt(b.innerText) === correctAnswer) {
                    b.classList.add('correct');
                }
            });

            setTimeout(() => {
                showFeedback(false);
            }, 800);
        }
    }

    function showFeedback(isCorrect) {
        if (isCorrect) {
            const pick = feedbackSuccess[Math.floor(Math.random() * feedbackSuccess.length)];
            feedbackEmoji.innerText = pick.emoji;
            feedbackText.innerText = pick.text;
            feedbackText.style.color = '#4caf50';
        } else {
            feedbackEmoji.innerText = '😅';
            feedbackText.innerText = 'Cuba Lagi!';
            feedbackText.style.color = '#f44336';
        }
        feedbackOverlay.classList.add('active');
    }

    nextBtn.onclick = () => {
        generateQuestion();
    };

    // Initial Start
    generateQuestion();
});

