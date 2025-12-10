// ═══════════════════════════════════════════════════════════════════════════════
// Avatar System - Pixel Art Character Generation
// ═══════════════════════════════════════════════════════════════════════════════

export function generatePlayerAvatarHTML(playerCharacter) {
    try {
        if (!playerCharacter) return '<span style="font-size: 2rem;">🧑</span>'; // Fallback emoji

        // Import character generation logic (simplified/scaled version)
        // We'll create a scaled-down version of the character preview
        const char = playerCharacter;

        // Helper functions
        const darkenColor = (color, amt) => {
            const num = parseInt(color.replace('#', ''), 16);
            const r = Math.max(0, (num >> 16) - amt);
            const g = Math.max(0, ((num >> 8) & 0xFF) - amt);
            const b = Math.max(0, (num & 0xFF) - amt);
            return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        };

        const lightenColor = (color, percent) => {
            const num = parseInt(color.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.min(255, (num >> 16) + amt);
            const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
            const B = Math.min(255, (num & 0x0000FF) + amt);
            return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
        };

        // Data arrays
        const hairStyles = ['Spiky', 'Mohawk', 'Flat Top', 'Long', 'Short', 'Ponytail', 'Bald', 'Curly', 'Afro', 'Pigtails', 'Buzz Cut', 'Side Part', 'Wavy', 'Slick Back'];
        const bodyTypes = ['Normal', 'Athletic', 'Slim', 'Stocky'];
        const outfits = ['Adventurer', 'T-Shirt', 'Striped', 'Hoodie', 'Suit', 'Overalls', 'Tank Top', 'Uniform', 'Sweater', 'Jacket', 'Polo', 'V-Neck', 'Vest', 'Lab Coat'];
        const accessories = ['None', 'Glasses', 'Sunglasses', 'Round Glasses', 'Eye Patch', 'Monocle', 'Bandana', 'Scarf', 'Necklace', 'Bow Tie', 'Tie'];
        const hats = ['None', 'Cap', 'Beanie', 'Top Hat', 'Cowboy', 'Hard Hat', 'Crown', 'Headphones', 'Police Cap', 'Beret', 'Bandana', 'Wizard Hat', 'Viking Helmet'];
        const facialHairs = ['None', 'Stubble', 'Beard', 'Goatee', 'Mustache', 'Full Beard', 'Handlebar'];

        const hairStyle = hairStyles[char.hairStyle || 0];
        const bodyType = bodyTypes[char.bodyType || 0];
        const outfit = outfits[char.outfit || 0];
        const accessory = accessories[char.accessory || 0];
        const hat = hats[char.hat || 0];
        const facialHair = facialHairs[char.facialHair || 0];

        // Body dimensions (scaled)
        let bodyWidth = 24;
        let bodyHeight = 28;
        switch (bodyType) {
            case 'Athletic': bodyWidth = 26; bodyHeight = 29; break;
            case 'Slim': bodyWidth = 20; bodyHeight = 30; break;
            case 'Stocky': bodyWidth = 28; bodyHeight = 25; break;
        }

        // Generate simplified character HTML (scaled down)
        const skinColor = char.skinColor || '#ffd5b5';
        const hairColor = char.hairColor || '#2c1810';
        const outfitColor = char.outfitColor || '#e74c3c';
        const pantsColor = char.pantsColor || '#3a3a5a';
        const eyeColor = char.eyeColor || '#4a90d9';

        // Simple hair (just a few styles for avatar)
        let hairHTML = '';
        if (hairStyle !== 'Bald') {
            if (hairStyle === 'Long' || hairStyle === 'Ponytail' || hairStyle === 'Pigtails') {
                hairHTML = `<div style="position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); width: 28px; height: 30px; background: ${hairColor}; border-radius: 4px 4px 0 0;"></div>`;
            } else {
                hairHTML = `<div style="position: absolute; bottom: 62px; left: 50%; transform: translateX(-50%); width: 24px; height: 8px; background: ${hairColor}; border-radius: 4px 4px 0 0;"></div>`;
            }
        }

        // Simple hat
        let hatHTML = '';
        if (hat !== 'None') {
            hatHTML = `<div style="position: absolute; bottom: 64px; left: 50%; transform: translateX(-50%); width: 26px; height: 10px; background: #2c3e50; border-radius: 4px 4px 0 0;"></div>`;
        }

        // Simple outfit
        const outfitDark = darkenColor(outfitColor, 20);
        let outfitHTML = `<div style="position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); width: ${bodyWidth}px; height: ${bodyHeight}px; background: ${outfitColor}; box-shadow: 2px 0 0 0 ${outfitDark};"></div>`;

        // Generate the character HTML
        return `
        <div style="position: relative; width: 100%; height: 100%; overflow: hidden;">
            <!-- Legs -->
            <div style="position: absolute; bottom: 0; left: calc(50% - 8px); width: 7px; height: 15px; background: ${pantsColor}; box-shadow: 2px 0 0 0 ${darkenColor(pantsColor, 15)};"></div>
            <div style="position: absolute; bottom: 0; left: calc(50% + 1px); width: 7px; height: 15px; background: ${pantsColor}; box-shadow: 2px 0 0 0 ${darkenColor(pantsColor, 15)};"></div>
            
            <!-- Shoes -->
            <div style="position: absolute; bottom: 0; left: calc(50% - 10px); width: 9px; height: 5px; background: #4a3020; box-shadow: 1px 0 0 0 #3a2010;"></div>
            <div style="position: absolute; bottom: 0; left: calc(50% + 1px); width: 9px; height: 5px; background: #4a3020; box-shadow: 1px 0 0 0 #3a2010;"></div>
            
            <!-- Body/Outfit -->
            ${outfitHTML}
            
            <!-- Arms -->
            <div style="position: absolute; bottom: 25px; left: calc(50% - ${bodyWidth / 2 + 6}px); width: 6px; height: 20px; background: ${skinColor}; box-shadow: 1px 0 0 0 ${darkenColor(skinColor, 15)};"></div>
            <div style="position: absolute; bottom: 25px; left: calc(50% + ${bodyWidth / 2}px); width: 6px; height: 20px; background: ${skinColor}; box-shadow: 1px 0 0 0 ${darkenColor(skinColor, 15)};"></div>
            
            <!-- Hands -->
            <div style="position: absolute; bottom: 22px; left: calc(50% - ${bodyWidth / 2 + 7}px); width: 7px; height: 7px; background: ${skinColor}; border-radius: 2px;"></div>
            <div style="position: absolute; bottom: 22px; left: calc(50% + ${bodyWidth / 2}px); width: 7px; height: 7px; background: ${skinColor}; border-radius: 2px;"></div>
            
            <!-- Head -->
            <div style="position: absolute; bottom: 42px; left: 50%; transform: translateX(-50%); width: 22px; height: 22px; background: ${skinColor}; border-radius: 4px; box-shadow: 2px 0 0 0 ${darkenColor(skinColor, 15)}, -2px 0 0 0 ${lightenColor(skinColor, 10)};"></div>
            
            <!-- Hair (behind if long) -->
            ${hairStyle === 'Long' || hairStyle === 'Afro' ? hairHTML : ''}
            
            <!-- Eyes -->
            <div style="position: absolute; bottom: 52px; left: calc(50% - 6px); width: 4px; height: 5px; background: ${eyeColor}; box-shadow: inset 1px 1px 0 0 ${lightenColor(eyeColor, 30)};"></div>
            <div style="position: absolute; bottom: 52px; left: calc(50% + 2px); width: 4px; height: 5px; background: ${eyeColor}; box-shadow: inset 1px 1px 0 0 ${lightenColor(eyeColor, 30)};"></div>
            
            <!-- Eye highlights -->
            <div style="position: absolute; bottom: 55px; left: calc(50% - 5px); width: 1.5px; height: 1.5px; background: white;"></div>
            <div style="position: absolute; bottom: 55px; left: calc(50% + 3px); width: 1.5px; height: 1.5px; background: white;"></div>
            
            <!-- Mouth -->
            <div style="position: absolute; bottom: 46px; left: 50%; transform: translateX(-50%); width: 6px; height: 2px; background: ${darkenColor(skinColor, 30)}; border-radius: 0 0 2px 2px;"></div>
            
            <!-- Hair (in front if not long) -->
            ${hairStyle !== 'Long' && hairStyle !== 'Afro' ? hairHTML : ''}
            
            <!-- Hat -->
            ${hatHTML}
        </div>
    `;
    } catch (error) {
        console.error('Error generating player avatar:', error);
        return '<span style="font-size: 2rem;">🧑</span>'; // Fallback emoji
    }
}
