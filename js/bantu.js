document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const overlay = document.getElementById('connectionOverlay');
    const chooseBuilder = document.getElementById('chooseBuilder');
    const chooseCounter = document.getElementById('chooseCounter');
    const builderConn = document.getElementById('builderConn');
    const counterConn = document.getElementById('counterConn');
    const builderView = document.getElementById('builderView');
    const counterView = document.getElementById('counterView');
    const myIdDisplay = document.getElementById('myId');
    const friendIdInput = document.getElementById('friendId');
    const connectBtn = document.getElementById('connectBtn');
    const connStatus = document.getElementById('connStatus');
    const joinStatus = document.getElementById('joinStatus');

    const inventory = document.getElementById('inventory');
    const dropZone = document.getElementById('dropZone');
    const limitText = document.getElementById('limitText');
    const readyBtn = document.getElementById('readyBtn');
    const builderReset = document.getElementById('builderReset');
    const optionsGrid = document.getElementById('optionsGrid');
    const hintText = document.getElementById('hintText');
    const feedbackOverlay = document.getElementById('feedbackOverlay');
    const nextBtn = document.getElementById('nextBtn');

    const yaySound = new Audio('assets/audio/yayyy-sound.mp3');
    const awwSound = new Audio('assets/audio/awww-sound.mp3');
    const popSound = new Audio('assets/audio/pop.mp3');

    let peer = null;
    let conn = null;
    let myRole = null;
    let placedObjectsCount = 0;
    const MAX_OBJECTS = 5;

    // --- Role Selection ---
    chooseBuilder.onclick = () => {
        myRole = 'builder';
        chooseBuilder.classList.add('active');
        chooseCounter.classList.remove('active');
        builderConn.style.display = 'block';
        counterConn.style.display = 'none';
        initPeer();
    };

    chooseCounter.onclick = () => {
        myRole = 'counter';
        chooseCounter.classList.add('active');
        chooseBuilder.classList.remove('active');
        counterConn.style.display = 'block';
        builderConn.style.display = 'none';
        initPeer();
    };

    function initPeer() {
        if (peer) return;

        // Generate a 4-digit ID for easier entry
        const shortId = Math.floor(1000 + Math.random() * 9000).toString();

        peer = new Peer(shortId);

        peer.on('open', (id) => {
            myIdDisplay.innerText = id;
            if (myRole === 'counter') {
                joinStatus.innerText = "Sedia menyambung";
            }
        });

        peer.on('connection', (connection) => {
            conn = connection;
            setupConnection();
            connStatus.innerText = "Kawan sudah masuk! 🎉";
            setTimeout(startGame, 1000);
        });

        peer.on('error', (err) => {
            console.error(err);
            alert("Ralat sambungan. Sila cuba lagi.");
        });
    }

    connectBtn.onclick = () => {
        const friendId = friendIdInput.value;
        if (friendId.length !== 4) return;

        joinStatus.innerText = "Menyambung...";
        conn = peer.connect(friendId);

        conn.on('open', () => {
            setupConnection();
            joinStatus.innerText = "Berjaya disambung! 🤝";
            setTimeout(startGame, 1000);
        });

        conn.on('error', () => {
            joinStatus.innerText = "Gagal menyambung. Periksa kod.";
        });
    };

    function setupConnection() {
        conn.on('data', (data) => {
            if (data.type === 'place') {
                renderRemoteObject(data.emoji, data.x, data.y);
            } else if (data.type === 'ready') {
                showCounterOptions(data.count);
            } else if (data.type === 'reset') {
                location.reload();
            } else if (data.type === 'clear') {
                clearRemoteItems();
            } else if (data.type === 'feedback') {
                showFeedback(data.success);
            }
        });
    }

    function startGame() {
        overlay.style.transform = 'translateY(-100%)';
        if (myRole === 'builder') {
            builderView.style.display = 'flex';
        } else {
            counterView.style.display = 'flex';
        }
    }

    // --- Builder Logic ---
    inventory.addEventListener('dragstart', (e) => {
        if (placedObjectsCount >= MAX_OBJECTS) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('emoji', e.target.dataset.emoji);
    });

    const builderDropZone = document.getElementById('builderDropZone');
    if (builderDropZone) {
        builderDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            builderDropZone.style.background = 'rgba(255,255,255,0.8)';
        });

        builderDropZone.addEventListener('dragleave', () => {
            builderDropZone.style.background = 'rgba(255,255,255,0.5)';
        });

        builderDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            builderDropZone.style.background = 'rgba(255,255,255,0.5)';

            if (placedObjectsCount >= MAX_OBJECTS) return;

            const emoji = e.dataTransfer.getData('emoji');
            if (!emoji) return;

            // Calculate relative drop position for sync
            const rect = builderDropZone.getBoundingClientRect();
            const x = e.clientX - rect.left - 25;
            const y = e.clientY - rect.top - 25;

            // Show locally on builder side (preview)
            renderLocalBuilderObject(emoji, x, y);

            placedObjectsCount++;
            limitText.innerText = placedObjectsCount;

            if (conn) {
                conn.send({ type: 'place', emoji, x, y });
            }
        });
    }

    function renderLocalBuilderObject(emoji, x, y) {
        const obj = document.createElement('div');
        obj.className = 'placed-object floating'; // Add floating for design consistency
        obj.innerText = emoji;
        obj.style.left = `${x}px`;
        obj.style.top = `${y}px`;
        builderDropZone.appendChild(obj);
        popSound.currentTime = 0;
        popSound.play().catch(e => console.log("Audio play failed:", e));
    }

    readyBtn.onclick = () => {
        if (placedObjectsCount === 0) return;
        readyBtn.disabled = true;
        if (conn) {
            conn.send({ type: 'ready', count: placedObjectsCount });
        }
    };

    builderReset.onclick = () => {
        if (conn) conn.send({ type: 'clear' });

        // Clear locally
        const objects = builderDropZone.querySelectorAll('.placed-object');
        objects.forEach(obj => obj.remove());
        placedObjectsCount = 0;
        limitText.innerText = 0;
        readyBtn.disabled = false;
    };

    // --- Counter Logic ---
    function renderRemoteObject(emoji, x, y) {
        hintText.style.display = 'none';
        const obj = document.createElement('div');
        obj.className = 'placed-object counting-object floating';
        obj.innerText = emoji;

        // Add random delay to float for variety
        obj.style.animationDelay = `${Math.random() * 2}s`;

        obj.style.left = `${x}px`;
        obj.style.top = `${y}px`;

        let localCounted = 0;
        obj.onclick = () => {
            if (optionsGrid.style.display === 'flex' && !obj.classList.contains('counted')) {
                const totalCounted = document.querySelectorAll('.placed-object.counted').length + 1;
                obj.classList.add('counted');

                const ext = totalCounted === 4 ? 'ogg' : 'mp3';
                const audio = new Audio(`assets/audio/bunyi no/no${totalCounted}.${ext}`);
                audio.play();

                obj.style.transform = 'scale(1.5)';
                setTimeout(() => obj.style.transform = '', 200);
            }
        };

        dropZone.appendChild(obj);
        popSound.currentTime = 0;
        popSound.play().catch(e => console.log("Audio play failed:", e));
    }

    function clearRemoteItems() {
        const objects = dropZone.querySelectorAll('.placed-object');
        objects.forEach(obj => obj.remove());
        hintText.style.display = 'block';
        optionsGrid.style.display = 'none';
    }

    function showCounterOptions(count) {
        hintText.style.display = 'none';
        optionsGrid.style.display = 'flex';
        optionsGrid.innerHTML = '';

        let options = [count];
        while (options.length < 3) {
            let wrong = Math.floor(Math.random() * 5) + 1;
            if (!options.includes(wrong)) options.push(wrong);
        }
        options.sort(() => Math.random() - 0.5);

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => {
                const isCorrect = opt === count;
                if (conn) conn.send({ type: 'feedback', success: isCorrect });
                showFeedback(isCorrect);
            };
            optionsGrid.appendChild(btn);
        });
    }

    function showFeedback(success) {
        const emojiEl = document.getElementById('feedbackEmoji');
        const textEl = document.getElementById('feedbackText');

        if (success) {
            emojiEl.innerText = '🌟';
            textEl.innerText = 'Hebat! Kamu Berjaya!';
            yaySound.play();
        } else {
            emojiEl.innerText = '😅';
            textEl.innerText = 'Cuba lagi!';
            awwSound.play();
        }
        feedbackOverlay.classList.add('active');
    }

    nextBtn.onclick = () => {
        feedbackOverlay.classList.remove('active');

        if (role === 'builder') {
            const objects = builderDropZone.querySelectorAll('.placed-object');
            objects.forEach(obj => obj.remove());
            placedObjectsCount = 0;
            limitText.innerText = 0;
            readyBtn.disabled = false;
            if (conn) conn.send({ type: 'clear' });
        } else if (role === 'counter') {
            clearRemoteItems();
            if (conn) conn.send({ type: 'clear' }); // In case counter hits it first
        }
    };
});

