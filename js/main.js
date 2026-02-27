document.addEventListener('DOMContentLoaded', () => {
    console.log('Classroom Board Initialized');

    const scene = document.querySelector('.scene');
    const colors = [
        '#ffeb3b', '#4fc3f7', '#ff8a80', '#ccff90',
        '#ffd180', '#b2ff59', '#cfd8dc', '#f8bbd0'
    ];

    const startBtn = document.getElementById('startBtn');

    // Create falling numbers (Rain Effect)
    const createFallingNumber = () => {
        const num = document.createElement('div');
        num.className = 'falling-number';
        num.innerText = Math.floor(Math.random() * 10);

        const side = Math.random() > 0.5 ? 'left' : 'right';
        const horizontalPos = Math.random() * 15; // Stay near the edges

        if (side === 'left') {
            num.style.left = `${horizontalPos}%`;
        } else {
            num.style.right = `${horizontalPos}%`;
        }

        num.style.color = colors[Math.floor(Math.random() * colors.length)];
        num.style.fontSize = `${2 + Math.random() * 3}rem`;

        const duration = 5 + Math.random() * 10;
        num.style.animationDuration = `${duration}s`;

        scene.appendChild(num);

        // Remove after animation finishes
        setTimeout(() => {
            num.remove();
        }, duration * 1000);
    };

    // Initial burst and continuous spawn (Only if scene exists and not on final or number1/2 page)
    const currentPage = window.location.pathname.split('/').pop();
    if (scene && currentPage !== 'final.html' && currentPage !== 'number1.html' && currentPage !== 'number2.html' && currentPage !== 'number3.html' && currentPage !== 'number4.html' && currentPage !== 'number5.html') {
        for (let i = 0; i < 15; i++) {
            setTimeout(createFallingNumber, Math.random() * 5000);
        }
        setInterval(createFallingNumber, 1500);
    }

    // Create random sparkles periodically (Only if scene exists)
    if (scene) {
        setInterval(() => {
            createSparkle();
        }, 1000);
    }

    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        sparkle.style.left = `${x}%`;
        sparkle.style.top = `${y}%`;

        if (!scene) return;
        scene.appendChild(sparkle);

        // Remove after animation
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }

    // Page Transition Logic
    const transitionOverlay = document.getElementById('transitionOverlay');

    // Handle entry transition (contraction)
    if (transitionOverlay && transitionOverlay.classList.contains('out')) {
        setTimeout(() => {
            transitionOverlay.classList.add('hidden');
        }, 100);
    }

    // Number burst on click and navigate with transition
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            // Burst particles
            for (let i = 0; i < 20; i++) {
                createNumberParticle(e.clientX, e.clientY);
            }

            // Trigger Iris Expansion
            if (transitionOverlay) {
                transitionOverlay.classList.add('active');
            }

            // Decide where to navigate based on current page
            const currentPage = window.location.pathname.split('/').pop();
            const targetPage = (currentPage === 'game.html') ? 'final.html' : 'game.html';

            // Navigate after transition is mostly opaque
            setTimeout(() => {
                window.location.href = targetPage;
            }, 750);
        });
    }

    const countingGameBtn = document.getElementById('countingGameBtn');
    if (countingGameBtn) {
        countingGameBtn.addEventListener('click', (e) => {
            for (let i = 0; i < 20; i++) {
                createNumberParticle(e.clientX, e.clientY);
            }
            if (transitionOverlay) {
                transitionOverlay.classList.add('active');
            }
            setTimeout(() => {
                window.location.href = 'counting.html';
            }, 750);
        });
    }

    const bantuGameBtn = document.getElementById('bantuGameBtn');
    if (bantuGameBtn) {
        bantuGameBtn.addEventListener('click', (e) => {
            for (let i = 0; i < 20; i++) {
                createNumberParticle(e.clientX, e.clientY);
            }
            if (transitionOverlay) {
                transitionOverlay.classList.add('active');
            }
            setTimeout(() => {
                window.location.href = 'bantu.html';
            }, 750);
        });
    }

    // Secondary button on game page (startGameBtn)
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', (e) => {
            for (let i = 0; i < 20; i++) {
                createNumberParticle(e.clientX, e.clientY);
            }
            if (transitionOverlay) {
                transitionOverlay.classList.add('active');
            }
            setTimeout(() => {
                window.location.href = 'final.html';
            }, 750);
        });
    }

    // Interactive Number Spots on Final Page
    const numberSpots = document.querySelectorAll('.number-spot');
    numberSpots.forEach(spot => {
        spot.addEventListener('click', (e) => {
            const num = spot.getAttribute('data-number');

            // Create a bigger burst
            for (let i = 0; i < 15; i++) {
                createNumberParticle(e.clientX, e.clientY);
            }

            // Add click animation class
            spot.classList.add('clicked');

            // If it's number 1, navigate to the dedicated page
            if (num === '1') {
                const transitionOverlay = document.getElementById('transitionOverlay');
                if (transitionOverlay) {
                    transitionOverlay.classList.remove('hidden');
                    transitionOverlay.classList.remove('out');
                    transitionOverlay.classList.add('active');
                }
                setTimeout(() => {
                    window.location.href = 'number1.html';
                }, 750);
            } else if (num === '2') {
                const transitionOverlay = document.getElementById('transitionOverlay');
                if (transitionOverlay) {
                    transitionOverlay.classList.remove('hidden');
                    transitionOverlay.classList.remove('out');
                    transitionOverlay.classList.add('active');
                }
                setTimeout(() => {
                    window.location.href = 'number2.html';
                }, 750);
            } else if (num === '3') {
                const transitionOverlay = document.getElementById('transitionOverlay');
                if (transitionOverlay) {
                    transitionOverlay.classList.remove('hidden');
                    transitionOverlay.classList.remove('out');
                    transitionOverlay.classList.add('active');
                }
                setTimeout(() => {
                    window.location.href = 'number3.html';
                }, 750);
            } else if (num === '4') {
                const transitionOverlay = document.getElementById('transitionOverlay');
                if (transitionOverlay) {
                    transitionOverlay.classList.remove('hidden');
                    transitionOverlay.classList.remove('out');
                    transitionOverlay.classList.add('active');
                }
                setTimeout(() => {
                    window.location.href = 'number4.html';
                }, 750);
            } else if (num === '5') {
                const transitionOverlay = document.getElementById('transitionOverlay');
                if (transitionOverlay) {
                    transitionOverlay.classList.remove('hidden');
                    transitionOverlay.classList.remove('out');
                    transitionOverlay.classList.add('active');
                }
                setTimeout(() => {
                    window.location.href = 'number5.html';
                }, 750);
            } else {
                // Re-show after a delay for other numbers
                setTimeout(() => {
                    spot.classList.remove('clicked');
                }, 2000);
            }
        });
    });

    // --- Background Music Manager ---
    const bgMusic = new Audio('assets/audio/bckgrnd music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.4; // Lowered volume

    const musicToggle = document.getElementById('musicToggle');
    let isMusicPlaying = localStorage.getItem('musicPlaying') === 'true';

    // Resume playback if it was allowed
    if (isMusicPlaying) {
        const savedTime = localStorage.getItem('musicTime') || 0;
        bgMusic.currentTime = parseFloat(savedTime);

        // Try to play immediately (works if previously interacted with origin)
        const playAttempt = bgMusic.play();

        if (playAttempt !== undefined) {
            playAttempt.catch(() => {
                console.log("Autoplay blocked. Waiting for interaction...");
                const startAudio = () => {
                    if (isMusicPlaying) bgMusic.play();
                    document.removeEventListener('click', startAudio);
                    document.removeEventListener('touchstart', startAudio);
                };
                document.addEventListener('click', startAudio);
                document.addEventListener('touchstart', startAudio);
            });
        }
    } else {
        if (musicToggle) musicToggle.classList.add('muted');
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();

            if (bgMusic.paused) {
                bgMusic.play();
                isMusicPlaying = true;
                musicToggle.classList.remove('muted');
            } else {
                bgMusic.pause();
                isMusicPlaying = false;
                musicToggle.classList.add('muted');
            }

            localStorage.setItem('musicPlaying', isMusicPlaying);
        });
    }

    // Save playback position more frequently and on navigation
    const saveTime = () => {
        if (isMusicPlaying && !bgMusic.paused) {
            localStorage.setItem('musicTime', bgMusic.currentTime);
        }
    };

    window.addEventListener('beforeunload', saveTime);
    setInterval(saveTime, 500); // 500ms for tighter syncing

    function createNumberParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'number-particle';
        particle.innerText = Math.floor(Math.random() * 10);

        const style = {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            fontSize: `${20 + Math.random() * 20}px`,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            pointerEvents: 'none',
            fontFamily: 'Fredoka One, cursive',
            zIndex: 100,
            transition: 'all 1s ease-out'
        };

        Object.assign(particle.style, style);
        document.body.appendChild(particle);

        // Animate out
        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 100;
            particle.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) rotate(${Math.random() * 360}deg)`;
            particle.style.opacity = 0;
        }, 10);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    // Number 1 Example Popup Logic
    const showExampleBtn = document.getElementById('showExampleBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupDim = document.getElementById('popupDim');
    const examplePopup = document.getElementById('examplePopup');

    if (showExampleBtn && examplePopup && popupDim && closePopupBtn) {
        showExampleBtn.addEventListener('click', () => {
            popupDim.classList.add('active');
            examplePopup.classList.add('active');
        });

        const closePopup = () => {
            popupDim.classList.remove('active');
            examplePopup.classList.remove('active');
        };

        closePopupBtn.addEventListener('click', closePopup);
        popupDim.addEventListener('click', closePopup);
    }
});

