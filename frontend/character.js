// Character Customisation Page

document.addEventListener('DOMContentLoaded', () => {
    initSnowfall();
    initCharacterCustomisation();
    initSubmitButton();
    initPreviewBackground();
    updateCharacterPreview();
});

// Character data
const characterData = {
    name: '',
    skinColor: '#ffd5b5',
    hairStyle: 0,
    hairColor: '#2c1810',
    eyeColor: '#4a90d9',
    outfit: 0,
    outfitColor: '#e74c3c',
    pantsColor: '#3a3a5a' // Default value, no longer customizable
};

const hairStyles = ['Spiky', 'Short', 'Long', 'Curly', 'Bald'];
const outfits = ['Adventurer', 'T-Shirt', 'Hoodie', 'Suit'];

// Initialize customisation controls
function initCharacterCustomisation() {
    // Name input
    document.getElementById('characterName').addEventListener('input', (e) => {
        characterData.name = e.target.value;
    });

    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            const isNext = btn.classList.contains('next');

            switch (target) {
                case 'hairStyle':
                    characterData.hairStyle = cycleOption(characterData.hairStyle, hairStyles.length, isNext);
                    document.getElementById('hairStyleValue').textContent = hairStyles[characterData.hairStyle];
                    break;
                case 'outfit':
                    characterData.outfit = cycleOption(characterData.outfit, outfits.length, isNext);
                    document.getElementById('outfitValue').textContent = outfits[characterData.outfit];
                    break;
            }
            updateCharacterPreview();
        });
    });

    // Color buttons
    initColorButtons('skinColors', 'skinColor');
    initColorButtons('hairColors', 'hairColor');
    initColorButtons('eyeColors', 'eyeColor');
    initColorButtons('outfitColors', 'outfitColor');
    // Pants color removed
}

function cycleOption(current, max, isNext) {
    if (isNext) {
        return (current + 1) % max;
    } else {
        return (current - 1 + max) % max;
    }
}

function initColorButtons(containerId, dataKey) {
    const container = document.getElementById(containerId);
    if (!container) return; // Safety check
    container.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            characterData[dataKey] = btn.dataset.color;
            updateCharacterPreview();
        });
    });
}

// Update the character preview
function updateCharacterPreview() {
    const preview = document.getElementById('characterPreview');
    if (!preview) return; // Safety check
    
    const hairStyle = hairStyles[characterData.hairStyle];
    const outfit = outfits[characterData.outfit];

    // Generate hair based on style
    let hairHTML = '';
    switch (hairStyle) {
        case 'Spiky':
            hairHTML = `
                <div style="position: absolute; bottom: 145px; left: 50%; transform: translateX(-50%); width: 52px; height: 20px; background: ${characterData.hairColor}; box-shadow: -8px -8px 0 0 ${characterData.hairColor}, 8px -8px 0 0 ${characterData.hairColor}, 0 -16px 0 0 ${characterData.hairColor}, -16px 0 0 0 ${characterData.hairColor}, 16px 0 0 0 ${characterData.hairColor};"></div>
            `;
            break;
        case 'Short':
            hairHTML = `
                <div style="position: absolute; bottom: 145px; left: 50%; transform: translateX(-50%); width: 48px; height: 16px; background: ${characterData.hairColor}; border-radius: 8px 8px 0 0;"></div>
            `;
            break;
        case 'Long':
            hairHTML = `
                <div style="position: absolute; bottom: 110px; left: 50%; transform: translateX(-50%); width: 56px; height: 60px; background: ${characterData.hairColor}; border-radius: 8px 8px 0 0;"></div>
            `;
            break;
        case 'Curly':
            hairHTML = `
                <div style="position: absolute; bottom: 142px; left: 50%; transform: translateX(-50%); width: 54px; height: 24px; background: ${characterData.hairColor}; border-radius: 50%; box-shadow: -6px 0 0 0 ${characterData.hairColor}, 6px 0 0 0 ${characterData.hairColor}, 0 -6px 0 0 ${characterData.hairColor};"></div>
            `;
            break;
        case 'Bald':
            hairHTML = '';
            break;
    }

    // Body dimensions (standard size)
    const bodyWidth = 48;
    const bodyHeight = 56;

    // Generate outfit pattern
    let outfitHTML = '';
    const outfitDark = darkenColor(characterData.outfitColor, 20);
    const outfitLight = lightenColor(characterData.outfitColor, 15);

    switch (outfit) {
        case 'Hoodie':
            outfitHTML = `
                <div style="position: absolute; bottom: 48px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${outfitDark};"></div>
                <div style="position: absolute; bottom: 98px; left: 50%; transform: translateX(-50%); width: 20px; height: 10px; background: ${outfitDark}; border-radius: 0 0 10px 10px;"></div>
                <div style="position: absolute; bottom: 65px; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background: ${outfitDark};"></div>
            `;
            break;
        case 'Suit':
            outfitHTML = `
                <div style="position: absolute; bottom: 48px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: #2c3e50; box-shadow: 4px 0 0 0 #1a252f;"></div>
                <div style="position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); width: 8px; height: 24px; background: #fff;"></div>
                <div style="position: absolute; bottom: 92px; left: 50%; transform: translateX(-50%); width: 10px; height: 12px; background: #c0392b;"></div>
            `;
            break;
        case 'T-Shirt':
        case 'Adventurer':
        default:
            outfitHTML = `
                <div style="position: absolute; bottom: 48px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${outfitDark}, -4px 0 0 0 ${outfitLight};"></div>
            `;
            break;
    }


    const pantsColor = characterData.pantsColor;
    const pantsDark = darkenColor(pantsColor, 15);

    preview.innerHTML = `
        <!-- Legs -->
        <div style="position: absolute; bottom: 20px; left: calc(50% - 16px); width: 14px; height: 30px; background: ${pantsColor}; box-shadow: 4px 0 0 0 ${pantsDark};"></div>
        <div style="position: absolute; bottom: 20px; left: calc(50% + 2px); width: 14px; height: 30px; background: ${pantsColor}; box-shadow: 4px 0 0 0 ${pantsDark};"></div>
        
        <!-- Shoes -->
        <div style="position: absolute; bottom: 20px; left: calc(50% - 20px); width: 18px; height: 10px; background: #4a3020; box-shadow: 2px 0 0 0 #3a2010;"></div>
        <div style="position: absolute; bottom: 20px; left: calc(50% + 2px); width: 18px; height: 10px; background: #4a3020; box-shadow: 2px 0 0 0 #3a2010;"></div>
        
        <!-- Body/Outfit -->
        ${outfitHTML}
        
        <!-- Arms -->
        <div style="position: absolute; bottom: 70px; left: calc(50% - ${bodyWidth / 2 + 12}px); width: 12px; height: 40px; background: ${characterData.skinColor}; box-shadow: 2px 0 0 0 ${darkenColor(characterData.skinColor, 15)};"></div>
        <div style="position: absolute; bottom: 70px; left: calc(50% + ${bodyWidth / 2}px); width: 12px; height: 40px; background: ${characterData.skinColor}; box-shadow: 2px 0 0 0 ${darkenColor(characterData.skinColor, 15)};"></div>
        
        <!-- Hands -->
        <div style="position: absolute; bottom: 65px; left: calc(50% - ${bodyWidth / 2 + 14}px); width: 14px; height: 14px; background: ${characterData.skinColor}; border-radius: 4px;"></div>
        <div style="position: absolute; bottom: 65px; left: calc(50% + ${bodyWidth / 2}px); width: 14px; height: 14px; background: ${characterData.skinColor}; border-radius: 4px;"></div>
        
        <!-- Head -->
        <div style="position: absolute; bottom: 105px; left: 50%; transform: translateX(-50%); width: 44px; height: 44px; background: ${characterData.skinColor}; border-radius: 8px; box-shadow: 4px 0 0 0 ${darkenColor(characterData.skinColor, 15)}, -4px 0 0 0 ${lightenColor(characterData.skinColor, 10)};"></div>
        
        <!-- Hair (behind head if long) -->
        ${hairStyle === 'Long' ? hairHTML : ''}
        
        <!-- Eyes -->
        <div style="position: absolute; bottom: 125px; left: calc(50% - 12px); width: 8px; height: 10px; background: ${characterData.eyeColor}; box-shadow: inset 2px 2px 0 0 ${lightenColor(characterData.eyeColor, 30)};"></div>
        <div style="position: absolute; bottom: 125px; left: calc(50% + 4px); width: 8px; height: 10px; background: ${characterData.eyeColor}; box-shadow: inset 2px 2px 0 0 ${lightenColor(characterData.eyeColor, 30)};"></div>
        
        <!-- Eye highlights -->
        <div style="position: absolute; bottom: 131px; left: calc(50% - 10px); width: 3px; height: 3px; background: white;"></div>
        <div style="position: absolute; bottom: 131px; left: calc(50% + 6px); width: 3px; height: 3px; background: white;"></div>
        
        <!-- Eyebrows -->
        <div style="position: absolute; bottom: 136px; left: calc(50% - 14px); width: 10px; height: 3px; background: ${darkenColor(characterData.hairColor, 10)};"></div>
        <div style="position: absolute; bottom: 136px; left: calc(50% + 4px); width: 10px; height: 3px; background: ${darkenColor(characterData.hairColor, 10)};"></div>
        
        <!-- Mouth -->
        <div style="position: absolute; bottom: 113px; left: 50%; transform: translateX(-50%); width: 12px; height: 4px; background: ${darkenColor(characterData.skinColor, 30)}; border-radius: 0 0 4px 4px;"></div>
        
        <!-- Hair (in front if not long) -->
        ${hairStyle !== 'Long' ? hairHTML : ''}
    `;
}

// Color utilities
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

// Submit button
function initSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', () => {
        submitBtn.style.transform = 'translateY(8px)';

        // Save character data to localStorage
        localStorage.setItem('playerCharacter', JSON.stringify(characterData));

        setTimeout(() => {
            submitBtn.style.transform = '';
            // Go to country selection
            window.location.href = 'country-selection.html';
        }, 300);
    });
}

// Snowfall
function initSnowfall() {
    const snowContainer = document.getElementById('snowContainer');

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * 100 + 'vw';

        const sizes = [4, 6, 8];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';

        const duration = 8 + Math.random() * 6;
        snowflake.style.animationDuration = duration + 's';
        snowflake.style.animationDelay = Math.random() * 2 + 's';

        const drift = Math.round((Math.random() - 0.5) * 60 / 4) * 4;
        snowflake.style.setProperty('--drift', drift + 'px');

        snowContainer.appendChild(snowflake);
        setTimeout(() => snowflake.remove(), (duration + 2) * 1000);
    }

    for (let i = 0; i < 30; i++) {
        setTimeout(() => createSnowflake(), i * 100);
    }
    setInterval(createSnowflake, 200);
}

// Initialize preview background with trees, flowers, rocks, and bushes
function initPreviewBackground() {
    const container = document.getElementById('previewBackground');
    if (!container) return;
    
    createPreviewTrees(container);
    createPreviewFlowers(container);
    createPreviewBushes(container);
    createPreviewRocks(container);
}

// Create trees in preview (fewer than home page)
function createPreviewTrees(container) {
    const treePositions = [15, 75]; // 2 trees instead of 4
    
    for (let i = 0; i < treePositions.length; i++) {
        createPreviewTree(container, treePositions[i], i);
    }
}

function createPreviewTree(container, leftPos, index) {
    const tree = document.createElement('div');
    tree.className = 'pixel-tree';
    tree.style.left = `${leftPos}%`;
    tree.style.position = 'absolute';
    tree.style.bottom = '0';
    
    const containerHeight = container.offsetHeight || 350;
    const treeHeight = containerHeight * 0.8;
    const trunkWidth = 20 + Math.floor(Math.random() * 15);
    
    const baseDelay = 0.1 + index * 0.3;
    
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
                inset 4px 0 0 0 #8a5a30,
                inset -4px 0 0 0 #4a2a10;
        "></div>
    `;
    
    const foliageRows = 5 + Math.floor(Math.random() * 3);
    let foliageHTML = '';
    
    const baseWidth = trunkWidth * 3;
    for (let row = 0; row < foliageRows; row++) {
        const rowWidth = baseWidth - (row * (baseWidth / foliageRows) * 0.6);
        const rowHeight = 20 + Math.floor(Math.random() * 10);
        const greenShade = row % 3 === 0 ? '#208020' : row % 3 === 1 ? '#30a030' : '#48c048';
        const offsetY = row * 18;
        
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
                    0 2px 0 0 #1a5a1a;
            "></div>
        `;
        
        if (row % 2 === 0) {
            foliageHTML += `
                <div class="tree-snow-row" style="
                    width: ${rowWidth * 0.8}px;
                    height: 10px;
                    background: #f8f8f8;
                    position: absolute;
                    bottom: ${treeHeight * 0.4 + offsetY + rowHeight - 5}px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 
                        -${Math.floor(rowWidth * 0.2)}px 2px 0 0 #f8f8f8,
                        ${Math.floor(rowWidth * 0.2)}px 2px 0 0 #f8f8f8,
                        0 2px 0 0 #d0d8e0;
                "></div>
            `;
        }
    }
    
    tree.innerHTML = `${trunkHTML}${foliageHTML}`;
    tree.style.animationDelay = `${baseDelay}s`;
    tree.style.opacity = '0';
    tree.style.animation = 'treeGrow 1.5s ease-out forwards';
    
    container.appendChild(tree);
}

// Create flowers in preview (fewer than home page)
function createPreviewFlowers(container) {
    const flowerCount = 4; // 4 instead of 8
    const flowerColors = [
        { petals: '#ff6b8a', center: '#ffeb3b' },
        { petals: '#ba68c8', center: '#ffcc02' },
        { petals: '#64b5f6', center: '#fff59d' },
        { petals: '#ec407a', center: '#fff176' },
    ];
    
    const sectionWidth = 80 / flowerCount;
    
    for (let i = 0; i < flowerCount; i++) {
        const sectionStart = 10 + (i * sectionWidth);
        const offset = Math.random() * (sectionWidth * 0.6);
        const leftPos = sectionStart + offset;
        
        createPreviewFlower(container, i, leftPos, flowerColors[i % flowerColors.length]);
    }
}

function createPreviewFlower(container, index, leftPos, colorScheme) {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.style.left = `${leftPos}%`;
    flower.style.position = 'absolute';
    flower.style.bottom = '0';
    
    const containerHeight = container.offsetHeight || 350;
    const heightPercent = 30 + Math.random() * 15;
    const totalHeight = (heightPercent / 100) * containerHeight;
    
    const flowerSize = 30 + Math.floor(Math.random() * 25);
    const petalSize = Math.floor(flowerSize * 0.4);
    
    const stemWidth = 8 + Math.floor(Math.random() * 4);
    const curveDirection = Math.random() > 0.5 ? 1 : -1;
    const curveIntensity = 20 + Math.random() * 30;
    
    const stemHTML = createPreviewStem(totalHeight, stemWidth, curveDirection, curveIntensity);
    const headOffsetX = curveDirection * curveIntensity;
    
    const containerSize = flowerSize + (petalSize * 2);
    
    flower.innerHTML = `
        <div class="flower-head-wrapper" style="
            width: ${containerSize}px; 
            height: ${containerSize}px;
            position: absolute;
            bottom: ${totalHeight - containerSize / 2}px;
            left: 50%;
            transform: translateX(calc(-50% + ${headOffsetX}px));
            z-index: 10;
        ">
            <div class="flower-head" style="
                width: ${flowerSize}px; 
                height: ${flowerSize}px;
                position: relative;
            ">
                ${createPreviewPetals(petalSize, colorScheme.petals)}
                <div class="flower-center" style="
                    width: ${Math.floor(flowerSize * 0.28)}px;
                    height: ${Math.floor(flowerSize * 0.28)}px;
                    background: ${colorScheme.center};
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 5;
                    box-shadow: 
                        inset 2px 2px 0 0 ${lightenColor(colorScheme.center, 30)},
                        inset -2px -2px 0 0 ${darkenColor(colorScheme.center, 20)};
                "></div>
            </div>
        </div>
        <div class="flower-stem-container" style="
            height: ${totalHeight}px; 
            width: ${curveIntensity * 2 + stemWidth + 30}px;
            position: relative;
        ">
            ${stemHTML}
        </div>
    `;
    
    flower.style.animationDelay = `${0.2 + index * 0.15}s`;
    flower.style.opacity = '0';
    flower.style.animation = 'flowerGrow 2s ease-out forwards';
    
    container.appendChild(flower);
    
    setTimeout(() => {
        flower.classList.add('sway');
    }, (0.2 + index * 0.15 + 2.2) * 1000);
}

function createPreviewStem(height, width, direction, intensity) {
    const segments = Math.floor(height / 15);
    let stemHTML = '';
    const midX = intensity + width / 2 + 15;
    
    for (let i = 0; i < segments; i++) {
        const progress = i / segments;
        const nextProgress = (i + 1) / segments;
        const curveOffset = Math.sin(progress * Math.PI * 0.8) * intensity * direction;
        const nextCurveOffset = Math.sin(nextProgress * Math.PI * 0.8) * intensity * direction;
        const segmentHeight = 15;
        const yPos = i * segmentHeight;
        const xPos = midX + curveOffset;
        const angle = Math.atan2(nextCurveOffset - curveOffset, segmentHeight) * (180 / Math.PI);
        
        stemHTML += `
            <div class="stem-segment" style="
                position: absolute;
                bottom: ${yPos}px;
                left: ${xPos}px;
                width: ${width}px;
                height: ${segmentHeight + 4}px;
                background: #40a040;
                transform: translateX(-50%) rotate(${angle * 0.3}deg);
                box-shadow:
                    ${Math.floor(width * 0.25)}px 0 0 0 #308030,
                    -${Math.floor(width * 0.25)}px 0 0 0 #50c850,
                    0 2px 0 0 #308030;
            "></div>
        `;
    }
    return stemHTML;
}

function createPreviewPetals(size, color) {
    const darkColor = darkenColor(color, 25);
    const lightColor = lightenColor(color, 30);
    const s = Math.floor(size * 1.4);
    const spread = Math.floor(size * 0.35);
    const smallSpread = Math.floor(size * 0.2);
    const inner = Math.floor(s * 0.5);
    
    return `
        <div style="
            position: absolute;
            width: ${Math.floor(size * 1.2)}px;
            height: ${Math.floor(size * 1.2)}px;
            background: ${color};
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow:
                0 -${s}px 0 ${spread}px ${darkColor},
                0 ${s}px 0 ${spread}px ${darkColor},
                -${s}px 0 0 ${spread}px ${darkColor},
                ${s}px 0 0 ${spread}px ${darkColor},
                0 -${Math.floor(s * 0.85)}px 0 ${smallSpread}px ${color},
                0 ${Math.floor(s * 0.85)}px 0 ${smallSpread}px ${color},
                -${Math.floor(s * 0.85)}px 0 0 ${smallSpread}px ${lightColor},
                ${Math.floor(s * 0.85)}px 0 0 ${smallSpread}px ${color},
                0 -${inner}px 0 ${smallSpread}px ${lightColor},
                0 ${inner}px 0 ${smallSpread}px ${color},
                -${inner}px 0 0 ${smallSpread}px ${lightColor},
                ${inner}px 0 0 ${smallSpread}px ${lightColor};
        "></div>
    `;
}

// Create bushes in preview (fewer than home page)
function createPreviewBushes(container) {
    const bushCount = 6; // 6 instead of 12
    
    for (let i = 0; i < bushCount; i++) {
        const bush = document.createElement('div');
        bush.className = 'pixel-bush';
        bush.style.position = 'absolute';
        bush.style.bottom = '0';
        
        const leftPos = 5 + (i / bushCount) * 88;
        bush.style.left = `${leftPos}%`;
        
        const size = 25 + Math.floor(Math.random() * 30);
        const height = size * (0.6 + Math.random() * 0.3);
        
        const greens = ['#2d8a2d', '#3da03d', '#4db84d', '#35a035'];
        const mainColor = greens[Math.floor(Math.random() * greens.length)];
        const darkColor = darkenColor(mainColor, 20);
        const lightColor = lightenColor(mainColor, 15);
        
        const lumps = 2 + Math.floor(Math.random() * 2);
        let bushHTML = '';
        
        for (let j = 0; j < lumps; j++) {
            const lumpSize = size * (0.5 + Math.random() * 0.4);
            const lumpX = (j - lumps / 2 + 0.5) * (size * 0.3);
            const lumpY = Math.random() * 5;
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
                        0 2px 0 0 ${darkColor};
                "></div>
            `;
        }
        
        bush.innerHTML = bushHTML;
        bush.style.width = `${size * 1.3}px`;
        bush.style.height = `${height + 15}px`;
        bush.style.animationDelay = `${0.3 + i * 0.1}s`;
        bush.style.opacity = '0';
        bush.style.animation = 'bushGrow 1s ease-out forwards';
        
        container.appendChild(bush);
    }
}

// Create rocks in preview (fewer than home page)
function createPreviewRocks(container) {
    const rockCount = 4; // 4 instead of 8
    
    for (let i = 0; i < rockCount; i++) {
        const rock = document.createElement('div');
        rock.className = 'pixel-rock';
        rock.style.position = 'absolute';
        rock.style.bottom = '0';
        
        const leftPos = 8 + Math.random() * 82;
        rock.style.left = `${leftPos}%`;
        
        const width = 15 + Math.floor(Math.random() * 20);
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
                    0 2px 0 0 ${darkenColor(mainColor, 30)},
                    inset ${Math.floor(width * 0.2)}px ${Math.floor(height * 0.2)}px 0 0 ${lightenColor(mainColor, 20)};
            "></div>
            ${Math.random() > 0.5 ? `
                <div style="
                    position: absolute;
                    top: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: ${width * 0.6}px;
                    height: 6px;
                    background: #f8f8f8;
                    box-shadow: 0 1px 0 0 #d0d8e0;
                "></div>
            ` : ''}
        `;
        
        rock.style.animationDelay = `${0.5 + i * 0.15}s`;
        rock.style.opacity = '0';
        rock.style.animation = 'rockAppear 0.5s ease-out forwards';
        
        container.appendChild(rock);
    }
}

