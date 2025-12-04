// Cute Flower Garden with Snow - 8-Bit Style

document.addEventListener('DOMContentLoaded', () => {
    createTallTrees();
    createFlowerGarden();
    createBushes();
    createRocks();
    createBunnies();
    initPixelSnowfall();
    initButtonEffects();
});

// Flower colors
const flowerColors = [
    { petals: '#ff6b8a', center: '#ffeb3b' },
    { petals: '#ff8a65', center: '#fff176' },
    { petals: '#ba68c8', center: '#ffcc02' },
    { petals: '#64b5f6', center: '#fff59d' },
    { petals: '#ff7043', center: '#ffd54f' },
    { petals: '#ec407a', center: '#fff176' },
    { petals: '#7e57c2', center: '#ffeb3b' },
    { petals: '#f06292', center: '#fff9c4' },
    { petals: '#ea80fc', center: '#ffeb3b' },
    { petals: '#ff5252', center: '#ffeb3b' },
];

const petalStyles = ['round', 'star', 'diamond', 'tulip', 'daisy'];

// Create pixel bushes
function createBushes() {
    const container = document.getElementById('flowersContainer');
    const bushCount = 12;

    for (let i = 0; i < bushCount; i++) {
        const bush = document.createElement('div');
        bush.className = 'pixel-bush';

        const leftPos = 3 + (i / bushCount) * 92;
        bush.style.left = `${leftPos}%`;

        const size = 40 + Math.floor(Math.random() * 50);
        const height = size * (0.6 + Math.random() * 0.3);

        const greens = ['#2d8a2d', '#3da03d', '#4db84d', '#35a035'];
        const mainColor = greens[Math.floor(Math.random() * greens.length)];
        const darkColor = darkenColor(mainColor, 20);
        const lightColor = lightenColor(mainColor, 15);

        const lumps = 3 + Math.floor(Math.random() * 3);
        let bushHTML = '';

        for (let j = 0; j < lumps; j++) {
            const lumpSize = size * (0.5 + Math.random() * 0.4);
            const lumpX = (j - lumps / 2 + 0.5) * (size * 0.35);
            const lumpY = Math.random() * 10;
            const lumpColor = j % 2 === 0 ? mainColor : lightColor;

            bushHTML += `
                <div style="
                    position: absolute;
                    bottom: ${lumpY}px;
                    left: 50%;
                    transform: translateX(calc(-50% + ${lumpX}px));
                    width: ${lumpSize}px;
                    height: ${lumpSize * 0.7}px;
                    background: ${lumpColor};
                    box-shadow:
                        ${Math.floor(lumpSize * 0.15)}px 0 0 0 ${darkColor},
                        -${Math.floor(lumpSize * 0.15)}px 0 0 0 ${lightColor},
                        0 4px 0 0 ${darkColor};
                "></div>
            `;
        }

        if (Math.random() > 0.4) {
            bushHTML += `
                <div style="
                    position: absolute;
                    top: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: ${size * 0.7}px;
                    height: 12px;
                    background: #f8f8f8;
                    box-shadow:
                        -${size * 0.2}px 4px 0 0 #f8f8f8,
                        ${size * 0.2}px 4px 0 0 #f8f8f8,
                        0 4px 0 0 #d0d8e0;
                "></div>
            `;
        }

        bush.innerHTML = bushHTML;
        bush.style.width = `${size * 1.5}px`;
        bush.style.height = `${height + 20}px`;
        bush.style.animationDelay = `${0.3 + i * 0.08}s`;

        container.appendChild(bush);
    }
}

// Create pixel rocks
function createRocks() {
    const container = document.getElementById('flowersContainer');
    const rockCount = 8;

    for (let i = 0; i < rockCount; i++) {
        const rock = document.createElement('div');
        rock.className = 'pixel-rock';

        const leftPos = 5 + Math.random() * 88;
        rock.style.left = `${leftPos}%`;

        const width = 24 + Math.floor(Math.random() * 40);
        const height = width * (0.5 + Math.random() * 0.3);

        const grays = ['#808080', '#909090', '#707070', '#858585'];
        const mainColor = grays[Math.floor(Math.random() * grays.length)];

        rock.innerHTML = `
            <div style="
                width: ${width}px;
                height: ${height}px;
                background: ${mainColor};
                box-shadow:
                    ${Math.floor(width * 0.2)}px 0 0 0 ${darkenColor(mainColor, 20)},
                    -${Math.floor(width * 0.15)}px 0 0 0 ${lightenColor(mainColor, 15)},
                    0 4px 0 0 ${darkenColor(mainColor, 30)},
                    inset ${Math.floor(width * 0.2)}px ${Math.floor(height * 0.2)}px 0 0 ${lightenColor(mainColor, 20)};
            "></div>
            ${Math.random() > 0.5 ? `
                <div style="
                    position: absolute;
                    top: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: ${width * 0.6}px;
                    height: 8px;
                    background: #f8f8f8;
                    box-shadow: 0 2px 0 0 #d0d8e0;
                "></div>
            ` : ''}
        `;

        rock.style.animationDelay = `${0.5 + i * 0.1}s`;
        container.appendChild(rock);
    }
}

// Create jumping bunnies
function createBunnies() {
    const container = document.getElementById('flowersContainer');
    const bunnyCount = 5;

    for (let i = 0; i < bunnyCount; i++) {
        const bunny = document.createElement('div');
        bunny.className = 'pixel-bunny';

        const leftPos = 10 + (i / bunnyCount) * 75;
        bunny.style.left = `${leftPos}%`;

        const facingLeft = Math.random() > 0.5;

        const bunnyColors = ['#f0e8e0', '#e8e0d8', '#d8d0c8', '#f8f0e8', '#e0d8d0'];
        const bodyColor = bunnyColors[Math.floor(Math.random() * bunnyColors.length)];
        const darkColor = darkenColor(bodyColor, 15);
        const lightColor = lightenColor(bodyColor, 10);

        // Build bunny always facing RIGHT, use scaleX to flip
        bunny.innerHTML = `
            <div class="bunny-body" style="
                width: 32px;
                height: 24px;
                background: ${bodyColor};
                position: relative;
                box-shadow:
                    4px 0 0 0 ${darkColor},
                    -4px 0 0 0 ${lightColor},
                    0 4px 0 0 ${darkColor};
                transform: scaleX(${facingLeft ? -1 : 1});
            ">
                <!-- Head -->
                <div style="
                    position: absolute;
                    top: -12px;
                    right: -8px;
                    width: 24px;
                    height: 20px;
                    background: ${bodyColor};
                    box-shadow:
                        4px 0 0 0 ${darkColor},
                        -4px 0 0 0 ${lightColor},
                        0 -4px 0 0 ${lightColor};
                ">
                    <!-- Left ear -->
                    <div style="
                        position: absolute;
                        top: -20px;
                        left: 2px;
                        width: 8px;
                        height: 20px;
                        background: ${bodyColor};
                        box-shadow: 2px 0 0 0 ${darkColor};
                    ">
                        <div style="
                            position: absolute;
                            top: 4px;
                            left: 2px;
                            width: 4px;
                            height: 12px;
                            background: #ffb8b8;
                        "></div>
                    </div>
                    <!-- Right ear -->
                    <div style="
                        position: absolute;
                        top: -16px;
                        right: 2px;
                        width: 8px;
                        height: 16px;
                        background: ${bodyColor};
                        box-shadow: 2px 0 0 0 ${darkColor};
                    ">
                        <div style="
                            position: absolute;
                            top: 3px;
                            left: 2px;
                            width: 4px;
                            height: 10px;
                            background: #ffb8b8;
                        "></div>
                    </div>
                    <!-- Eye -->
                    <div style="
                        position: absolute;
                        top: 6px;
                        right: 4px;
                        width: 6px;
                        height: 6px;
                        background: #303030;
                    ">
                        <div style="
                            position: absolute;
                            top: 1px;
                            left: 1px;
                            width: 2px;
                            height: 2px;
                            background: white;
                        "></div>
                    </div>
                    <!-- Nose -->
                    <div style="
                        position: absolute;
                        bottom: 2px;
                        right: -2px;
                        width: 6px;
                        height: 4px;
                        background: #ffb0b0;
                    "></div>
                </div>
                <!-- Tail -->
                <div style="
                    position: absolute;
                    top: 4px;
                    left: -10px;
                    width: 12px;
                    height: 12px;
                    background: ${lightColor};
                    border-radius: 50%;
                "></div>
                <!-- Front leg -->
                <div style="
                    position: absolute;
                    bottom: -8px;
                    right: 4px;
                    width: 8px;
                    height: 12px;
                    background: ${bodyColor};
                    box-shadow: 2px 0 0 0 ${darkColor};
                "></div>
                <!-- Back leg -->
                <div style="
                    position: absolute;
                    bottom: -8px;
                    left: 4px;
                    width: 10px;
                    height: 14px;
                    background: ${darkColor};
                "></div>
            </div>
        `;

        container.appendChild(bunny);

        // Start random bunny behavior
        startBunnyBehavior(bunny, facingLeft);
    }
}

// Random bunny behavior - bunnies only jump in the direction they're facing
function startBunnyBehavior(bunny, initialFacing) {
    let currentLeft = parseFloat(bunny.style.left);
    let facingLeft = initialFacing;
    const bunnyBody = bunny.querySelector('.bunny-body');

    function updateFacing() {
        if (bunnyBody) {
            bunnyBody.style.transform = `scaleX(${facingLeft ? -1 : 1})`;
        }
    }

    function hop() {
        // Random behavior: idle, turn around, or hop forward
        const action = Math.random();

        if (action < 0.25) {
            // Idle - just wiggle in place
            bunny.classList.remove('hopping');
            bunny.classList.add('idle');
            setTimeout(hop, 1500 + Math.random() * 2500);
        } else if (action < 0.4) {
            // Turn around (don't jump yet)
            facingLeft = !facingLeft;
            updateFacing();
            bunny.classList.remove('hopping');
            bunny.classList.add('idle');
            setTimeout(hop, 800 + Math.random() * 1000);
        } else {
            // Hop forward in facing direction
            bunny.classList.remove('idle');
            bunny.classList.add('hopping');

            const moveAmount = 4 + Math.random() * 6;

            // Always move in the direction the bunny is facing
            if (facingLeft) {
                currentLeft = Math.max(5, currentLeft - moveAmount);
            } else {
                currentLeft = Math.min(90, currentLeft + moveAmount);
            }

            // If hitting bounds, turn around AFTER this hop
            if (currentLeft <= 5 || currentLeft >= 90) {
                setTimeout(() => {
                    facingLeft = !facingLeft;
                    updateFacing();
                }, 500);
            }

            bunny.style.left = `${currentLeft}%`;

            // Schedule next action after hop animation completes
            setTimeout(() => {
                bunny.classList.remove('hopping');
                setTimeout(hop, 400 + Math.random() * 1500);
            }, 500);
            return;
        }
    }

    // Start with random delay
    setTimeout(hop, Math.random() * 2000);
}

// Create huge pixel trees
function createTallTrees() {
    const container = document.getElementById('flowersContainer');
    const treePositions = [5, 28, 68, 92];

    for (let i = 0; i < treePositions.length; i++) {
        createPixelTree(container, treePositions[i], i);
    }
}

function createPixelTree(container, leftPos, index) {
    const tree = document.createElement('div');
    tree.className = 'pixel-tree';
    tree.style.left = `${leftPos}%`;

    const treeHeight = window.innerHeight * (1.2 + Math.random() * 0.5);
    const trunkWidth = 40 + Math.floor(Math.random() * 30);

    const baseDelay = 0.1 + index * 0.5;

    // Single trunk piece
    const trunkHTML = `
        <div class="tree-trunk" style="
            width: ${trunkWidth}px;
            height: ${treeHeight * 0.5}px;
            background: #6a4420;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            box-shadow:
                ${Math.floor(trunkWidth * 0.2)}px 0 0 0 #4a2a10,
                -${Math.floor(trunkWidth * 0.2)}px 0 0 0 #8a5a30,
                inset 8px 0 0 0 #8a5a30,
                inset -8px 0 0 0 #4a2a10;
        "></div>
    `;

    const foliageRows = 8 + Math.floor(Math.random() * 5);
    let foliageHTML = '';

    const baseWidth = trunkWidth * 4;
    for (let row = 0; row < foliageRows; row++) {
        const rowWidth = baseWidth - (row * (baseWidth / foliageRows) * 0.7);
        const rowHeight = 32 + Math.floor(Math.random() * 16);
        const greenShade = row % 3 === 0 ? '#208020' : row % 3 === 1 ? '#30a030' : '#48c048';
        const offsetY = row * 28;

        foliageHTML += `
            <div class="tree-foliage-row" style="
                width: ${rowWidth}px;
                height: ${rowHeight}px;
                background: ${greenShade};
                position: absolute;
                bottom: ${treeHeight * 0.4 + offsetY}px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 
                    ${Math.floor(rowWidth * 0.15)}px 0 0 0 #1a6a1a,
                    -${Math.floor(rowWidth * 0.15)}px 0 0 0 #50d050,
                    0 4px 0 0 #1a5a1a;
            "></div>
        `;

        if (row % 2 === 0) {
            foliageHTML += `
                <div class="tree-snow-row" style="
                    width: ${rowWidth * 0.8}px;
                    height: 16px;
                    background: #f8f8f8;
                    position: absolute;
                    bottom: ${treeHeight * 0.4 + offsetY + rowHeight - 8}px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 
                        -${Math.floor(rowWidth * 0.2)}px 4px 0 0 #f8f8f8,
                        ${Math.floor(rowWidth * 0.2)}px 4px 0 0 #f8f8f8,
                        0 4px 0 0 #d0d8e0;
                "></div>
            `;
        }
    }

    tree.innerHTML = `${trunkHTML}${foliageHTML}`;
    tree.style.animationDelay = `${baseDelay}s`;

    container.appendChild(tree);
}

// Create evenly spread flowers
function createFlowerGarden() {
    const container = document.getElementById('flowersContainer');
    const flowerCount = 8;

    const growOrder = Array.from({ length: flowerCount }, (_, i) => i);
    shuffleArray(growOrder);

    const sectionWidth = 90 / flowerCount;
    const positions = [];

    for (let i = 0; i < flowerCount; i++) {
        const sectionStart = 5 + (i * sectionWidth);
        const offset = Math.random() * (sectionWidth * 0.6);
        positions.push(sectionStart + offset);
    }

    for (let i = 0; i < flowerCount; i++) {
        const growIndex = growOrder.indexOf(i);
        createFlower(container, i, positions[i], growIndex);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createFlower(container, index, leftPos, growOrderIndex) {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.style.left = `${leftPos}%`;

    const heightPercent = 50 + Math.random() * 20;
    const totalHeight = (heightPercent / 100) * window.innerHeight;

    const colorScheme = flowerColors[Math.floor(Math.random() * flowerColors.length)];

    // Flower size
    const flowerSize = 50 + Math.floor(Math.random() * 50);
    const petalSize = Math.floor(flowerSize * 0.4);
    const petalStyle = petalStyles[Math.floor(Math.random() * petalStyles.length)];

    const stemWidth = 14 + Math.floor(Math.random() * 8);

    const curveDirection = Math.random() > 0.5 ? 1 : -1;
    const curveIntensity = 60 + Math.random() * 80;

    // Grow delay for this flower
    const growDelay = 0.2 + (growOrderIndex * 0.15);

    const swayAmount = 1 + Math.random() * 2;
    const swayDuration = 3 + Math.random() * 2;

    const stemHTML = createPixelCurvedStem(totalHeight, stemWidth, curveDirection, curveIntensity);
    const headOffsetX = curveDirection * curveIntensity;

    // Container size needs to be bigger to fit petals
    const containerSize = flowerSize + (petalSize * 3);

    flower.innerHTML = `
        <div class="flower-head-wrapper" style="
            width: ${containerSize}px; 
            height: ${containerSize}px;
            position: absolute;
            bottom: ${totalHeight - containerSize / 2}px;
            left: 50%;
            transform: translateX(calc(-50% + ${headOffsetX}px));
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div class="flower-head" style="
                width: ${flowerSize}px; 
                height: ${flowerSize}px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                ${createPixelPetalsWithSnow(petalSize, colorScheme.petals, petalStyle)}
                <div class="flower-center" style="
                    width: ${Math.floor(flowerSize * 0.28)}px;
                    height: ${Math.floor(flowerSize * 0.28)}px;
                    background: ${colorScheme.center};
                    position: absolute;
                    z-index: 5;
                    box-shadow: 
                        inset 3px 3px 0 0 ${lightenColor(colorScheme.center, 30)},
                        inset -3px -3px 0 0 ${darkenColor(colorScheme.center, 20)};
                "></div>
            </div>
        </div>
        <div class="flower-stem-container" style="
            height: ${totalHeight}px; 
            width: ${curveIntensity * 2 + stemWidth + 60}px;
            position: relative;
        ">
            ${stemHTML}
        </div>
    `;

    // Set animation delay
    flower.style.animationDelay = `${growDelay}s`;
    flower.style.setProperty('--grow-delay', `${growDelay}s`);
    flower.style.setProperty('--sway-amount', `${swayAmount}deg`);
    flower.style.setProperty('--sway-duration', `${swayDuration}s`);

    container.appendChild(flower);

    // Start swaying after grown
    setTimeout(() => {
        flower.classList.add('sway');
    }, (growDelay + 2.2) * 1000);
}

function createPixelCurvedStem(height, width, direction, intensity) {
    const segments = Math.floor(height / 20);
    let stemHTML = '';
    const midX = intensity + width / 2 + 30;

    for (let i = 0; i < segments; i++) {
        const progress = i / segments;
        const nextProgress = (i + 1) / segments;
        const curveOffset = Math.sin(progress * Math.PI * 0.8) * intensity * direction;
        const nextCurveOffset = Math.sin(nextProgress * Math.PI * 0.8) * intensity * direction;
        const segmentHeight = 20;
        const yPos = i * segmentHeight;
        const xPos = midX + curveOffset;
        const angle = Math.atan2(nextCurveOffset - curveOffset, segmentHeight) * (180 / Math.PI);

        stemHTML += `
            <div class="stem-segment" style="
                position: absolute;
                bottom: ${yPos}px;
                left: ${xPos}px;
                width: ${width}px;
                height: ${segmentHeight + 6}px;
                background: #40a040;
                transform: translateX(-50%) rotate(${angle * 0.3}deg);
                box-shadow:
                    ${Math.floor(width * 0.25)}px 0 0 0 #308030,
                    -${Math.floor(width * 0.25)}px 0 0 0 #50c850,
                    0 4px 0 0 #308030;
            "></div>
        `;

        if (i % 4 === 2 && i < segments - 2) {
            const leafSide = (i % 2 === 0) ? -1 : 1;
            const leafSize = 20 + Math.floor(Math.random() * 12);

            stemHTML += `
                <div class="pixel-leaf" style="
                    position: absolute;
                    bottom: ${yPos + 6}px;
                    left: ${xPos + (leafSide * width * 0.8)}px;
                    width: ${leafSize}px;
                    height: ${Math.floor(leafSize * 0.5)}px;
                    background: #48c048;
                    transform: translateX(${leafSide > 0 ? '0' : '-100%'}) rotate(${leafSide * 25}deg);
                    box-shadow:
                        ${leafSide * 3}px 3px 0 0 #308030,
                        inset ${leafSide * 3}px 2px 0 0 #60d860;
                "></div>
            `;
        }
    }
    return stemHTML;
}

// Create beautiful detailed pixel petals
function createPixelPetalsWithSnow(size, color, style) {
    const darkColor = darkenColor(color, 25);
    const darkerColor = darkenColor(color, 40);
    const lightColor = lightenColor(color, 30);
    const lighterColor = lightenColor(color, 50);
    const highlightColor = lightenColor(color, 70);

    // Petal dimensions
    const s = Math.floor(size * 1.6);
    const spread = Math.floor(size * 0.45);
    const smallSpread = Math.floor(size * 0.25);
    const tinySpread = Math.floor(size * 0.15);
    const centerSize = Math.floor(size * 1.4);

    // Inner detail positions
    const inner = Math.floor(s * 0.5);
    const mid = Math.floor(s * 0.75);

    let petalsHTML = '';

    switch (style) {
        case 'star':
            // 8-pointed star with layered detail
            petalsHTML = `
                <div style="
                    position: absolute;
                    width: ${centerSize}px;
                    height: ${centerSize}px;
                    background: ${color};
                    box-shadow:
                        /* Outer petals - dark edges */
                        0 -${s}px 0 ${spread}px ${darkColor},
                        0 ${s}px 0 ${spread}px ${darkColor},
                        -${s}px 0 0 ${spread}px ${darkColor},
                        ${s}px 0 0 ${spread}px ${darkColor},
                        /* Diagonal petals */
                        -${mid}px -${mid}px 0 ${smallSpread}px ${color},
                        ${mid}px -${mid}px 0 ${smallSpread}px ${color},
                        -${mid}px ${mid}px 0 ${smallSpread}px ${darkerColor},
                        ${mid}px ${mid}px 0 ${smallSpread}px ${darkerColor},
                        /* Main petal colors */
                        0 -${Math.floor(s * 0.85)}px 0 ${smallSpread}px ${color},
                        0 ${Math.floor(s * 0.85)}px 0 ${smallSpread}px ${color},
                        -${Math.floor(s * 0.85)}px 0 0 ${smallSpread}px ${lightColor},
                        ${Math.floor(s * 0.85)}px 0 0 ${smallSpread}px ${color},
                        /* Inner highlights */
                        0 -${inner}px 0 ${tinySpread}px ${lightColor},
                        -${inner}px 0 0 ${tinySpread}px ${lighterColor},
                        /* Pixel detail spots */
                        -${Math.floor(s * 0.3)}px -${Math.floor(s * 0.8)}px 0 3px ${highlightColor},
                        ${Math.floor(s * 0.3)}px -${Math.floor(s * 0.6)}px 0 2px ${lighterColor};
                "></div>
            `;
            break;

        case 'diamond':
            // Elegant diamond petals with gradient layers
            petalsHTML = `
                <div style="
                    position: absolute;
                    width: ${centerSize}px;
                    height: ${centerSize}px;
                    background: ${color};
                    box-shadow:
                        /* Outer dark edges */
                        0 -${s}px 0 ${spread}px ${darkerColor},
                        0 ${s}px 0 ${spread}px ${darkerColor},
                        -${s}px 0 0 ${spread}px ${darkerColor},
                        ${s}px 0 0 ${spread}px ${darkerColor},
                        /* Mid layer */
                        0 -${Math.floor(s * 0.8)}px 0 ${smallSpread}px ${darkColor},
                        0 ${Math.floor(s * 0.8)}px 0 ${smallSpread}px ${darkColor},
                        -${Math.floor(s * 0.8)}px 0 0 ${smallSpread}px ${color},
                        ${Math.floor(s * 0.8)}px 0 0 ${smallSpread}px ${color},
                        /* Inner bright layer */
                        0 -${inner}px 0 ${smallSpread}px ${color},
                        0 ${inner}px 0 ${smallSpread}px ${color},
                        -${inner}px 0 0 ${smallSpread}px ${lightColor},
                        ${inner}px 0 0 ${smallSpread}px ${lightColor},
                        /* Diagonal accents */
                        -${mid}px -${mid}px 0 ${tinySpread}px ${lightColor},
                        ${mid}px -${mid}px 0 ${tinySpread}px ${lightColor},
                        /* Highlight spots */
                        0 -${Math.floor(s * 0.5)}px 0 4px ${highlightColor},
                        -${Math.floor(s * 0.5)}px 0 0 3px ${lighterColor},
                        ${Math.floor(s * 0.4)}px -${Math.floor(s * 0.4)}px 0 2px ${highlightColor};
                "></div>
            `;
            break;

        case 'tulip':
            // Tulip with curved appearance
            petalsHTML = `
                <div style="
                    position: absolute;
                    width: ${centerSize}px;
                    height: ${centerSize}px;
                    background: ${color};
                    box-shadow:
                        /* Main tulip shape - outer */
                        0 -${s}px 0 ${spread}px ${color},
                        -${Math.floor(s * 0.9)}px -${mid}px 0 ${spread}px ${lightColor},
                        ${Math.floor(s * 0.9)}px -${mid}px 0 ${spread}px ${darkColor},
                        /* Middle layer */
                        0 -${Math.floor(s * 0.7)}px 0 ${smallSpread}px ${lightColor},
                        -${Math.floor(s * 0.6)}px -${inner}px 0 ${smallSpread}px ${lighterColor},
                        ${Math.floor(s * 0.6)}px -${inner}px 0 ${smallSpread}px ${color},
                        /* Inner cup */
                        -${Math.floor(s * 0.3)}px 0 0 ${smallSpread}px ${lightColor},
                        ${Math.floor(s * 0.3)}px 0 0 ${smallSpread}px ${darkColor},
                        /* Dark base */
                        -${Math.floor(s * 0.4)}px ${Math.floor(s * 0.3)}px 0 ${tinySpread}px ${darkerColor},
                        ${Math.floor(s * 0.4)}px ${Math.floor(s * 0.3)}px 0 ${tinySpread}px ${darkerColor},
                        /* Highlights */
                        0 -${Math.floor(s * 0.85)}px 0 4px ${highlightColor},
                        -${Math.floor(s * 0.5)}px -${Math.floor(s * 0.6)}px 0 3px ${highlightColor},
                        -${Math.floor(s * 0.7)}px -${Math.floor(s * 0.3)}px 0 2px ${lighterColor};
                "></div>
            `;
            break;

        case 'daisy':
            // Full daisy with many detailed petals
            petalsHTML = `
                <div style="
                    position: absolute;
                    width: ${centerSize}px;
                    height: ${centerSize}px;
                    background: ${color};
                    box-shadow:
                        /* 8 outer petals with edges */
                        0 -${s}px 0 ${spread}px ${color},
                        0 ${s}px 0 ${spread}px ${darkColor},
                        -${s}px 0 0 ${spread}px ${lightColor},
                        ${s}px 0 0 ${spread}px ${darkColor},
                        -${mid}px -${mid}px 0 ${spread}px ${color},
                        ${mid}px -${mid}px 0 ${spread}px ${color},
                        -${mid}px ${mid}px 0 ${spread}px ${darkColor},
                        ${mid}px ${mid}px 0 ${spread}px ${darkColor},
                        /* Inner petal layer */
                        0 -${Math.floor(s * 0.7)}px 0 ${smallSpread}px ${lightColor},
                        0 ${Math.floor(s * 0.7)}px 0 ${smallSpread}px ${color},
                        -${Math.floor(s * 0.7)}px 0 0 ${smallSpread}px ${lighterColor},
                        ${Math.floor(s * 0.7)}px 0 0 ${smallSpread}px ${color},
                        /* Inner diagonal accents */
                        -${inner}px -${inner}px 0 ${tinySpread}px ${lighterColor},
                        ${inner}px -${inner}px 0 ${tinySpread}px ${lightColor},
                        /* Pixel highlights on petals */
                        0 -${Math.floor(s * 0.8)}px 0 4px ${highlightColor},
                        -${Math.floor(s * 0.8)}px 0 0 3px ${highlightColor},
                        -${Math.floor(s * 0.5)}px -${Math.floor(s * 0.5)}px 0 3px ${highlightColor},
                        ${Math.floor(s * 0.4)}px -${Math.floor(s * 0.7)}px 0 2px ${lighterColor};
                "></div>
            `;
            break;

        default: // round - classic 4-petal with detail
            petalsHTML = `
                <div style="
                    position: absolute;
                    width: ${centerSize}px;
                    height: ${centerSize}px;
                    background: ${color};
                    box-shadow:
                        /* Outer petals with dark edges */
                        0 -${s}px 0 ${spread}px ${darkColor},
                        0 ${s}px 0 ${spread}px ${darkerColor},
                        -${s}px 0 0 ${spread}px ${darkColor},
                        ${s}px 0 0 ${spread}px ${darkerColor},
                        /* Main petal colors */
                        0 -${Math.floor(s * 0.85)}px 0 ${smallSpread}px ${color},
                        0 ${Math.floor(s * 0.85)}px 0 ${smallSpread}px ${darkColor},
                        -${Math.floor(s * 0.85)}px 0 0 ${smallSpread}px ${lightColor},
                        ${Math.floor(s * 0.85)}px 0 0 ${smallSpread}px ${color},
                        /* Inner bright layer */
                        0 -${inner}px 0 ${smallSpread}px ${lightColor},
                        0 ${inner}px 0 ${smallSpread}px ${color},
                        -${inner}px 0 0 ${smallSpread}px ${lighterColor},
                        ${inner}px 0 0 ${smallSpread}px ${lightColor},
                        /* Highlight spots */
                        0 -${Math.floor(s * 0.6)}px 0 4px ${highlightColor},
                        -${Math.floor(s * 0.6)}px 0 0 4px ${highlightColor},
                        -${Math.floor(s * 0.3)}px -${Math.floor(s * 0.7)}px 0 2px ${lighterColor},
                        ${Math.floor(s * 0.2)}px -${Math.floor(s * 0.5)}px 0 2px ${highlightColor};
                "></div>
            `;
    }

    return petalsHTML;
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}

function initPixelSnowfall() {
    const snowContainer = document.getElementById('snowContainer');

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * 100 + 'vw';

        const sizes = [4, 6, 8, 10];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';

        const duration = 8 + Math.random() * 6;
        snowflake.style.animationDuration = duration + 's';
        snowflake.style.animationDelay = Math.random() * 2 + 's';

        const drift = Math.round((Math.random() - 0.5) * 80 / 4) * 4;
        snowflake.style.setProperty('--drift', drift + 'px');

        snowContainer.appendChild(snowflake);
        setTimeout(() => snowflake.remove(), (duration + 2) * 1000);
    }

    for (let i = 0; i < 50; i++) {
        setTimeout(() => createSnowflake(), i * 80);
    }
    setInterval(createSnowflake, 150);
}

function initButtonEffects() {
    const beginBtn = document.getElementById('beginBtn');
    const languageModal = document.getElementById('languageModal');
    const langBtns = document.querySelectorAll('.lang-btn');

    beginBtn.addEventListener('click', () => {
        beginBtn.style.transform = 'translateY(8px)';
        createPixelBurst(beginBtn);
        setTimeout(() => {
            beginBtn.style.transform = '';
            // Show language selection modal instead of direct navigation
            languageModal.classList.add('active');
        }, 300);
    });

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            const country = btn.dataset.country;

            // Store selection
            localStorage.setItem('selectedLanguage', lang);
            localStorage.setItem('selectedCountry', country);

            // Navigate to character customisation
            window.location.href = 'character.html';
        });
    });
}

function createPixelBurst(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `position: fixed; left: ${centerX}px; top: ${centerY}px; width: 8px; height: 8px; background: white; pointer-events: none; z-index: 1000;`;
        document.body.appendChild(particle);

        const angle = (i / 8) * Math.PI * 2;
        const velocity = 60;
        const targetX = Math.round(Math.cos(angle) * velocity / 8) * 8;
        const targetY = Math.round(Math.sin(angle) * velocity / 8) * 8;

        let frame = 0;
        const interval = setInterval(() => {
            frame++;
            const progress = frame / 10;
            particle.style.transform = `translate(calc(-50% + ${targetX * progress}px), calc(-50% + ${targetY * progress + progress * progress * 30}px))`;
            particle.style.opacity = 1 - progress;
            if (frame >= 10) { clearInterval(interval); particle.remove(); }
        }, 40);
    }
}
