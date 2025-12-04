// ═══════════════════════════════════════════════════════════════════════════════
// LINGUAWORLDS - Extended Language Configurations
// ═══════════════════════════════════════════════════════════════════════════════

export const EXTENDED_LANGUAGES = {
  // ═══════════════════════════════════════════════════════════════════════════════
  // 🇬🇧 ENGLISH - London Pub
  // ═══════════════════════════════════════════════════════════════════════════════
  english: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    
    scene: {
      id: 'london_pub',
      name: 'London Pub',
      subtitle: 'Master British English over a pint',
      description: 'Step into "The Queen\'s Arms" - a centuries-old pub with dark wood paneling, brass fixtures, and a roaring fireplace. Regulars nurse their ales while debating football.',
      
      environment: {
        location: 'Soho, London',
        timeOfDay: 'Evening (7 PM)',
        weather: 'Rainy London evening',
        season: 'Autumn',
        ambience: 'Warm refuge from the rain, convivial chatter',
      },
      
      visuals: {
        primaryColor: '#2c1810',
        secondaryColor: '#c77c48',
        accentColor: '#d4af37',
        backgroundColor: '#1a1410',
        theme: 'british-cozy',
        lighting: 'Warm firelight, brass lamp glow',
        atmosphere: 'Cozy, traditional, welcoming',
      },
    },
    
    character: {
      name: 'Victoria',
      fullName: 'Victoria Pemberton',
      role: 'Pub Landlady',
      age: 52,
      emoji: '🍺',
      
      personality: {
        traits: ['Witty', 'Motherly', 'Storyteller', 'Sharp-tongued', 'Generous'],
        background: 'Third-generation publican who\'s seen everything. Can settle any argument, make any cocktail, and tell stories that keep patrons coming back for decades.',
        quirks: ['Calls everyone "love" or "darling"', 'Has a story for every occasion', 'Knows everyone\'s regular order'],
        speakingStyle: 'Warm with dry wit, colloquial British expressions',
      },
      
      appearance: {
        skinColor: 0xf5c09a,
        hairColor: 0x8b4513,
        hairStyle: 'short_curly',
        outfitColor: 0x2c1810,
        outfitSecondary: 0xc77c48,
        outfitStyle: 'pub_landlady',
        accessories: ['pearl_necklace', 'reading_glasses'],
      },
      
      voice: {
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
        model: 'eleven_multilingual_v2',
        stability: 0.65,
        similarityBoost: 0.8,
      },
    },
    
    vocabulary: {
      basic: [
        { word: 'Cheers', translation: 'Thanks/Toast', pronunciation: 'cheerz', context: 'Multi-purpose British word' },
        { word: 'Mate', translation: 'Friend', pronunciation: 'mayt', context: 'Casual address' },
        { word: 'Lovely', translation: 'Nice/Great', pronunciation: 'LUV-lee', context: 'Universal British positive' },
        { word: 'Brilliant', translation: 'Excellent', pronunciation: 'BRIL-yant', context: 'Enthusiastic approval' },
      ],
      intermediate: [
        { word: 'A pint', translation: 'A beer', pronunciation: 'uh pint', context: 'Standard beer order' },
        { word: 'Knackered', translation: 'Exhausted', pronunciation: 'NAK-erd', context: 'Extremely tired' },
        { word: 'Cheeky', translation: 'Playfully bold', pronunciation: 'CHEE-kee', context: 'Mischievous in a fun way' },
        { word: 'Innit', translation: 'Isn\'t it', pronunciation: 'IN-it', context: 'Tag question' },
      ],
    },
    
    falseFriends: [
      { word: 'pants', looksLike: 'pants (trousers)', actualMeaning: 'underwear (UK)', warning: 'Use "trousers" for pants' },
      { word: 'chips', looksLike: 'chips (crisps)', actualMeaning: 'fries (UK)', warning: 'Thin crisps are "crisps"' },
      { word: 'rubber', looksLike: 'rubber (material)', actualMeaning: 'eraser (UK)', warning: 'Context is important!' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🇨🇳 MANDARIN CHINESE - Beijing Tea House
  // ═══════════════════════════════════════════════════════════════════════════════
  mandarin: {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    
    scene: {
      id: 'beijing_teahouse',
      name: 'Beijing Tea House',
      subtitle: 'Discover Chinese through tea ceremony',
      description: 'Enter a traditional Beijing tea house near the Forbidden City. Red lanterns hang from dark wooden beams. The gentle sound of a guzheng fills the air as steam rises from porcelain cups.',
      
      environment: {
        location: 'Qianmen, Beijing',
        timeOfDay: 'Afternoon (3 PM)',
        weather: 'Clear winter day',
        season: 'Winter',
        ambience: 'Serene, contemplative, timeless',
      },
      
      visuals: {
        primaryColor: '#8b0000',
        secondaryColor: '#ffd700',
        accentColor: '#1a1a1a',
        backgroundColor: '#f5f0e6',
        theme: 'oriental-serenity',
        lighting: 'Soft lantern glow, natural light through paper screens',
        atmosphere: 'Peaceful, traditional, wise',
      },
    },
    
    character: {
      name: 'Mei Lin',
      fullName: '美琳 (Měi Lín)',
      role: 'Tea Master',
      age: 45,
      emoji: '🍵',
      
      personality: {
        traits: ['Serene', 'Wise', 'Patient', 'Philosophical', 'Graceful'],
        background: 'Trained in Hangzhou\'s finest tea academy, Mei Lin has dedicated her life to the art of tea. She believes tea is not just a drink but a path to understanding life.',
        quirks: ['Moves with deliberate grace', 'Finds wisdom in everyday moments', 'Can identify any tea by smell'],
        speakingStyle: 'Calm, measured, uses proverbs and metaphors',
      },
      
      appearance: {
        skinColor: 0xf5c09a,
        hairColor: 0x1a1a1a,
        hairStyle: 'traditional_bun',
        outfitColor: 0x8b0000,
        outfitSecondary: 0xffd700,
        outfitStyle: 'qipao',
        accessories: ['jade_pendant', 'silk_fan'],
      },
      
      voice: {
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
        model: 'eleven_multilingual_v2',
        stability: 0.75,
        similarityBoost: 0.8,
      },
    },
    
    vocabulary: {
      basic: [
        { word: '你好', translation: 'Hello', pronunciation: 'nǐ hǎo', context: 'Standard greeting' },
        { word: '谢谢', translation: 'Thank you', pronunciation: 'xiè xiè', context: 'Expressing gratitude' },
        { word: '再见', translation: 'Goodbye', pronunciation: 'zài jiàn', context: 'Farewell' },
        { word: '是', translation: 'Yes', pronunciation: 'shì', context: 'Affirmation' },
        { word: '不', translation: 'No/Not', pronunciation: 'bù', context: 'Negation' },
      ],
      intermediate: [
        { word: '茶', translation: 'Tea', pronunciation: 'chá', context: 'The star of this scene' },
        { word: '请', translation: 'Please', pronunciation: 'qǐng', context: 'Polite request' },
        { word: '好喝', translation: 'Delicious (drink)', pronunciation: 'hǎo hē', context: 'Complimenting beverages' },
        { word: '美丽', translation: 'Beautiful', pronunciation: 'měi lì', context: 'Describing beauty' },
      ],
    },
    
    falseFriends: [
      { word: '手纸', looksLike: 'hand paper', actualMeaning: 'toilet paper', warning: 'Not for writing!' },
      { word: '小心', looksLike: 'small heart', actualMeaning: 'be careful', warning: 'Warning sign, not affection' },
      { word: '马马虎虎', looksLike: 'horse horse tiger tiger', actualMeaning: 'so-so/mediocre', warning: 'Common idiom!' },
    ],
    
    culturalNotes: [
      { title: 'Tea Ceremony', content: 'Chinese tea ceremony (gongfu cha) emphasizes technique, timing, and appreciation of the tea\'s qualities through multiple short infusions.' },
      { title: 'Gift Giving', content: 'Always present and receive items with both hands as a sign of respect.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🇪🇸 SPANISH - Madrid Tapas Bar
  // ═══════════════════════════════════════════════════════════════════════════════
  spanish: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    
    scene: {
      id: 'madrid_tapas',
      name: 'Madrid Tapas Bar',
      subtitle: 'Learn Spanish through food and flamenco',
      description: 'La Taberna de Carmen - a vibrant tapas bar in the heart of La Latina. Walls covered with flamenco posters and bullfighting memorabilia. The air is thick with the aroma of jamón ibérico and the sound of passionate conversation.',
      
      environment: {
        location: 'La Latina, Madrid',
        timeOfDay: 'Late Evening (10 PM)',
        weather: 'Warm summer night',
        season: 'Summer',
        ambience: 'Passionate, lively, celebratory',
      },
      
      visuals: {
        primaryColor: '#c2410c',
        secondaryColor: '#fbbf24',
        accentColor: '#1a1a1a',
        backgroundColor: '#fef3c7',
        theme: 'spanish-fiesta',
        lighting: 'Warm amber lights, candles on tables',
        atmosphere: 'Energetic, romantic, festive',
      },
    },
    
    character: {
      name: 'Carmen',
      fullName: 'Carmen Delgado',
      role: 'Flamenco Dancer & Chef',
      age: 38,
      emoji: '💃',
      
      personality: {
        traits: ['Passionate', 'Expressive', 'Dramatic', 'Generous', 'Proud'],
        background: 'Former professional flamenco dancer who opened her tapas bar after an injury. Now she channels her passion into cooking her grandmother\'s recipes and teaching the joy of Spanish culture.',
        quirks: ['Breaks into dance when excited', 'Speaks with her whole body', 'Insists on feeding everyone'],
        speakingStyle: 'Animated, emotional, uses many exclamations',
      },
      
      appearance: {
        skinColor: 0xc68642,
        hairColor: 0x1a1a1a,
        hairStyle: 'long_wavy',
        outfitColor: 0xc2410c,
        outfitSecondary: 0x1a1a1a,
        outfitStyle: 'flamenco_inspired',
        accessories: ['flower_hair', 'gold_hoops', 'dancing_shoes'],
      },
      
      voice: {
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
        model: 'eleven_multilingual_v2',
        stability: 0.55,
        similarityBoost: 0.85,
      },
    },
    
    vocabulary: {
      basic: [
        { word: '¡Hola!', translation: 'Hello!', pronunciation: 'OH-lah', context: 'Casual greeting' },
        { word: 'Gracias', translation: 'Thank you', pronunciation: 'GRAH-syahs', context: 'Expressing thanks' },
        { word: 'Por favor', translation: 'Please', pronunciation: 'por fah-VOR', context: 'Polite request' },
        { word: 'Sí', translation: 'Yes', pronunciation: 'see', context: 'Affirmation' },
        { word: 'No', translation: 'No', pronunciation: 'noh', context: 'Negation' },
      ],
      intermediate: [
        { word: 'Tapas', translation: 'Small dishes', pronunciation: 'TAH-pahs', context: 'Spanish appetizers' },
        { word: '¡Qué rico!', translation: 'How delicious!', pronunciation: 'keh REE-koh', context: 'Food appreciation' },
        { word: 'Una cerveza', translation: 'A beer', pronunciation: 'OO-nah ser-VEH-sah', context: 'Ordering beer' },
        { word: 'La cuenta', translation: 'The bill', pronunciation: 'lah KWEN-tah', context: 'Requesting payment' },
      ],
    },
    
    falseFriends: [
      { word: 'embarazada', looksLike: 'embarrassed', actualMeaning: 'pregnant', warning: 'Use "avergonzado" for embarrassed!' },
      { word: 'constipado', looksLike: 'constipated', actualMeaning: 'have a cold', warning: 'Use "estreñido" for constipated' },
      { word: 'éxito', looksLike: 'exit', actualMeaning: 'success', warning: 'Exit is "salida"' },
      { word: 'sensible', looksLike: 'sensible', actualMeaning: 'sensitive', warning: 'Sensible is "sensato"' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🇯🇵 JAPANESE - Kyoto Tea Garden
  // ═══════════════════════════════════════════════════════════════════════════════
  japanese: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    
    scene: {
      id: 'kyoto_garden',
      name: 'Kyoto Tea Garden',
      subtitle: 'Experience Japanese through tradition',
      description: 'A serene tea garden in Gion, Kyoto. Cherry blossoms drift past ancient stone lanterns. A bamboo water feature marks time with its gentle clacking. The scent of matcha and incense mingles in the air.',
      
      environment: {
        location: 'Gion, Kyoto',
        timeOfDay: 'Spring Morning (9 AM)',
        weather: 'Cherry blossom season',
        season: 'Spring',
        ambience: 'Meditative, ethereal, harmonious',
      },
      
      visuals: {
        primaryColor: '#0f172a',
        secondaryColor: '#f472b6',
        accentColor: '#4ade80',
        backgroundColor: '#fdf2f8',
        theme: 'zen-garden',
        lighting: 'Soft pink cherry blossom light',
        atmosphere: 'Peaceful, refined, spiritual',
      },
    },
    
    character: {
      name: 'Yuki',
      fullName: '雪 (Yuki)',
      role: 'Tea Ceremony Host',
      age: 35,
      emoji: '🏯',
      
      personality: {
        traits: ['Graceful', 'Meticulous', 'Humble', 'Insightful', 'Calm'],
        background: 'Born into a family of tea masters, Yuki has practiced the way of tea since childhood. She finds profound meaning in every gesture and believes that tea ceremony is a meditation on harmony.',
        quirks: ['Bows frequently', 'Notices every detail', 'Speaks softly but with purpose'],
        speakingStyle: 'Formal, gentle, thoughtful pauses',
      },
      
      appearance: {
        skinColor: 0xffecd2,
        hairColor: 0x1a1a1a,
        hairStyle: 'elegant_updo',
        outfitColor: 0xf472b6,
        outfitSecondary: 0xffffff,
        outfitStyle: 'kimono',
        accessories: ['kanzashi', 'obi', 'tabi'],
      },
      
      voice: {
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
        model: 'eleven_multilingual_v2',
        stability: 0.8,
        similarityBoost: 0.75,
      },
    },
    
    vocabulary: {
      basic: [
        { word: 'こんにちは', translation: 'Hello', pronunciation: 'kon-ni-chi-wa', context: 'Daytime greeting' },
        { word: 'ありがとう', translation: 'Thank you', pronunciation: 'a-ri-ga-tou', context: 'Casual thanks' },
        { word: 'すみません', translation: 'Excuse me/Sorry', pronunciation: 'su-mi-ma-sen', context: 'Getting attention or apologizing' },
        { word: 'はい', translation: 'Yes', pronunciation: 'hai', context: 'Affirmation' },
        { word: 'いいえ', translation: 'No', pronunciation: 'i-i-e', context: 'Negation' },
      ],
      intermediate: [
        { word: 'お茶', translation: 'Tea', pronunciation: 'o-cha', context: 'The honorable tea' },
        { word: 'おいしい', translation: 'Delicious', pronunciation: 'o-i-shi-i', context: 'Food/drink appreciation' },
        { word: '美しい', translation: 'Beautiful', pronunciation: 'u-tsu-ku-shi-i', context: 'Describing beauty' },
        { word: 'よろしくお願いします', translation: 'Please take care of me', pronunciation: 'yo-ro-shi-ku o-ne-gai-shi-mas', context: 'Polite request/introduction' },
      ],
    },
    
    falseFriends: [
      { word: 'スマート', looksLike: 'smart (intelligent)', actualMeaning: 'slim/stylish', warning: 'Use "頭がいい" for intelligent' },
      { word: 'マンション', looksLike: 'mansion', actualMeaning: 'apartment', warning: 'Not a large house!' },
      { word: 'ナイーブ', looksLike: 'naive', actualMeaning: 'sensitive/delicate', warning: 'Different nuance' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🇮🇹 ITALIAN - Rome Café
  // ═══════════════════════════════════════════════════════════════════════════════
  italian: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    
    scene: {
      id: 'rome_cafe',
      name: 'Rome Café',
      subtitle: 'Learn Italian through coffee and culture',
      description: 'Caffè Sant\'Eustachio - a legendary Roman café steps from the Pantheon. The marble counter gleams. The ancient espresso machine hisses. Outside, scooters zip past ruins two millennia old.',
      
      environment: {
        location: 'Centro Storico, Rome',
        timeOfDay: 'Afternoon (4 PM)',
        weather: 'Warm Mediterranean sun',
        season: 'Summer',
        ambience: 'Animated, artistic, eternal',
      },
      
      visuals: {
        primaryColor: '#1e3a24',
        secondaryColor: '#e74c3c',
        accentColor: '#d4af37',
        backgroundColor: '#faf9f6',
        theme: 'roman-afternoon',
        lighting: 'Golden afternoon light on travertine',
        atmosphere: 'Romantic, historic, vibrant',
      },
    },
    
    character: {
      name: 'Marco',
      fullName: 'Marco Rossi',
      role: 'Barista & Art History Enthusiast',
      age: 32,
      emoji: '☕',
      
      personality: {
        traits: ['Animated', 'Charming', 'Knowledgeable', 'Romantic', 'Proud'],
        background: 'Art history graduate who discovered his true passion behind the espresso machine. Believes making coffee is an art form equal to any Renaissance masterpiece.',
        quirks: ['Gestures wildly while talking', 'Compares everything to art', 'Refuses to make coffee "to go"'],
        speakingStyle: 'Expressive, poetic, uses many hand gestures',
      },
      
      appearance: {
        skinColor: 0xc68642,
        hairColor: 0x2c1810,
        hairStyle: 'styled_back',
        outfitColor: 0xffffff,
        outfitSecondary: 0x1a1a1a,
        outfitStyle: 'barista_apron',
        accessories: ['gold_watch', 'crucifix_necklace'],
      },
      
      voice: {
        voiceId: 'pNInz6obpgDQGcFmaJgB',
        model: 'eleven_multilingual_v2',
        stability: 0.55,
        similarityBoost: 0.85,
      },
    },
    
    vocabulary: {
      basic: [
        { word: 'Buongiorno', translation: 'Good day', pronunciation: 'bwon-JORN-oh', context: 'Morning/afternoon greeting' },
        { word: 'Grazie', translation: 'Thank you', pronunciation: 'GRAH-tsee-eh', context: 'Expressing thanks' },
        { word: 'Prego', translation: 'You\'re welcome/Please', pronunciation: 'PREH-go', context: 'Polite response' },
        { word: 'Sì', translation: 'Yes', pronunciation: 'see', context: 'Affirmation' },
        { word: 'No', translation: 'No', pronunciation: 'noh', context: 'Negation' },
      ],
      intermediate: [
        { word: 'Un caffè', translation: 'An espresso', pronunciation: 'oon kaf-FEH', context: 'Standard Italian coffee' },
        { word: 'Che bello!', translation: 'How beautiful!', pronunciation: 'keh BEL-loh', context: 'Expressing admiration' },
        { word: 'Per favore', translation: 'Please', pronunciation: 'per fah-VOR-eh', context: 'Polite request' },
        { word: 'Bellissimo', translation: 'Very beautiful', pronunciation: 'bel-LEE-see-moh', context: 'Strong appreciation' },
      ],
    },
    
    falseFriends: [
      { word: 'camera', looksLike: 'camera', actualMeaning: 'room', warning: 'Camera (device) is "macchina fotografica"' },
      { word: 'pepperoni', looksLike: 'pepperoni', actualMeaning: 'peppers', warning: 'Salami is "salame piccante"' },
      { word: 'caldo', looksLike: 'cold', actualMeaning: 'hot', warning: 'Cold is "freddo"!' },
      { word: 'bravo', looksLike: 'brave', actualMeaning: 'good/skilled', warning: 'Brave is "coraggioso"' },
    ],
  },
};

// Merge function
export const mergeLanguageConfigs = (primary, extended) => ({
  ...primary,
  ...extended,
});

