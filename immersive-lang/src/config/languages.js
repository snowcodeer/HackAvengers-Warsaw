// Language configuration with cultural worlds and characters

export const LANGUAGE_CONFIG = {
  french: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    location: 'Paris Boulangerie',
    character: {
      name: 'Amélie',
      role: 'Boulangère',
      emoji: '👩‍🍳',
      personality: 'Warm, patient, passionate about pastries and French culture',
      voice: 'eleven_multilingual_v2', // ElevenLabs voice
    },
    visualStyle: {
      theme: 'parisian-morning',
      primaryColor: '#1e3a5f',
      accentColor: '#d4af37',
      ambience: 'cozy bakery with morning light streaming through windows',
    },
    environment: {
      type: 'bakery',
      props: ['croissants', 'baguettes', 'coffee machine', 'display cases', 'vintage tiles'],
      sounds: ['coffee_brewing', 'french_accordion', 'morning_birds'],
      lighting: 'warm golden morning',
    },
    startingPhrases: [
      { phrase: 'Bonjour!', translation: 'Hello!', pronunciation: 'bon-ZHOOR' },
      { phrase: 'Un croissant, s\'il vous plaît', translation: 'A croissant, please', pronunciation: 'un krwa-SAN, seel voo PLAY' },
      { phrase: 'Merci beaucoup', translation: 'Thank you very much', pronunciation: 'mer-SEE boh-KOO' },
    ],
    falseFriends: [
      { word: 'actuellement', looksLike: 'actually', actualMeaning: 'currently', warning: 'Use "en fait" for "actually"' },
      { word: 'bras', looksLike: 'bra', actualMeaning: 'arm', warning: 'Underwear is "soutien-gorge"' },
      { word: 'coin', looksLike: 'coin (money)', actualMeaning: 'corner', warning: 'Money coin is "pièce"' },
    ],
    difficultyScaling: {
      level1: { english: 80, target: 20, grammar: 'basic greetings' },
      level2: { english: 60, target: 40, grammar: 'ordering food' },
      level3: { english: 40, target: 60, grammar: 'polite conversation' },
      level4: { english: 20, target: 80, grammar: 'past tense' },
      level5: { english: 0, target: 100, grammar: 'natural conversation' },
    }
  },
  
  german: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    location: 'Berlin Berghain',
    character: {
      name: 'Wolfgang',
      role: 'DJ & Club Philosopher',
      emoji: '🎧',
      personality: 'Cool, mysterious, deeply philosophical about techno and life',
      voice: 'eleven_multilingual_v2',
    },
    visualStyle: {
      theme: 'industrial-night',
      primaryColor: '#1a1a1a',
      accentColor: '#e74c3c',
      ambience: 'dark industrial club with strobe lights and concrete walls',
    },
    environment: {
      type: 'nightclub',
      props: ['DJ booth', 'speakers', 'concrete pillars', 'strobe lights', 'bar'],
      sounds: ['techno_beat', 'crowd_ambient', 'bass_rumble'],
      lighting: 'dark with red strobes',
    },
    startingPhrases: [
      { phrase: 'Guten Abend', translation: 'Good evening', pronunciation: 'GOO-ten AH-bent' },
      { phrase: 'Ein Bier, bitte', translation: 'A beer, please', pronunciation: 'ine BEER, BIT-uh' },
      { phrase: 'Die Musik ist gut', translation: 'The music is good', pronunciation: 'dee moo-ZEEK ist goot' },
    ],
    falseFriends: [
      { word: 'Gift', looksLike: 'gift', actualMeaning: 'poison', warning: 'Use "Geschenk" for a present' },
      { word: 'bekommen', looksLike: 'become', actualMeaning: 'to receive/get', warning: 'Use "werden" for become' },
      { word: 'bald', looksLike: 'bald (hairless)', actualMeaning: 'soon', warning: 'Hairless is "kahl"' },
    ],
    difficultyScaling: {
      level1: { english: 80, target: 20, grammar: 'basic greetings' },
      level2: { english: 60, target: 40, grammar: 'ordering drinks' },
      level3: { english: 40, target: 60, grammar: 'gendered articles' },
      level4: { english: 20, target: 80, grammar: 'compound words' },
      level5: { english: 0, target: 100, grammar: 'philosophical discussion' },
    }
  },
  
  english: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    location: 'London Pub',
    character: {
      name: 'Victoria',
      role: 'Pub Landlady',
      emoji: '🍺',
      personality: 'Witty, storytelling, loves British humor and traditions',
      voice: 'eleven_multilingual_v2',
    },
    visualStyle: {
      theme: 'british-cozy',
      primaryColor: '#2c1810',
      accentColor: '#c77c48',
      ambience: 'warm traditional pub with wooden beams and fireplace',
    },
    environment: {
      type: 'pub',
      props: ['bar counter', 'beer taps', 'fireplace', 'dart board', 'vintage signs'],
      sounds: ['pub_chatter', 'fireplace_crackle', 'glasses_clinking'],
      lighting: 'warm firelight',
    },
    startingPhrases: [
      { phrase: 'Cheers, mate!', translation: 'Thanks/Hello, friend!', pronunciation: 'cheerz, mayt' },
      { phrase: 'A pint of bitter, please', translation: 'A glass of ale, please', pronunciation: 'uh pint of BIT-er, pleez' },
      { phrase: 'Lovely weather, innit?', translation: 'Nice weather, isn\'t it?', pronunciation: 'LUV-lee WEH-thur, IN-it' },
    ],
    falseFriends: [
      { word: 'pants', looksLike: 'pants (trousers)', actualMeaning: 'underwear (UK)', warning: 'Use "trousers" for pants' },
      { word: 'chips', looksLike: 'chips (crisps)', actualMeaning: 'fries (UK)', warning: 'Thin crisps are "crisps"' },
      { word: 'rubber', looksLike: 'rubber (material)', actualMeaning: 'eraser (UK)', warning: 'Context is important!' },
    ],
    difficultyScaling: {
      level1: { english: 100, target: 0, grammar: 'british slang intro' },
      level2: { english: 90, target: 10, grammar: 'pub vocabulary' },
      level3: { english: 80, target: 20, grammar: 'british idioms' },
      level4: { english: 70, target: 30, grammar: 'cockney rhyming' },
      level5: { english: 60, target: 40, grammar: 'advanced british culture' },
    }
  },
  
  mandarin: {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '中文',
    location: 'Beijing Tea House',
    character: {
      name: 'Mei Lin',
      role: 'Tea Master',
      emoji: '🍵',
      personality: 'Serene, wise, steeped in traditional Chinese philosophy',
      voice: 'eleven_multilingual_v2',
    },
    visualStyle: {
      theme: 'oriental-serenity',
      primaryColor: '#8b0000',
      accentColor: '#ffd700',
      ambience: 'traditional tea house with paper lanterns and bamboo',
    },
    environment: {
      type: 'teahouse',
      props: ['tea sets', 'bamboo plants', 'calligraphy scrolls', 'paper lanterns', 'low tables'],
      sounds: ['guzheng_music', 'water_pouring', 'wind_chimes'],
      lighting: 'soft lantern glow',
    },
    startingPhrases: [
      { phrase: '你好', translation: 'Hello', pronunciation: 'nǐ hǎo' },
      { phrase: '谢谢', translation: 'Thank you', pronunciation: 'xiè xiè' },
      { phrase: '喝茶', translation: 'Drink tea', pronunciation: 'hē chá' },
    ],
    falseFriends: [
      { word: '手纸', looksLike: 'hand paper', actualMeaning: 'toilet paper', warning: 'Not for writing!' },
      { word: '小心', looksLike: 'small heart', actualMeaning: 'be careful', warning: 'Warning sign, not affection' },
      { word: '马马虎虎', looksLike: 'horse horse tiger tiger', actualMeaning: 'so-so/mediocre', warning: 'Common idiom!' },
    ],
    difficultyScaling: {
      level1: { english: 90, target: 10, grammar: 'tones introduction' },
      level2: { english: 75, target: 25, grammar: 'basic characters' },
      level3: { english: 55, target: 45, grammar: 'measure words' },
      level4: { english: 35, target: 65, grammar: 'sentence structure' },
      level5: { english: 15, target: 85, grammar: 'cultural expressions' },
    }
  },
  
  spanish: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    location: 'Madrid Tapas Bar',
    character: {
      name: 'Carmen',
      role: 'Flamenco Dancer & Chef',
      emoji: '💃',
      personality: 'Passionate, expressive, loves sharing Spanish culture through food and dance',
      voice: 'eleven_multilingual_v2',
    },
    visualStyle: {
      theme: 'spanish-fiesta',
      primaryColor: '#c2410c',
      accentColor: '#fbbf24',
      ambience: 'vibrant tapas bar with flamenco posters and mosaic tiles',
    },
    environment: {
      type: 'tapas_bar',
      props: ['tapas counter', 'wine barrels', 'flamenco posters', 'mosaic tiles', 'guitar'],
      sounds: ['flamenco_guitar', 'spanish_chatter', 'plates_clinking'],
      lighting: 'warm evening amber',
    },
    startingPhrases: [
      { phrase: '¡Hola!', translation: 'Hello!', pronunciation: 'OH-lah' },
      { phrase: 'Una cerveza, por favor', translation: 'A beer, please', pronunciation: 'OO-nah ser-VEH-sah, por fah-VOR' },
      { phrase: '¡Qué rico!', translation: 'How delicious!', pronunciation: 'keh REE-koh' },
    ],
    falseFriends: [
      { word: 'embarazada', looksLike: 'embarrassed', actualMeaning: 'pregnant', warning: 'Very different! Use "avergonzado"' },
      { word: 'constipado', looksLike: 'constipated', actualMeaning: 'have a cold', warning: 'Use "estreñido" for constipated' },
      { word: 'éxito', looksLike: 'exit', actualMeaning: 'success', warning: 'Exit is "salida"' },
    ],
    difficultyScaling: {
      level1: { english: 80, target: 20, grammar: 'basic greetings' },
      level2: { english: 60, target: 40, grammar: 'ordering tapas' },
      level3: { english: 40, target: 60, grammar: 'ser vs estar' },
      level4: { english: 20, target: 80, grammar: 'subjunctive mood' },
      level5: { english: 0, target: 100, grammar: 'cultural expressions' },
    }
  },
  
  japanese: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    location: 'Kyoto Tea Garden',
    character: {
      name: 'Yuki',
      role: 'Tea Ceremony Host',
      emoji: '🏯',
      personality: 'Graceful, meticulous, deeply respectful of traditions',
      voice: 'eleven_multilingual_v2',
    },
    visualStyle: {
      theme: 'zen-garden',
      primaryColor: '#0f172a',
      accentColor: '#f472b6',
      ambience: 'serene zen garden with cherry blossoms and koi pond',
    },
    environment: {
      type: 'tea_garden',
      props: ['stone lanterns', 'bamboo fountain', 'cherry blossom tree', 'tatami mats', 'tea ceremony set'],
      sounds: ['bamboo_fountain', 'birds_singing', 'wind_in_trees'],
      lighting: 'soft cherry blossom pink',
    },
    startingPhrases: [
      { phrase: 'こんにちは', translation: 'Hello', pronunciation: 'kon-ni-chi-wa' },
      { phrase: 'お茶をどうぞ', translation: 'Please have some tea', pronunciation: 'o-cha wo dou-zo' },
      { phrase: 'ありがとうございます', translation: 'Thank you very much', pronunciation: 'a-ri-ga-tou go-za-i-mas' },
    ],
    falseFriends: [
      { word: 'スマート', looksLike: 'smart (intelligent)', actualMeaning: 'slim/stylish', warning: 'Use "頭がいい" for intelligent' },
      { word: 'マンション', looksLike: 'mansion', actualMeaning: 'apartment', warning: 'Not a large house!' },
      { word: 'ナイーブ', looksLike: 'naive', actualMeaning: 'sensitive/delicate', warning: 'Different nuance in Japanese' },
    ],
    difficultyScaling: {
      level1: { english: 90, target: 10, grammar: 'hiragana basics' },
      level2: { english: 75, target: 25, grammar: 'polite forms' },
      level3: { english: 55, target: 45, grammar: 'particles' },
      level4: { english: 35, target: 65, grammar: 'keigo (honorifics)' },
      level5: { english: 15, target: 85, grammar: 'natural conversation' },
    }
  },
  
  italian: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    location: 'Rome Café',
    character: {
      name: 'Marco',
      role: 'Barista & Art Lover',
      emoji: '☕',
      personality: 'Animated, artistic, passionate about coffee and Roman history',
      voice: 'eleven_multilingual_v2',
    },
    visualStyle: {
      theme: 'roman-afternoon',
      primaryColor: '#1e3a24',
      accentColor: '#e74c3c',
      ambience: 'charming Roman café with view of ancient ruins',
    },
    environment: {
      type: 'cafe',
      props: ['espresso machine', 'marble counter', 'outdoor tables', 'roman columns', 'gelato display'],
      sounds: ['espresso_machine', 'italian_chatter', 'vespa_passing'],
      lighting: 'golden afternoon sun',
    },
    startingPhrases: [
      { phrase: 'Buongiorno!', translation: 'Good day!', pronunciation: 'bwon-JORN-oh' },
      { phrase: 'Un caffè, per favore', translation: 'A coffee, please', pronunciation: 'oon kaf-FEH, per fa-VOR-eh' },
      { phrase: 'Che bello!', translation: 'How beautiful!', pronunciation: 'keh BEL-loh' },
    ],
    falseFriends: [
      { word: 'camera', looksLike: 'camera', actualMeaning: 'room', warning: 'Camera (device) is "macchina fotografica"' },
      { word: 'pepperoni', looksLike: 'pepperoni', actualMeaning: 'peppers', warning: 'Salami is "salame piccante"' },
      { word: 'caldo', looksLike: 'cold', actualMeaning: 'hot', warning: 'Cold is "freddo"!' },
    ],
    difficultyScaling: {
      level1: { english: 80, target: 20, grammar: 'basic greetings' },
      level2: { english: 60, target: 40, grammar: 'ordering coffee' },
      level3: { english: 40, target: 60, grammar: 'gendered nouns' },
      level4: { english: 20, target: 80, grammar: 'passato prossimo' },
      level5: { english: 0, target: 100, grammar: 'congiuntivo' },
    }
  },
  
  polish: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    location: 'Warsaw Old Town',
    character: {
      name: 'Kasia',
      role: 'History Guide',
      emoji: '🥟',
      personality: 'Warm, proud of Polish heritage, loves sharing pierogi recipes',
      voice: 'eleven_multilingual_v2',
    },
    visualStyle: {
      theme: 'old-town-charm',
      primaryColor: '#7f1d1d',
      accentColor: '#faf9f6',
      ambience: 'historic old town square with colorful buildings and market stalls',
    },
    environment: {
      type: 'old_town',
      props: ['market stalls', 'colorful buildings', 'cobblestone streets', 'pierogi stand', 'fountain'],
      sounds: ['market_sounds', 'polish_accordion', 'fountain_water'],
      lighting: 'warm afternoon glow',
    },
    startingPhrases: [
      { phrase: 'Cześć!', translation: 'Hi!', pronunciation: 'cheshch' },
      { phrase: 'Poproszę pierogi', translation: 'I\'d like pierogi please', pronunciation: 'po-PRO-sheh pyeh-RO-gee' },
      { phrase: 'Dziękuję', translation: 'Thank you', pronunciation: 'jen-KOO-yeh' },
    ],
    falseFriends: [
      { word: 'aktualnie', looksLike: 'actually', actualMeaning: 'currently', warning: 'Use "właściwie" for actually' },
      { word: 'sympatyczny', looksLike: 'sympathetic', actualMeaning: 'nice/likeable', warning: 'Sympathetic is "współczujący"' },
      { word: 'ewentualnie', looksLike: 'eventually', actualMeaning: 'possibly/alternatively', warning: 'Eventually is "w końcu"' },
    ],
    difficultyScaling: {
      level1: { english: 80, target: 20, grammar: 'basic greetings' },
      level2: { english: 60, target: 40, grammar: 'ordering food' },
      level3: { english: 40, target: 60, grammar: 'noun cases' },
      level4: { english: 20, target: 80, grammar: 'verb conjugation' },
      level5: { english: 0, target: 100, grammar: 'complex sentences' },
    }
  }
};

export const getLanguageConfig = (code) => LANGUAGE_CONFIG[code] || null;

