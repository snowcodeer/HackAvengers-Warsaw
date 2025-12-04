// LinguaVerse - Immersive Language Learning
// Main orchestration module

// ==================== CONFIGURATION ====================
const CONFIG = {
    ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
    ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    DECART_API_KEY: import.meta.env.VITE_DECART_API_KEY || '',
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
};

// ==================== SCENARIO DATA ====================
const SCENARIOS = {
    french: [
        {
            id: 'boulangerie',
            name: 'La Boulangerie',
            emoji: '🥐',
            country: 'France',
            flag: '🇫🇷',
            description: 'Order croissants, baguettes, and pastries in a charming Parisian bakery. Master the art of French politeness.',
            vocab: ['Bonjour', 'Croissant', "S'il vous plaît", 'Merci'],
            character: {
                name: 'Marie Dupont',
                emoji: '👩‍🍳',
                role: 'Master Baker',
                bio: 'Marie has been running this family boulangerie for 30 years. She loves teaching visitors about French bread culture and will gently correct your pronunciation while serving the finest pastries in Paris.'
            },
            world: {
                type: 'bakery',
                ambiance: 'warm_morning',
                style: 'parisian_vintage'
            },
            falseFriends: [
                { word: 'pain', meaning: 'bread (not pain!)', trap: 'Sounds like English "pain"' },
                { word: 'entrée', meaning: 'starter (not main course!)', trap: 'In US English means main dish' }
            ]
        },
        {
            id: 'cafe',
            name: 'Café de Flore',
            emoji: '☕',
            country: 'France',
            flag: '🇫🇷',
            description: 'Sip espresso at a legendary Saint-Germain café. Discuss philosophy with local intellectuals.',
            vocab: ['Un café', 'L\'addition', 'Je voudrais', 'C\'est délicieux'],
            character: {
                name: 'Jean-Pierre',
                emoji: '🧔',
                role: 'Café Philosopher',
                bio: 'A retired literature professor who spends his days at this café, eager to share French culture with curious visitors.'
            },
            world: {
                type: 'cafe',
                ambiance: 'afternoon_golden',
                style: 'art_deco'
            },
            falseFriends: [
                { word: 'préservatif', meaning: 'condom (not preservative!)', trap: 'Very embarrassing mix-up' },
                { word: 'librairie', meaning: 'bookshop (not library!)', trap: 'Library is bibliothèque' }
            ]
        }
    ],
    german: [
        {
            id: 'berghain',
            name: 'Berghain Queue',
            emoji: '🎧',
            country: 'Germany',
            flag: '🇩🇪',
            description: 'Navigate the legendary nightclub queue. Convince the bouncer in German while learning club culture vocabulary.',
            vocab: ['Guten Abend', 'Darf ich rein?', 'Ich bin allein', 'Techno'],
            character: {
                name: 'Sven',
                emoji: '🕴️',
                role: 'Legendary Doorman',
                bio: 'Sven has guarded the door for 15 years. He respects authenticity and will test your German while deciding your fate.'
            },
            world: {
                type: 'nightclub_exterior',
                ambiance: 'night_industrial',
                style: 'brutalist'
            },
            falseFriends: [
                { word: 'Gift', meaning: 'poison (not gift!)', trap: 'Gift in German = Geschenk' },
                { word: 'bekommen', meaning: 'to receive (not become!)', trap: 'Become = werden' }
            ]
        },
        {
            id: 'biergarten',
            name: 'Biergarten München',
            emoji: '🍺',
            country: 'Germany',
            flag: '🇩🇪',
            description: 'Join locals at a traditional Bavarian beer garden. Order Maß and pretzels like a true Münchner.',
            vocab: ['Prost!', 'Eine Maß bitte', 'Gemütlich', 'Lecker'],
            character: {
                name: 'Hans',
                emoji: '🧑‍🌾',
                role: 'Friendly Local',
                bio: 'Hans is a third-generation Munich native who loves introducing visitors to proper beer garden etiquette.'
            },
            world: {
                type: 'outdoor_garden',
                ambiance: 'summer_evening',
                style: 'bavarian_rustic'
            },
            falseFriends: [
                { word: 'bald', meaning: 'soon (not bald!)', trap: 'Bald = kahl' },
                { word: 'Chef', meaning: 'boss (not chef!)', trap: 'Chef/cook = Koch' }
            ]
        }
    ],
    spanish: [
        {
            id: 'tapas',
            name: 'Tapas Bar Madrid',
            emoji: '🍷',
            country: 'Spain',
            flag: '🇪🇸',
            description: 'Hop between tapas bars in La Latina. Order jamón, wine, and learn the art of Spanish socializing.',
            vocab: ['¡Hola!', 'Una caña', 'Qué rico', '¿Cuánto es?'],
            character: {
                name: 'Carmen',
                emoji: '💃',
                role: 'Tapas Connoisseur',
                bio: 'Carmen knows every tapas bar in Madrid. She\'ll teach you to eat, drink, and chat like a true madrileño.'
            },
            world: {
                type: 'tapas_bar',
                ambiance: 'evening_warm',
                style: 'spanish_rustic'
            },
            falseFriends: [
                { word: 'embarazada', meaning: 'pregnant (not embarrassed!)', trap: 'Embarrassed = avergonzado' },
                { word: 'constipado', meaning: 'having a cold (not constipated!)', trap: 'Very different!' }
            ]
        }
    ],
    mandarin: [
        {
            id: 'teahouse',
            name: '茶馆 Tea House',
            emoji: '🍵',
            country: 'China',
            flag: '🇨🇳',
            description: 'Experience a traditional Chengdu tea ceremony. Learn drinking toasts and polite conversation.',
            vocab: ['你好', '谢谢', '干杯', '好喝'],
            character: {
                name: 'Wei Lao Shi',
                emoji: '🧓',
                role: 'Tea Master',
                bio: 'Master Wei has practiced the art of tea for 50 years. He teaches language through the patience of the tea ceremony.'
            },
            world: {
                type: 'teahouse',
                ambiance: 'misty_morning',
                style: 'chinese_traditional'
            },
            falseFriends: [
                { word: '手纸', meaning: 'toilet paper (not hand paper!)', trap: 'Literal translation trap' },
                { word: '小心', meaning: 'be careful (not small heart!)', trap: 'Common phrase' }
            ]
        },
        {
            id: 'hotpot',
            name: '火锅 Hot Pot',
            emoji: '🍲',
            country: 'China',
            flag: '🇨🇳',
            description: 'Gather around the bubbling pot. Order ingredients, adjust spice levels, and toast with baijiu.',
            vocab: ['辣', '不辣', '再来一瓶', '太好吃了'],
            character: {
                name: 'Mei Mei',
                emoji: '👧',
                role: 'Hot Pot Enthusiast',
                bio: 'Mei Mei is a food blogger who knows all the best hot pot spots and loves helping foreigners navigate the menu.'
            },
            world: {
                type: 'restaurant',
                ambiance: 'evening_busy',
                style: 'modern_chinese'
            },
            falseFriends: [
                { word: '闷', meaning: 'stuffy/bored (not moan!)', trap: 'Tone matters!' },
                { word: '买/卖', meaning: 'buy/sell (tones!)', trap: 'Third vs fourth tone' }
            ]
        }
    ],
    japanese: [
        {
            id: 'izakaya',
            name: '居酒屋 Izakaya',
            emoji: '🏮',
            country: 'Japan',
            flag: '🇯🇵',
            description: 'Duck into a hidden Tokyo izakaya. Order sake, small dishes, and learn Japanese drinking etiquette.',
            vocab: ['いらっしゃいませ', '乾杯', 'おいしい', 'お会計'],
            character: {
                name: 'Tanaka-san',
                emoji: '👨‍🍳',
                role: 'Izakaya Master',
                bio: 'Tanaka-san runs this family izakaya. He appreciates when foreigners try Japanese and rewards effort with secret menu items.'
            },
            world: {
                type: 'izakaya',
                ambiance: 'night_cozy',
                style: 'showa_retro'
            },
            falseFriends: [
                { word: 'スマート', meaning: 'slim/stylish (not smart!)', trap: 'Smart = 賢い (kashikoi)' },
                { word: 'マンション', meaning: 'apartment (not mansion!)', trap: 'Mansion = 大邸宅' }
            ]
        }
    ],
    polish: [
        {
            id: 'milk_bar',
            name: 'Bar Mleczny',
            emoji: '🥟',
            country: 'Poland',
            flag: '🇵🇱',
            description: 'Experience communist-era nostalgia at a milk bar. Order pierogi and barszcz like a local.',
            vocab: ['Dzień dobry', 'Proszę', 'Pyszne', 'Ile to kosztuje?'],
            character: {
                name: 'Pani Zofia',
                emoji: '👵',
                role: 'Milk Bar Matriarch',
                bio: 'Pani Zofia has served workers at this bar mleczny since 1972. She\'s tough but warms up when you try Polish.'
            },
            world: {
                type: 'cafeteria',
                ambiance: 'afternoon_nostalgic',
                style: 'prl_vintage'
            },
            falseFriends: [
                { word: 'aktualnie', meaning: 'currently (not actually!)', trap: 'Actually = właściwie' },
                { word: 'sympatyczny', meaning: 'nice/likeable (not sympathetic!)', trap: 'Sympathetic = współczujący' }
            ]
        }
    ]
};

// ==================== STATE ====================
let state = {
    selectedLanguage: null,
    selectedScenario: null,
    lessonPlan: null,
    glossary: [],
    currentDifficulty: 1,
    conversationHistory: []
};

// ==================== DOM ELEMENTS ====================
const elements = {
    languageGrid: document.getElementById('languageGrid'),
    scenarioGrid: document.getElementById('scenarioGrid'),
    characterPreview: document.getElementById('characterPreview'),
    startBtn: document.getElementById('startBtn'),
    stepScenario: document.getElementById('step-scenario'),
    stepCharacter: document.getElementById('step-character'),
    stepStart: document.getElementById('step-start')
};

// ==================== EVENT HANDLERS ====================
function initLanguageSelection() {
    const cards = elements.languageGrid.querySelectorAll('.language-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous selection
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            state.selectedLanguage = card.dataset.lang;
            showScenarios(state.selectedLanguage);
        });
    });
}

function showScenarios(language) {
    const scenarios = SCENARIOS[language] || [];
    
    elements.scenarioGrid.innerHTML = scenarios.map(s => `
        <div class="scenario-card" data-scenario="${s.id}">
            <div class="scenario-preview">${s.emoji}</div>
            <div class="scenario-content">
                <div class="scenario-location">
                    <span class="scenario-flag">${s.flag}</span>
                    <span class="scenario-country">${s.country}</span>
                </div>
                <h3 class="scenario-name">${s.name}</h3>
                <p class="scenario-desc">${s.description}</p>
                <div class="scenario-vocab">
                    ${s.vocab.map(v => `<span class="vocab-tag">${v}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    const scenarioCards = elements.scenarioGrid.querySelectorAll('.scenario-card');
    scenarioCards.forEach(card => {
        card.addEventListener('click', () => {
            scenarioCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const scenarioId = card.dataset.scenario;
            state.selectedScenario = scenarios.find(s => s.id === scenarioId);
            showCharacter(state.selectedScenario);
        });
    });
    
    // Show section with animation
    elements.stepScenario.classList.remove('hidden');
    elements.stepScenario.classList.add('fade-in');
}

function showCharacter(scenario) {
    const char = scenario.character;
    
    elements.characterPreview.innerHTML = `
        <div class="character-avatar">${char.emoji}</div>
        <div class="character-info">
            <h3 class="character-name">${char.name}</h3>
            <p class="character-role">${char.role}</p>
            <p class="character-bio">${char.bio}</p>
        </div>
    `;
    
    elements.stepCharacter.classList.remove('hidden');
    elements.stepCharacter.classList.add('fade-in');
    
    elements.stepStart.classList.remove('hidden');
    elements.stepStart.classList.add('fade-in');
    
    elements.startBtn.disabled = false;
}

// ==================== LESSON GENERATION (Claude API) ====================
async function generateLessonPlan(language, scenario) {
    const prompt = `You are a language learning curriculum designer. Create a progressive lesson plan for someone learning ${language} in a ${scenario.name} setting.

The lesson should:
1. Start with basic greetings and essential phrases
2. Progress to ordering/requesting items
3. Include small talk and cultural nuances
4. End with complex conversations

Include these false friends to watch out for:
${scenario.falseFriends.map(f => `- "${f.word}": ${f.meaning} (Trap: ${f.trap})`).join('\n')}

Return a JSON object with this structure:
{
    "levels": [
        {
            "level": 1,
            "name": "First Contact",
            "objectives": ["Say hello", "Basic politeness"],
            "phrases": [
                {"native": "...", "translation": "...", "pronunciation": "..."}
            ],
            "dialoguePrompts": ["..."],
            "grammarNotes": ["..."]
        }
    ],
    "falseFriends": [...],
    "culturalTips": ["..."]
}`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CONFIG.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 2000,
                messages: [{ role: 'user', content: prompt }]
            })
        });
        
        const data = await response.json();
        const content = data.content[0].text;
        
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        console.error('Error generating lesson plan:', error);
    }
    
    // Return default lesson plan
    return getDefaultLessonPlan(language, scenario);
}

function getDefaultLessonPlan(language, scenario) {
    return {
        levels: [
            {
                level: 1,
                name: 'First Contact',
                objectives: ['Basic greeting', 'Introduce yourself'],
                phrases: scenario.vocab.slice(0, 2).map(v => ({
                    native: v,
                    translation: 'Common phrase',
                    pronunciation: v
                })),
                dialoguePrompts: [`Greet ${scenario.character.name}`],
                grammarNotes: ['Focus on pronunciation']
            }
        ],
        falseFriends: scenario.falseFriends,
        culturalTips: [`In ${scenario.country}, always be polite!`]
    };
}

// ==================== START GAME ====================
async function startGame() {
    elements.startBtn.textContent = 'Loading...';
    elements.startBtn.disabled = true;
    
    // Generate lesson plan
    state.lessonPlan = await generateLessonPlan(state.selectedLanguage, state.selectedScenario);
    
    // Store state for the game world
    sessionStorage.setItem('linguaverse_state', JSON.stringify({
        language: state.selectedLanguage,
        scenario: state.selectedScenario,
        lessonPlan: state.lessonPlan
    }));
    
    // Navigate to the game world
    window.location.href = 'lingua-world.html';
}

// ==================== INITIALIZATION ====================
function init() {
    initLanguageSelection();
    elements.startBtn.addEventListener('click', startGame);
}

document.addEventListener('DOMContentLoaded', init);

export { CONFIG, SCENARIOS, state };

