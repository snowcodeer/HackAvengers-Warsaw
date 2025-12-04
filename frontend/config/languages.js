// ═══════════════════════════════════════════════════════════════════════════════
// LINGUAVERSE - Ultra-Detailed Language & Scene Configuration
// "Duolingo on Steroids" - Full Immersive Language Learning Experience
// ═══════════════════════════════════════════════════════════════════════════════

export const LANGUAGE_CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // FRENCH - La Boulangerie Parisienne
  // ═══════════════════════════════════════════════════════════════════════════
  french: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    
    // ─────────────────────────────────────────────────────────────────────────
    // SCENE: Paris Boulangerie at Dawn
    // ─────────────────────────────────────────────────────────────────────────
    scene: {
      name: 'La Belle Époque Boulangerie',
      location: 'Montmartre, Paris',
      timeOfDay: 'early morning',
      weather: 'light fog lifting',
      
      // Detailed Environment Description
      description: `A charming corner boulangerie in Montmartre. The shop has existed since 1892, 
        with original art nouveau tiles and hand-painted signage. Morning light streams through 
        tall windows, casting golden rectangles across the worn wooden floor. The aroma of fresh 
        croissants mingles with strong coffee. Outside, cobblestone streets glisten with morning dew.`,
      
      // Ultra-Detailed Props
      props: {
        // Counter Area
        mainCounter: {
          type: 'display_counter',
          material: 'aged marble with brass trim',
          position: { x: 0, y: 0.5, z: -3 },
          items: [
            { name: 'croissants', count: 24, arrangement: 'pyramid' },
            { name: 'pain_au_chocolat', count: 18, arrangement: 'rows' },
            { name: 'chausson_aux_pommes', count: 12, arrangement: 'scattered' },
            { name: 'palmiers', count: 20, arrangement: 'fan' },
            { name: 'éclairs', count: 15, flavors: ['chocolat', 'café', 'vanille'] },
            { name: 'tartes_aux_fruits', count: 8, fruits: ['fraises', 'framboises', 'myrtilles'] }
          ]
        },
        
        // Bread Displays
        breadShelves: {
          type: 'wooden_shelving',
          material: 'dark walnut',
          position: { x: -4, y: 0, z: -5 },
          shelves: [
            { level: 1, items: ['baguettes_traditionnelles', 'baguettes_rustiques'], count: 40 },
            { level: 2, items: ['pain_de_campagne', 'pain_complet'], count: 20 },
            { level: 3, items: ['boules_de_pain', 'pain_aux_noix'], count: 15 },
            { level: 4, items: ['fougasse', 'pain_aux_olives'], count: 10 }
          ]
        },
        
        // Wicker Baskets
        baskets: [
          { type: 'large_wicker', position: { x: 2, y: 0.3, z: -2 }, contents: 'brioche_feuilletée', count: 8 },
          { type: 'medium_wicker', position: { x: -2, y: 0.8, z: -4 }, contents: 'petits_pains', count: 24 },
          { type: 'small_wicker', position: { x: 3, y: 1, z: -3 }, contents: 'chouquettes', count: 50 }
        ],
        
        // Vintage Coffee Machine
        coffeeMachine: {
          type: 'vintage_brass_espresso',
          model: 'La Pavoni 1905 reproduction',
          position: { x: 3, y: 1, z: -4 },
          details: ['polished brass handles', 'pressure gauges', 'steam wands', 'ceramic cups']
        },
        
        // Decorative Elements
        decorations: [
          { type: 'art_nouveau_mirror', position: { x: 0, y: 2, z: -6 }, frame: 'gilded' },
          { type: 'vintage_clock', position: { x: -3, y: 2.5, z: -6 }, style: 'pendulum' },
          { type: 'chalkboard_menu', position: { x: 2, y: 2, z: -6 }, items: ['café', 'thé', 'chocolat chaud'] },
          { type: 'dried_lavender_bundles', positions: ['window_sill', 'counter_corner'] },
          { type: 'antique_scales', position: { x: -1, y: 1, z: -3 }, material: 'brass' },
          { type: 'fresh_flowers', type: 'sunflowers', vase: 'blue_ceramic' }
        ],
        
        // Floor & Ceiling
        architectural: {
          floor: { type: 'hexagonal_tiles', colors: ['cream', 'terracotta'], pattern: 'alternating' },
          ceiling: { type: 'pressed_tin', color: 'antique_white', height: 3.5 },
          windows: { type: 'tall_french', panes: 12, curtains: 'lace' },
          door: { type: 'glass_with_bell', frame: 'painted_green' }
        },
        
        // Outside View (Through Windows)
        exterior: {
          street: 'cobblestone',
          buildings: ['cream_facades', 'wrought_iron_balconies', 'window_boxes_with_geraniums'],
          pedestrians: ['man_with_newspaper', 'woman_with_poodle', 'artist_with_easel'],
          skyline: 'sacre_coeur_in_distance'
        }
      },
      
      // Atmospheric Sounds (ElevenLabs Sound Design)
      sounds: {
        ambient: [
          { name: 'morning_birds_paris', volume: 0.3, loop: true },
          { name: 'distant_church_bells', volume: 0.2, interval: 300000 },
          { name: 'gentle_street_sounds', volume: 0.25, loop: true }
        ],
        shop: [
          { name: 'coffee_machine_steam', volume: 0.4, trigger: 'random', frequency: 30000 },
          { name: 'paper_bag_rustling', volume: 0.3, trigger: 'transaction' },
          { name: 'door_bell_chime', volume: 0.5, trigger: 'enter_exit' },
          { name: 'coins_on_marble', volume: 0.35, trigger: 'payment' }
        ],
        music: {
          track: 'french_accordion_cafe',
          artist: 'Parisian Mornings',
          volume: 0.15,
          style: 'nostalgic musette'
        }
      },
      
      // Lighting
      lighting: {
        primary: { type: 'directional', color: '#FFE4B5', intensity: 0.8, direction: 'east' },
        secondary: { type: 'ambient', color: '#FFF8DC', intensity: 0.4 },
        accent: [
          { type: 'point', position: { x: 0, y: 3, z: 0 }, color: '#FFD700', intensity: 0.3 },
          { type: 'point', position: { x: -3, y: 2.5, z: -2 }, color: '#FFA500', intensity: 0.2 }
        ],
        effects: ['dust_motes_in_sunbeams', 'warm_glow_on_pastries']
      }
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // CHARACTER: Amélie the Baker
    // ─────────────────────────────────────────────────────────────────────────
    character: {
      name: 'Amélie Dubois',
      role: 'Maître Boulangère',
      age: 34,
      emoji: '👩‍🍳',
      
      // Detailed Appearance
      appearance: {
        height: 'medium',
        build: 'athletic',
        hair: { color: 'chestnut_brown', style: 'messy_bun', accessories: ['flour_dusting'] },
        eyes: { color: 'hazel', expression: 'warm_and_knowing' },
        skin: { tone: 'fair_with_rosy_cheeks' },
        outfit: {
          top: 'white_chef_coat',
          apron: 'navy_blue_linen',
          accessories: ['vintage_watch', 'small_gold_earrings'],
          footwear: 'practical_clogs'
        },
        signature: 'always_has_flour_on_nose'
      },
      
      // Personality & Voice
      personality: {
        traits: ['warm', 'patient', 'passionate', 'slightly_perfectionist', 'good_humored'],
        interests: ['baking_traditions', 'french_literature', 'morning_routines', 'local_gossip'],
        quirks: ['hums_while_working', 'offers_extra_pastry_to_regulars', 'corrects_pronunciation_gently'],
        backstory: `Third-generation baker, learned from her grandmother. Studied pastry in Lyon 
          before returning to Paris. Dreams of publishing a cookbook. Has a cat named Croissant.`
      },
      
      // Voice Configuration (ElevenLabs)
      voice: {
        voiceId: 'ThT5KcBeYPX3keUQqHPh', // Charlotte - French accent
        style: 'warm_and_melodic',
        accent: 'Parisian',
        speed: 0.95,
        pitch: 1.05,
        expressionTags: {
          greeting: '[warmly]',
          teaching: '[patiently]',
          excited: '[enthusiastically]',
          correcting: '[gently]',
          praising: '[delighted]'
        }
      },
      
      // Teaching Style
      teachingStyle: {
        approach: 'conversational_immersion',
        corrections: 'gentle_modeling',
        encouragement: 'frequent_and_genuine',
        culturalTips: 'woven_into_conversation'
      }
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // LESSON PLAN
    // ─────────────────────────────────────────────────────────────────────────
    lessonPlan: {
      unit1: {
        title: 'Bonjour! Ordering at the Boulangerie',
        objectives: ['greetings', 'basic_ordering', 'numbers_1-10', 'polite_forms'],
        scenarios: [
          { name: 'Morning Greeting', phrases: ['Bonjour', 'Ça va?', 'Très bien, merci'] },
          { name: 'Ordering Bread', phrases: ['Une baguette, s\'il vous plaît', 'C\'est combien?'] },
          { name: 'Thank You & Goodbye', phrases: ['Merci beaucoup', 'Au revoir', 'Bonne journée'] }
        ],
        vocabulary: [
          { word: 'boulangerie', translation: 'bakery', pronunciation: 'boo-lahn-zhuh-REE' },
          { word: 'croissant', translation: 'croissant', pronunciation: 'krwa-SAHN' },
          { word: 'pain', translation: 'bread', pronunciation: 'pan' },
          { word: 'café', translation: 'coffee', pronunciation: 'ka-FAY' }
        ],
        culturalNotes: [
          'Always greet with "Bonjour" when entering a shop',
          'Use "vous" (formal you) with shopkeepers',
          'French people buy bread fresh daily'
        ]
      },
      unit2: {
        title: 'Les Pâtisseries - Sweet Treats',
        objectives: ['pastry_vocabulary', 'preferences', 'adjectives'],
        scenarios: [
          { name: 'Choosing Pastries', phrases: ['Qu\'est-ce que c\'est?', 'C\'est délicieux!'] },
          { name: 'Expressing Preferences', phrases: ['Je préfère...', 'J\'aime beaucoup...'] }
        ]
      },
      unit3: {
        title: 'Une Conversation - Small Talk',
        objectives: ['weather', 'daily_routines', 'past_tense_basics'],
        scenarios: [
          { name: 'Weather Chat', phrases: ['Il fait beau aujourd\'hui', 'Quel temps fait-il?'] },
          { name: 'Daily Life', phrases: ['Je me lève à...', 'D\'habitude, je...'] }
        ]
      }
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // DIFFICULTY SCALING (Mostly English with bits of French)
    // ─────────────────────────────────────────────────────────────────────────
    difficultyScaling: {
      level1: { 
        english: 85, target: 15, 
        grammar: 'basic greetings',
        instruction: 'Speak mostly in English. Introduce key French words like "bonjour", "merci", "croissant". Translate immediately after saying the French word.',
        example: 'Ah, bonjour! That means "hello"! Welcome to my little bakery.'
      },
      level2: { 
        english: 70, target: 30, 
        grammar: 'ordering food',
        instruction: 'Mix more French into your English. Use French for common bakery items and greetings. Provide context clues.',
        example: 'Would you like un croissant? It\'s fresh from the oven - tout chaud!'
      },
      level3: { 
        english: 50, target: 50, 
        grammar: 'polite conversation',
        instruction: 'Speak half in French, half in English. Use French for complete simple phrases. Repeat in English only if they seem confused.',
        example: 'C\'est trois euros. That will be three euros. Voulez-vous autre chose?'
      },
      level4: { 
        english: 25, target: 75, 
        grammar: 'past tense',
        instruction: 'Speak primarily in French with simple sentences. Only switch to English for complex explanations or if they are stuck.',
        example: 'Aujourd\'hui, j\'ai fait ces croissants à cinq heures du matin. Ils sont parfaits!'
      },
      level5: { 
        english: 5, target: 95, 
        grammar: 'natural conversation',
        instruction: 'Speak naturally in French. Use English only as an absolute last resort.',
        example: 'Ah, vous parlez bien français maintenant! Qu\'est-ce que je vous sers aujourd\'hui?'
      }
    },
    
    // False Friends (Words that look similar but mean different things)
    falseFriends: [
      { word: 'actuellement', looksLike: 'actually', actualMeaning: 'currently', warning: 'Use "en fait" for actually' },
      { word: 'bras', looksLike: 'bra', actualMeaning: 'arm', warning: 'Underwear is "soutien-gorge"' },
      { word: 'coin', looksLike: 'coin (money)', actualMeaning: 'corner', warning: 'Money coin is "pièce"' },
      { word: 'pain', looksLike: 'pain', actualMeaning: 'bread', warning: 'Pain (hurt) is "douleur"' },
      { word: 'préservatif', looksLike: 'preservative', actualMeaning: 'condom', warning: 'Preservative is "conservateur"' }
    ],
    
    // Starting Phrases for Quick Reference
    startingPhrases: [
      { phrase: 'Bonjour!', translation: 'Hello!', pronunciation: 'bon-ZHOOR' },
      { phrase: 'Un croissant, s\'il vous plaît', translation: 'A croissant, please', pronunciation: 'un krwa-SAN, seel voo PLAY' },
      { phrase: 'Merci beaucoup', translation: 'Thank you very much', pronunciation: 'mer-SEE boh-KOO' },
      { phrase: 'C\'est combien?', translation: 'How much is it?', pronunciation: 'say kom-BYEN' },
      { phrase: 'Au revoir!', translation: 'Goodbye!', pronunciation: 'oh ruh-VWAR' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JAPANESE - Kyoto Tea Ceremony House
  // ═══════════════════════════════════════════════════════════════════════════
  japanese: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    
    scene: {
      name: 'Sakura-an Tea House',
      location: 'Gion District, Kyoto',
      timeOfDay: 'spring afternoon',
      weather: 'cherry blossom petals falling',
      
      description: `A traditional machiya tea house in Kyoto's historic Gion district. The space 
        embodies wabi-sabi aesthetics with carefully aged wood, paper shoji screens, and a 
        contemplative rock garden visible through open fusuma doors. Cherry blossoms drift past 
        the engawa veranda. The subtle fragrance of matcha and incense fills the air.`,
      
      props: {
        mainRoom: {
          type: 'chashitsu_tea_room',
          size: '4.5 tatami',
          position: { x: 0, y: 0, z: -2 },
          elements: [
            { name: 'tatami_mats', count: 4.5, condition: 'perfectly_maintained' },
            { name: 'tokonoma_alcove', contents: ['hanging_scroll', 'single_flower', 'incense_burner'] },
            { name: 'sunken_hearth', type: 'ro', status: 'charcoal_glowing' },
            { name: 'iron_kettle', type: 'tetsubin', steam: true }
          ]
        },
        
        teaSetup: {
          type: 'tea_ceremony_arrangement',
          position: { x: 0, y: 0.3, z: -1.5 },
          items: [
            { name: 'chawan', type: 'raku_tea_bowl', color: 'black_with_gold_repair', style: 'kintsugi' },
            { name: 'chasen', type: 'bamboo_whisk', prongs: 80 },
            { name: 'chashaku', type: 'bamboo_scoop', curve: 'elegant' },
            { name: 'natsume', type: 'tea_caddy', lacquer: 'red_black' },
            { name: 'fukusa', type: 'silk_cloth', color: 'purple' },
            { name: 'mizusashi', type: 'water_container', material: 'celadon_ceramic' }
          ]
        },
        
        garden: {
          type: 'karesansui',
          visible: true,
          elements: [
            { name: 'raked_gravel', pattern: 'wave_circles' },
            { name: 'moss_islands', count: 3 },
            { name: 'stone_lantern', type: 'yukimi', position: 'corner' },
            { name: 'bamboo_fountain', type: 'shishi_odoshi', sound: true },
            { name: 'cherry_tree', type: 'weeping', blossoms: 'peak_bloom' },
            { name: 'stepping_stones', count: 7, arrangement: 'asymmetric' }
          ]
        },
        
        decorations: [
          { type: 'shoji_screens', pattern: 'geometric', light: 'filtered' },
          { type: 'ikebana_arrangement', style: 'moribana', flowers: ['plum_blossom', 'pine'] },
          { type: 'hanging_scroll', calligraphy: '和敬清寂', meaning: 'harmony_respect_purity_tranquility' },
          { type: 'zabuton_cushions', color: 'indigo', count: 4 },
          { type: 'paper_lantern', type: 'chochin', position: 'corner' }
        ],
        
        architectural: {
          floor: { type: 'tatami', border: 'dark_cloth', condition: 'perfectly_aligned' },
          ceiling: { type: 'exposed_wood', style: 'sukiya', beams: 'dark_cypress' },
          walls: { type: 'clay_plaster', color: 'warm_grey', texture: 'hand_applied' },
          windows: { type: 'shoji_screens', panes: 'translucent_paper', frames: 'bamboo' },
          entrance: { type: 'nijiriguchi', size: 'small_humble', purpose: 'humility_entrance' },
          roof: { type: 'traditional_tile', style: 'kyoto', eaves: 'deep_overhang' }
        },
        
        exterior: {
          view: 'gion_street',
          elements: ['traditional_machiya_facades', 'stone_lanterns', 'narrow_cobblestone_path'],
          activity: ['geisha_walking', 'tourists_with_cameras', 'local_shopkeepers'],
          skyline: 'mountains_in_distance',
          season: 'cherry_blossom_peak'
        }
      },
      
      sounds: {
        ambient: [
          { name: 'bamboo_fountain_click', volume: 0.4, interval: 15000 },
          { name: 'wind_in_bamboo', volume: 0.25, loop: true },
          { name: 'distant_temple_bell', volume: 0.2, interval: 600000 }
        ],
        ceremony: [
          { name: 'water_pouring', volume: 0.35, trigger: 'tea_preparation' },
          { name: 'whisk_in_bowl', volume: 0.3, trigger: 'making_matcha' },
          { name: 'silk_on_ceramic', volume: 0.2, trigger: 'cleaning' }
        ],
        music: {
          track: 'koto_meditation',
          artist: 'Kyoto Springs',
          volume: 0.12,
          style: 'traditional shamisen and koto'
        }
      },
      
      lighting: {
        primary: { type: 'diffused', color: '#FFF5E6', intensity: 0.6, source: 'shoji_filtered' },
        secondary: { type: 'ambient', color: '#FAF0E6', intensity: 0.3 },
        accent: [
          { type: 'lantern', position: { x: 2, y: 1, z: -3 }, color: '#FFE4B5', intensity: 0.2 }
        ],
        effects: ['cherry_blossom_shadows', 'shoji_paper_glow']
      }
    },
    
    character: {
      name: 'Yuki Tanaka',
      role: '茶道師範 (Tea Ceremony Master)',
      age: 45,
      emoji: '🍵',
      
      appearance: {
        height: 'petite',
        build: 'graceful',
        hair: { color: 'black_with_silver', style: 'elegant_updo', accessories: ['tortoiseshell_kanzashi'] },
        eyes: { color: 'dark_brown', expression: 'serene_and_attentive' },
        skin: { tone: 'porcelain' },
        outfit: {
          top: 'formal_kimono',
          obi: 'gold_brocade',
          pattern: 'autumn_maple_leaves',
          accessories: ['folding_fan', 'fukusa_at_obi'],
          footwear: 'white_tabi'
        },
        signature: 'movements_like_flowing_water'
      },
      
      personality: {
        traits: ['serene', 'meticulous', 'wise', 'surprisingly_humorous', 'deeply_patient'],
        interests: ['tea_ceremony', 'zen_philosophy', 'seasonal_flowers', 'traditional_crafts'],
        quirks: ['quotes_haiku', 'notices_every_detail', 'gentle_corrections_through_demonstration'],
        backstory: `Trained from age 15 in the Urasenke school of tea ceremony. Spent a decade 
          studying in Uji. Now teaches foreigners to appreciate Japanese culture through tea.
          Believes language learning is like tea ceremony - mindful, patient, beautiful.`
      },
      
      voice: {
        voiceId: 'pNInz6obpgDQGcFmaJgB', // Soft Japanese female
        style: 'gentle_and_measured',
        accent: 'Kyoto_dialect',
        speed: 0.85,
        pitch: 1.1,
        expressionTags: {
          greeting: '[gracefully]',
          teaching: '[patiently]',
          correcting: '[gently demonstrating]',
          praising: '[warmly pleased]'
        }
      }
    },
    
    difficultyScaling: {
      level1: { 
        english: 90, target: 10,
        grammar: 'basic greetings and hiragana introduction',
        instruction: 'Speak almost entirely in English. Introduce basic Japanese words like "konnichiwa", "arigatou", "ocha". Always provide romaji and translation.',
        example: 'Welcome! Or as we say, いらっしゃいませ (irasshaimase)! Please, sit down.'
      },
      level2: { 
        english: 75, target: 25,
        grammar: 'polite forms and basic particles',
        instruction: 'Use Japanese for greetings and common tea ceremony terms. Explain politeness levels.',
        example: 'Now, let\'s enjoy some お茶 (ocha) - tea. どうぞ (douzo) - please, take a cup.'
      },
      level3: { 
        english: 55, target: 45,
        grammar: 'sentence structure and honorifics',
        instruction: 'Speak more Japanese, using complete simple sentences. Explain keigo (honorific speech) naturally.',
        example: 'このお茶は美味しいですね。This tea is delicious, isn\'t it? いかがですか？How do you like it?'
      },
      level4: { 
        english: 30, target: 70,
        grammar: 'casual vs formal speech',
        instruction: 'Speak primarily in Japanese with natural rhythm. Use English for complex cultural explanations only.',
        example: 'お茶の心は「和敬清寂」です。The spirit of tea is harmony, respect, purity, and tranquility.'
      },
      level5: { 
        english: 10, target: 90,
        grammar: 'natural conversation with cultural nuance',
        instruction: 'Speak naturally in Japanese, with all appropriate honorifics and cultural context.',
        example: '素晴らしいですね。日本語がお上手になりましたね。お茶をもう一杯いかがですか？'
      }
    },
    
    lessonPlan: {
      unit1: {
        title: 'はじめまして - First Meeting',
        objectives: ['greetings', 'self_introduction', 'basic_politeness'],
        scenarios: [
          { name: 'Entering Tea House', phrases: ['お邪魔します', '失礼します', 'ありがとうございます'] },
          { name: 'Receiving Tea', phrases: ['いただきます', 'おいしいです', 'ごちそうさまでした'] },
          { name: 'Thanking Host', phrases: ['ありがとうございました', 'また来ます', 'さようなら'] }
        ],
        vocabulary: [
          { word: 'こんにちは', translation: 'hello', pronunciation: 'kon-ni-chi-wa' },
          { word: 'ありがとう', translation: 'thank you', pronunciation: 'a-ri-ga-tou' },
          { word: 'お茶', translation: 'tea', pronunciation: 'o-cha' },
          { word: 'どうぞ', translation: 'please (offering)', pronunciation: 'dou-zo' },
          { word: 'おいしい', translation: 'delicious', pronunciation: 'o-i-shi-i' },
          { word: 'いただきます', translation: 'I humbly receive', pronunciation: 'i-ta-da-ki-mas' }
        ],
        culturalNotes: [
          'Remove shoes before entering traditional spaces',
          'Bow slightly when greeting and thanking',
          'Say "itadakimasu" before eating or drinking',
          'Tea ceremony embodies wabi-sabi - finding beauty in imperfection'
        ]
      },
      unit2: {
        title: '茶道の心 - The Spirit of Tea',
        objectives: ['tea_ceremony_vocabulary', 'honorifics', 'cultural_expressions'],
        scenarios: [
          { name: 'Observing Ceremony', phrases: ['美しいですね', '素晴らしい', '勉強になります'] }
        ]
      },
      unit3: {
        title: '季節の言葉 - Seasonal Words',
        objectives: ['seasonal_vocabulary', 'nature_terms', 'poetic_expressions'],
        scenarios: [
          { name: 'Discussing Seasons', phrases: ['桜が咲いています', '秋の紅葉', '雪が降っています'] }
        ]
      }
    },
    
    falseFriends: [
      { word: 'スマート', looksLike: 'smart (intelligent)', actualMeaning: 'slim/stylish', warning: 'Use 頭がいい for intelligent' },
      { word: 'マンション', looksLike: 'mansion', actualMeaning: 'apartment building', warning: 'Not a large house!' },
      { word: 'ナイーブ', looksLike: 'naive', actualMeaning: 'sensitive/delicate', warning: 'Different nuance' }
    ],
    
    startingPhrases: [
      { phrase: 'こんにちは', translation: 'Hello', pronunciation: 'kon-ni-chi-wa' },
      { phrase: 'お茶をどうぞ', translation: 'Please have some tea', pronunciation: 'o-cha wo dou-zo' },
      { phrase: 'ありがとうございます', translation: 'Thank you very much', pronunciation: 'a-ri-ga-tou go-za-i-mas' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPANISH - Madrid Tapas Bar
  // ═══════════════════════════════════════════════════════════════════════════
  spanish: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    
    scene: {
      name: 'Casa del Flamenco',
      location: 'La Latina, Madrid',
      timeOfDay: 'evening',
      weather: 'warm summer night',
      
      description: `A vibrant tapas bar in Madrid's historic La Latina neighborhood. The space pulses 
        with energy - walls covered in hand-painted Talavera tiles, legs of jamón hanging from 
        the ceiling, and the passionate sounds of flamenco guitar filling the air. Locals and 
        tourists mix at the bar, sharing small plates and animated conversation.`,
      
      props: {
        bar: {
          type: 'zinc_counter',
          material: 'aged_zinc_with_marble_top',
          position: { x: 0, y: 0.9, z: -4 },
          items: [
            { name: 'jamón_serrano', legs: 6, stand: 'traditional_jamonero' },
            { name: 'manchego_wheels', count: 4, ages: ['curado', 'viejo'] },
            { name: 'olives_display', varieties: ['gordal', 'manzanilla', 'arbequina'] },
            { name: 'wine_bottles', types: ['rioja', 'ribera_del_duero', 'cava'] }
          ]
        },
        
        tapasDisplay: {
          type: 'glass_case',
          position: { x: -3, y: 1, z: -3 },
          dishes: [
            { name: 'tortilla_española', slices: 8, garnish: 'parsley' },
            { name: 'patatas_bravas', style: 'madrid', sauce: 'aioli_and_spicy' },
            { name: 'gambas_al_ajillo', sizzling: true, garlic: 'abundant' },
            { name: 'croquetas_de_jamón', count: 24, size: 'bite_sized' },
            { name: 'pimientos_de_padrón', charred: true, salt: 'coarse' },
            { name: 'boquerones_en_vinagre', presentation: 'traditional' }
          ]
        },
        
        decorations: [
          { type: 'talavera_tiles', pattern: 'blue_white_yellow', wall: 'back' },
          { type: 'bullfighting_posters', vintage: true, count: 3 },
          { type: 'flamenco_posters', dancers: ['famous_bailaoras'] },
          { type: 'wine_barrel_tables', count: 4 },
          { type: 'hanging_garlic_braids', count: 5 },
          { type: 'castanets_display', on_wall: true },
          { type: 'spanish_guitar', mounted: true, condition: 'well_played' }
        ],
        
        stage: {
          type: 'small_tablao',
          position: { x: 4, y: 0.2, z: -5 },
          elements: [
            { name: 'wooden_platform', wood: 'aged_oak', condition: 'well_worn' },
            { name: 'chair_for_guitarist', style: 'traditional', material: 'dark_wood' },
            { name: 'microphone', style: 'vintage', brand: 'classic_spanish' },
            { name: 'dance_space', marked: true, size: 'intimate' }
          ]
        },
        
        architectural: {
          floor: { type: 'terracotta_tiles', pattern: 'traditional_spanish', condition: 'worn_smooth' },
          ceiling: { type: 'exposed_beams', wood: 'dark_oak', height: 3.8 },
          walls: { type: 'plaster', color: 'warm_ochre', texture: 'hand_finished' },
          windows: { type: 'arched', panes: 'small_glass', shutters: 'wooden' },
          door: { type: 'heavy_wood', style: 'traditional_spanish', handle: 'wrought_iron' }
        },
        
        exterior: {
          view: 'la_latina_street',
          elements: ['cobblestone_plaza', 'colorful_facades', 'wrought_iron_balconies'],
          activity: ['locals_socializing', 'tourists_exploring', 'street_musicians'],
          skyline: 'madrid_rooftops',
          atmosphere: 'vibrant_evening'
        }
      },
      
      sounds: {
        ambient: [
          { name: 'spanish_chatter', volume: 0.35, loop: true },
          { name: 'glasses_clinking', volume: 0.25, trigger: 'random', frequency: 20000 },
          { name: 'sizzling_tapas', volume: 0.2, loop: true }
        ],
        music: {
          track: 'flamenco_guitar_rumba',
          artist: 'Madrid Nights',
          volume: 0.2,
          style: 'passionate flamenco with palmas'
        }
      },
      
      lighting: {
        primary: { type: 'warm', color: '#FFB347', intensity: 0.7 },
        accent: [
          { type: 'hanging_lamps', color: '#FF8C00', count: 5 },
          { type: 'candles_on_tables', flicker: true }
        ],
        effects: ['warm_glow', 'dancing_shadows']
      }
    },
    
    character: {
      name: 'Carmen Reyes',
      role: 'Chef & Flamenco Enthusiast',
      age: 38,
      emoji: '💃',
      
      appearance: {
        height: 'tall',
        build: 'athletic',
        hair: { color: 'jet_black', style: 'flowing_curls', accessories: ['red_flower'] },
        eyes: { color: 'dark_brown', expression: 'fiery_and_warm' },
        outfit: {
          top: 'fitted_blouse',
          bottom: 'flowing_skirt',
          color: 'red_and_black',
          accessories: ['gold_hoop_earrings', 'bangles'],
          signature: 'always_ready_to_dance'
        }
      },
      
      personality: {
        traits: ['passionate', 'expressive', 'warm', 'dramatic', 'generous'],
        interests: ['flamenco', 'cooking', 'spanish_history', 'family'],
        quirks: ['speaks_with_hands', 'breaks_into_song', 'generous_with_portions'],
        backstory: `Born in Seville, moved to Madrid to open her dream tapas bar. Trained as 
          a flamenco dancer before discovering her love for cooking. Believes food and dance 
          are the same - both expressions of the soul.`
      },
      
      voice: {
        voiceId: 'XB0fDUnXU5powFXDhCwa', // Spanish female
        style: 'expressive_and_warm',
        accent: 'Castilian_Spanish',
        speed: 1.05,
        pitch: 1.0,
        expressionTags: {
          greeting: '[enthusiastically]',
          teaching: '[passionately]',
          correcting: '[encouragingly]',
          praising: '[excitedly]'
        }
      }
    },
    
    difficultyScaling: {
      level1: { 
        english: 85, target: 15,
        grammar: 'basic greetings',
        instruction: 'Speak mostly in English, sprinkling in Spanish words like "hola", "gracias", "tapas". Always translate.',
        example: '¡Hola! That means hello! Welcome to my tapas bar! Would you like some jamón - that\'s ham!'
      },
      level2: { 
        english: 65, target: 35,
        grammar: 'ordering food',
        instruction: 'Use Spanish for food items and common phrases. Provide translations naturally.',
        example: '¡Muy bien! Would you like patatas bravas? They\'re spicy potatoes - muy deliciosas!'
      },
      level3: { 
        english: 45, target: 55,
        grammar: 'ser vs estar',
        instruction: 'Speak half in Spanish. Use complete sentences. Explain grammar naturally.',
        example: '¿Cómo está la comida? How is the food? ¡Las tapas están deliciosas hoy!'
      },
      level4: { 
        english: 20, target: 80,
        grammar: 'past tense',
        instruction: 'Speak primarily in Spanish. Use English only for complex explanations.',
        example: 'Hoy hice las croquetas con una receta de mi abuela. ¡Son las mejores de Madrid!'
      },
      level5: { 
        english: 5, target: 95,
        grammar: 'natural conversation',
        instruction: 'Speak naturally in Spanish with regional expressions.',
        example: '¡Qué maravilla! Tu español es increíble. ¿Quieres probar el vino? Es de la Rioja.'
      }
    },
    
    lessonPlan: {
      unit1: {
        title: '¡Bienvenido! - Welcome to Tapas',
        objectives: ['greetings', 'ordering_tapas', 'basic_politeness'],
        scenarios: [
          { name: 'Entering Bar', phrases: ['¡Hola!', 'Buenas tardes', 'Una mesa, por favor'] },
          { name: 'Ordering Tapas', phrases: ['¿Qué recomiendas?', 'Quiero...', 'Para compartir'] },
          { name: 'Paying', phrases: ['La cuenta, por favor', '¿Cuánto es?', 'Gracias'] }
        ],
        vocabulary: [
          { word: 'tapas', translation: 'small plates', pronunciation: 'TAH-pas' },
          { word: 'jamón', translation: 'ham', pronunciation: 'ha-MON' },
          { word: 'queso', translation: 'cheese', pronunciation: 'KEH-so' },
          { word: 'cerveza', translation: 'beer', pronunciation: 'ser-VEH-sah' },
          { word: 'delicioso', translation: 'delicious', pronunciation: 'deh-lee-SEE-oh-so' }
        ],
        culturalNotes: [
          'Tapas are meant to be shared',
          'Spaniards eat dinner very late (9-10 PM)',
          'Always greet when entering a bar',
          'Tapas culture is about socializing, not just eating'
        ]
      },
      unit2: {
        title: 'La Comida - Food & Flavors',
        objectives: ['food_vocabulary', 'describing_taste', 'ordering_drinks'],
        scenarios: [
          { name: 'Describing Food', phrases: ['Está muy rico', 'Me encanta', 'Tiene mucho sabor'] }
        ]
      },
      unit3: {
        title: 'Flamenco y Cultura - Culture & Music',
        objectives: ['cultural_vocabulary', 'expressing_emotions', 'music_terms'],
        scenarios: [
          { name: 'Discussing Flamenco', phrases: ['¡Qué pasión!', 'Me emociona', 'Es arte puro'] }
        ]
      }
    },
    
    falseFriends: [
      { word: 'embarazada', looksLike: 'embarrassed', actualMeaning: 'pregnant', warning: 'Very different! Use "avergonzado"' },
      { word: 'éxito', looksLike: 'exit', actualMeaning: 'success', warning: 'Exit is "salida"' },
      { word: 'constipado', looksLike: 'constipated', actualMeaning: 'have a cold', warning: 'Use "estreñido" for constipated' }
    ],
    
    startingPhrases: [
      { phrase: '¡Hola!', translation: 'Hello!', pronunciation: 'OH-lah' },
      { phrase: 'Una cerveza, por favor', translation: 'A beer, please', pronunciation: 'OO-nah ser-VEH-sah' },
      { phrase: '¡Qué rico!', translation: 'How delicious!', pronunciation: 'keh REE-koh' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GERMAN - Berlin Techno Club
  // ═══════════════════════════════════════════════════════════════════════════
  german: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    
    scene: {
      name: 'Klang Bunker',
      location: 'Kreuzberg, Berlin',
      timeOfDay: '3 AM',
      weather: 'city night',
      
      description: `An underground techno club in a converted WWII bunker. Raw concrete walls absorb 
        the pulsing bass. Minimal lighting - mostly deep red and blue LEDs. The dance floor is 
        packed with people lost in the music. Industrial pipes run along the ceiling. There's a 
        mysterious, philosophical energy in the air.`,
      
      props: {
        djBooth: {
          type: 'industrial_platform',
          position: { x: 0, y: 1, z: -8 },
          equipment: [
            { name: 'cdjs', model: 'Pioneer CDJ-3000', count: 4 },
            { name: 'mixer', model: 'Allen & Heath Xone:96' },
            { name: 'controller', model: 'Native Instruments' }
          ]
        },
        
        speakers: {
          type: 'funktion_one',
          positions: [
            { x: -6, y: 2, z: -5 },
            { x: 6, y: 2, z: -5 }
          ],
          subwoofers: { position: 'under_booth', count: 4 }
        },
        
        bar: {
          type: 'concrete_slab',
          position: { x: -8, y: 1, z: 0 },
          drinks: ['club_mate', 'berliner_pilsner', 'vodka', 'water'],
          style: 'minimal'
        },
        
        decorations: [
          { type: 'exposed_pipes', material: 'rusty_steel', arrangement: 'industrial' },
          { type: 'graffiti_art', style: 'abstract', artists: ['local'], themes: ['freedom', 'unity'] },
          { type: 'fog_machines', count: 4, output: 'thick', position: 'strategic' },
          { type: 'strobe_lights', pattern: 'synchronized', intensity: 'pulsing' },
          { type: 'minimalist_art', style: 'berlin_underground', frames: 'none' },
          { type: 'vintage_techno_posters', era: '90s_berlin', condition: 'faded' }
        ],
        
        architectural: {
          floor: { type: 'concrete', finish: 'raw_polished', condition: 'worn' },
          ceiling: { type: 'exposed_concrete', height: 4.5, pipes: 'visible' },
          walls: { type: 'raw_concrete', texture: 'bunker_original', thickness: 'massive' },
          windows: { type: 'minimal', style: 'industrial', light: 'filtered' },
          entrance: { type: 'heavy_steel_door', style: 'bunker_original', sound: 'echoing' },
          columns: { type: 'reinforced_concrete', spacing: 'irregular', purpose: 'structural' }
        },
        
        exterior: {
          view: 'kreuzberg_street',
          elements: ['graffiti_walls', 'industrial_buildings', 'night_life'],
          activity: ['club_goers', 'artists', 'night_wanderers'],
          skyline: 'berlin_skyline',
          atmosphere: 'underground_energy'
        }
      },
      
      sounds: {
        ambient: [
          { name: 'crowd_ambient', volume: 0.3, loop: true },
          { name: 'deep_bass_rumble', volume: 0.4, loop: true }
        ],
        music: {
          track: 'minimal_techno_130bpm',
          artist: 'Berlin Underground',
          volume: 0.35,
          style: 'deep minimal techno'
        }
      },
      
      lighting: {
        primary: { type: 'minimal', color: '#0D0D0D', intensity: 0.1 },
        accent: [
          { type: 'led_strip', color: '#FF0000', position: 'walls' },
          { type: 'strobe', color: '#FFFFFF', frequency: 'beat_synced' },
          { type: 'laser', color: '#00FF00', pattern: 'geometric' }
        ]
      }
    },
    
    character: {
      name: 'Wolfgang Müller',
      role: 'DJ & Club Philosopher',
      age: 42,
      emoji: '🎧',
      
      appearance: {
        height: 'tall',
        build: 'lean',
        hair: { color: 'shaved', style: 'bald' },
        eyes: { color: 'grey', expression: 'intense_and_knowing' },
        outfit: {
          top: 'black_tshirt',
          bottom: 'black_jeans',
          accessories: ['industrial_rings', 'vintage_watch'],
          footwear: 'black_boots'
        }
      },
      
      personality: {
        traits: ['philosophical', 'mysterious', 'deep', 'dry_humor', 'intense'],
        interests: ['techno_music', 'philosophy', 'berlin_history', 'sound_design'],
        quirks: ['speaks_in_metaphors', 'long_pauses', 'profound_observations'],
        backstory: `Former philosophy student who found deeper truth in techno than in Hegel. 
          Has been DJing in Berlin for 20 years. Sees the dance floor as a collective consciousness.`
      },
      
      voice: {
        voiceId: 'VR6AewLTigWG4xSOukaG', // Deep male German
        style: 'measured_and_deep',
        accent: 'Berlin',
        speed: 0.9,
        pitch: 0.9,
        expressionTags: {
          greeting: '[coolly]',
          teaching: '[philosophically]',
          correcting: '[thoughtfully]',
          praising: '[approvingly]'
        }
      }
    },
    
    difficultyScaling: {
      level1: { 
        english: 80, target: 20,
        grammar: 'basic greetings',
        instruction: 'Speak mostly in English with key German words. "Guten Abend", "Bier", "Musik".',
        example: 'Guten Abend - good evening. Welcome to my... space. Would you like ein Bier?'
      },
      level2: { 
        english: 60, target: 40,
        grammar: 'ordering drinks',
        instruction: 'Mix German naturally. Use German for club and drink vocabulary.',
        example: 'Die Musik ist gut, ja? The beat... der Beat... it speaks to something deeper.'
      },
      level3: { 
        english: 40, target: 60,
        grammar: 'gendered articles',
        instruction: 'Speak more German. Explain der/die/das naturally through context.',
        example: 'Das ist der Sound von Berlin. Die Nacht ist jung. Was fühlst du?'
      },
      level4: { 
        english: 20, target: 80,
        grammar: 'compound words',
        instruction: 'Speak primarily German. Explain compound words as they come up.',
        example: 'Die Tanzfläche - the dance floor - ist ein Ort der Freiheit. Verstehst du?'
      },
      level5: { 
        english: 5, target: 95,
        grammar: 'philosophical discussion',
        instruction: 'Speak natural German with philosophical depth.',
        example: 'Die Musik ist eine Sprache ohne Worte. Hier sind wir alle gleich.'
      }
    },
    
    lessonPlan: {
      unit1: {
        title: 'Willkommen - Welcome to Berlin',
        objectives: ['greetings', 'ordering_drinks', 'basic_conversation'],
        scenarios: [
          { name: 'Entering Club', phrases: ['Guten Abend', 'Ein Bier, bitte', 'Wie viel kostet das?'] },
          { name: 'Discussing Music', phrases: ['Die Musik ist gut', 'Was für Musik?', 'Ich mag Techno'] },
          { name: 'Philosophical Talk', phrases: ['Was denkst du?', 'Das ist interessant', 'Verstehst du?'] }
        ],
        vocabulary: [
          { word: 'Musik', translation: 'music', pronunciation: 'moo-ZEEK' },
          { word: 'Bier', translation: 'beer', pronunciation: 'BEER' },
          { word: 'Tanz', translation: 'dance', pronunciation: 'tahnts' },
          { word: 'Freiheit', translation: 'freedom', pronunciation: 'FRY-hite' },
          { word: 'Gemeinschaft', translation: 'community', pronunciation: 'geh-MINE-shahft' }
        ],
        culturalNotes: [
          'Berlin techno culture values freedom and unity',
          'Clubs often stay open until morning',
          'The dance floor is a space of equality',
          'Berlin has a rich underground art scene'
        ]
      },
      unit2: {
        title: 'Die Nacht - The Night',
        objectives: ['night_vocabulary', 'expressing_feelings', 'philosophical_discussion'],
        scenarios: [
          { name: 'Deep Conversation', phrases: ['Was bedeutet das?', 'Ich fühle...', 'Das ist tief'] }
        ]
      },
      unit3: {
        title: 'Berlin Kultur - Berlin Culture',
        objectives: ['cultural_vocabulary', 'history_terms', 'artistic_expressions'],
        scenarios: [
          { name: 'Discussing Berlin', phrases: ['Berlin ist...', 'Die Geschichte', 'Die Kunst'] }
        ]
      }
    },
    
    falseFriends: [
      { word: 'Gift', looksLike: 'gift', actualMeaning: 'poison', warning: 'Use "Geschenk" for a present' },
      { word: 'bekommen', looksLike: 'become', actualMeaning: 'to receive/get', warning: 'Use "werden" for become' },
      { word: 'bald', looksLike: 'bald (hairless)', actualMeaning: 'soon', warning: 'Hairless is "kahl"' }
    ],
    
    startingPhrases: [
      { phrase: 'Guten Abend', translation: 'Good evening', pronunciation: 'GOO-ten AH-bent' },
      { phrase: 'Ein Bier, bitte', translation: 'A beer, please', pronunciation: 'ine BEER, BIT-uh' },
      { phrase: 'Die Musik ist gut', translation: 'The music is good', pronunciation: 'dee moo-ZEEK ist goot' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ITALIAN - Rome Café
  // ═══════════════════════════════════════════════════════════════════════════
  italian: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    
    scene: {
      name: 'Caffè degli Artisti',
      location: 'Trastevere, Rome',
      timeOfDay: 'golden hour',
      weather: 'warm Mediterranean evening',
      
      description: `A charming café in Rome's Trastevere neighborhood. Outdoor tables spill onto 
        cobblestone streets. The golden light of sunset illuminates ochre walls covered in climbing 
        ivy. The sound of a fountain mingles with animated Italian conversation. Ancient Roman 
        columns are visible in the distance. Vespas buzz past.`,
      
      props: {
        outdoorTerrace: {
          type: 'cobblestone_seating',
          tables: [
            { type: 'round_marble', chairs: 4, umbrella: 'cream' },
            { type: 'bistro', chairs: 2, position: 'street_edge' }
          ],
          planters: ['geraniums', 'basil', 'rosemary']
        },
        
        bar: {
          type: 'marble_counter',
          position: { x: 0, y: 1, z: -4 },
          equipment: [
            { name: 'la_marzocco_espresso', model: 'vintage', polished: true },
            { name: 'grinder', beans: 'fresh_roasted' },
            { name: 'cups_display', type: 'ceramic', pattern: 'traditional' }
          ]
        },
        
        pastriesDisplay: {
          type: 'glass_case',
          items: [
            { name: 'cornetti', count: 20, filling: ['vuoto', 'crema', 'cioccolato'] },
            { name: 'tiramisù', portions: 8 },
            { name: 'cannoli_siciliani', count: 12 },
            { name: 'panna_cotta', count: 6 },
            { name: 'biscotti', varieties: ['mandorla', 'cioccolato'] }
          ]
        },
        
        decorations: [
          { type: 'vintage_movie_posters', films: ['la_dolce_vita', 'roma'], framed: true, condition: 'aged' },
          { type: 'hanging_plants', type: 'ivy_and_flowers', arrangement: 'cascading' },
          { type: 'roman_artifacts', displayed: true, types: ['pottery_shards', 'coins', 'fragments'] },
          { type: 'chalkboard_menu', handwritten: true, style: 'elegant_cursive' },
          { type: 'wine_bottles_display', varieties: ['chianti', 'prosecco', 'barolo'], arrangement: 'rustic' },
          { type: 'fresh_flowers', type: 'sunflowers', vase: 'terracotta' },
          { type: 'vintage_photos', subjects: ['trastevere_old', 'family_café'], frames: 'ornate' }
        ],
        
        architectural: {
          floor: { type: 'terracotta_tiles', pattern: 'traditional_roman', condition: 'worn_smooth' },
          ceiling: { type: 'wooden_beams', style: 'exposed', wood: 'dark_oak' },
          walls: { type: 'ochre_plaster', color: 'warm_yellow', texture: 'hand_applied' },
          windows: { type: 'arched', style: 'roman', shutters: 'green_wooden' },
          door: { type: 'heavy_wood', style: 'traditional_italian', handle: 'wrought_iron' },
          columns: { type: 'stone', style: 'roman_inspired', decorative: true }
        },
        
        exterior: {
          view: 'trastevere_plaza',
          elements: ['cobblestone_piazza', 'ancient_fountain', 'ivy_covered_walls'],
          activity: ['locals_drinking_coffee', 'tourists_photographing', 'vespas_parking'],
          skyline: 'rome_domes',
          atmosphere: 'golden_hour_magic'
        }
      },
      
      sounds: {
        ambient: [
          { name: 'vespa_passing', volume: 0.2, trigger: 'random', frequency: 45000 },
          { name: 'fountain_water', volume: 0.25, loop: true },
          { name: 'italian_conversation', volume: 0.3, loop: true }
        ],
        shop: [
          { name: 'espresso_machine', volume: 0.4, trigger: 'order' },
          { name: 'cup_on_saucer', volume: 0.3, trigger: 'serving' }
        ],
        music: {
          track: 'italian_classics_instrumental',
          artist: 'Roma Serenata',
          volume: 0.15,
          style: 'romantic Italian melodies'
        }
      },
      
      lighting: {
        primary: { type: 'golden_hour', color: '#FFD700', intensity: 0.8 },
        secondary: { type: 'string_lights', color: '#FFF5E1', intensity: 0.3 },
        effects: ['long_shadows', 'warm_glow_on_walls']
      }
    },
    
    character: {
      name: 'Marco Benedetti',
      role: 'Barista & Art Lover',
      age: 35,
      emoji: '☕',
      
      appearance: {
        height: 'medium',
        build: 'athletic',
        hair: { color: 'dark_brown', style: 'styled_back', touch: 'product' },
        eyes: { color: 'warm_brown', expression: 'animated_and_friendly' },
        outfit: {
          top: 'crisp_white_shirt',
          bottom: 'tailored_trousers',
          accessories: ['leather_watch', 'simple_chain'],
          footwear: 'polished_loafers'
        }
      },
      
      personality: {
        traits: ['animated', 'artistic', 'passionate', 'romantic', 'proud'],
        interests: ['art_history', 'coffee', 'roman_culture', 'football'],
        quirks: ['gestures_constantly', 'quotes_poetry', 'coffee_perfectionist'],
        backstory: `Studied art history at La Sapienza before taking over his grandfather's café. 
          Sees making coffee as an art form. Dreams of opening a gallery. Knows every 
          ancient ruin in Rome by heart.`
      },
      
      voice: {
        voiceId: 'IKne3meq5aSn9XLyUdCD', // Italian male
        style: 'animated_and_warm',
        accent: 'Roman',
        speed: 1.1,
        pitch: 1.0,
        expressionTags: {
          greeting: '[enthusiastically]',
          teaching: '[passionately]',
          correcting: '[warmly]',
          praising: '[delighted]'
        }
      }
    },
    
    difficultyScaling: {
      level1: { 
        english: 85, target: 15,
        grammar: 'basic greetings',
        instruction: 'Speak mostly English with Italian words like "buongiorno", "caffè", "grazie". Always translate.',
        example: 'Buongiorno! That means "good day"! Welcome to my little café. Un caffè?'
      },
      level2: { 
        english: 65, target: 35,
        grammar: 'ordering coffee',
        instruction: 'Use Italian for coffee and food terms. Explain Italian coffee culture.',
        example: 'Would you like un espresso? In Italia, we drink it standing at the bar - al banco!'
      },
      level3: { 
        english: 45, target: 55,
        grammar: 'gendered nouns',
        instruction: 'Speak half Italian. Explain il/la naturally.',
        example: 'Il caffè è pronto! La tazza - the cup - is beautiful, no? È italiana!'
      },
      level4: { 
        english: 20, target: 80,
        grammar: 'passato prossimo',
        instruction: 'Speak primarily Italian. Use English for complex history/culture.',
        example: 'Oggi ho fatto un caffè perfetto. La nonna mi ha insegnato i segreti.'
      },
      level5: { 
        english: 5, target: 95,
        grammar: 'natural conversation',
        instruction: 'Speak natural Italian with Roman expressions.',
        example: 'Ma dai! Il tuo italiano è bellissimo! Racconta, cosa hai visto oggi a Roma?'
      }
    },
    
    lessonPlan: {
      unit1: {
        title: 'Benvenuto! - Welcome to Rome',
        objectives: ['greetings', 'ordering_coffee', 'basic_politeness'],
        scenarios: [
          { name: 'Entering Café', phrases: ['Buongiorno!', 'Buonasera', 'Un tavolo, per favore'] },
          { name: 'Ordering Coffee', phrases: ['Un caffè, per favore', 'Un cappuccino', 'Al banco o al tavolo?'] },
          { name: 'Appreciating', phrases: ['Che bello!', 'Delizioso!', 'Grazie mille'] }
        ],
        vocabulary: [
          { word: 'caffè', translation: 'coffee', pronunciation: 'kaf-FEH' },
          { word: 'cornetto', translation: 'croissant', pronunciation: 'kor-NET-toh' },
          { word: 'grazie', translation: 'thank you', pronunciation: 'GRAH-tsee-eh' },
          { word: 'per favore', translation: 'please', pronunciation: 'per fa-VOR-eh' },
          { word: 'bello', translation: 'beautiful', pronunciation: 'BEL-loh' }
        ],
        culturalNotes: [
          'Italians drink espresso standing at the bar',
          'Cappuccino is only for breakfast',
          'Coffee culture is a social ritual',
          'Always greet when entering a café',
          'Rome has layers of history everywhere'
        ]
      },
      unit2: {
        title: 'La Dolce Vita - The Sweet Life',
        objectives: ['food_vocabulary', 'expressing_pleasure', 'cultural_terms'],
        scenarios: [
          { name: 'Enjoying Food', phrases: ['Che buono!', 'Mi piace molto', 'È squisito'] }
        ]
      },
      unit3: {
        title: 'Arte e Storia - Art & History',
        objectives: ['art_vocabulary', 'historical_terms', 'expressing_wonder'],
        scenarios: [
          { name: 'Discussing Art', phrases: ['Che capolavoro!', 'È magnifico', 'La storia di Roma'] }
        ]
      }
    },
    
    falseFriends: [
      { word: 'camera', looksLike: 'camera', actualMeaning: 'room', warning: 'Camera (device) is "macchina fotografica"' },
      { word: 'pepperoni', looksLike: 'pepperoni', actualMeaning: 'peppers', warning: 'Salami is "salame piccante"' },
      { word: 'caldo', looksLike: 'cold', actualMeaning: 'hot', warning: 'Cold is "freddo"!' }
    ],
    
    startingPhrases: [
      { phrase: 'Buongiorno!', translation: 'Good day!', pronunciation: 'bwon-JORN-oh' },
      { phrase: 'Un caffè, per favore', translation: 'A coffee, please', pronunciation: 'oon kaf-FEH, per fa-VOR-eh' },
      { phrase: 'Che bello!', translation: 'How beautiful!', pronunciation: 'keh BEL-loh' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MANDARIN - Beijing Tea House
  // ═══════════════════════════════════════════════════════════════════════════
  mandarin: {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    
    scene: {
      name: 'Dragon Well Tea House',
      location: 'Houhai, Beijing',
      timeOfDay: 'misty morning',
      weather: 'light mist over the lake',
      
      description: `A traditional Beijing tea house overlooking Houhai Lake. Red lanterns sway 
        gently. Through the carved wooden windows, you see willows trailing into the misty water. 
        The air is fragrant with jasmine tea. Ancient calligraphy adorns the walls. A guzheng 
        plays softly in the background.`,
      
      props: {
        teaRoom: {
          type: 'traditional_chinese',
          furniture: [
            { name: 'rosewood_table', style: 'qing_dynasty', inlay: 'mother_of_pearl' },
            { name: 'carved_chairs', style: 'ming', cushions: 'silk_embroidered' }
          ],
          teaSet: [
            { name: 'yixing_teapot', clay: 'purple_sand', age: 'vintage' },
            { name: 'gongfu_cups', porcelain: 'blue_white', count: 6 },
            { name: 'tea_boat', wood: 'bamboo' },
            { name: 'tea_pets', figures: ['dragon', 'toad', 'elephant'] }
          ]
        },
        
        decorations: [
          { type: 'red_lanterns', count: 8, size: 'large' },
          { type: 'calligraphy_scrolls', content: ['tea_poetry', 'proverbs'] },
          { type: 'porcelain_vases', dynasty: 'ming_reproduction' },
          { type: 'bonsai_trees', varieties: ['pine', 'maple'] },
          { type: 'paper_windows', patterns: 'geometric_traditional' }
        ],
        
        exterior: {
          view: 'houhai_lake',
          elements: ['willow_trees', 'lotus_flowers', 'stone_bridge'],
          boats: 'traditional_rowing'
        }
      },
      
      sounds: {
        ambient: [
          { name: 'water_lapping', volume: 0.2, loop: true },
          { name: 'bird_songs', volume: 0.15, loop: true }
        ],
        music: {
          track: 'guzheng_traditional',
          artist: 'Beijing Serenity',
          volume: 0.18,
          style: 'classical Chinese strings'
        }
      },
      
      lighting: {
        primary: { type: 'diffused_morning', color: '#FFF8DC', intensity: 0.5 },
        accent: [
          { type: 'lantern_glow', color: '#FF4500', intensity: 0.3 }
        ],
        effects: ['mist_diffusion', 'soft_shadows']
      }
    },
    
    character: {
      name: 'Mei Lin Wang',
      role: '茶艺师 (Tea Master)',
      age: 50,
      emoji: '🍵',
      
      appearance: {
        height: 'medium',
        build: 'graceful',
        hair: { color: 'silver_black', style: 'traditional_bun', accessories: ['jade_pin'] },
        eyes: { color: 'dark_brown', expression: 'wise_and_kind' },
        outfit: {
          top: 'silk_qipao',
          color: 'deep_red_with_gold',
          accessories: ['jade_bracelet', 'silk_fan'],
          footwear: 'embroidered_slippers'
        }
      },
      
      personality: {
        traits: ['wise', 'patient', 'philosophical', 'warm', 'storyteller'],
        interests: ['tea_culture', 'chinese_history', 'calligraphy', 'tai_chi'],
        quirks: ['speaks_in_proverbs', 'tea_as_life_metaphor', 'gentle_humor'],
        backstory: `Learned tea ceremony from her grandmother, who learned from palace tea masters. 
          Has spent her life studying the connection between tea, philosophy, and health. 
          Believes every cup of tea tells a story.`
      },
      
      voice: {
        voiceId: 'jsCqWAovK2LkecY7zXl4', // Chinese female
        style: 'gentle_and_wise',
        accent: 'Beijing_Mandarin',
        speed: 0.9,
        pitch: 1.05,
        expressionTags: {
          greeting: '[warmly]',
          teaching: '[wisely]',
          correcting: '[gently]',
          praising: '[encouragingly]'
        }
      }
    },
    
    difficultyScaling: {
      level1: { 
        english: 90, target: 10,
        grammar: 'tones introduction',
        instruction: 'Speak mostly English. Introduce basic Chinese words with pinyin and tones. "Nǐ hǎo", "xièxie", "chá".',
        example: 'Welcome! Or in Chinese, 欢迎 (huānyíng)! Would you like some 茶 (chá) - tea?'
      },
      level2: { 
        english: 75, target: 25,
        grammar: 'basic characters',
        instruction: 'Use more Chinese for tea and hospitality terms. Explain tones clearly.',
        example: 'This is 龙井茶 (Lóngjǐng chá) - Dragon Well tea. 好喝! (Hǎo hē!) - Delicious to drink!'
      },
      level3: { 
        english: 55, target: 45,
        grammar: 'measure words',
        instruction: 'Speak half Chinese. Introduce measure words naturally.',
        example: '请喝一杯茶。Please drink a cup of tea. 杯 (bēi) is the measure word for cups.'
      },
      level4: { 
        english: 30, target: 70,
        grammar: 'sentence structure',
        instruction: 'Speak primarily Chinese. Explain sentence structure as needed.',
        example: '这个茶很特别。今天天气很好，是喝茶的好日子。你觉得怎么样？'
      },
      level5: { 
        english: 10, target: 90,
        grammar: 'cultural expressions',
        instruction: 'Speak natural Chinese with idioms and cultural expressions.',
        example: '茶如人生，先苦后甜。慢慢品，不要急。你的中文进步很大啊！'
      }
    },
    
    falseFriends: [
      { word: '手纸', looksLike: 'hand paper', actualMeaning: 'toilet paper', warning: 'Not for writing!' },
      { word: '小心', looksLike: 'small heart', actualMeaning: 'be careful', warning: 'Warning sign, not affection' }
    ],
    
    startingPhrases: [
      { phrase: '你好', translation: 'Hello', pronunciation: 'nǐ hǎo' },
      { phrase: '谢谢', translation: 'Thank you', pronunciation: 'xiè xiè' },
      { phrase: '喝茶', translation: 'Drink tea', pronunciation: 'hē chá' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // POLISH - Warsaw Old Town
  // ═══════════════════════════════════════════════════════════════════════════
  polish: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    
    scene: {
      name: 'Pierogi & Memories',
      location: 'Stare Miasto, Warsaw',
      timeOfDay: 'afternoon',
      weather: 'crisp autumn day',
      
      description: `A cozy milk bar (bar mleczny) in Warsaw's reconstructed Old Town. The space 
        honors post-war Polish tradition with simple wooden tables and the comforting aroma of 
        home cooking. Through the window, colorful townhouses rebuilt from rubble line the square. 
        Steam rises from bowls of barszcz and plates of golden pierogi.`,
      
      props: {
        servingCounter: {
          type: 'traditional_milk_bar',
          position: { x: 0, y: 1, z: -4 },
          dishes: [
            { name: 'pierogi', varieties: ['ruskie', 'z_mięsem', 'z_kapustą', 'słodkie'] },
            { name: 'barszcz_czerwony', with: 'uszka' },
            { name: 'żurek', with: 'egg_and_kielbasa' },
            { name: 'kotlet_schabowy', with: 'potatoes_and_cabbage' },
            { name: 'placki_ziemniaczane', with: 'sour_cream' }
          ]
        },
        
        dining: {
          tables: [
            { type: 'simple_wooden', seats: 4, cloth: 'checkered_red_white' },
            { type: 'bench_seating', communal: true }
          ],
          condiments: ['sour_cream', 'fried_onions', 'butter', 'sugar']
        },
        
        decorations: [
          { type: 'vintage_posters', era: 'PRL', subject: 'polish_culture' },
          { type: 'amber_jewelry_display', style: 'baltic' },
          { type: 'folk_art', type: 'wycinanki', region: 'Łowicz' },
          { type: 'photos', subject: 'old_warsaw', framed: true },
          { type: 'dried_flowers', type: 'wildflowers' }
        ],
        
        exterior: {
          view: 'old_town_square',
          elements: ['colorful_townhouses', 'mermaid_statue', 'cobblestones', 'reconstructed_facades'],
          activity: ['tourists', 'street_artists', 'cafe_terraces', 'local_families'],
          skyline: 'warsaw_skyline',
          atmosphere: 'post_war_resilience'
        },
        
        architectural: {
          floor: { type: 'wooden_planks', condition: 'well_worn', pattern: 'traditional' },
          ceiling: { type: 'exposed_beams', wood: 'dark_pine', height: 3.2 },
          walls: { type: 'plaster', color: 'warm_cream', texture: 'hand_finished' },
          windows: { type: 'tall', style: 'traditional_polish', frames: 'dark_wood' },
          door: { type: 'heavy_wood', style: 'traditional', handle: 'brass' },
          details: ['checkered_tablecloths', 'vintage_lamps', 'family_photos']
        }
      },
      
      sounds: {
        ambient: [
          { name: 'kitchen_sounds', volume: 0.2, loop: true },
          { name: 'polish_conversation', volume: 0.25, loop: true },
          { name: 'church_bells', volume: 0.15, interval: 3600000 }
        ],
        music: {
          track: 'polish_folk_modern',
          artist: 'Warsaw Echoes',
          volume: 0.15,
          style: 'modern Polish folk fusion'
        }
      },
      
      lighting: {
        primary: { type: 'natural', color: '#FFF5E6', intensity: 0.7 },
        secondary: { type: 'warm', color: '#FFE4B5', intensity: 0.3 }
      }
    },
    
    character: {
      name: 'Kasia Kowalska',
      role: 'Pani Kucharka (Lady Cook)',
      age: 55,
      emoji: '🥟',
      
      appearance: {
        height: 'medium',
        build: 'warm_and_sturdy',
        hair: { color: 'ash_blonde', style: 'neat_bun', accessories: ['hair_net'] },
        eyes: { color: 'blue', expression: 'motherly_and_proud' },
        outfit: {
          top: 'white_blouse',
          apron: 'floral_pattern',
          accessories: ['amber_necklace'],
          footwear: 'practical_shoes'
        }
      },
      
      personality: {
        traits: ['motherly', 'proud', 'warm', 'resilient', 'storyteller'],
        interests: ['polish_history', 'family_recipes', 'folk_traditions', 'gardening'],
        quirks: ['feeds_everyone_extra', 'history_in_every_dish', 'gentle_corrections'],
        backstory: `Third-generation Warsaw resident. Her grandmother survived the war and helped 
          rebuild the Old Town. Every recipe carries family memory. Believes food connects 
          generations and teaches culture better than any book.`
      },
      
      voice: {
        voiceId: 'onwK4e9ZLuTAKqWW03F9', // Polish female
        style: 'warm_and_nurturing',
        accent: 'Warsaw_Polish',
        speed: 0.95,
        pitch: 1.0,
        expressionTags: {
          greeting: '[warmly]',
          teaching: '[patiently]',
          correcting: '[gently]',
          praising: '[proudly]'
        }
      }
    },
    
    difficultyScaling: {
      level1: { 
        english: 90, target: 10,
        grammar: 'basic greetings',
        instruction: 'Speak mostly English. Introduce basic Polish words with pronunciation. "Cześć", "dziękuję", "pierogi".',
        example: 'Welcome! Or in Polish, Cześć (cheshch)! Would you like some pierogi (pyeh-RO-gee)?'
      },
      level2: { 
        english: 75, target: 25,
        grammar: 'food vocabulary',
        instruction: 'Use more Polish for food and hospitality terms. Explain pronunciation clearly.',
        example: 'This is pierogi ruskie (pyeh-RO-gee ROOS-kyeh) - with potatoes and cheese. Smacznego (smach-NEH-go)! That means enjoy your meal!'
      },
      level3: { 
        english: 55, target: 45,
        grammar: 'noun cases',
        instruction: 'Speak half Polish. Introduce cases naturally through food ordering.',
        example: 'Poproszę pierogi (po-PRO-sheh pyeh-RO-gee). Please, I would like pierogi. Dziękuję (jen-KOO-yeh) means thank you.'
      },
      level4: { 
        english: 30, target: 70,
        grammar: 'verb conjugation',
        instruction: 'Speak primarily Polish. Explain sentence structure as needed.',
        example: 'Dzisiaj zrobiłam pierogi (djee-SHAY zro-BEE-wam pyeh-RO-gee). Today I made pierogi. Są świeże i pyszne (sohn SHFYEH-zheh ee PISH-neh). They are fresh and delicious.'
      },
      level5: { 
        english: 10, target: 90,
        grammar: 'cultural expressions',
        instruction: 'Speak natural Polish with idioms and cultural expressions.',
        example: 'Ale fajnie mówisz po polsku (AH-leh FAY-nyeh MOO-vish po POL-skoo)! How cool that you speak Polish! Opowiedz mi o sobie (o-PO-vyech mee o SO-byeh). Tell me about yourself.'
      }
    },
    
    lessonPlan: {
      unit1: {
        title: 'Witaj! - Welcome to Warsaw',
        objectives: ['greetings', 'ordering_food', 'basic_politeness'],
        scenarios: [
          { name: 'Entering Milk Bar', phrases: ['Dzień dobry', 'Cześć', 'Czy jest wolne miejsce?'] },
          { name: 'Ordering Food', phrases: ['Poproszę pierogi', 'Co polecasz?', 'Ile to kosztuje?'] },
          { name: 'Thanking', phrases: ['Dziękuję', 'Bardzo dziękuję', 'Smacznego!'] }
        ],
        vocabulary: [
          { word: 'pierogi', translation: 'dumplings', pronunciation: 'pyeh-RO-gee' },
          { word: 'barszcz', translation: 'beet soup', pronunciation: 'barshch' },
          { word: 'dziękuję', translation: 'thank you', pronunciation: 'jen-KOO-yeh' },
          { word: 'proszę', translation: 'please', pronunciation: 'PRO-sheh' },
          { word: 'smacznego', translation: 'enjoy your meal', pronunciation: 'smach-NEH-go' }
        ],
        culturalNotes: [
          'Milk bars (bar mleczny) are traditional Polish cafeterias',
          'Pierogi are Poland\'s national dish',
          'Always say "Smacznego" before eating',
          'Warsaw Old Town was rebuilt after WWII',
          'Polish food connects generations and history'
        ]
      },
      unit2: {
        title: 'Polskie Jedzenie - Polish Food',
        objectives: ['food_vocabulary', 'describing_taste', 'ordering_drinks'],
        scenarios: [
          { name: 'Describing Food', phrases: ['Pyszne!', 'Bardzo dobre', 'Smakuje wyśmienicie'] }
        ]
      },
      unit3: {
        title: 'Historia i Tradycja - History & Tradition',
        objectives: ['historical_vocabulary', 'family_terms', 'cultural_expressions'],
        scenarios: [
          { name: 'Discussing History', phrases: ['To jest historia', 'Tradycja rodzinna', 'Pamięć'] }
        ]
      }
    },
    
    falseFriends: [
      { word: 'aktualnie', looksLike: 'actually', actualMeaning: 'currently', warning: 'Use "właściwie" for actually' },
      { word: 'sympatyczny', looksLike: 'sympathetic', actualMeaning: 'nice/likeable', warning: 'Sympathetic is "współczujący"' }
    ],
    
    startingPhrases: [
      { phrase: 'Cześć!', translation: 'Hi!', pronunciation: 'cheshch' },
      { phrase: 'Poproszę pierogi', translation: 'I\'d like pierogi please', pronunciation: 'po-PRO-sheh pyeh-RO-gee' },
      { phrase: 'Dziękuję', translation: 'Thank you', pronunciation: 'jen-KOO-yeh' },
      { phrase: 'Smacznego!', translation: 'Enjoy your meal!', pronunciation: 'smach-NEH-go' }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const getLanguageConfig = (code) => LANGUAGE_CONFIG[code] || null;

export const getAvailableLanguages = () => {
  return Object.entries(LANGUAGE_CONFIG).map(([key, config]) => ({
    code: key,
    name: config.name,
    nativeName: config.nativeName,
    flag: config.flag,
    scene: config.scene.name,
    character: config.character.name
  }));
};

export const getDifficultyInstruction = (langCode, level) => {
  const config = LANGUAGE_CONFIG[langCode];
  if (!config) return '';
  const scale = config.difficultyScaling[`level${level}`];
  return scale ? scale.instruction : config.difficultyScaling.level1.instruction;
};

export const getCharacterVoice = (langCode) => {
  const config = LANGUAGE_CONFIG[langCode];
  return config ? config.character.voice : null;
};

export default LANGUAGE_CONFIG;
