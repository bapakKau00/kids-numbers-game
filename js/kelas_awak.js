document.addEventListener('DOMContentLoaded', () => {
    const kidDropZone = document.getElementById('kidDropZone');
    const botDropZone = document.getElementById('botDropZone');
    const botHand = document.getElementById('botHand');
    const resetBtn = document.getElementById('resetBtn');
    const popSound = document.getElementById('popSound');
    const botDialogue = document.getElementById('botDialogue');

    // Remove or hide inventories as they are no longer used for drag & drop
    const kidInventory = document.getElementById('kidInventory');
    const botInventory = document.getElementById('botInventory');
    if (kidInventory) kidInventory.style.display = 'none';
    if (botInventory) botInventory.style.display = 'none';

    // Add counter displays if they don't exist
    let kidCounterDisplay = document.getElementById('kidCounterDisplay');
    if (!kidCounterDisplay) {
        kidCounterDisplay = document.createElement('div');
        kidCounterDisplay.id = 'kidCounterDisplay';
        kidCounterDisplay.style.position = 'absolute';
        kidCounterDisplay.style.top = '20px';
        kidCounterDisplay.style.left = '20px';
        kidCounterDisplay.style.fontSize = '6rem';
        kidCounterDisplay.style.fontFamily = "'Fredoka One', cursive";
        kidCounterDisplay.style.color = '#ff5252';
        kidCounterDisplay.style.textShadow = '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff';
        kidCounterDisplay.style.zIndex = '100';
        kidDropZone.parentElement.style.position = 'relative';
        kidDropZone.parentElement.appendChild(kidCounterDisplay);
    }

    let botCounterDisplay = document.getElementById('botCounterDisplay');
    if (!botCounterDisplay) {
        botCounterDisplay = document.createElement('div');
        botCounterDisplay.id = 'botCounterDisplay';
        botCounterDisplay.style.position = 'absolute';
        botCounterDisplay.style.top = '20px';
        botCounterDisplay.style.left = '20px';
        botCounterDisplay.style.fontSize = '6rem';
        botCounterDisplay.style.fontFamily = "'Fredoka One', cursive";
        botCounterDisplay.style.color = '#2196F3';
        botCounterDisplay.style.textShadow = '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff';
        botCounterDisplay.style.zIndex = '100';
        botDropZone.parentElement.style.position = 'relative';
        botDropZone.parentElement.appendChild(botCounterDisplay);
    }

    const availableEmojis = ['📖', '🍎', '🎒', '🎨', '🪴'];
    const emojiSpecs = {
        '📖': { name: 'buku', d1Audio: 'berapa-buku_pmXAMFAM.ogg' },
        '🍎': { name: 'epal', d1Audio: 'berapa-epal_kYi8SgEh.ogg' },
        '🎒': { name: 'beg', d1Audio: 'berapa-beg_s6u1NZA8.ogg' },
        '🎨': { name: 'palet warna air', d1Audio: 'berapa-palet-air_AeMI1WJh.ogg' },
        '🪴': { name: 'pokok', d1Audio: 'berapa-pokok_DWlSs8Sk.ogg' }
    };
    const MAX_ITEMS = 5;

    let currentKidCount = 0;
    let currentBotCount = 0;
    let totalItemsRound = 0;

    let botQueue = [];
    let isBotAnimating = false;

    // --- GAME LOGIC ---

    function startNewRound() {
        // Clear desks
        kidDropZone.querySelectorAll('.placed-object').forEach(el => el.remove());
        botDropZone.querySelectorAll('.placed-object').forEach(el => el.remove());

        currentKidCount = 0;
        currentBotCount = 0;
        updateCounters();

        botQueue = [];
        isBotAnimating = false;
        botHand.style.opacity = '0';

        // Pick random item and random amount (1 to 5)
        const emoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
        totalItemsRound = Math.floor(Math.random() * MAX_ITEMS) + 1;

        if (botDialogue) {
            const spec = emojiSpecs[emoji];
            botDialogue.innerText = `Berapa ${spec.name} yang ada di atas meja?`;
            botDialogue.classList.add('show');

            const d1Sound = new Audio(`assets/audio/dialog 1 bot/${spec.d1Audio}`);
            d1Sound.play().catch(() => { });
        }

        // Place items
        for (let i = 0; i < totalItemsRound; i++) {
            placeItemRandomly(kidDropZone, emoji, true);
            placeItemRandomly(botDropZone, emoji, false);
        }
    }

    function placeItemRandomly(zone, emoji, isKid) {
        const obj = document.createElement('div');
        obj.className = 'placed-object desk-item';
        obj.innerText = emoji;
        obj.dataset.counted = 'false';

        // Styling for interaction
        obj.style.cursor = isKid ? 'pointer' : 'default';
        obj.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s';

        // Random position within the desk-top area
        const deskTop = zone.querySelector('.desk-top');

        // Keep items well within the desk bounds
        let pctX = 25 + Math.random() * 50; // 25% to 75% width
        let pctY = 30 + Math.random() * 45; // 30% to 75% depth

        obj.style.left = `${pctX}%`;
        obj.style.top = `${pctY}%`;
        // translate(-50%, -100%) anchors bottom center to left/top. rotateX(-60deg) stands it up relative to the tilted desk.
        obj.style.transform = 'translate(-50%, -100%) rotateX(-60deg) scale(0)';

        deskTop.appendChild(obj);

        setTimeout(() => {
            obj.style.transform = 'translate(-50%, -100%) rotateX(-60deg) scale(1)';
        }, 50 + Math.random() * 200);

        if (isKid) {
            obj.addEventListener('click', (e) => {
                e.stopPropagation();
                if (obj.dataset.counted === 'true') return;

                // Count it!
                obj.dataset.counted = 'true';
                currentKidCount++;
                updateCounters();

                // Visual feedback
                obj.style.transform = 'translate(-50%, -100%) rotateX(-60deg) translateY(-40px) scale(1.3)';
                obj.style.filter = 'drop-shadow(0 20px 10px rgba(0,0,0,0.2))';

                if (popSound) {
                    const sound = popSound.cloneNode();
                    sound.volume = 0.5;
                    sound.play().catch(() => { });
                }

                // Play number sound
                const ext = currentKidCount === 4 ? 'ogg' : 'mp3';
                const numSound = new Audio(`assets/audio/bunyi no/no${currentKidCount}.${ext}`);
                numSound.play().catch(() => { });

                // Trigger bot to mimic clicking an uncounted item on its side
                triggerBotMimicClick();
            });
        }
    }

    function updateCounters() {
        kidCounterDisplay.innerText = currentKidCount > 0 ? currentKidCount : '';
        botCounterDisplay.innerText = currentBotCount > 0 ? currentBotCount : '';

        // Check win condition
        if (currentKidCount === totalItemsRound && currentBotCount === totalItemsRound && totalItemsRound > 0) {
            if (botDialogue) {
                // Determine the current emoji text by checking any placed object
                const anyObj = kidDropZone.querySelector('.placed-object');
                const emojiChar = anyObj ? anyObj.innerText : '📖';
                const spec = emojiSpecs[emojiChar] || emojiSpecs['📖'];
                botDialogue.innerText = `Ooo ada ${totalItemsRound} ${spec.name} yang ada dia atas meja ini.`;

                // Play Dialog 2 audio
                const d2Sound = new Audio(`assets/audio/dialog 2 bot/${spec.name}/ada ${totalItemsRound} ${spec.name}.ogg`);
                d2Sound.play().catch(() => { });
            }

            setTimeout(() => {
                if (botDialogue) botDialogue.classList.remove('show');
                // Wait briefly before clearing logic starts
                setTimeout(() => {
                    startNewRound();
                }, 500);
            }, 4000); // 4 seconds before starting next round
        }
    }

    // --- BOT LOGIC (Mimic Click) ---

    function triggerBotMimicClick() {
        botQueue.push({ action: 'click' });
        processBotQueue();
    }

    function processBotQueue() {
        if (isBotAnimating || botQueue.length === 0) return;

        isBotAnimating = true;
        const task = botQueue.shift();

        // Find an uncounted item on the bot's desk
        const botItems = Array.from(botDropZone.querySelectorAll('.placed-object')).filter(el => el.dataset.counted === 'false');

        if (botItems.length === 0) {
            isBotAnimating = false;
            return;
        }

        const targetItem = botItems[0];
        targetItem.dataset.counted = 'true'; // Reserve it

        const botRect = botDropZone.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();

        const targetX = itemRect.left - botRect.left + (itemRect.width / 2);
        const targetY = itemRect.top - botRect.top + (itemRect.height / 2);

        botHand.style.transition = 'all 0.6s ease-in-out';
        botHand.style.left = `${targetX}px`;
        botHand.style.top = `${targetY + 40}px`; // Start slightly below
        botHand.style.opacity = '1';

        setTimeout(() => {
            // "Click" motion
            botHand.style.top = `${targetY}px`;

            setTimeout(() => {
                // Actually count it
                currentBotCount++;
                updateCounters();

                // Visual feedback for bot item
                targetItem.style.transform = 'translate(-50%, -100%) rotateX(-60deg) translateY(-40px) scale(1.3)';
                targetItem.style.filter = 'drop-shadow(0 20px 10px rgba(0,0,0,0.2))';

                if (popSound) {
                    const sound = popSound.cloneNode();
                    sound.volume = 0.5;
                    sound.play().catch(() => { });
                }

                // Move hand away
                setTimeout(() => {
                    botHand.style.opacity = '0';
                    botHand.style.top = `${targetY + 40}px`;

                    setTimeout(() => {
                        isBotAnimating = false;
                        processBotQueue();
                    }, 400);
                }, 300);

            }, 200);
        }, 600);
    }

    // --- RESET LOGIC ---
    resetBtn.addEventListener('click', () => {
        startNewRound();
    });

    // Start first round
    setTimeout(startNewRound, 500);

});
