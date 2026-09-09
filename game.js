// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game State
const gameState = {
    currentScene: 'mainMenu',
    selectedCharacter: null,
    gameRunning: false,
    paused: false
};

// Player Object
const player = {
    name: '',
    character: '',
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    level: 1,
    health: 100,
    maxHealth: 100,
    speed: 5,
    vx: 0,
    vy: 0,
    location: 'Tatooine',
    questsCompleted: 0,
    easterEggsFound: 0
};

// Planets
const planets = [
    { name: 'Tatooine', level: 1, color: '#D4AF37', unlocked: true, description: '🏜️ Desert starting world' },
    { name: 'Dagobah', level: 5, color: '#228B22', unlocked: false, description: '🌿 Swamp training planet' },
    { name: 'Kashyyyk', level: 8, color: '#8B4513', unlocked: false, description: '🌲 Forest rescue planet' },
    { name: 'Hoth', level: 10, color: '#B0C4DE', unlocked: false, description: '❄️ Ice rebel base' },
    { name: 'Mustafar', level: 12, color: '#FF4500', unlocked: false, description: '🌋 Lava Sith lair' },
    { name: 'Death Star', level: 15, color: '#333333', unlocked: false, description: '⚫ FINAL BOSS' }
];

// Easter Eggs
const easterEggs = [
    { name: 'Golden LEGO Brick', x: 150, y: 100, found: false },
    { name: 'Millennium Falcon', x: 300, y: 200, found: false },
    { name: 'Yoda Secret Hut', x: 500, y: 150, found: false },
    { name: 'Wookiee Dance Party', x: 700, y: 300, found: false },
    { name: 'Frozen Han Solo', x: 400, y: 400, found: false },
    { name: 'Ewok Village', x: 600, y: 350, found: false },
    { name: 'Jar Jar Secret Stash', x: 250, y: 450, found: false }
];

// Input Handling
const keys = {};

window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Touch controls for iPad
canvas.addEventListener('touchmove', (e) => {
    if (gameState.gameRunning && !gameState.paused) {
        const touch = e.touches[0];
        const dx = touch.clientX - canvas.width / 2;
        const dy = touch.clientY - canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 50) {
            player.vx = (dx / distance) * player.speed;
            player.vy = (dy / distance) * player.speed;
        } else {
            player.vx = 0;
            player.vy = 0;
        }
    }
}, false);

// Character Selection
document.querySelectorAll('.characterCard').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.characterCard').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        gameState.selectedCharacter = card.dataset.character;
        document.getElementById('startGameBtn').disabled = false;
    });
});

// Start Game
document.getElementById('startGameBtn').addEventListener('click', () => {
    if (gameState.selectedCharacter === 'luke') {
        player.name = 'Luke Skywalker';
        player.character = 'luke';
        player.health = 120;
        player.maxHealth = 120;
    } else if (gameState.selectedCharacter === 'rey') {
        player.name = 'Rey';
        player.character = 'rey';
        player.health = 110;
        player.maxHealth = 110;
    }
    
    startGame();
});

// Map Button
document.getElementById('mapBtn').addEventListener('click', () => {
    gameState.currentScene = 'map';
    displayMap();
});

// Close Map
document.getElementById('closeMapBtn').addEventListener('click', () => {
    gameState.currentScene = 'game';
    document.getElementById('mapScreen').classList.add('hidden');
});

// Pause Button
document.getElementById('pauseBtn').addEventListener('click', () => {
    gameState.paused = true;
    gameState.currentScene = 'pause';
    displayPauseMenu();
});

// Resume
document.getElementById('resumeBtn').addEventListener('click', () => {
    gameState.paused = false;
    gameState.currentScene = 'game';
    document.getElementById('pauseMenu').classList.add('hidden');
});

// Main Menu
document.getElementById('mainMenuBtn').addEventListener('click', () => {
    gameState.gameRunning = false;
    gameState.currentScene = 'mainMenu';
    document.getElementById('pauseMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
});

function startGame() {
    gameState.currentScene = 'game';
    gameState.gameRunning = true;
    gameState.paused = false;
    
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('mapScreen').classList.add('hidden');
    document.getElementById('pauseMenu').classList.add('hidden');
    
    updateHUD();
    gameLoop();
}

function displayMap() {
    document.getElementById('mapScreen').classList.remove('hidden');
    
    const planetsGrid = document.getElementById('planetsGrid');
    planetsGrid.innerHTML = '';
    
    planets.forEach((planet, index) => {
        const card = document.createElement('div');
        card.className = `planetCard ${planet.unlocked ? '' : 'locked'}`;
        card.innerHTML = `
            <h3>${planet.name}</h3>
            <p>${planet.description}</p>
            <p class="planetLevel">Level ${planet.level}</p>
            ${planet.unlocked ? '<p style="color: #00FF00;">✓ Unlocked</p>' : '<p style="color: #FF6B6B;">🔒 Locked</p>'}
        `;
        
        if (planet.unlocked) {
            card.addEventListener('click', () => {
                player.location = planet.name;
                player.questsCompleted++;
                
                // Unlock next planet
                if (index < planets.length - 1) {
                    planets[index + 1].unlocked = true;
                }
                
                document.getElementById('mapScreen').classList.add('hidden');
                gameState.currentScene = 'game';
                updateHUD();
            });
        }
        
        planetsGrid.appendChild(card);
    });
}

function displayPauseMenu() {
    document.getElementById('pauseMenu').classList.remove('hidden');
    document.getElementById('pauseCharName').textContent = player.name;
    document.getElementById('pauseLevel').textContent = player.level;
    document.getElementById('pauseLocation').textContent = player.location;
    document.getElementById('pauseHealth').textContent = `${player.health}/${player.maxHealth}`;
    document.getElementById('pauseQuests').textContent = player.questsCompleted;
    document.getElementById('pauseEggs').textContent = player.easterEggsFound;
}

function updateHUD() {
    document.getElementById('characterName').textContent = player.name;
    document.getElementById('level').textContent = player.level;
    document.getElementById('health').textContent = Math.max(0, player.health);
    document.getElementById('maxHealth').textContent = player.maxHealth;
    document.getElementById('location').textContent = player.location;
}

function handleInput() {
    player.vx = 0;
    player.vy = 0;
    
    if (keys['w'] || keys['W'] || keys['ArrowUp']) player.vy = -player.speed;
    if (keys['s'] || keys['S'] || keys['ArrowDown']) player.vy = player.speed;
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) player.vx = -player.speed;
    if (keys['d'] || keys['D'] || keys['ArrowRight']) player.vx = player.speed;
    
    // Normalize diagonal movement
    if (player.vx !== 0 && player.vy !== 0) {
        player.vx *= 0.707;
        player.vy *= 0.707;
    }
}

function update() {
    if (!gameState.gameRunning || gameState.paused) return;
    
    handleInput();
    
    // Update position
    player.x += player.vx;
    player.y += player.vy;
    
    // Boundary checking
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
    player.y = Math.max(player.height / 2, Math.min(canvas.height - player.height / 2, player.y));
    
    // Check easter egg collisions
    easterEggs.forEach(egg => {
        const dist = Math.hypot(player.x - egg.x, player.y - egg.y);
        if (dist < 30 && !egg.found) {
            egg.found = true;
            player.easterEggsFound++;
            player.health = Math.min(player.maxHealth, player.health + 10);
        }
    });
    
    updateHUD();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw starfield background
    drawStarfield();
    
    // Draw easter eggs
    easterEggs.forEach(egg => {
        if (!egg.found) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(egg.x, egg.y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw star effect around egg
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(egg.x, egg.y, 15, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
    
    // Draw player
    drawPlayer();
}

function drawStarfield() {
    ctx.fillStyle = '#FFF';
    for (let i = 0; i < 150; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 73.5) % canvas.height;
        const size = (i % 3) + 0.5;
        ctx.fillRect(x, y, size, size);
    }
}

function drawPlayer() {
    // Draw character
    ctx.fillStyle = player.character === 'luke' ? '#4169E1' : '#FF69B4';
    ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    
    // Draw outline
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    
    // Draw health bar
    const barWidth = 40;
    const barHeight = 4;
    
    // Background (red)
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x - barWidth / 2, player.y - 25, barWidth, barHeight);
    
    // Health (green)
    ctx.fillStyle = '#00FF00';
    const healthPercent = player.health / player.maxHealth;
    ctx.fillRect(player.x - barWidth / 2, player.y - 25, barWidth * healthPercent, barHeight);
    
    // Character label
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.character.toUpperCase(), player.x, player.y + 25);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start with main menu
document.getElementById('mainMenu').classList.remove('hidden');
console.log('Star Wars LEGO - Open World loaded!');
console.log('Controls: WASD or Arrow Keys to move | M for map | ESC to pause');
console.log('iPad: Drag from center to move');
