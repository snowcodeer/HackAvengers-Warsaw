const languages = [
    { code: 'PL', name: 'Polish', flag: '🇵🇱' },
    { code: 'FR', name: 'French', flag: '🇫🇷' },
    { code: 'DE', name: 'German', flag: '🇩🇪' },
    { code: 'ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'CN', name: 'Mandarin', flag: '🇨🇳' },
    { code: 'JP', name: 'Japanese', flag: '🇯🇵' }
];

const scenarios = [
    { id: 'village', name: 'Village Square', icon: '🏘️', lang: 'PL' },
    { id: 'boulangerie', name: 'La Boulangerie', icon: '🥐', lang: 'FR' },
    { id: 'cafe', name: 'Café de Flore', icon: '☕', lang: 'FR' },
    { id: 'pub', name: 'The Pub', icon: '🍺', lang: 'DE' }, // Using DE for Pub as per prompt example (Berghain is DE)
    { id: 'berghain', name: 'Berghain', icon: '🎧', lang: 'DE' },
    { id: 'tapas', name: 'Tapas Bar', icon: '🥘', lang: 'ES' },
    { id: 'teahouse', name: 'Tea House', icon: '🍵', lang: 'CN' },
    { id: 'izakaya', name: 'Izakaya', icon: '🍶', lang: 'JP' }
];

const guides = [
    { id: 'child', name: 'Kasia (Child)', icon: '👧', lang: 'PL' },
    { id: 'marie', name: 'Marie (Baker)', icon: '👩‍🍳', lang: 'FR' },
    { id: 'jeanpaul', name: 'Jean-Paul (Philosopher)', icon: '🤔', lang: 'FR' },
    { id: 'klaus', name: 'Klaus (Bouncer)', icon: '🕶️', lang: 'DE' },
    { id: 'carmen', name: 'Carmen (Chef)', icon: '💃', lang: 'ES' },
    { id: 'liwei', name: 'Li Wei (Scholar)', icon: '📜', lang: 'CN' },
    { id: 'kenji', name: 'Kenji (Chef)', icon: '👨‍🍳', lang: 'JP' }
];

let selectedLanguage = null;
let selectedScenario = null;
let selectedGuide = null;
let lessonPlan = null;

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSelection();
    initSnowfall();
});

function initLanguageSelection() {
    const grid = document.getElementById('languageGrid');
    languages.forEach(lang => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-icon">${lang.flag}</div>
            <div class="card-label">${lang.name}</div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('#languageGrid .card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedLanguage = lang;
            document.getElementById('btnStep1').disabled = false;
        });
        grid.appendChild(card);
    });

    document.getElementById('btnStep1').addEventListener('click', () => {
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
        generateLesson();
    });
}

async function generateLesson() {
    const loading = document.getElementById('lessonLoading');
    const content = document.getElementById('lessonContent');
    const btn = document.getElementById('btnStep2');

    try {
        const response = await fetch('http://localhost:8001/api/lesson/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: selectedLanguage.name,
                difficulty: 'Beginner'
            })
        });

        if (!response.ok) throw new Error('Failed to generate lesson');

        lessonPlan = await response.json();

        // Display Lesson
        loading.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = `
            <h3>${lessonPlan.title}</h3>
            <p><strong>Objective:</strong> ${lessonPlan.objective}</p>
            <p><strong>Cultural Note:</strong> ${lessonPlan.cultural_note}</p>
            <h4>Vocabulary:</h4>
            <ul>
                ${lessonPlan.vocabulary.map(v => `<li>${v.word} (${v.pronunciation}) - ${v.translation}</li>`).join('')}
            </ul>
        `;
        btn.style.display = 'inline-block';

    } catch (error) {
        console.error(error);
        loading.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = `<p>Error generating lesson. Please try again.</p>`;
        // Allow continue anyway for demo
        btn.style.display = 'inline-block';
    }

    btn.addEventListener('click', () => {
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step3').classList.add('active');
        initScenarioSelection();
    });
}

function initScenarioSelection() {
    const grid = document.getElementById('scenarioGrid');
    grid.innerHTML = '';

    // Filter scenarios by language
    const relevantScenarios = scenarios.filter(s => s.lang === selectedLanguage.code);

    // If no specific scenarios, show generic or all
    const displayScenarios = relevantScenarios.length > 0 ? relevantScenarios : scenarios;

    displayScenarios.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-icon">${s.icon}</div>
            <div class="card-label">${s.name}</div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('#scenarioGrid .card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedScenario = s;
            document.getElementById('btnStep3').disabled = false;
        });
        grid.appendChild(card);
    });

    document.getElementById('btnStep3').addEventListener('click', () => {
        document.getElementById('step3').classList.remove('active');
        document.getElementById('step4').classList.add('active');
        initGuideSelection();
    });
}

function initGuideSelection() {
    const grid = document.getElementById('guideGrid');
    grid.innerHTML = '';

    const relevantGuides = guides.filter(g => g.lang === selectedLanguage.code);
    const displayGuides = relevantGuides.length > 0 ? relevantGuides : guides;

    displayGuides.forEach(g => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-icon">${g.icon}</div>
            <div class="card-label">${g.name}</div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('#guideGrid .card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedGuide = g;
            document.getElementById('btnStep4').disabled = false;
        });
        grid.appendChild(card);
    });

    document.getElementById('btnStep4').addEventListener('click', () => {
        // Save everything
        const gameData = {
            language: selectedLanguage,
            scenario: selectedScenario,
            guide: selectedGuide,
            lesson: lessonPlan
        };
        localStorage.setItem('linguaVerseData', JSON.stringify(gameData));

        // Go to character customization
        window.location.href = 'character.html';
    });
}

function initSnowfall() {
    const snowContainer = document.getElementById('snowContainer');
    if (!snowContainer) return;

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 5 + 3;
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';
        snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
        snowContainer.appendChild(snowflake);
        setTimeout(() => snowflake.remove(), 10000);
    }
    setInterval(createSnowflake, 200);
}
