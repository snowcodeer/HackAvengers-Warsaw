// Country Selection - Stardew Valley Style Neighborhood

// ==================== COUNTRY DATA (8 COUNTRIES) ====================
const COUNTRIES = [
    // Top row (3 houses)
    {
        id: 'france',
        name: 'FRANCE',
        flag: '🇫🇷',
        lang: 'french',
        posX: 150,
        posY: 130
    },
    {
        id: 'germany',
        name: 'GERMANY',
        flag: '🇩🇪',
        lang: 'german',
        posX: 400,
        posY: 130
    },
    {
        id: 'uk',
        name: 'UK',
        flag: '🇬🇧',
        lang: 'english',
        posX: 650,
        posY: 130
    },
    // Middle row (2 houses)
    {
        id: 'spain',
        name: 'SPAIN',
        flag: '🇪🇸',
        lang: 'spanish',
        posX: 275,
        posY: 310
    },
    {
        id: 'italy',
        name: 'ITALY',
        flag: '🇮🇹',
        lang: 'italian',
        posX: 525,
        posY: 310
    },
    // Bottom row (3 houses)
    {
        id: 'japan',
        name: 'JAPAN',
        flag: '🇯🇵',
        lang: 'japanese',
        posX: 150,
        posY: 490
    },
    {
        id: 'china',
        name: 'CHINA',
        flag: '🇨🇳',
        lang: 'mandarin',
        posX: 400,
        posY: 490
    },
    {
        id: 'poland',
        name: 'POLAND',
        flag: '🇵🇱',
        lang: 'polish',
        posX: 650,
        posY: 490
    }
];

// ==================== CANVAS SETUP ====================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game view - top-down camera
let cameraX = 0;
let cameraY = 0;
const TILE_SIZE = 32;
const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 700;

// ==================== GAME STATE ====================
let player = {
    worldX: 400,  // Start in center of neighborhood
    worldY: 400,
    width: 24,
    height: 32,
    speed: 3,
    facing: 'down',
    animFrame: 0
};

let keys = {};
let worldObjects = [];

// ==================== INITIALIZE ====================
function init() {
    createWorld();
    setupControls();
    centerCameraOnPlayer();
    gameLoop();
}

function createWorld() {
    worldObjects = [];
    
    // Create houses for each country in neighborhood layout
    COUNTRIES.forEach((country) => {
        country.houseX = country.posX;
        country.houseY = country.posY;
        
        // Create house (bigger size)
        // House center at posY, height 100, so bottom edge is at posY + 50
        // Door should be at bottom of house (door center = house bottom - door height/2)
        worldObjects.push({
            type: 'house',
            x: country.posX,
            y: country.posY,
            width: 90,
            height: 100,
            country: country.id,
            door: {
                x: country.posX,
                y: country.posY + 30,  // Door bottom aligns with house bottom (50 - 20 = 30)
                width: 26,
                height: 40
            }
        });
    });
    
    // Add trees around the neighborhood perimeter
    const treePositions = [
        // Top edge
        { x: 50, y: 50 }, { x: 150, y: 30 }, { x: 280, y: 40 }, { x: 400, y: 30 }, { x: 520, y: 40 }, { x: 650, y: 30 }, { x: 750, y: 50 },
        // Bottom edge
        { x: 50, y: 650 }, { x: 180, y: 660 }, { x: 320, y: 650 }, { x: 480, y: 660 }, { x: 620, y: 650 }, { x: 750, y: 650 },
        // Left edge
        { x: 30, y: 150 }, { x: 40, y: 310 }, { x: 30, y: 490 },
        // Right edge
        { x: 770, y: 150 }, { x: 760, y: 310 }, { x: 770, y: 490 },
        // Scattered between houses
        { x: 275, y: 210 }, { x: 525, y: 210 }, { x: 80, y: 310 }, { x: 720, y: 310 }, { x: 275, y: 410 }, { x: 525, y: 410 }
    ];
    
    treePositions.forEach(pos => {
        worldObjects.push({
            type: 'tree',
            x: pos.x,
            y: pos.y,
            size: 35 + Math.random() * 15
        });
    });
    
    // Add bushes and flowers around houses
    COUNTRIES.forEach((country) => {
        // Bushes near each house
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 70 + Math.random() * 30;
            worldObjects.push({
                type: 'bush',
                x: country.posX + Math.cos(angle) * dist,
                y: country.posY + Math.sin(angle) * dist,
                size: 15 + Math.random() * 10
            });
        }
        
        // Flowers near each house
        for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 60 + Math.random() * 40;
            worldObjects.push({
                type: 'flower',
                x: country.posX + Math.cos(angle) * dist,
                y: country.posY + Math.sin(angle) * dist,
                color: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#FF9FF3', '#54A0FF'][Math.floor(Math.random() * 5)]
            });
        }
    });
    
    // Add rocks scattered around
    for (let i = 0; i < 8; i++) {
        worldObjects.push({
            type: 'rock',
            x: 50 + Math.random() * 500,
            y: 50 + Math.random() * 500,
            size: 12 + Math.random() * 8
        });
    }
    
    // Set player starting position in center
    player.worldX = 300;
    player.worldY = 380;
}

function centerCameraOnPlayer() {
    cameraX = player.worldX - canvas.width / 2;
    cameraY = player.worldY - canvas.height / 2;
}

// ==================== CONTROLS ====================
function setupControls() {
    window.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        
        // Enter door with E key only
        if (e.code === 'KeyE') {
            checkDoorInteraction();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });
}

function checkDoorInteraction() {
    const houses = worldObjects.filter(obj => obj.type === 'house');
    
    for (let house of houses) {
        const door = house.door;
        const distX = Math.abs(player.worldX - door.x);
        const distY = player.worldY - door.y;  // Player should be below (south of) the door
        
        // Player must be in front of door (below it) and close enough
        if (distX < 25 && distY > 0 && distY < 40) {
            const country = COUNTRIES.find(c => c.id === house.country);
            if (country) {
                selectCountry(country);
            }
        }
    }
}

function selectCountry(country) {
    // Save language and country (scene selection will happen on lingua.html)
    localStorage.setItem('selectedLanguage', country.lang);
    localStorage.setItem('selectedCountry', country.name);
    
    // Go to scene selection
    window.location.href = 'lingua.html';
}

// ==================== GAME LOOP ====================
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    const prevX = player.worldX;
    const prevY = player.worldY;
    
    if (keys['KeyW'] || keys['ArrowUp']) {
        player.worldY -= player.speed;
        player.facing = 'up';
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        player.worldY += player.speed;
        player.facing = 'down';
    }
    if (keys['KeyA'] || keys['ArrowLeft']) {
        player.worldX -= player.speed;
        player.facing = 'left';
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
        player.worldX += player.speed;
        player.facing = 'right';
    }
    
    // Collision detection with houses and trees
    let collided = false;
    for (let obj of worldObjects) {
        if (obj.type === 'house') {
            // House collision - block the house body but allow standing at door
            const houseLeft = obj.x - obj.width/2;
            const houseRight = obj.x + obj.width/2;
            const houseTop = obj.y - obj.height/2;
            const houseBottom = obj.y + obj.height/2;
            
            // Check if player is inside house bounds
            const inHouseX = player.worldX > houseLeft - player.width/2 &&
                            player.worldX < houseRight + player.width/2;
            const inHouseY = player.worldY > houseTop - player.height/2 &&
                            player.worldY < houseBottom;
            
            // Allow player to stand just at the door (bottom edge of house)
            const nearDoor = Math.abs(player.worldX - obj.door.x) < obj.door.width;
            const atDoorLevel = player.worldY > houseBottom - 15 && player.worldY < houseBottom + 30;
            
            if (inHouseX && inHouseY && !(nearDoor && atDoorLevel)) {
                collided = true;
            }
        } else if (obj.type === 'tree') {
            const dist = Math.sqrt(
                Math.pow(player.worldX - obj.x, 2) + 
                Math.pow(player.worldY - obj.y, 2)
            );
            if (dist < 20) {
                collided = true;
            }
        }
    }
    
    // World boundaries
    if (player.worldX < 30) player.worldX = 30;
    if (player.worldX > WORLD_WIDTH - 30) player.worldX = WORLD_WIDTH - 30;
    if (player.worldY < 30) player.worldY = 30;
    if (player.worldY > WORLD_HEIGHT - 30) player.worldY = WORLD_HEIGHT - 30;
    
    if (collided) {
        player.worldX = prevX;
        player.worldY = prevY;
    }
    
    // Animation
    if (keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'] ||
        keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight']) {
        player.animFrame += 0.2;
    } else {
        player.animFrame = 0;
    }
    
    // Smooth camera follow
    const targetCameraX = player.worldX - canvas.width / 2;
    const targetCameraY = player.worldY - canvas.height / 2;
    cameraX += (targetCameraX - cameraX) * 0.1;
    cameraY += (targetCameraY - cameraY) * 0.1;
}

// ==================== RENDERING ====================
function render() {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw terrain
    drawTerrain();
    
    // Draw paths connecting houses
    drawPaths();
    
    // Sort and draw objects by Y position
    const sortedObjects = [...worldObjects].sort((a, b) => {
        const aY = a.y + (a.height || a.size || 0);
        const bY = b.y + (b.height || b.size || 0);
        return aY - bY;
    });
    
    // Draw objects behind player
    sortedObjects.forEach(obj => {
        const objY = obj.y + (obj.height || obj.size || 0);
        if (objY < player.worldY + player.height) {
            drawObject(obj);
        }
    });
    
    // Draw player
    const playerScreenX = player.worldX - cameraX;
    const playerScreenY = player.worldY - cameraY;
    drawPlayer(playerScreenX, playerScreenY);
    
    // Draw objects in front of player
    sortedObjects.forEach(obj => {
        const objY = obj.y + (obj.height || obj.size || 0);
        if (objY >= player.worldY + player.height) {
            drawObject(obj);
        }
    });
}

function drawTerrain() {
    // Grass base - solid fill first
    ctx.fillStyle = '#5DAD5D';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grass texture pattern (static, based on world position)
    for (let y = -TILE_SIZE; y < canvas.height + TILE_SIZE; y += TILE_SIZE) {
        for (let x = -TILE_SIZE; x < canvas.width + TILE_SIZE; x += TILE_SIZE) {
            // Calculate world tile position
            const tileX = Math.floor((x + cameraX) / TILE_SIZE);
            const tileY = Math.floor((y + cameraY) / TILE_SIZE);
            
            // Screen position aligned to tile grid
            const screenX = tileX * TILE_SIZE - cameraX;
            const screenY = tileY * TILE_SIZE - cameraY;
            
            // Checkerboard grass pattern (deterministic)
            const pattern = (tileX + tileY) % 2;
            ctx.fillStyle = pattern === 0 ? '#6BBD6B' : '#5DAD5D';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            
            // Static grass details based on tile position (seeded by position)
            const seed = (tileX * 7 + tileY * 13) % 100;
            if (seed > 60) {
                ctx.fillStyle = '#7CCD7C';
                ctx.fillRect(screenX + (seed % 20) + 4, screenY + ((seed * 3) % 20) + 4, 2, 3);
            }
            if (seed > 80) {
                ctx.fillStyle = '#6BBD6B';
                ctx.fillRect(screenX + ((seed * 2) % 24) + 2, screenY + ((seed * 5) % 24) + 2, 2, 2);
            }
        }
    }
}

function drawPaths() {
    // Central plaza/intersection
    const centerX = 400 - cameraX;
    const centerY = 310 - cameraY;
    
    // Plaza (circular dirt area in center)
    ctx.fillStyle = '#C4A55A';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Plaza texture
    ctx.fillStyle = '#B89850';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // Paths to each house
    ctx.fillStyle = '#C4A55A';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#C4A55A';
    
    COUNTRIES.forEach(country => {
        const houseX = country.posX - cameraX;
        const houseY = country.posY + 60 - cameraY; // To front of house
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(houseX, houseY);
        ctx.stroke();
    });
    
    // Path texture (deterministic - no flickering)
    ctx.fillStyle = '#B89850';
    COUNTRIES.forEach((country, countryIndex) => {
        const houseX = country.posX - cameraX;
        const houseY = country.posY + 60 - cameraY;
        
        // Draw dots along path for texture (using deterministic positions)
        const dist = Math.sqrt(Math.pow(houseX - centerX, 2) + Math.pow(houseY - centerY, 2));
        const steps = Math.floor(dist / 15);
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const px = centerX + (houseX - centerX) * t;
            const py = centerY + (houseY - centerY) * t;
            // Use deterministic offset based on position
            const seed = (countryIndex * 7 + i * 13) % 16;
            ctx.fillRect(px - 8 + seed, py - 8 + (seed * 3 % 16), 4, 4);
        }
    });
}

function drawObject(obj) {
    const screenX = obj.x - cameraX;
    const screenY = obj.y - cameraY;
    
    if (screenX < -100 || screenX > canvas.width + 100 ||
        screenY < -100 || screenY > canvas.height + 100) return;
    
    switch(obj.type) {
        case 'house':
            drawHouse(obj, screenX, screenY);
            break;
        case 'tree':
            drawTree(screenX, screenY, obj.size);
            break;
        case 'bush':
            drawBush(screenX, screenY, obj.size);
            break;
        case 'rock':
            drawRock(screenX, screenY, obj.size);
            break;
        case 'flower':
            drawFlower(screenX, screenY, obj.color);
            break;
    }
}

function drawHouse(house, x, y) {
    const country = COUNTRIES.find(c => c.id === house.country);
    const w = house.width;
    const h = house.height;
    const door = house.door;
    const doorX = door.x - cameraX;
    const doorY = door.y - cameraY;
    
    // House shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + h/2 + 5, w/2 + 5, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw country-specific house
    switch(country.id) {
        case 'france':
            drawFrenchHouse(x, y, w, h, doorX, doorY, door);
            break;
        case 'germany':
            drawGermanHouse(x, y, w, h, doorX, doorY, door);
            break;
        case 'spain':
            drawSpanishHouse(x, y, w, h, doorX, doorY, door);
            break;
        case 'japan':
            drawJapaneseHouse(x, y, w, h, doorX, doorY, door);
            break;
        case 'poland':
            drawPolishHouse(x, y, w, h, doorX, doorY, door);
            break;
        case 'uk':
            drawUKHouse(x, y, w, h, doorX, doorY, door);
            break;
        case 'italy':
            drawItalianHouse(x, y, w, h, doorX, doorY, door);
            break;
        case 'china':
            drawChineseHouse(x, y, w, h, doorX, doorY, door);
            break;
        default:
            drawDefaultHouse(x, y, w, h, doorX, doorY, door);
    }
    
    // Door highlight when player is near (in front of door)
    const distX = Math.abs(player.worldX - door.x);
    const distY = player.worldY - door.y;
    if (distX < 25 && distY > 0 && distY < 40) {
        ctx.strokeStyle = '#F8E038';
        ctx.lineWidth = 3;
        ctx.strokeRect(doorX - door.width/2 - 5, doorY - door.height/2 - 5, door.width + 10, door.height + 10);
        
        ctx.fillStyle = '#F8E038';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS E', doorX, doorY - door.height/2 - 12);
    }
    
    // Draw flagpole with country flag
    drawFlagpole(x + w/2 - 10, y - h/2 - 25, country);
    
    // Country label (below the flag)
    ctx.fillStyle = '#F8F0D8';
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#402808';
    ctx.lineWidth = 3;
    ctx.strokeText(country.name, x, y - h/2 - 70);
    ctx.fillText(country.name, x, y - h/2 - 70);
}

// ==================== FLAGPOLE ====================
function drawFlagpole(x, y, country) {
    const poleHeight = 50;
    const flagWidth = 36;
    const flagHeight = 24;
    
    // Pole shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x + 2, y - poleHeight + 2, 4, poleHeight);
    
    // Wooden pole
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(x, y - poleHeight, 4, poleHeight);
    
    // Pole highlight
    ctx.fillStyle = '#A8841C';
    ctx.fillRect(x, y - poleHeight, 2, poleHeight);
    
    // Pole top ornament (gold ball)
    ctx.fillStyle = '#C9A227';
    ctx.beginPath();
    ctx.arc(x + 2, y - poleHeight - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E8C84A';
    ctx.beginPath();
    ctx.arc(x + 1, y - poleHeight - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Flag position (waving to the left)
    const flagX = x - flagWidth;
    const flagY = y - poleHeight + 2;
    
    // Flag shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(flagX + 2, flagY + 2, flagWidth, flagHeight);
    
    // Draw country-specific flag
    drawCountryFlag(flagX, flagY, flagWidth, flagHeight, country.id);
    
    // Flag border
    ctx.strokeStyle = '#402808';
    ctx.lineWidth = 1;
    ctx.strokeRect(flagX, flagY, flagWidth, flagHeight);
}

function drawCountryFlag(x, y, w, h, countryId) {
    switch(countryId) {
        case 'france':
            // Blue, White, Red vertical stripes
            ctx.fillStyle = '#002395';
            ctx.fillRect(x, y, w/3, h);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + w/3, y, w/3, h);
            ctx.fillStyle = '#ED2939';
            ctx.fillRect(x + 2*w/3, y, w/3, h);
            break;
        case 'germany':
            // Black, Red, Gold horizontal stripes
            ctx.fillStyle = '#000000';
            ctx.fillRect(x, y, w, h/3);
            ctx.fillStyle = '#DD0000';
            ctx.fillRect(x, y + h/3, w, h/3);
            ctx.fillStyle = '#FFCC00';
            ctx.fillRect(x, y + 2*h/3, w, h/3);
            break;
        case 'uk':
            // Union Jack (simplified)
            ctx.fillStyle = '#012169';
            ctx.fillRect(x, y, w, h);
            // White diagonals
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(x, y); ctx.lineTo(x + w, y + h);
            ctx.moveTo(x + w, y); ctx.lineTo(x, y + h);
            ctx.stroke();
            // Red diagonals
            ctx.strokeStyle = '#C8102E';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y); ctx.lineTo(x + w, y + h);
            ctx.moveTo(x + w, y); ctx.lineTo(x, y + h);
            ctx.stroke();
            // White cross
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + w/2 - 4, y, 8, h);
            ctx.fillRect(x, y + h/2 - 3, w, 6);
            // Red cross
            ctx.fillStyle = '#C8102E';
            ctx.fillRect(x + w/2 - 2, y, 4, h);
            ctx.fillRect(x, y + h/2 - 2, w, 4);
            break;
        case 'spain':
            // Red, Yellow, Red horizontal
            ctx.fillStyle = '#AA151B';
            ctx.fillRect(x, y, w, h/4);
            ctx.fillStyle = '#F1BF00';
            ctx.fillRect(x, y + h/4, w, h/2);
            ctx.fillStyle = '#AA151B';
            ctx.fillRect(x, y + 3*h/4, w, h/4);
            break;
        case 'italy':
            // Green, White, Red vertical stripes
            ctx.fillStyle = '#009246';
            ctx.fillRect(x, y, w/3, h);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + w/3, y, w/3, h);
            ctx.fillStyle = '#CE2B37';
            ctx.fillRect(x + 2*w/3, y, w/3, h);
            break;
        case 'japan':
            // White with red circle
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#BC002D';
            ctx.beginPath();
            ctx.arc(x + w/2, y + h/2, h/3, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'china':
            // Red with yellow stars
            ctx.fillStyle = '#DE2910';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#FFDE00';
            // Big star
            drawStar(x + w*0.2, y + h*0.35, 5);
            // Small stars
            drawStar(x + w*0.4, y + h*0.2, 3);
            drawStar(x + w*0.5, y + h*0.35, 3);
            drawStar(x + w*0.5, y + h*0.55, 3);
            drawStar(x + w*0.4, y + h*0.7, 3);
            break;
        case 'poland':
            // White and Red horizontal
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x, y, w, h/2);
            ctx.fillStyle = '#DC143C';
            ctx.fillRect(x, y + h/2, w, h/2);
            break;
        default:
            ctx.fillStyle = '#888888';
            ctx.fillRect(x, y, w, h);
    }
}

function drawStar(cx, cy, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

// ==================== FRENCH HOUSE ====================
// Classic French cottage - cream walls, blue shutters, gray slate roof
function drawFrenchHouse(x, y, w, h, doorX, doorY, door) {
    // Cream/beige stone walls
    ctx.fillStyle = '#F5E6D3';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Stone texture
    ctx.fillStyle = '#E8D5C0';
    for (let row = 0; row < h; row += 12) {
        for (let col = 0; col < w; col += 18) {
            const offset = (row % 24 === 0) ? 0 : 9;
            ctx.fillRect(x - w/2 + col + offset, y - h/2 + row, 16, 10);
        }
    }
    
    // Gray slate mansard-style roof
    ctx.fillStyle = '#5A6370';
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 6, y - h/2 + 8);
    ctx.lineTo(x - w/2 + 5, y - h/2 - 20);
    ctx.lineTo(x + w/2 - 5, y - h/2 - 20);
    ctx.lineTo(x + w/2 + 6, y - h/2 + 8);
    ctx.closePath();
    ctx.fill();
    
    // Roof tiles
    ctx.fillStyle = '#4A5360';
    for (let i = 0; i < w; i += 6) {
        ctx.fillRect(x - w/2 + i, y - h/2 - 18, 4, 24);
    }
    
    // Chimney
    ctx.fillStyle = '#D4A574';
    ctx.fillRect(x + w/4, y - h/2 - 30, 10, 15);
    
    // Windows with BLUE shutters (iconic French)
    drawFrenchWindow(x - w/2 + 12, y - h/2 + 18, 18, 22);
    drawFrenchWindow(x + w/2 - 30, y - h/2 + 18, 18, 22);
    
    // Blue door with arch
    ctx.fillStyle = '#2E5090';
    ctx.fillRect(doorX - door.width/2, doorY - door.height/2, door.width, door.height);
    
    // Door arch top
    ctx.beginPath();
    ctx.arc(doorX, doorY - door.height/2, door.width/2, Math.PI, 0);
    ctx.fill();
    
    // Door panels
    ctx.fillStyle = '#1E4080';
    ctx.fillRect(doorX - door.width/2 + 3, doorY - door.height/2 + 8, door.width - 6, door.height/2 - 5);
    ctx.fillRect(doorX - door.width/2 + 3, doorY + 3, door.width - 6, door.height/2 - 10);
    
    // Door handle
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(doorX + door.width/2 - 7, doorY, 3, 3);
}

function drawFrenchWindow(x, y, w, h) {
    // Window frame
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(x, y, w, h);
    
    // Glass
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
    
    // Window cross
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(x + w/2 - 1, y, 2, h);
    ctx.fillRect(x, y + h/2 - 1, w, 2);
    
    // Blue shutters on sides
    ctx.fillStyle = '#2E5090';
    ctx.fillRect(x - 5, y, 4, h);
    ctx.fillRect(x + w + 1, y, 4, h);
    
    // Shutter lines
    ctx.fillStyle = '#1E4080';
    ctx.fillRect(x - 5, y + 5, 4, 1);
    ctx.fillRect(x - 5, y + 10, 4, 1);
    ctx.fillRect(x - 5, y + 15, 4, 1);
    ctx.fillRect(x + w + 1, y + 5, 4, 1);
    ctx.fillRect(x + w + 1, y + 10, 4, 1);
    ctx.fillRect(x + w + 1, y + 15, 4, 1);
}

// ==================== GERMAN HOUSE ====================
// Half-timbered Fachwerk - white walls with dark wood beams
function drawGermanHouse(x, y, w, h, doorX, doorY, door) {
    // White plaster walls
    ctx.fillStyle = '#FFFEF5';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Dark brown timber frame (Fachwerk pattern)
    ctx.fillStyle = '#3D2314';
    
    // Outer frame
    ctx.fillRect(x - w/2, y - h/2, w, 4);
    ctx.fillRect(x - w/2, y + h/2 - 4, w, 4);
    ctx.fillRect(x - w/2, y - h/2, 4, h);
    ctx.fillRect(x + w/2 - 4, y - h/2, 4, h);
    
    // Horizontal beam
    ctx.fillRect(x - w/2, y - h/2 + 35, w, 4);
    
    // Diagonal beams (X pattern)
    ctx.save();
    ctx.translate(x, y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#3D2314';
    ctx.beginPath();
    ctx.moveTo(-w/2 + 4, -h/2 + 4);
    ctx.lineTo(-w/2 + 25, -h/2 + 35);
    ctx.moveTo(-w/2 + 25, -h/2 + 4);
    ctx.lineTo(-w/2 + 4, -h/2 + 35);
    ctx.moveTo(w/2 - 4, -h/2 + 4);
    ctx.lineTo(w/2 - 25, -h/2 + 35);
    ctx.moveTo(w/2 - 25, -h/2 + 4);
    ctx.lineTo(w/2 - 4, -h/2 + 35);
    ctx.stroke();
    ctx.restore();
    
    // Red tile roof (steep German style)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 8, y - h/2 + 8);
    ctx.lineTo(x, y - h/2 - 30);
    ctx.lineTo(x + w/2 + 8, y - h/2 + 8);
    ctx.closePath();
    ctx.fill();
    
    // Roof tiles
    ctx.fillStyle = '#6B3510';
    for (let row = 0; row < 38; row += 5) {
        const rowY = y - h/2 - 30 + row;
        const rowWidth = (row / 38) * (w + 16);
        for (let col = 0; col < rowWidth; col += 6) {
            ctx.fillRect(x - rowWidth/2 + col, rowY, 4, 4);
        }
    }
    
    // Windows (small paned)
    drawGermanWindow(x - w/2 + 10, y - h/2 + 42, 16, 20);
    drawGermanWindow(x + w/2 - 26, y - h/2 + 42, 16, 20);
    
    // Wooden door
    ctx.fillStyle = '#5D3A1A';
    ctx.fillRect(doorX - door.width/2, doorY - door.height/2, door.width, door.height);
    
    // Door arch
    ctx.beginPath();
    ctx.arc(doorX, doorY - door.height/2, door.width/2, Math.PI, 0);
    ctx.fill();
    
    // Door planks
    ctx.fillStyle = '#4D2A10';
    for (let i = 3; i < door.width; i += 5) {
        ctx.fillRect(doorX - door.width/2 + i, doorY - door.height/2, 1, door.height);
    }
    
    // Door hardware
    ctx.fillStyle = '#2A2A2A';
    ctx.fillRect(doorX + door.width/2 - 6, doorY - 2, 4, 6);
}

function drawGermanWindow(x, y, w, h) {
    ctx.fillStyle = '#3D2314';
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x, y, w, h);
    // Multi-paned
    ctx.fillStyle = '#3D2314';
    ctx.fillRect(x + w/2 - 1, y, 2, h);
    ctx.fillRect(x, y + h/3, w, 2);
    ctx.fillRect(x, y + 2*h/3, w, 2);
}

// ==================== SPANISH HOUSE ====================
// White stucco, terracotta roof, wrought iron details
function drawSpanishHouse(x, y, w, h, doorX, doorY, door) {
    // White stucco walls
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Stucco texture
    ctx.fillStyle = '#F5F5F0';
    for (let i = 0; i < 20; i++) {
        const px = x - w/2 + (i * 17 % w);
        const py = y - h/2 + (i * 23 % h);
        ctx.fillRect(px, py, 3, 3);
    }
    
    // Terracotta tile roof
    ctx.fillStyle = '#C84C09';
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 10, y - h/2 + 5);
    ctx.lineTo(x, y - h/2 - 20);
    ctx.lineTo(x + w/2 + 10, y - h/2 + 5);
    ctx.closePath();
    ctx.fill();
    
    // Barrel tile texture
    ctx.fillStyle = '#A83C05';
    for (let i = 0; i < w + 20; i += 8) {
        ctx.beginPath();
        ctx.arc(x - w/2 - 10 + i + 4, y - h/2 - 8, 3, 0, Math.PI);
        ctx.fill();
    }
    
    // Arched windows with wrought iron
    drawSpanishWindow(x - w/2 + 12, y - h/2 + 20, 16, 24);
    drawSpanishWindow(x + w/2 - 28, y - h/2 + 20, 16, 24);
    
    // Wooden door with arch
    ctx.fillStyle = '#6B4423';
    ctx.fillRect(doorX - door.width/2, doorY - door.height/2, door.width, door.height);
    ctx.beginPath();
    ctx.arc(doorX, doorY - door.height/2, door.width/2, Math.PI, 0);
    ctx.fill();
    
    // Door studs (decorative nails)
    ctx.fillStyle = '#2A2A2A';
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            ctx.beginPath();
            ctx.arc(doorX - 6 + col * 6, doorY - 8 + row * 8, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Door handle ring
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(doorX + door.width/2 - 6, doorY, 3, 0, Math.PI * 2);
    ctx.stroke();
}

function drawSpanishWindow(x, y, w, h) {
    // Arched window
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(x, y, w, h);
    ctx.beginPath();
    ctx.arc(x + w/2, y, w/2, Math.PI, 0);
    ctx.fill();
    
    // Glass
    ctx.fillStyle = '#4A6FA5';
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
    
    // Wrought iron bars
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(x + w/2 - 1, y - 6, 2, h + 6);
    ctx.fillRect(x, y + h/2, w, 2);
}

// ==================== JAPANESE HOUSE ====================
// Traditional machiya - dark wood, shoji screens, curved roof
function drawJapaneseHouse(x, y, w, h, doorX, doorY, door) {
    // Light tan/beige walls (earth tones)
    ctx.fillStyle = '#E8DCC8';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Dark wood frame
    ctx.fillStyle = '#2D1810';
    ctx.fillRect(x - w/2, y - h/2, w, 6);
    ctx.fillRect(x - w/2, y + h/2 - 6, w, 6);
    ctx.fillRect(x - w/2, y - h/2, 6, h);
    ctx.fillRect(x + w/2 - 6, y - h/2, 6, h);
    ctx.fillRect(x - w/2, y - h/2 + 35, w, 4);
    
    // Curved roof (dark tiles)
    ctx.fillStyle = '#1A1A2E';
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 12, y - h/2 + 8);
    ctx.quadraticCurveTo(x - w/2 - 5, y - h/2 - 15, x, y - h/2 - 22);
    ctx.quadraticCurveTo(x + w/2 + 5, y - h/2 - 15, x + w/2 + 12, y - h/2 + 8);
    ctx.closePath();
    ctx.fill();
    
    // Roof edge detail
    ctx.fillStyle = '#2A2A3E';
    ctx.fillRect(x - w/2 - 12, y - h/2 + 4, w + 24, 6);
    
    // Shoji screen windows (paper screens)
    drawShojiWindow(x - w/2 + 10, y - h/2 + 42, 18, 28);
    drawShojiWindow(x + w/2 - 28, y - h/2 + 42, 18, 28);
    
    // Sliding door (fusuma)
    ctx.fillStyle = '#D4C8B8';
    ctx.fillRect(doorX - door.width/2, doorY - door.height/2, door.width, door.height);
    
    // Door frame
    ctx.fillStyle = '#2D1810';
    ctx.fillRect(doorX - door.width/2 - 2, doorY - door.height/2 - 2, door.width + 4, 2);
    ctx.fillRect(doorX - door.width/2 - 2, doorY + door.height/2, door.width + 4, 2);
    ctx.fillRect(doorX - door.width/2 - 2, doorY - door.height/2, 2, door.height + 4);
    ctx.fillRect(doorX + door.width/2, doorY - door.height/2, 2, door.height + 4);
    
    // Door panel lines
    ctx.fillStyle = '#2D1810';
    ctx.fillRect(doorX, doorY - door.height/2, 1, door.height);
    
    // Simple circular handle (traditional)
    ctx.fillStyle = '#2D1810';
    ctx.beginPath();
    ctx.arc(doorX + door.width/2 - 5, doorY, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawShojiWindow(x, y, w, h) {
    // Paper screen background
    ctx.fillStyle = '#F5F0E6';
    ctx.fillRect(x, y, w, h);
    
    // Dark wood grid
    ctx.fillStyle = '#2D1810';
    // Outer frame
    ctx.fillRect(x, y, w, 2);
    ctx.fillRect(x, y + h - 2, w, 2);
    ctx.fillRect(x, y, 2, h);
    ctx.fillRect(x + w - 2, y, 2, h);
    // Inner grid
    ctx.fillRect(x + w/2 - 1, y, 2, h);
    ctx.fillRect(x, y + h/3, w, 2);
    ctx.fillRect(x, y + 2*h/3, w, 2);
}

// ==================== POLISH HOUSE ====================
// Colorful wooden cottage with folk patterns
function drawPolishHouse(x, y, w, h, doorX, doorY, door) {
    // Wooden walls (warm brown)
    ctx.fillStyle = '#B8956A';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Horizontal log texture
    ctx.fillStyle = '#A8855A';
    for (let i = 0; i < h; i += 10) {
        ctx.fillRect(x - w/2, y - h/2 + i, w, 8);
        ctx.fillStyle = '#987548';
        ctx.fillRect(x - w/2, y - h/2 + i + 6, w, 2);
        ctx.fillStyle = '#A8855A';
    }
    
    // Decorative trim (colorful folk art)
    ctx.fillStyle = '#C84040'; // Red
    ctx.fillRect(x - w/2, y - h/2, w, 4);
    ctx.fillRect(x - w/2, y - h/2 + 35, w, 4);
    
    // Folk pattern dots
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < w; i += 10) {
        ctx.beginPath();
        ctx.arc(x - w/2 + i + 5, y - h/2 + 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Green and blue accents
    ctx.fillStyle = '#40A040';
    ctx.fillRect(x - w/2, y - h/2 + 4, w, 2);
    ctx.fillStyle = '#4080C0';
    ctx.fillRect(x - w/2, y - h/2 + 33, w, 2);
    
    // Thatched/wooden roof
    ctx.fillStyle = '#6B5030';
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 8, y - h/2 + 8);
    ctx.lineTo(x, y - h/2 - 28);
    ctx.lineTo(x + w/2 + 8, y - h/2 + 8);
    ctx.closePath();
    ctx.fill();
    
    // Roof straw texture
    ctx.fillStyle = '#7B6040';
    for (let i = 0; i < w + 16; i += 4) {
        const roofX = x - w/2 - 8 + i;
        ctx.fillRect(roofX, y - h/2 - 20 + Math.abs(i - (w + 16)/2) * 0.8, 2, 28 - Math.abs(i - (w + 16)/2) * 0.8);
    }
    
    // Windows with colorful frames
    drawPolishWindow(x - w/2 + 10, y - h/2 + 45, 16, 20);
    drawPolishWindow(x + w/2 - 26, y - h/2 + 45, 16, 20);
    
    // Red wooden door
    ctx.fillStyle = '#8B2020';
    ctx.fillRect(doorX - door.width/2, doorY - door.height/2, door.width, door.height);
    
    // Door decorative heart (Polish folk motif)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(doorX, doorY - 8);
    ctx.bezierCurveTo(doorX - 6, doorY - 14, doorX - 10, doorY - 6, doorX, doorY);
    ctx.bezierCurveTo(doorX + 10, doorY - 6, doorX + 6, doorY - 14, doorX, doorY - 8);
    ctx.fill();
    
    // Door handle
    ctx.fillStyle = '#2A2A2A';
    ctx.fillRect(doorX + door.width/2 - 5, doorY, 3, 5);
}

function drawPolishWindow(x, y, w, h) {
    // Colorful frame (red, green, blue pattern)
    ctx.fillStyle = '#C84040';
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
    ctx.fillStyle = '#40A040';
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    
    // Glass
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x, y, w, h);
    
    // Window cross
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + w/2 - 1, y, 2, h);
    ctx.fillRect(x, y + h/2 - 1, w, 2);
    
    // Lace curtain effect
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x + 1, y + 1, w - 2, 6);
}

// ==================== UK HOUSE ====================
// Classic British cottage - red brick, white trim, chimney
function drawUKHouse(x, y, w, h, doorX, doorY, door) {
    // Red brick walls
    ctx.fillStyle = '#B85C5C';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Brick pattern
    ctx.fillStyle = '#A04040';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 6; col++) {
            const offset = row % 2 === 0 ? 0 : 7;
            ctx.fillRect(x - w/2 + col * 15 + offset + 1, y - h/2 + row * 12 + 1, 13, 10);
        }
    }
    
    // Gray slate roof
    ctx.fillStyle = '#5A5A6A';
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 8, y - h/2 + 8);
    ctx.lineTo(x, y - h/2 - 30);
    ctx.lineTo(x + w/2 + 8, y - h/2 + 8);
    ctx.closePath();
    ctx.fill();
    
    // Chimney
    ctx.fillStyle = '#8B4040';
    ctx.fillRect(x + w/4, y - h/2 - 35, 15, 25);
    ctx.fillStyle = '#5A5A6A';
    ctx.fillRect(x + w/4 - 2, y - h/2 - 38, 19, 5);
    
    // White door frame
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(doorX - door.width/2 - 4, doorY - door.height/2 - 4, door.width + 8, door.height + 4);
    
    // Door (British racing green or red)
    ctx.fillStyle = '#1A4D2E';
    ctx.fillRect(doorX - door.width/2, doorY - door.height/2, door.width, door.height);
    
    // Door knocker
    ctx.fillStyle = '#C9A227';
    ctx.beginPath();
    ctx.arc(doorX, doorY - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Windows with white frames
    const windowY = y - h/4;
    
    // Left window
    drawBritishWindow(x - w/3, windowY, 18, 22);
    
    // Right window
    drawBritishWindow(x + w/3, windowY, 18, 22);
}

function drawBritishWindow(x, y, w, h) {
    // White frame
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - w/2 - 3, y - h/2 - 3, w + 6, h + 6);
    
    // Glass
    ctx.fillStyle = '#6BA3D6';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Window panes (4 panes)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - 1, y - h/2, 2, h);
    ctx.fillRect(x - w/2, y - 1, w, 2);
}

// ==================== ITALIAN HOUSE ====================
// Tuscan villa - ochre/terracotta, green shutters, terracotta roof
function drawItalianHouse(x, y, w, h, doorX, doorY, door) {
    // Ochre/yellow stucco walls
    ctx.fillStyle = '#E8C47C';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Wall texture
    ctx.fillStyle = '#D4A860';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(x - w/2 + i * 18 + 2, y - h/2 + 10, 2, h - 20);
    }
    
    // Terracotta tile roof
    ctx.fillStyle = '#C8563D';
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 10, y - h/2 + 8);
    ctx.lineTo(x, y - h/2 - 28);
    ctx.lineTo(x + w/2 + 10, y - h/2 + 8);
    ctx.closePath();
    ctx.fill();
    
    // Roof tiles detail
    ctx.fillStyle = '#B84530';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(x - w/3 + i * 15, y - h/2 - 5 + Math.abs(i - 2) * 5, 6, Math.PI, 0);
        ctx.fill();
    }
    
    // Stone archway door frame
    ctx.fillStyle = '#A08060';
    ctx.beginPath();
    ctx.moveTo(doorX - door.width/2 - 6, doorY + door.height/2);
    ctx.lineTo(doorX - door.width/2 - 6, doorY - door.height/4);
    ctx.quadraticCurveTo(doorX - door.width/2 - 6, doorY - door.height/2 - 8, doorX, doorY - door.height/2 - 8);
    ctx.quadraticCurveTo(doorX + door.width/2 + 6, doorY - door.height/2 - 8, doorX + door.width/2 + 6, doorY - door.height/4);
    ctx.lineTo(doorX + door.width/2 + 6, doorY + door.height/2);
    ctx.closePath();
    ctx.fill();
    
    // Wooden door
    ctx.fillStyle = '#6B4423';
    ctx.fillRect(doorX - door.width/2, doorY - door.height/2, door.width, door.height);
    
    // Door details
    ctx.fillStyle = '#4A2F15';
    ctx.fillRect(doorX - door.width/2 + 3, doorY - door.height/2 + 3, door.width - 6, 3);
    ctx.fillRect(doorX - door.width/2 + 3, doorY, door.width - 6, 3);
    
    // Windows with green shutters
    const windowY = y - h/4;
    drawItalianWindow(x - w/3, windowY, 16, 24);
    drawItalianWindow(x + w/3, windowY, 16, 24);
}

function drawItalianWindow(x, y, w, h) {
    // Green shutters
    ctx.fillStyle = '#2E5E3E';
    ctx.fillRect(x - w/2 - 8, y - h/2, 7, h);
    ctx.fillRect(x + w/2 + 1, y - h/2, 7, h);
    
    // Shutter slats
    ctx.fillStyle = '#1A3A24';
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(x - w/2 - 7, y - h/2 + i * 6 + 2, 5, 2);
        ctx.fillRect(x + w/2 + 2, y - h/2 + i * 6 + 2, 5, 2);
    }
    
    // Window
    ctx.fillStyle = '#6BA3D6';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Window cross
    ctx.fillStyle = '#F5E6D3';
    ctx.fillRect(x - 1, y - h/2, 2, h);
    ctx.fillRect(x - w/2, y - 1, w, 2);
}

// ==================== CHINESE HOUSE ====================
// Traditional Chinese courtyard house - red walls, curved roof, gold details
function drawChineseHouse(x, y, w, h, doorX, doorY, door) {
    // Red/crimson walls
    ctx.fillStyle = '#B83232';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    // Wall lattice pattern
    ctx.fillStyle = '#8B2020';
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(x - w/2 + 5 + i * 22, y - h/2 + 5, 2, h - 10);
    }
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(x - w/2 + 5, y - h/2 + 20 + i * 25, w - 10, 2);
    }
    
    // Curved green/teal roof
    ctx.fillStyle = '#2A6B5E';
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 12, y - h/2 + 10);
    ctx.quadraticCurveTo(x - w/4, y - h/2 - 35, x, y - h/2 - 25);
    ctx.quadraticCurveTo(x + w/4, y - h/2 - 35, x + w/2 + 12, y - h/2 + 10);
    ctx.lineTo(x - w/2 - 12, y - h/2 + 10);
    ctx.closePath();
    ctx.fill();
    
    // Roof edge detail (gold)
    ctx.strokeStyle = '#C9A227';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 12, y - h/2 + 10);
    ctx.quadraticCurveTo(x - w/4, y - h/2 - 35, x, y - h/2 - 25);
    ctx.quadraticCurveTo(x + w/4, y - h/2 - 35, x + w/2 + 12, y - h/2 + 10);
    ctx.stroke();
    
    // Roof tiles
    ctx.fillStyle = '#1A4A40';
    for (let i = 0; i < 5; i++) {
        const tileX = x - w/3 + i * 15;
        const tileY = y - h/2 - 10 + Math.abs(i - 2) * 4;
        ctx.beginPath();
        ctx.arc(tileX, tileY, 5, Math.PI, 0);
        ctx.fill();
    }
    
    // Gold door frame
    ctx.fillStyle = '#C9A227';
    ctx.fillRect(doorX - door.width/2 - 5, doorY - door.height/2 - 5, door.width + 10, door.height + 5);
    
    // Red door
    ctx.fillStyle = '#D43C3C';
    ctx.fillRect(doorX - door.width/2, doorY - door.height/2, door.width, door.height);
    
    // Door studs (gold)
    ctx.fillStyle = '#C9A227';
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
            ctx.beginPath();
            ctx.arc(doorX - 5 + col * 10, doorY - door.height/4 + row * 12, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Traditional windows (circular)
    const windowY = y - h/4;
    drawChineseWindow(x - w/3, windowY, 20);
    drawChineseWindow(x + w/3, windowY, 20);
}

function drawChineseWindow(x, y, size) {
    // Circular window frame (gold)
    ctx.fillStyle = '#C9A227';
    ctx.beginPath();
    ctx.arc(x, y, size/2 + 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Window opening
    ctx.fillStyle = '#1A1A2E';
    ctx.beginPath();
    ctx.arc(x, y, size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Lattice pattern inside
    ctx.strokeStyle = '#C9A227';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - size/3, y - size/3);
    ctx.lineTo(x + size/3, y + size/3);
    ctx.moveTo(x + size/3, y - size/3);
    ctx.lineTo(x - size/3, y + size/3);
    ctx.moveTo(x, y - size/2 + 2);
    ctx.lineTo(x, y + size/2 - 2);
    ctx.moveTo(x - size/2 + 2, y);
    ctx.lineTo(x + size/2 - 2, y);
    ctx.stroke();
}

// ==================== DEFAULT HOUSE ====================
function drawDefaultHouse(x, y, w, h, doorX, doorY, door) {
    ctx.fillStyle = '#D4A574';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    
    ctx.fillStyle = '#C8423D';
    ctx.beginPath();
    ctx.moveTo(x - w/2 - 8, y - h/2 + 8);
    ctx.lineTo(x, y - h/2 - 25);
    ctx.lineTo(x + w/2 + 8, y - h/2 + 8);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#5A4020';
    ctx.fillRect(doorX - door.width/2, doorY - door.height/2, door.width, door.height);
}

function drawTree(x, y, size) {
    // Tree shadow (at base of tree)
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x, y + 5, size/3, size/6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Trunk (starts at ground level y, goes up)
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(x - 5, y - size/2, 10, size/2);
    
    // Trunk detail
    ctx.fillStyle = '#6A5010';
    ctx.fillRect(x - 3, y - size/2, 2, size/2);
    
    // Leaves (layered circles, above trunk)
    ctx.fillStyle = '#2D8A2D';
    ctx.beginPath();
    ctx.arc(x, y - size/2 - size/4, size/2.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#3DA03D';
    ctx.beginPath();
    ctx.arc(x - size/5, y - size/2 - size/4, size/3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + size/5, y - size/2 - size/4, size/3.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#4DB84D';
    ctx.beginPath();
    ctx.arc(x, y - size/2 - size/3, size/4, 0, Math.PI * 2);
    ctx.fill();
}

function drawBush(x, y, size) {
    // Shadow at base
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(x, y + 3, size/2, size/5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bush body (sits on ground)
    ctx.fillStyle = '#3DA03D';
    ctx.beginPath();
    ctx.arc(x, y - size/4, size/2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#4DB84D';
    ctx.beginPath();
    ctx.arc(x - size/4, y - size/4, size/3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + size/4, y - size/4, size/3, 0, Math.PI * 2);
    ctx.fill();
}

function drawRock(x, y, size) {
    // Shadow at base
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(x, y + 2, size/2, size/5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Rock body (sits on ground)
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.ellipse(x, y - size/6, size/2, size/3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#777';
    ctx.beginPath();
    ctx.ellipse(x - size/6, y - size/6, size/4, size/5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.ellipse(x + size/6, y - size/4, size/6, size/8, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawFlower(x, y, color) {
    // Stem
    ctx.fillStyle = '#3DA03D';
    ctx.fillRect(x - 1, y, 2, 8);
    
    // Petals
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x - 3, y - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 3, y - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + 1, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Center
    ctx.fillStyle = '#FFE66D';
    ctx.beginPath();
    ctx.arc(x, y - 2, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlayer(x, y) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + player.height/2, player.width/2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Body (blue shirt)
    ctx.fillStyle = '#4A90D9';
    ctx.fillRect(x - player.width/2 + 2, y - player.height/2 + 10, player.width - 4, player.height - 18);
    
    // Shirt detail
    ctx.fillStyle = '#3A7BC8';
    ctx.fillRect(x - 2, y - player.height/2 + 10, 4, player.height - 18);
    
    // Legs (brown pants)
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(x - player.width/2 + 4, y + player.height/2 - 12, 7, 10);
    ctx.fillRect(x + player.width/2 - 11, y + player.height/2 - 12, 7, 10);
    
    // Head
    ctx.fillStyle = '#F8D8B8';
    ctx.beginPath();
    ctx.arc(x, y - player.height/2 + 6, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair
    ctx.fillStyle = '#684010';
    ctx.beginPath();
    ctx.arc(x, y - player.height/2 + 3, 8, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 8, y - player.height/2 + 3, 16, 4);
    
    // Eyes based on direction
    ctx.fillStyle = '#402808';
    if (player.facing === 'down') {
        ctx.fillRect(x - 4, y - player.height/2 + 5, 2, 2);
        ctx.fillRect(x + 2, y - player.height/2 + 5, 2, 2);
    } else if (player.facing === 'up') {
        // Back of head, no eyes visible
    } else if (player.facing === 'left') {
        ctx.fillRect(x - 5, y - player.height/2 + 5, 2, 2);
    } else if (player.facing === 'right') {
        ctx.fillRect(x + 3, y - player.height/2 + 5, 2, 2);
    }
    
    // Arms (animate when walking)
    ctx.fillStyle = '#F8D8B8';
    const armOffset = Math.floor(player.animFrame) % 2 === 0 ? 0 : 2;
    ctx.fillRect(x - player.width/2 - 2, y - player.height/2 + 12 + armOffset, 4, 10);
    ctx.fillRect(x + player.width/2 - 2, y - player.height/2 + 12 - armOffset, 4, 10);
}

// ==================== START ====================
init();

// Handle resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
