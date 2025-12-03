// Character Customisation Page

document.addEventListener('DOMContentLoaded', () => {
    initSnowfall();
    initCharacterCustomisation();
    initSubmitButton();
    updateCharacterPreview();
});

// Character data
const characterData = {
    name: '',
    bodyType: 0,
    skinColor: '#ffd5b5',
    hairStyle: 0,
    hairColor: '#2c1810',
    eyeColor: '#4a90d9',
    outfit: 0,
    outfitColor: '#e74c3c'
};

const bodyTypes = ['Normal', 'Athletic', 'Slim', 'Stocky'];
const hairStyles = ['Spiky', 'Long', 'Short', 'Ponytail', 'Bald', 'Curly'];
const outfits = ['Adventurer', 'Warrior', 'Mage', 'Farmer', 'Noble', 'Casual'];

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
            
            switch(target) {
                case 'bodyType':
                    characterData.bodyType = cycleOption(characterData.bodyType, bodyTypes.length, isNext);
                    document.getElementById('bodyTypeValue').textContent = bodyTypes[characterData.bodyType];
                    break;
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
    const hairStyle = hairStyles[characterData.hairStyle];
    const bodyType = bodyTypes[characterData.bodyType];
    
    // Generate hair based on style
    let hairHTML = '';
    switch(hairStyle) {
        case 'Spiky':
            hairHTML = `
                <div style="position: absolute; bottom: 105px; left: 50%; transform: translateX(-50%); width: 52px; height: 24px; background: ${characterData.hairColor}; box-shadow: -8px -8px 0 0 ${characterData.hairColor}, 8px -8px 0 0 ${characterData.hairColor}, 0 -16px 0 0 ${characterData.hairColor}, -16px 0 0 0 ${characterData.hairColor}, 16px 0 0 0 ${characterData.hairColor};"></div>
            `;
            break;
        case 'Long':
            hairHTML = `
                <div style="position: absolute; bottom: 90px; left: 50%; transform: translateX(-50%); width: 56px; height: 60px; background: ${characterData.hairColor}; border-radius: 8px 8px 0 0;"></div>
            `;
            break;
        case 'Short':
            hairHTML = `
                <div style="position: absolute; bottom: 108px; left: 50%; transform: translateX(-50%); width: 48px; height: 20px; background: ${characterData.hairColor}; border-radius: 8px 8px 0 0;"></div>
            `;
            break;
        case 'Ponytail':
            hairHTML = `
                <div style="position: absolute; bottom: 105px; left: 50%; transform: translateX(-50%); width: 48px; height: 20px; background: ${characterData.hairColor}; border-radius: 8px 8px 0 0;"></div>
                <div style="position: absolute; bottom: 80px; right: 15px; width: 12px; height: 40px; background: ${characterData.hairColor}; border-radius: 0 0 6px 6px;"></div>
            `;
            break;
        case 'Bald':
            hairHTML = '';
            break;
        case 'Curly':
            hairHTML = `
                <div style="position: absolute; bottom: 102px; left: 50%; transform: translateX(-50%); width: 54px; height: 28px; background: ${characterData.hairColor}; border-radius: 50%; box-shadow: -6px 0 0 0 ${characterData.hairColor}, 6px 0 0 0 ${characterData.hairColor}, 0 -6px 0 0 ${characterData.hairColor};"></div>
            `;
            break;
    }
    
    // Body width based on type
    let bodyWidth = 48;
    let bodyHeight = 56;
    switch(bodyType) {
        case 'Athletic': bodyWidth = 52; bodyHeight = 58; break;
        case 'Slim': bodyWidth = 40; bodyHeight = 60; break;
        case 'Stocky': bodyWidth = 56; bodyHeight = 50; break;
    }
    
    preview.innerHTML = `
        <!-- Legs -->
        <div style="position: absolute; bottom: 0; left: calc(50% - 16px); width: 14px; height: 30px; background: #3a3a5a; box-shadow: 4px 0 0 0 #2a2a4a;"></div>
        <div style="position: absolute; bottom: 0; left: calc(50% + 2px); width: 14px; height: 30px; background: #3a3a5a; box-shadow: 4px 0 0 0 #2a2a4a;"></div>
        
        <!-- Shoes -->
        <div style="position: absolute; bottom: 0; left: calc(50% - 20px); width: 18px; height: 10px; background: #4a3020; box-shadow: 2px 0 0 0 #3a2010;"></div>
        <div style="position: absolute; bottom: 0; left: calc(50% + 2px); width: 18px; height: 10px; background: #4a3020; box-shadow: 2px 0 0 0 #3a2010;"></div>
        
        <!-- Body/Outfit -->
        <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${darkenColor(characterData.outfitColor, 20)}, -4px 0 0 0 ${lightenColor(characterData.outfitColor, 15)};"></div>
        
        <!-- Arms -->
        <div style="position: absolute; bottom: 50px; left: calc(50% - ${bodyWidth/2 + 12}px); width: 12px; height: 40px; background: ${characterData.skinColor}; box-shadow: 2px 0 0 0 ${darkenColor(characterData.skinColor, 15)};"></div>
        <div style="position: absolute; bottom: 50px; left: calc(50% + ${bodyWidth/2}px); width: 12px; height: 40px; background: ${characterData.skinColor}; box-shadow: 2px 0 0 0 ${darkenColor(characterData.skinColor, 15)};"></div>
        
        <!-- Hands -->
        <div style="position: absolute; bottom: 45px; left: calc(50% - ${bodyWidth/2 + 14}px); width: 14px; height: 14px; background: ${characterData.skinColor}; border-radius: 4px;"></div>
        <div style="position: absolute; bottom: 45px; left: calc(50% + ${bodyWidth/2}px); width: 14px; height: 14px; background: ${characterData.skinColor}; border-radius: 4px;"></div>
        
        <!-- Head -->
        <div style="position: absolute; bottom: 85px; left: 50%; transform: translateX(-50%); width: 44px; height: 44px; background: ${characterData.skinColor}; border-radius: 8px; box-shadow: 4px 0 0 0 ${darkenColor(characterData.skinColor, 15)}, -4px 0 0 0 ${lightenColor(characterData.skinColor, 10)};"></div>
        
        <!-- Eyes -->
        <div style="position: absolute; bottom: 105px; left: calc(50% - 12px); width: 8px; height: 10px; background: ${characterData.eyeColor}; box-shadow: inset 2px 2px 0 0 ${lightenColor(characterData.eyeColor, 30)};"></div>
        <div style="position: absolute; bottom: 105px; left: calc(50% + 4px); width: 8px; height: 10px; background: ${characterData.eyeColor}; box-shadow: inset 2px 2px 0 0 ${lightenColor(characterData.eyeColor, 30)};"></div>
        
        <!-- Eye highlights -->
        <div style="position: absolute; bottom: 111px; left: calc(50% - 10px); width: 3px; height: 3px; background: white;"></div>
        <div style="position: absolute; bottom: 111px; left: calc(50% + 6px); width: 3px; height: 3px; background: white;"></div>
        
        <!-- Mouth -->
        <div style="position: absolute; bottom: 93px; left: 50%; transform: translateX(-50%); width: 12px; height: 4px; background: ${darkenColor(characterData.skinColor, 30)}; border-radius: 0 0 4px 4px;"></div>
        
        <!-- Hair -->
        ${hairHTML}
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
            // Navigate to game world
            window.location.href = 'game.html';
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

