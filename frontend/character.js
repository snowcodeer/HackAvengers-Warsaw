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
    outfitColor: '#e74c3c',
    pantsColor: '#3a3a5a',
    accessory: 0,
    hat: 0,
    facialHair: 0
};

const bodyTypes = ['Normal', 'Athletic', 'Slim', 'Stocky'];
const hairStyles = ['Spiky', 'Mohawk', 'Flat Top', 'Long', 'Short', 'Ponytail', 'Bald', 'Curly', 'Afro', 'Pigtails', 'Buzz Cut', 'Side Part', 'Wavy', 'Slick Back'];
const outfits = ['Adventurer', 'T-Shirt', 'Striped', 'Hoodie', 'Suit', 'Overalls', 'Tank Top', 'Uniform', 'Sweater', 'Jacket', 'Polo', 'V-Neck', 'Vest', 'Lab Coat'];
const accessories = ['None', 'Glasses', 'Sunglasses', 'Round Glasses', 'Eye Patch', 'Monocle', 'Bandana', 'Scarf', 'Necklace', 'Bow Tie', 'Tie'];
const hats = ['None', 'Cap', 'Beanie', 'Top Hat', 'Cowboy', 'Hard Hat', 'Crown', 'Headphones', 'Police Cap', 'Beret', 'Bandana', 'Wizard Hat', 'Viking Helmet'];
const facialHairs = ['None', 'Stubble', 'Beard', 'Goatee', 'Mustache', 'Full Beard', 'Handlebar'];

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
                case 'accessory':
                    characterData.accessory = cycleOption(characterData.accessory, accessories.length, isNext);
                    document.getElementById('accessoryValue').textContent = accessories[characterData.accessory];
                    break;
                case 'hat':
                    characterData.hat = cycleOption(characterData.hat, hats.length, isNext);
                    document.getElementById('hatValue').textContent = hats[characterData.hat];
                    break;
                case 'facialHair':
                    characterData.facialHair = cycleOption(characterData.facialHair, facialHairs.length, isNext);
                    document.getElementById('facialHairValue').textContent = facialHairs[characterData.facialHair];
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
    initColorButtons('pantsColors', 'pantsColor');
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
    const outfit = outfits[characterData.outfit];
    const accessory = accessories[characterData.accessory];
    const hat = hats[characterData.hat];
    const facialHair = facialHairs[characterData.facialHair];
    
    // Generate hair based on style
    let hairHTML = '';
    switch(hairStyle) {
        case 'Spiky':
            hairHTML = `
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 52px; height: 20px; background: ${characterData.hairColor}; box-shadow: -8px -8px 0 0 ${characterData.hairColor}, 8px -8px 0 0 ${characterData.hairColor}, 0 -16px 0 0 ${characterData.hairColor}, -16px 0 0 0 ${characterData.hairColor}, 16px 0 0 0 ${characterData.hairColor};"></div>
            `;
            break;
        case 'Mohawk':
            hairHTML = `
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 12px; height: 32px; background: ${characterData.hairColor};"></div>
                <div style="position: absolute; bottom: 145px; left: 50%; transform: translateX(-50%); width: 8px; height: 20px; background: ${characterData.hairColor};"></div>
            `;
            break;
        case 'Flat Top':
            hairHTML = `
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 50px; height: 16px; background: ${characterData.hairColor};"></div>
            `;
            break;
        case 'Long':
            hairHTML = `
                <div style="position: absolute; bottom: 90px; left: 50%; transform: translateX(-50%); width: 56px; height: 60px; background: ${characterData.hairColor}; border-radius: 8px 8px 0 0;"></div>
            `;
            break;
        case 'Short':
            hairHTML = `
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 48px; height: 16px; background: ${characterData.hairColor}; border-radius: 8px 8px 0 0;"></div>
            `;
            break;
        case 'Ponytail':
            hairHTML = `
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 48px; height: 16px; background: ${characterData.hairColor}; border-radius: 8px 8px 0 0;"></div>
                <div style="position: absolute; bottom: 80px; right: 20px; width: 12px; height: 45px; background: ${characterData.hairColor}; border-radius: 0 0 6px 6px;"></div>
            `;
            break;
        case 'Bald':
            hairHTML = '';
            break;
        case 'Curly':
            hairHTML = `
                <div style="position: absolute; bottom: 122px; left: 50%; transform: translateX(-50%); width: 54px; height: 24px; background: ${characterData.hairColor}; border-radius: 50%; box-shadow: -6px 0 0 0 ${characterData.hairColor}, 6px 0 0 0 ${characterData.hairColor}, 0 -6px 0 0 ${characterData.hairColor};"></div>
            `;
            break;
        case 'Afro':
            hairHTML = `
                <div style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); width: 60px; height: 50px; background: ${characterData.hairColor}; border-radius: 50%;"></div>
            `;
            break;
        case 'Pigtails':
            hairHTML = `
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 48px; height: 14px; background: ${characterData.hairColor};"></div>
                <div style="position: absolute; bottom: 100px; left: 20px; width: 14px; height: 30px; background: ${characterData.hairColor}; border-radius: 0 0 7px 7px;"></div>
                <div style="position: absolute; bottom: 100px; right: 20px; width: 14px; height: 30px; background: ${characterData.hairColor}; border-radius: 0 0 7px 7px;"></div>
            `;
            break;
        case 'Buzz Cut':
            hairHTML = `
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 46px; height: 10px; background: ${characterData.hairColor};"></div>
            `;
            break;
        case 'Side Part':
            hairHTML = `
                <div style="position: absolute; bottom: 125px; left: calc(50% - 5px); transform: translateX(-50%); width: 52px; height: 18px; background: ${characterData.hairColor}; border-radius: 8px 0 0 0;"></div>
            `;
            break;
        case 'Wavy':
            hairHTML = `
                <div style="position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%); width: 50px; height: 28px; background: ${characterData.hairColor}; border-radius: 12px 12px 0 0;"></div>
                <div style="position: absolute; bottom: 100px; left: 24px; width: 12px; height: 35px; background: ${characterData.hairColor}; border-radius: 0 0 8px 8px;"></div>
                <div style="position: absolute; bottom: 100px; right: 24px; width: 12px; height: 35px; background: ${characterData.hairColor}; border-radius: 0 0 8px 8px;"></div>
            `;
            break;
        case 'Slick Back':
            hairHTML = `
                <div style="position: absolute; bottom: 118px; left: 50%; transform: translateX(-50%); width: 48px; height: 24px; background: ${characterData.hairColor}; border-radius: 50% 50% 0 0;"></div>
            `;
            break;
    }
    
    // Generate accessory
    let accessoryHTML = '';
    switch(accessory) {
        case 'Glasses':
            accessoryHTML = `
                <div style="position: absolute; bottom: 105px; left: calc(50% - 20px); width: 40px; height: 12px; border: 3px solid #333; background: transparent; border-radius: 2px;"></div>
            `;
            break;
        case 'Sunglasses':
            accessoryHTML = `
                <div style="position: absolute; bottom: 104px; left: calc(50% - 18px); width: 14px; height: 10px; background: #111; border-radius: 2px;"></div>
                <div style="position: absolute; bottom: 104px; left: calc(50% + 4px); width: 14px; height: 10px; background: #111; border-radius: 2px;"></div>
                <div style="position: absolute; bottom: 108px; left: calc(50% - 4px); width: 8px; height: 3px; background: #333;"></div>
            `;
            break;
        case 'Round Glasses':
            accessoryHTML = `
                <div style="position: absolute; bottom: 103px; left: calc(50% - 18px); width: 14px; height: 14px; border: 3px solid #daa520; border-radius: 50%; background: transparent;"></div>
                <div style="position: absolute; bottom: 103px; left: calc(50% + 4px); width: 14px; height: 14px; border: 3px solid #daa520; border-radius: 50%; background: transparent;"></div>
            `;
            break;
        case 'Eye Patch':
            accessoryHTML = `
                <div style="position: absolute; bottom: 103px; left: calc(50% - 18px); width: 16px; height: 14px; background: #222;"></div>
                <div style="position: absolute; bottom: 110px; left: calc(50% - 22px); width: 60px; height: 3px; background: #333; transform: rotate(-10deg);"></div>
            `;
            break;
        case 'Monocle':
            accessoryHTML = `
                <div style="position: absolute; bottom: 102px; left: calc(50% + 2px); width: 16px; height: 16px; border: 3px solid #daa520; border-radius: 50%; background: transparent;"></div>
                <div style="position: absolute; bottom: 88px; left: calc(50% + 14px); width: 2px; height: 20px; background: #daa520;"></div>
            `;
            break;
        case 'Bandana':
            accessoryHTML = `
                <div style="position: absolute; bottom: 118px; left: 50%; transform: translateX(-50%); width: 50px; height: 10px; background: #c0392b;"></div>
                <div style="position: absolute; bottom: 108px; right: 22px; width: 8px; height: 16px; background: #c0392b; transform: rotate(20deg);"></div>
            `;
            break;
        case 'Scarf':
            accessoryHTML = `
                <div style="position: absolute; bottom: 78px; left: 50%; transform: translateX(-50%); width: 52px; height: 12px; background: #e74c3c; box-shadow: 0 4px 0 0 #c0392b;"></div>
                <div style="position: absolute; bottom: 55px; left: calc(50% + 10px); width: 10px; height: 28px; background: #e74c3c; border-radius: 0 0 4px 4px;"></div>
            `;
            break;
        case 'Necklace':
            accessoryHTML = `
                <div style="position: absolute; bottom: 75px; left: 50%; transform: translateX(-50%); width: 30px; height: 6px; background: #f1c40f; border-radius: 0 0 15px 15px;"></div>
                <div style="position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; background: #e74c3c; border-radius: 50%;"></div>
            `;
            break;
        case 'Bow Tie':
            accessoryHTML = `
                <div style="position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); width: 24px; height: 10px; background: #c0392b;"></div>
                <div style="position: absolute; bottom: 82px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background: #a02320;"></div>
            `;
            break;
        case 'Tie':
            accessoryHTML = `
                <div style="position: absolute; bottom: 78px; left: 50%; transform: translateX(-50%); width: 8px; height: 6px; background: #c0392b;"></div>
                <div style="position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); width: 10px; height: 35px; background: #c0392b; clip-path: polygon(50% 100%, 0% 0%, 100% 0%);"></div>
            `;
            break;
    }
    
    // Generate hat
    let hatHTML = '';
    switch(hat) {
        case 'Cap':
            hatHTML = `
                <div style="position: absolute; bottom: 128px; left: 50%; transform: translateX(-50%); width: 50px; height: 18px; background: #2c3e50; border-radius: 20px 20px 0 0;"></div>
                <div style="position: absolute; bottom: 126px; left: calc(50% - 5px); width: 36px; height: 8px; background: #2c3e50;"></div>
            `;
            break;
        case 'Beanie':
            hatHTML = `
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 52px; height: 28px; background: #8e44ad; border-radius: 10px 10px 0 0;"></div>
                <div style="position: absolute; bottom: 148px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; background: #8e44ad; border-radius: 50%;"></div>
            `;
            break;
        case 'Top Hat':
            hatHTML = `
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 56px; height: 10px; background: #1a1a1a;"></div>
                <div style="position: absolute; bottom: 133px; left: 50%; transform: translateX(-50%); width: 40px; height: 35px; background: #1a1a1a;"></div>
                <div style="position: absolute; bottom: 135px; left: 50%; transform: translateX(-50%); width: 42px; height: 6px; background: #c0392b;"></div>
            `;
            break;
        case 'Cowboy':
            hatHTML = `
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 64px; height: 12px; background: #8b6914; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 132px; left: 50%; transform: translateX(-50%); width: 44px; height: 24px; background: #8b6914; border-radius: 50% 50% 0 0;"></div>
            `;
            break;
        case 'Hard Hat':
            hatHTML = `
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 54px; height: 26px; background: #f39c12; border-radius: 50% 50% 0 0;"></div>
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 58px; height: 8px; background: #e67e22;"></div>
            `;
            break;
        case 'Crown':
            hatHTML = `
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 50px; height: 12px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 135px; left: calc(50% - 20px); width: 10px; height: 18px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 135px; left: 50%; transform: translateX(-50%); width: 10px; height: 22px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 135px; left: calc(50% + 10px); width: 10px; height: 18px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 150px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background: #e74c3c; border-radius: 50%;"></div>
            `;
            break;
        case 'Headphones':
            hatHTML = `
                <div style="position: absolute; bottom: 130px; left: 50%; transform: translateX(-50%); width: 54px; height: 8px; background: #333; border-radius: 20px 20px 0 0;"></div>
                <div style="position: absolute; bottom: 100px; left: 22px; width: 14px; height: 20px; background: #333; border-radius: 4px;"></div>
                <div style="position: absolute; bottom: 100px; right: 22px; width: 14px; height: 20px; background: #333; border-radius: 4px;"></div>
            `;
            break;
        case 'Police Cap':
            hatHTML = `
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 52px; height: 20px; background: #2c3e50;"></div>
                <div style="position: absolute; bottom: 124px; left: calc(50% - 5px); width: 35px; height: 10px; background: #2c3e50;"></div>
                <div style="position: absolute; bottom: 130px; left: 50%; transform: translateX(-50%); width: 14px; height: 10px; background: #f1c40f;"></div>
            `;
            break;
        case 'Beret':
            hatHTML = `
                <div style="position: absolute; bottom: 124px; left: calc(50% - 5px); width: 52px; height: 20px; background: #c0392b; border-radius: 50% 50% 0 50%;"></div>
                <div style="position: absolute; bottom: 138px; left: calc(50% + 10px); width: 8px; height: 8px; background: #c0392b; border-radius: 50%;"></div>
            `;
            break;
        case 'Bandana':
            hatHTML = `
                <div style="position: absolute; bottom: 122px; left: 50%; transform: translateX(-50%); width: 52px; height: 14px; background: #e74c3c;"></div>
                <div style="position: absolute; bottom: 108px; right: 20px; width: 10px; height: 20px; background: #e74c3c; transform: rotate(15deg);"></div>
            `;
            break;
        case 'Wizard Hat':
            hatHTML = `
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 56px; height: 10px; background: #4a148c;"></div>
                <div style="position: absolute; bottom: 132px; left: 50%; transform: translateX(-50%); width: 40px; height: 45px; background: #4a148c; clip-path: polygon(50% 0%, 0% 100%, 100% 100%);"></div>
                <div style="position: absolute; bottom: 160px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; background: #f1c40f; border-radius: 50%;"></div>
            `;
            break;
        case 'Viking Helmet':
            hatHTML = `
                <div style="position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%); width: 54px; height: 28px; background: #95a5a6; border-radius: 50% 50% 0 0;"></div>
                <div style="position: absolute; bottom: 140px; left: 16px; width: 8px; height: 25px; background: #f5f5dc; border-radius: 50% 50% 0 0; transform: rotate(-20deg);"></div>
                <div style="position: absolute; bottom: 140px; right: 16px; width: 8px; height: 25px; background: #f5f5dc; border-radius: 50% 50% 0 0; transform: rotate(20deg);"></div>
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
    
    // Generate outfit pattern
    let outfitHTML = '';
    const outfitDark = darkenColor(characterData.outfitColor, 20);
    const outfitLight = lightenColor(characterData.outfitColor, 15);
    
    switch(outfit) {
        case 'Striped':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: repeating-linear-gradient(0deg, ${characterData.outfitColor} 0px, ${characterData.outfitColor} 8px, #fff 8px, #fff 16px); box-shadow: 4px 0 0 0 ${outfitDark};"></div>
            `;
            break;
        case 'Hoodie':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${outfitDark};"></div>
                <div style="position: absolute; bottom: 78px; left: 50%; transform: translateX(-50%); width: 20px; height: 10px; background: ${outfitDark}; border-radius: 0 0 10px 10px;"></div>
                <div style="position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background: ${outfitDark};"></div>
            `;
            break;
        case 'Suit':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: #2c3e50; box-shadow: 4px 0 0 0 #1a252f;"></div>
                <div style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); width: 8px; height: 24px; background: #fff;"></div>
                <div style="position: absolute; bottom: 72px; left: 50%; transform: translateX(-50%); width: 10px; height: 12px; background: #c0392b;"></div>
            `;
            break;
        case 'Overalls':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: #3498db; box-shadow: 4px 0 0 0 #2980b9;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% - 14px); width: 8px; height: 20px; background: #3498db;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% + 6px); width: 8px; height: 20px; background: #3498db;"></div>
                <div style="position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); width: 16px; height: 16px; background: #2980b9;"></div>
            `;
            break;
        case 'Tank Top':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth - 8}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${outfitDark};"></div>
            `;
            break;
        case 'Uniform':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: #2c3e50; box-shadow: 4px 0 0 0 #1a252f;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% - 12px); width: 6px; height: 6px; background: #f1c40f; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 60px; left: calc(50% - 12px); width: 6px; height: 6px; background: #f1c40f; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% + 6px); width: 6px; height: 6px; background: #f1c40f; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 60px; left: calc(50% + 6px); width: 6px; height: 6px; background: #f1c40f; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 74px; left: calc(50% - 6px); width: 12px; height: 8px; background: #34495e;"></div>
            `;
            break;
        case 'Sweater':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${outfitDark};"></div>
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: 12px; background: repeating-linear-gradient(90deg, ${outfitDark} 0px, ${outfitDark} 4px, ${characterData.outfitColor} 4px, ${characterData.outfitColor} 8px);"></div>
                <div style="position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: 8px; background: repeating-linear-gradient(90deg, ${outfitDark} 0px, ${outfitDark} 4px, ${characterData.outfitColor} 4px, ${characterData.outfitColor} 8px);"></div>
            `;
            break;
        case 'Jacket':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${outfitDark};"></div>
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: 4px; height: ${bodyHeight - 10}px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% - 16px); width: 12px; height: 12px; background: ${outfitDark};"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% + 4px); width: 12px; height: 12px; background: ${outfitDark};"></div>
            `;
            break;
        case 'Polo':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${outfitDark};"></div>
                <div style="position: absolute; bottom: 75px; left: 50%; transform: translateX(-50%); width: 12px; height: 10px; background: ${outfitDark};"></div>
                <div style="position: absolute; bottom: 68px; left: calc(50% - 3px); width: 6px; height: 6px; background: #fff; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 60px; left: calc(50% - 3px); width: 6px; height: 6px; background: #fff; border-radius: 50%;"></div>
            `;
            break;
        case 'V-Neck':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${outfitDark};"></div>
                <div style="position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%); width: 16px; height: 16px; background: ${characterData.skinColor}; clip-path: polygon(50% 100%, 0% 0%, 100% 0%);"></div>
            `;
            break;
        case 'Vest':
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: #fff; box-shadow: 4px 0 0 0 #ddd;"></div>
                <div style="position: absolute; bottom: 28px; left: calc(50% - 22px); width: 16px; height: ${bodyHeight}px; background: ${characterData.outfitColor};"></div>
                <div style="position: absolute; bottom: 28px; left: calc(50% + 6px); width: 16px; height: ${bodyHeight}px; background: ${characterData.outfitColor};"></div>
            `;
            break;
        case 'Lab Coat':
            outfitHTML = `
                <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: ${bodyWidth + 8}px; height: ${bodyHeight + 15}px; background: #ffffff; box-shadow: 4px 0 0 0 #ddd;"></div>
                <div style="position: absolute; bottom: 55px; left: calc(50% - 18px); width: 10px; height: 10px; background: ${characterData.outfitColor}; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 40px; left: calc(50% - 18px); width: 10px; height: 10px; background: ${characterData.outfitColor}; border-radius: 50%;"></div>
            `;
            break;
        default: // T-Shirt, Adventurer
            outfitHTML = `
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${characterData.outfitColor}; box-shadow: 4px 0 0 0 ${outfitDark}, -4px 0 0 0 ${outfitLight};"></div>
            `;
    }
    
    // Generate facial hair
    let facialHairHTML = '';
    const facialHairColor = darkenColor(characterData.hairColor, 10);
    switch(facialHair) {
        case 'Stubble':
            facialHairHTML = `
                <div style="position: absolute; bottom: 88px; left: calc(50% - 16px); width: 32px; height: 8px; background: ${facialHairColor}; opacity: 0.4;"></div>
            `;
            break;
        case 'Beard':
            facialHairHTML = `
                <div style="position: absolute; bottom: 82px; left: calc(50% - 14px); width: 28px; height: 14px; background: ${facialHairColor}; border-radius: 0 0 6px 6px;"></div>
            `;
            break;
        case 'Goatee':
            facialHairHTML = `
                <div style="position: absolute; bottom: 82px; left: calc(50% - 6px); width: 12px; height: 14px; background: ${facialHairColor}; border-radius: 0 0 4px 4px;"></div>
            `;
            break;
        case 'Mustache':
            facialHairHTML = `
                <div style="position: absolute; bottom: 92px; left: calc(50% - 12px); width: 24px; height: 6px; background: ${facialHairColor};"></div>
            `;
            break;
        case 'Full Beard':
            facialHairHTML = `
                <div style="position: absolute; bottom: 75px; left: calc(50% - 18px); width: 36px; height: 22px; background: ${facialHairColor}; border-radius: 0 0 10px 10px;"></div>
                <div style="position: absolute; bottom: 92px; left: calc(50% - 12px); width: 24px; height: 6px; background: ${facialHairColor};"></div>
            `;
            break;
        case 'Handlebar':
            facialHairHTML = `
                <div style="position: absolute; bottom: 92px; left: calc(50% - 16px); width: 32px; height: 6px; background: ${facialHairColor};"></div>
                <div style="position: absolute; bottom: 88px; left: calc(50% - 20px); width: 6px; height: 10px; background: ${facialHairColor}; border-radius: 0 0 0 4px;"></div>
                <div style="position: absolute; bottom: 88px; left: calc(50% + 14px); width: 6px; height: 10px; background: ${facialHairColor}; border-radius: 0 0 4px 0;"></div>
            `;
            break;
    }

    const pantsColor = characterData.pantsColor;
    const pantsDark = darkenColor(pantsColor, 15);

    preview.innerHTML = `
        <!-- Legs -->
        <div style="position: absolute; bottom: 0; left: calc(50% - 16px); width: 14px; height: 30px; background: ${pantsColor}; box-shadow: 4px 0 0 0 ${pantsDark};"></div>
        <div style="position: absolute; bottom: 0; left: calc(50% + 2px); width: 14px; height: 30px; background: ${pantsColor}; box-shadow: 4px 0 0 0 ${pantsDark};"></div>
        
        <!-- Shoes -->
        <div style="position: absolute; bottom: 0; left: calc(50% - 20px); width: 18px; height: 10px; background: #4a3020; box-shadow: 2px 0 0 0 #3a2010;"></div>
        <div style="position: absolute; bottom: 0; left: calc(50% + 2px); width: 18px; height: 10px; background: #4a3020; box-shadow: 2px 0 0 0 #3a2010;"></div>
        
        <!-- Body/Outfit -->
        ${outfitHTML}
        
        <!-- Arms -->
        <div style="position: absolute; bottom: 50px; left: calc(50% - ${bodyWidth/2 + 12}px); width: 12px; height: 40px; background: ${characterData.skinColor}; box-shadow: 2px 0 0 0 ${darkenColor(characterData.skinColor, 15)};"></div>
        <div style="position: absolute; bottom: 50px; left: calc(50% + ${bodyWidth/2}px); width: 12px; height: 40px; background: ${characterData.skinColor}; box-shadow: 2px 0 0 0 ${darkenColor(characterData.skinColor, 15)};"></div>
        
        <!-- Hands -->
        <div style="position: absolute; bottom: 45px; left: calc(50% - ${bodyWidth/2 + 14}px); width: 14px; height: 14px; background: ${characterData.skinColor}; border-radius: 4px;"></div>
        <div style="position: absolute; bottom: 45px; left: calc(50% + ${bodyWidth/2}px); width: 14px; height: 14px; background: ${characterData.skinColor}; border-radius: 4px;"></div>
        
        <!-- Head -->
        <div style="position: absolute; bottom: 85px; left: 50%; transform: translateX(-50%); width: 44px; height: 44px; background: ${characterData.skinColor}; border-radius: 8px; box-shadow: 4px 0 0 0 ${darkenColor(characterData.skinColor, 15)}, -4px 0 0 0 ${lightenColor(characterData.skinColor, 10)};"></div>
        
        <!-- Hair (behind head if long) -->
        ${hairStyle === 'Long' || hairStyle === 'Afro' ? hairHTML : ''}
        
        <!-- Eyes -->
        <div style="position: absolute; bottom: 105px; left: calc(50% - 12px); width: 8px; height: 10px; background: ${characterData.eyeColor}; box-shadow: inset 2px 2px 0 0 ${lightenColor(characterData.eyeColor, 30)};"></div>
        <div style="position: absolute; bottom: 105px; left: calc(50% + 4px); width: 8px; height: 10px; background: ${characterData.eyeColor}; box-shadow: inset 2px 2px 0 0 ${lightenColor(characterData.eyeColor, 30)};"></div>
        
        <!-- Eye highlights -->
        <div style="position: absolute; bottom: 111px; left: calc(50% - 10px); width: 3px; height: 3px; background: white;"></div>
        <div style="position: absolute; bottom: 111px; left: calc(50% + 6px); width: 3px; height: 3px; background: white;"></div>
        
        <!-- Eyebrows -->
        <div style="position: absolute; bottom: 116px; left: calc(50% - 14px); width: 10px; height: 3px; background: ${darkenColor(characterData.hairColor, 10)};"></div>
        <div style="position: absolute; bottom: 116px; left: calc(50% + 4px); width: 10px; height: 3px; background: ${darkenColor(characterData.hairColor, 10)};"></div>
        
        <!-- Mouth -->
        <div style="position: absolute; bottom: 93px; left: 50%; transform: translateX(-50%); width: 12px; height: 4px; background: ${darkenColor(characterData.skinColor, 30)}; border-radius: 0 0 4px 4px;"></div>
        
        <!-- Facial Hair -->
        ${facialHairHTML}
        
        <!-- Hair (in front if not long) -->
        ${hairStyle !== 'Long' && hairStyle !== 'Afro' ? hairHTML : ''}
        
        <!-- Accessory -->
        ${accessoryHTML}
        
        <!-- Hat -->
        ${hatHTML}
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
            // Navigate to country selection
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

