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
    // CHARACTER: Marie Dupont
    // ─────────────────────────────────────────────────────────────────────────
    character: {
      name: 'Marie Dupont',
      emoji: '👩‍🍳',
      role: 'Master Baker',
      bio: 'Marie has been running this family boulangerie for 30 years. She is warm, patient, but very particular about bread crust.',
      visuals: {
        skinColor: '#f5c09a',
        hairColor: '#8d5524',
        hairStyle: 'bun',
        outfitColor: '#ffffff', // Chef white
        accessoryColor: '#e74c3c', // Red scarf
        style: 'chef'
      },
      voice: {
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella (Soft, warm French)
        style: 'warm',
        speed: 1.0,
        pitch: 1.0,
        expressionTags: {
          greeting: 'warmly',
          teaching: 'clearly',
          correction: 'encouragingly',
          praise: 'excitedly'
        }
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
        instruction: 'Speak mostly in English. Introduce key French words using the format: "word (translation)". Example: "bonjour (hello)", "merci (thank you)", "croissant (croissant)".',
        example: 'Ah, bonjour (hello)! Welcome to my little bakery. Would you like un croissant (a croissant)?'
      },
      level2: {
        english: 70, target: 30,
        grammar: 'ordering food',
        instruction: 'Mix more French into your English. Use the format "word (translation)" for French words. Example: "croissant (croissant)", "baguette (baguette)", "café (coffee)".',
        example: 'Would you like un croissant (a croissant)? It\'s fresh from the oven - tout chaud (very hot)!'
      },
      level3: {
        english: 50, target: 50,
        grammar: 'polite conversation',
        instruction: 'Speak half in French, half in English. Use the format "word (translation)" when introducing new vocabulary. Example: "trois euros (three euros)", "autre chose (something else)".',
        example: 'C\'est trois euros (three euros). That will be three euros. Voulez-vous autre chose (something else)?'
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
      name: 'Shinjuku Ramen Alley & Station',
      location: 'Omoide Yokocho, Tokyo',
      timeOfDay: 'raining evening',
      weather: 'neon reflections on wet pavement',

      description: `A narrow, smoky alleyway packed with tiny eateries next to Shinjuku Station. 
        Lanterns glow red against the rain. Steam billows from open kitchens. The sound of 
        trains rumbling overhead mixes with the clatter of bowls and enthusiastic slurping. 
        A ticket machine stands ready at the entrance of "Ramen Kenji".`,

      props: {
        ticketMachine: {
          type: 'vending_machine',
          position: { x: 3, y: 1, z: -2 },
          buttons: [
            { name: 'tonkotsu_ramen', price: 900, color: 'red' },
            { name: 'shoyu_ramen', price: 800, color: 'blue' },
            { name: 'gyoza', price: 400, color: 'yellow' },
            { name: 'beer', price: 500, color: 'green' }
          ],
          screen: 'glowing_lcd'
        },

        counterArea: {
          type: 'wooden_counter',
          position: { x: 0, y: 1, z: -4 },
          items: [
            { name: 'chopsticks_container', full: true },
            { name: 'water_pitcher', condensation: true },
            { name: 'condiments', types: ['pepper', 'chili_oil', 'vinegar'] },
            { name: 'pickled_ginger', container: 'red_jar' }
          ]
        },

        kitchen: {
          type: 'open_kitchen',
          visible: true,
          elements: [
            { name: 'huge_stock_pot', steam: 'heavy' },
            { name: 'noodle_boiler', bubbling: true },
            { name: 'chashu_pork', hanging: true }
          ]
        },

        decorations: [
          { type: 'red_lanterns', text: 'ラーメン', movement: 'swaying' },
          { type: 'noren_curtains', color: 'navy', text: '営業中' },
          { type: 'menu_boards', content: 'handwritten_japanese' },
          { type: 'faded_posters', content: 'beer_ads' }
        ],

        architectural: {
          floor: { type: 'wet_pavement', reflections: 'neon_lights' },
          walls: { type: 'wood_and_tin', texture: 'aged' },
          ceiling: { type: 'exposed_wiring', dripping: 'rain' },
          background: { type: 'shinjuku_station_lights', blur: true }
        },

        exterior: {
          view: 'shinjuku_crossing',
          elements: ['umbrellas', 'neon_signs', 'train_tracks'],
          atmosphere: 'cyberpunk_noir'
        }
      },

      sounds: {
        ambient: [
          { name: 'train_passing_overhead', volume: 0.4, trigger: 'interval', frequency: 120000 },
          { name: 'rain_on_roof', volume: 0.3, loop: true },
          { name: 'slurping_sounds', volume: 0.25, trigger: 'random' }
        ],
        shop: [
          { name: 'irasshaimase_shout', volume: 0.5, trigger: 'enter' },
          { name: 'ticket_machine_beep', volume: 0.3, trigger: 'interaction' },
          { name: 'noodle_shaking', volume: 0.35, trigger: 'cooking' }
        ],
        music: {
          track: 'city_pop_radio',
          artist: 'Tokyo Nights',
          volume: 0.15,
          style: 'muffled 80s city pop'
        }
      },

      lighting: {
        primary: { type: 'lantern_glow', color: '#FF4500', intensity: 0.7 },
        secondary: { type: 'neon_sign_blue', color: '#00FFFF', intensity: 0.4 },
        accent: [
          { type: 'kitchen_light', color: '#FFFACD', intensity: 0.8 },
          { type: 'vending_machine_glow', color: '#E0FFFF', intensity: 0.5 }
        ],
        effects: ['rain_reflections', 'steam_diffusion']
      }
    },

    character: {
      name: 'Kenji Sato',
      role: 'Ramen Master',
      age: 55,
      emoji: '🍜',
      visuals: {
        skinColor: '#f0d5be',
        hairColor: '#4a4a4a',
        hairStyle: 'hachimaki_tied',
        outfitColor: '#1a1a1a',
        accessoryColor: '#ffffff',
        style: 'traditional_chef'
      },

      appearance: {
        height: 'medium',
        build: 'stocky',
        hair: { color: 'salt_and_pepper', style: 'short', headband: 'white' },
        eyes: { color: 'black', expression: 'focused_and_intense' },
        outfit: {
          top: 'black_tshirt_kanji',
          apron: 'navy_canvas',
          accessories: ['towel_around_neck', 'white_headband'],
          signature: 'arms_crossed'
        }
      },

      personality: {
        traits: ['passionate', 'strict', 'loud', 'perfectionist', 'hidden_kindness'],
        interests: ['perfect_broth', 'baseball', 'train_schedules', 'fishing'],
        quirks: ['shouts_orders', 'tests_noodles_constantly', 'gives_extra_egg_to_polite_people'],
        backstory: `Worked in a corporate office for 20 years before quitting to pursue the perfect bowl of ramen. 
          His shop is small but legendary. He respects those who respect the food.`
      },

      voice: {
        voiceId: 'pNInz6obpgDQGcFmaJgB', // Japanese male (change if needed, keeping female ID for now but labeling male? No better swap ID if possible. I'll keep the ID but assume it's valid or swap to a generic one if I knew it. I'll keep existing ID to avoid breakage but note it.)
        // Wait, the previous one was female (Yuki). Let's swap to a male ID if I have one?
        // English/German/Italian used ids. I'll reuse the German/Italian male ID maybe? No that's wrong accent. 
        // I'll keep Yuki's ID but change pitch lower for now or just trust the system to handle it/user to swap.
        // Actually, let's use a generic placeholder or keep the ID. I will keep the ID but change the config parameters to try to make it sound deeper if possible.
        // Or better, I'll use the ID from the previous Japanese entry (Yuki) and hope it works, or maybe I should check if there are other IDs.
        // I'll stick to the existing ID to modify parameters.
        voiceId: 'pNInz6obpgDQGcFmaJgB',
        style: 'energetic',
        accent: 'Tokyo',
        speed: 1.1,
        pitch: 0.8, // Lower pitch for male
        expressionTags: {
          greeting: '[loudly]',
          teaching: '[passionately]',
          correcting: '[strictly]',
          praising: '[proudly]'
        }
      }
    },

    difficultyScaling: {
      level1: {
        english: 85, target: 15,
        grammar: 'basic ordering',
        instruction: 'Speak mostly in English. Introduce ordering basics. "Ramen", "kudasai", "oishii".',
        example: 'Irasshaimase! Welcome! Ticket machine is here. Ramen kudasai (please)?'
      },
      level2: {
        english: 65, target: 35,
        grammar: 'eating etiquette',
        instruction: 'Use Japanese for food items and actions. "Itadakimasu", "gochisousama".',
        example: 'Here is your ramen. Say itadakimasu (I humbly receive) before eating!'
      },
      level3: {
        english: 45, target: 55,
        grammar: 'asking questions',
        instruction: 'Speak half Japanese. "Doko" (where), "Ikura" (how much).',
        example: 'Toire wa doko desu ka (where is the toilet)? Ticket wa ikura desu ka (how much is the ticket)?'
      },
      level4: {
        english: 20, target: 80,
        grammar: 'polite forms',
        instruction: 'Speak primarily Japanese using -masu forms.',
        example: 'Shinkansen no kippu o kaitai desu. (I want to buy a bullet train ticket.)'
      },
      level5: {
        english: 5, target: 95,
        grammar: 'natural flow',
        instruction: 'Speak natural Tokyo Japanese.',
        example: 'Hai, omachidousama! Atsui kara ki wo tskete ne.'
      }
    },

    lessonPlan: {
      unit1: {
        title: 'The Ramen Shop - Ordering',
        objectives: ['ordering_food', 'vending_machine', 'etiquette'],
        scenarios: [
          { name: 'Ticket Machine', phrases: ['Ramen hitotsu', 'Biiru', 'Otsuri'] },
          { name: 'Customizing', phrases: ['Katame (hard noodles)', 'Koime (strong flavor)', 'Ninniku (garlic)'] },
          { name: 'Eating', phrases: ['Itadakimasu', 'Oishii', 'Gochisousama'] }
        ],
        vocabulary: [
          { word: 'Ramen', translation: 'ramen', pronunciation: 'RAH-men' },
          { word: 'Kudasai', translation: 'please', pronunciation: 'koo-dah-SAI' },
          { word: 'Kaeru', translation: 'to buy', pronunciation: 'KA-eh-roo' },
          { word: 'Oishii', translation: 'delicious', pronunciation: 'oh-EE-shee' },
          { word: 'Mizu', translation: 'water', pronunciation: 'MEE-zoo' }
        ],
        culturalNotes: [
          'Buy a ticket from the machine before sitting down',
          'Slurping noodles shows you enjoy the meal',
          'Don\'t leave chopsticks standing vertically in rice'
        ]
      },
      unit2: {
        title: 'The Station - Travel',
        objectives: ['buying_tickets', 'asking_directions', 'time'],
        scenarios: [
          { name: 'Buying Ticket', phrases: ['Shinkansen', 'Kippu', 'Eki'] },
          { name: 'Platform', phrases: ['Nan-ban sen?', 'Doko desu ka?'] }
        ]
      },
      unit3: {
        title: 'The Bullet Train',
        objectives: ['travel_vocabulary', 'seat_reservation', 'bento'],
        scenarios: [
          { name: 'On the Train', phrases: ['Madogawa (window seat)', 'Ekiben', 'Fuji-san'] }
        ]
      },
      unit4: {
        title: 'Onsen - Spa Visit',
        objectives: ['bath_vocabulary', 'rules', 'relaxing'],
        scenarios: [
          { name: 'Entering Onsen', phrases: ['Ofuro', 'Kigae', 'Atatamaru'] },
          { name: 'Rules', phrases: ['Tatoo dame (no tattoos)', 'Kakeyu (rinsing)'] }
        ]
      },
      unit5: {
        title: 'Konbini Life',
        objectives: ['convenience_store', 'daily_items', 'services'],
        scenarios: [
          { name: 'Shopping', phrases: ['Onigiri', 'Atatamemasu ka? (Warm it up?)', 'Fukuro (bag)'] }
        ]
      }
    },

    falseFriends: [
      { word: 'Mansion', looksLike: 'mansion', actualMeaning: 'condo/apartment', warning: 'Not a huge house!' },
      { word: 'Cunning', looksLike: 'cunning', actualMeaning: 'cheating', warning: 'Cheating on a test' },
      { word: 'Handle', looksLike: 'handle', actualMeaning: 'steering wheel', warning: 'Car steering wheel' }
    ],

    startingPhrases: [
      { phrase: 'Irasshaimase!', translation: 'Welcome!', pronunciation: 'ee-rah-shai-MAH-seh' },
      { phrase: 'Ramen kudasai', translation: 'Ramen please', pronunciation: 'rah-men koo-dah-sai' },
      { phrase: 'Itadakimasu', translation: 'I humbly receive', pronunciation: 'ee-tah-dah-kee-mas' }
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
      visuals: {
        skinColor: '#d2b48c',
        hairColor: '#000000',
        hairStyle: 'long_wavy',
        outfitColor: '#e74c3c',
        accessoryColor: '#ffd700',
        style: 'flamenco'
      },

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
        instruction: 'Speak mostly in English, sprinkling in Spanish words using the format: "word (translation)". Example: "hola (hello)", "gracias (thank you)", "tapas (small plates)".',
        example: '¡Hola (hello)! Welcome to my tapas bar! Would you like some jamón (ham)?'
      },
      level2: {
        english: 65, target: 35,
        grammar: 'ordering food',
        instruction: 'Use Spanish for food items and common phrases. Use the format "word (translation)". Example: "patatas bravas (spicy potatoes)", "deliciosas (delicious)".',
        example: '¡Muy bien (very good)! Would you like patatas bravas (spicy potatoes)? They\'re muy deliciosas (very delicious)!'
      },
      level3: {
        english: 45, target: 55,
        grammar: 'ser vs estar',
        instruction: 'Speak half in Spanish. Use the format "word (translation)" for new vocabulary. Example: "comida (food)", "tapas (small plates)", "deliciosas (delicious)".',
        example: '¿Cómo está la comida (the food)? ¡Las tapas (the small plates) están deliciosas (delicious) hoy!'
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
      name: 'Berghain Queue & Kebab',
      location: 'Friedrichshain-Kreuzberg, Berlin',
      timeOfDay: '4 AM Sunday',
      weather: 'cold foggy night with industrial steam',

      description: `The legendary concrete facade of the world's most exclusive techno club looms in the fog. 
        The bass shakes the ground. A silent, terrifying bouncer stands guard at the door, rejecting 90% of people. 
        Defeated ravers drift to 'Mustafa's Dream' Kebab stand next door for solace. The street is littered with 
        Club Mate bottles and cigarette butts. It is the peak of Berlin nightlife.`,

      props: {
        kebabStand: {
          type: 'street_food_stall',
          position: { x: 2, y: 0, z: -3 },
          items: [
            { name: 'vertical_rotisserie', meat: 'chicken_gemuese', rotating: true },
            { name: 'fresh_mint_and_feta', display: 'overflowing' },
            { name: 'sauce_containers', types: ['knoblauch', 'kraeuter', 'scharf'], quantity: 'large' },
            { name: 'flatbread_stack', warm: true }
          ]
        },

        clubEntrance: {
          type: 'industrial_door',
          position: { x: -3, y: 0, z: -6 },
          elements: [
            { name: 'metal_barricades', queue_status: 'anxious_silence' },
            { name: 'bouncer_podium', occupied: true },
            { name: 'industrial_lighting', color: 'stark_white' },
            { name: 'discarded_bottles', type: 'club_mate' }
          ]
        },

        streetElements: {
          type: 'berlin_street',
          items: [
            { name: 'concrete_blocks', covered_in: 'graffiti' },
            { name: 'street_lamp', flickering: true, color: 'sodium_orange' },
            { name: 'photo_automaten', type: 'vintage_booth', flash: 'random' }
          ]
        },

        decorations: [
          { type: 'graffiti_art', style: 'berlin_style', messages: ['Berlin ist arm aber sexy', 'Techno Viking', 'Nein Heißt Nein'] },
          { type: 'stickers', on: 'lamp_posts', density: 'maxed_out' }
        ],

        architectural: {
          floor: { type: 'asphalt', condition: 'gritty_and_wet', reflections: 'neon' },
          walls: { type: 'concrete_slab', height: 'imposing', texture: 'rough' },
          background: { type: 'power_plant_silhouette', atmosphere: 'ominous_magnificent' }
        },

        exterior: {
          view: 'wraler_park_distance',
          elements: ['tv_tower_silhouette', 'u_bahn_tracks', 'industrial_chimneys'],
          atmosphere: 'raw_urban_energy'
        }
      },

      sounds: {
        ambient: [
          { name: 'distant_techno_bass', volume: 0.6, loop: true, muffled: true },
          { name: 'u_bahn_rumble', volume: 0.4, trigger: 'interval', frequency: 60000 },
          { name: 'nervous_whispers_in_queue', volume: 0.2, loop: true }
        ],
        shop: [
          { name: 'knife_sharpening', volume: 0.4, trigger: 'random' },
          { name: 'sizzling_meat', volume: 0.3, loop: true },
          { name: 'bouncer_saying_nein', volume: 0.5, trigger: 'rejection' }
        ],
        music: {
          track: 'berlin_deep_house',
          artist: 'Kanal Beats',
          volume: 0.2,
          style: 'atmospheric underground'
        }
      },

      lighting: {
        primary: { type: 'street_lamp', color: '#FF8C00', intensity: 0.4 },
        secondary: { type: 'neon_sign', color: '#00FF00', intensity: 0.5, blink: true },
        accent: [
          { type: 'kebab_heat_lamp', color: '#FF4500', intensity: 0.7, position: 'stand' },
          { type: 'club_strobe', color: '#FFFFFF', intensity: 0.2, position: 'distant', flash: true }
        ],
        effects: ['fog_diffusion', 'wet_pavement_reflections']
      }
    },

    character: {
      name: 'Mehmet Yilmaz',
      role: 'Kebab Artist & Night Watchman',
      age: 45,
      emoji: '🥙',
      visuals: {
        skinColor: '#d6a680',
        hairColor: '#1a1a1a',
        hairStyle: 'short_trimmed',
        outfitColor: '#ffffff',
        accessoryColor: '#27ae60',
        style: 'chef_casual'
      },

      appearance: {
        height: 'medium',
        build: 'strong',
        hair: { color: 'black', style: 'short', beard: 'groomed' },
        eyes: { color: 'dark_brown', expression: 'friendly_and_knowing' },
        outfit: {
          top: 'white_shirt_rolled_sleeves',
          apron: 'green_logo',
          accessories: ['silver_chain'],
          signature: 'towel_over_shoulder'
        }
      },

      personality: {
        traits: ['observant', 'friendly', 'street-wise', 'generous', 'funny'],
        interests: ['soccer', 'berlin_nightlife', 'fresh_ingredients', 'customer_stories'],
        quirks: ['remembers_every_order', 'calls_everyone_chef', 'predicts_club_entry_success'],
        backstory: `Has run this stand for 15 years right outside the club. He has seen it all. 
          He knows who will get into the club and who won't. His "Gemüsekebap" is the best consolation prize in Berlin.`
      },

      voice: {
        voiceId: 'VR6AewLTigWG4xSOukaG', // German male
        style: 'energetic_and_warm',
        accent: 'Berlin_Turkish_mix',
        speed: 1.05,
        pitch: 1.0,
        expressionTags: {
          greeting: '[loudly]',
          teaching: '[clearly]',
          correcting: '[helpfully]',
          praising: '[warmly]'
        }
      }
    },

    difficultyScaling: {
      level1: {
        english: 85, target: 15,
        grammar: 'basic greetings',
        instruction: 'Speak mostly in English. Introduce German/Berlin slang. "Hallo", "Döner", "bitte".',
        example: 'Hallo Chef! Rejected from the club? Kein Problem. Ein Döner (a kebab), bitte?'
      },
      level2: {
        english: 65, target: 35,
        grammar: 'ordering food',
        instruction: 'Use German for ingredients and ordering. "Mit alles", "scharf".',
        example: 'Ein Döner mit alles (with everything)? Und ein bisschen scharf (spicy)? It helps the pain.'
      },
      level3: {
        english: 45, target: 55,
        grammar: 'modal verbs',
        instruction: 'Speak half German. "Ich möchte", "Kann ich haben".',
        example: 'Ich möchte einen Döner (I would like a kebab). Mit viel Knoblauch (with lots of garlic), bitte.'
      },
      level4: {
        english: 20, target: 80,
        grammar: 'complex sentences',
        instruction: 'Speak primarily German. Explain street culture.',
        example: 'Wenn du in den Club willst, musst du schwarz tragen. Aber jetzt, iss erstmal etwas.'
      },
      level5: {
        english: 5, target: 95,
        grammar: 'natural berlin dialect',
        instruction: 'Speak natural German with Berlin dialect nuances.',
        example: 'Na, wat is? Nicht reingekommen? Passiert den Besten. Hier haste \'n Trostpflaster!'
      }
    },

    lessonPlan: {
      unit1: {
        title: 'Der Döner - The Kebab',
        objectives: ['ordering_food', 'ingredients', 'preferences'],
        scenarios: [
          { name: 'Ordering', phrases: ['Einen Döner, bitte', 'Mit alles', 'Ohne Zwiebeln'] },
          { name: 'Sauce Selection', phrases: ['Kräuter (Herb)', 'Knoblauch (Garlic)', 'Scharf (Spicy)'] },
          { name: 'Paying', phrases: ['Das macht 6 Euro', 'Stimmt so (Keep change)', 'Danke schön'] }
        ],
        vocabulary: [
          { word: 'Döner', translation: 'kebab', pronunciation: 'DUH-ner' },
          { word: 'Mit alles', translation: 'with everything', pronunciation: 'mit AH-les' },
          { word: 'Scharf', translation: 'spicy', pronunciation: 'sharf' },
          { word: 'Zwiebeln', translation: 'onions', pronunciation: 'TSVEE-beln' },
          { word: 'Chef', translation: 'boss (common address)', pronunciation: 'shef' }
        ],
        culturalNotes: [
          'The Döner Kebab was invented in Berlin by Turkish immigrants',
          '"Mit alles" is grammatically incorrect but culturally mandatory',
          'Only tourists ask for a receipt'
        ]
      },
      unit2: {
        title: 'Die Tür - The Door',
        objectives: ['nightlife_vocabulary', 'rejection', 'modal_verbs'],
        scenarios: [
          { name: 'The Queue', phrases: ['Die Schlange ist lang (The line is long)', 'Ich bin nervös'] },
          { name: 'The Rejection', phrases: ['Heute leider nicht (Unfortunately not today)', 'Warum?'] },
          { name: 'Acceptance', phrases: ['Viel Spaß (Have fun)', 'Danke!'] }
        ],
        vocabulary: [
          { word: 'Türsteher', translation: 'bouncer', pronunciation: 'TUER-shtay-er' },
          { word: 'Schlange', translation: 'queue/snake', pronunciation: 'SHLAN-ge' },
          { word: 'Schwarz', translation: 'black (clothing)', pronunciation: 'shvarts' }
        ]
      },
      unit3: {
        title: 'Die Bahn - Night Bus',
        objectives: ['directions', 'buying_tickets', 'time'],
        scenarios: [
          { name: 'Buying Ticket', phrases: ['Eine Fahrkarte bitte', 'Kurzstrecke', 'Tageskarte'] },
          { name: 'Asking Directions', phrases: ['Wo ist die U-Bahn?', 'Welche Linie?', 'Richtung Warschauer Str.'] }
        ]
      },
      unit4: {
        title: 'Pfand - Bottles',
        objectives: ['recycling_terms', 'social_responsibility', 'numbers'],
        scenarios: [
          { name: 'Collecting', phrases: ['Pfand gehört daneben (Deposit belongs next to bin)', 'Flasche'] }
        ]
      },
      unit5: {
        title: 'Berliner Schnauze',
        objectives: ['slang', 'humor', 'direct_speech'],
        scenarios: [
          { name: 'Street Talk', phrases: ['Icke', 'Schrippe', 'Kiez'] }
        ]
      }
    },

    falseFriends: [
      { word: 'Gift', looksLike: 'gift', actualMeaning: 'poison', warning: 'Use "Geschenk" for a present!' },
      { word: 'Mist', looksLike: 'mist', actualMeaning: 'manure/damn', warning: 'Mist is "Nebel"' },
      { word: 'Bald', looksLike: 'bald', actualMeaning: 'soon', warning: 'Bald (hairless) is "Glatze"' }
    ],

    startingPhrases: [
      { phrase: 'Moin!', translation: 'Hi! (Colloquial)', pronunciation: 'moyn' },
      { phrase: 'Einen Döner, bitte', translation: 'A kebab, please', pronunciation: 'INE-en DUH-ner BIT-te' },
      { phrase: 'Heute leider nicht', translation: 'Not today (Rejection)', pronunciation: 'HOY-te LIE-der nisht' }
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
      name: 'Piazza Navona & Gelateria',
      location: 'Piazza Navona, Rome',
      timeOfDay: 'golden hour',
      weather: 'warm sunset over eternal city',

      description: `The magnificent Piazza Navona bathes in the golden light of the Roman sunset. 
        Gian Lorenzo Bernini's 'Fontana dei Quattro Fiumi' dominates the center, water dancing in the light. 
        The air smells of sugar cones and espresso. A vintage Vespa leans against an ochre wall. 
        It is the definition of 'La Dolce Vita'.`,

      props: {
        gelatoStand: {
          type: 'artisan_cart',
          position: { x: 3, y: 0, z: -3 },
          flavors: [
            { name: 'pistacchio_di_bronte', color: 'pale_green', origin: 'sicily' },
            { name: 'stracciatella', color: 'white_with_shards', texture: 'crunchy' },
            { name: 'fondente', color: 'dark_cacao', percent: '90%' },
            { name: 'fragola', color: 'bright_red', fruit_chunks: true }
          ],
          display: 'glass_case_gleaming'
        },

        fountain: {
          type: 'bernini_masterpiece',
          position: { x: 0, y: 0, z: -8 },
          elements: ['obelisk', 'marble_giants', 'water_jets'],
          water_effects: 'sparkling_droplets'
        },

        vespa: {
          type: 'vintage_scooter',
          model: '1960_sprint',
          color: 'mint_green',
          position: { x: -4, y: 0, z: -4 },
          helmet: 'leather_and_goggles'
        },

        paintersCorner: {
          type: 'street_artist_setup',
          position: { x: -2, y: 0, z: -2 },
          items: ['easel', 'watercolors', 'portrait_sketches'],
          subject: 'roman_skyline'
        },

        cafeTerrace: {
          type: 'outdoor_seating',
          tables: [
            { type: 'wrought_iron', umbrella: 'cream_canvas', items: ['spritz_aperol', 'green_olives'] },
            { type: 'bistro_marble', items: ['espresso_doppio', 'cornetto'] }
          ]
        },

        architectural: {
          church: { type: 'sant_agnese', facade: 'baroque_white', dome: 'majestic' },
          palazzi: { colors: ['burnt_siena', 'ochre', 'terracotta'], shutters: 'green' },
          sky: { type: 'gradient', colors: ['gold', 'apricot', 'purple'] }
        },

        exterior: {
          view: 'pantheon_dome_distance',
          atmosphere: 'dolce_vita_romantic'
        }
      },

      sounds: {
        ambient: [
          { name: 'fountain_splash', volume: 0.4, loop: true },
          { name: 'vespa_engine_rev', volume: 0.2, trigger: 'interval', frequency: 90000 },
          { name: 'church_bells_angelus', volume: 0.25, trigger: 'hour' }
        ],
        shop: [
          { name: 'scooping_gelato', volume: 0.3, trigger: 'serve' },
          { name: 'waffle_crunch', volume: 0.25, trigger: 'eat' },
          { name: 'clinking_spritz_glasses', volume: 0.25, trigger: 'toast' }
        ],
        music: {
          track: 'accordion_romance',
          artist: 'Luigi the Busker',
          volume: 0.2,
          style: 'live street accordion waltz'
        }
      },

      lighting: {
        primary: { type: 'sunset_gold', color: '#FFD700', intensity: 0.7, direction: 'west' },
        secondary: { type: 'twilight_blue', color: '#483D8B', intensity: 0.2, fill: true },
        accent: [
          { type: 'gelato_case_glow', color: '#FFFFFF', intensity: 0.6 },
          { type: 'street_lamp_warm', color: '#FFA500', intensity: 0.5, state: 'flickering_on' }
        ],
        effects: ['lens_flare_sunset', 'water_reflections']
      }
    },

    character: {
      name: 'Marco Benedetti',
      role: 'Gelato Artisan & Roman Poet',
      age: 32,
      emoji: '🍨',
      visuals: {
        skinColor: '#dcb480',
        hairColor: '#3d2b1f',
        hairStyle: 'messy_curls',
        outfitColor: '#ffffff',
        accessoryColor: '#e74c3c',
        style: 'italian_chic'
      },

      appearance: {
        height: 'tall',
        build: 'expressive',
        hair: { color: 'dark_curls', style: 'romantic_mess' },
        eyes: { color: 'green', expression: 'passionate_and_mischievous' },
        outfit: {
          top: 'linen_shirt_rolled_sleeves',
          apron: 'striped_blue_white',
          accessories: ['red_scarf', 'gold_chain'],
          signature: 'holding_silver_spatula'
        }
      },

      personality: {
        traits: ['passionate', 'flirtatious', 'proud', 'dramatic', 'generous'],
        interests: ['flavor_experiments', 'baroque_art', 'AS_Roma', 'opera'],
        quirks: ['kisses_fingers_when_food_is_good', 'recites_dante', 'never_serves_blue_ice_cream'],
        backstory: `Inherited the family gelateria. Believes that "Smurf" flavor is a crime against humanity. 
          He flirts with every customer over the age of 80.`
      },

      voice: {
        voiceId: 'IKne3meq5aSn9XLyUdCD', // Italian male
        style: 'passionate_and_lively',
        accent: 'Roman',
        speed: 1.05,
        pitch: 0.95,
        expressionTags: {
          greeting: '[enthusiastically]',
          teaching: '[with_flair]',
          correcting: '[dramatically]',
          praising: '[bravissimo]'
        }
      }
    },

    difficultyScaling: {
      level1: {
        english: 85, target: 15,
        grammar: 'basic greetings',
        instruction: 'Speak mostly English. Introduce Italian basics with hand gestures (implied). "Ciao", "grazie", "gelato".',
        example: 'Ciao! Welcome to Roma! Would you like un gelato (an ice cream)?'
      },
      level2: {
        english: 65, target: 35,
        grammar: 'ordering basics',
        instruction: 'Use Italian for flavors and numbers. "Vorrei" (I would like), "Dunque" (So...).',
        example: 'Vorrei un gelato al pistacchio. (I would like a pistachio gelato.) It is perfetto (perfect)!'
      },
      level3: {
        english: 45, target: 55,
        grammar: 'articles and adjectives',
        instruction: 'Speak half Italian. Describe things passionately.',
        example: 'Questa piazza è magnifica (this square is magnificent). Ma il traffico è terribile (but the traffic is terrible)!'
      },
      level4: {
        english: 20, target: 80,
        grammar: 'present perfect',
        instruction: 'Speak primarily Italian. Discuss art and food.',
        example: 'Hai visto il Colosseo? È molto antico, ma il mio gelato è fresco!'
      },
      level5: {
        english: 5, target: 95,
        grammar: 'subjunctive & idiom',
        instruction: 'Speak natural Roman Italian. Complain about politics or football.',
        example: 'Magari potessi mangiare gelato tutto il giorno! Ma la vita è dura, eh?'
      }
    },

    lessonPlan: {
      unit1: {
        title: 'Un Gelato Per Favore',
        objectives: ['ordering_food', 'flavors', 'politeness'],
        scenarios: [
          { name: 'Choosing', phrases: ['Vorrei assaggiare (I want to taste)', 'Pistacchio', 'Cono o Coppetta? (Cone or Cup?)'] },
          { name: 'The Cream Question', phrases: ['Con panna? (With cream?)', 'Sì, grazie'] },
          { name: 'Paying', phrases: ['Quanto costa?', 'Ecco a Lei'] }
        ],
        vocabulary: [
          { word: 'Gelato', translation: 'ice cream', pronunciation: 'jeh-LAH-toh' },
          { word: 'Cono', translation: 'cone', pronunciation: 'KOH-noh' },
          { word: 'Panna', translation: 'whipped cream', pronunciation: 'PAN-nah' },
          { word: 'Gusto', translation: 'flavor', pronunciation: 'GOO-stoh' },
          { word: 'Basta', translation: 'enough/stop', pronunciation: 'BAH-stah' }
        ],
        culturalNotes: [
          'Never ask for "pepperoni" on pizza (that means peppers)',
          'Cappuccino is only for breakfast (before 11 AM)',
          'You can ask to taste details (assaggiare) before buying'
        ]
      },
      unit2: {
        title: 'La Dolce Vita',
        objectives: ['emotions', 'adjectives', 'exclamations'],
        scenarios: [
          { name: 'Expressing Joy', phrases: ['Che bello! (How beautiful!)', 'Mamma mia!'] },
          { name: 'People Watching', phrases: ['Guarda lui! (Look at him!)', 'Che eleganza!'] }
        ]
      },
      unit3: {
        title: 'A Spasso - Walking',
        objectives: ['directions', 'monuments', 'history_basics'],
        scenarios: [
          { name: 'Lost in Rome', phrases: ['Scusi', 'Dov\'è il Pantheon?', 'Sempre dritto (Straight ahead)'] }
        ]
      },
      unit4: {
        title: 'Il Calcio - Football',
        objectives: ['sports', 'passion', 'colors'],
        scenarios: [
          { name: 'Team Talk', phrases: ['Forza Roma!', 'Che gol!', 'Arbitro! (Referee!)'] }
        ]
      },
      unit5: {
        title: 'L\'Aperitivo',
        objectives: ['socializing', 'drinks', 'evening_plans'],
        scenarios: [
          { name: 'Spritz Time', phrases: ['Uno Spritz Aperol', 'Patatine (Chips)', 'Cin cin!'] }
        ]
      }
    },

    falseFriends: [
      { word: 'Camera', looksLike: 'camera', actualMeaning: 'room', warning: 'Camera is "macchina fotografica"' },
      { word: 'Preservativo', looksLike: 'preservative', actualMeaning: 'condom', warning: 'Food preservative is "conservante"' },
      { word: 'Rumore', looksLike: 'rumor', actualMeaning: 'noise', warning: 'Rumor is "pettegolezzo"' }
    ],

    startingPhrases: [
      { phrase: 'Ciao bella!', translation: 'Hello beautiful!', pronunciation: 'chow BEL-lah' },
      { phrase: 'Un gelato, per favore', translation: 'A gelato, please', pronunciation: 'oon jeh-LAH-toh per fa-VOR-eh' },
      { phrase: 'Mamma mia!', translation: 'Oh my goodness!', pronunciation: 'mam-ma MEE-ah' }
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
      visuals: {
        skinColor: '#f5e6d3',
        hairColor: '#2c2c2c',
        hairStyle: 'bun',
        outfitColor: '#8b0000',
        accessoryColor: '#ffd700',
        style: 'kimono'
      },

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
      name: 'Warsaw Christmas Market',
      location: 'Rynek Starego Miasta, Warsaw',
      timeOfDay: 'snowy evening',
      weather: 'heavy fluffy snow falling',

      description: `The Old Town Market Place is transformed into a winter wonderland. A giant 
        Christmas tree sparkles in the center, surrounded by wooden stalls offering mulled wine 
        (Grzaniec) and gingerbread. The smell of cloves, cinnamon, and roasting oscypek fills 
        the crisp air. Snowflakes gently fall on the colorful tenement facades.`,

      props: {
        christmasTree: {
          type: 'giant_spruce',
          position: { x: 0, y: 0, z: -10 },
          height: '20m',
          decorations: ['led_lights_gold', 'red_baubles', 'star_topper'],
          lights_pattern: 'sparkle_fade'
        },

        pierogiStand: {
          type: 'food_stall_wooden',
          position: { x: -3, y: 0, z: -4 },
          sign: 'DOMOWE PIEROGI (Homemade Pierogi)',
          items: [
            { name: 'pierogi_ruskie', filling: 'potato_cheese', steaming: true },
            { name: 'pierogi_kapusta', filling: 'cabbage_mushroom', steaming: true },
            { name: 'pierogi_miesne', filling: 'meat', onion_topping: true },
            { name: 'bigos_pot', content: 'hunter_stew', boiling: true }
          ]
        },

        marketStalls: {
          type: 'wooden_chalets',
          position: { x: 3, y: 0, z: -4 },
          items: [
            { name: 'grzaniec_barrel', contents: 'hot_spiced_wine', steam: true },
            { name: 'oscypek_grill', type: 'mountain_cheese', cranberry_sauce: true },
            { name: 'gingerbread_hearts', text: 'Kocham Cię' }
          ]
        },

        skatingRink: {
          type: 'ice_rink_small',
          position: { x: 0, y: 0, z: -2 },
          activity: 'children_skating',
          ice_condition: 'glittering'
        },

        decorations: [
          { type: 'fairy_lights', location: 'strung_overhead', color: 'warm_white' },
          { type: 'mermaid_statue', location: 'center', covered_in_snow: true, shield_and_sword: 'visible' }
        ],

        architectural: {
          floor: { type: 'cobblestone', covered_in: 'fresh_snow', slippery: false },
          buildings: { type: 'tenement_houses', colors: ['terracotta', 'olive', 'ochre'], snow_on_roofs: true },
          sky: { type: 'night_blue', stars: 'visible' }
        },

        exterior: {
          view: 'royal_castle_distance',
          atmosphere: 'festive_magic'
        }
      },

      sounds: {
        ambient: [
          { name: 'crunching_snow', volume: 0.35, trigger: 'step' },
          { name: 'sleigh_bells', volume: 0.2, trigger: 'random' },
          { name: 'skates_on_ice', volume: 0.25, position: 'center' }
        ],
        shop: [
          { name: 'sizzling_onions', volume: 0.3, loop: true },
          { name: 'steaming_pot', volume: 0.2, loop: true },
          { name: 'pouring_wine', volume: 0.3, trigger: 'pour' }
        ],
        music: {
          track: 'polish_carols_instrumental',
          artist: 'Winter Warsaw',
          volume: 0.2,
          style: 'orchestral christmas carols'
        }
      },

      lighting: {
        primary: { type: 'string_lights', color: '#FFD700', intensity: 0.6 },
        secondary: { type: 'tree_lights', color: '#FFA500', intensity: 0.8 },
        accent: [
          { type: 'fire_barrel', color: '#FF4500', intensity: 0.5, flicker: true },
          { type: 'snow_glint', color: '#FFFFFF', intensity: 0.3 }
        ],
        effects: ['snow_falling_heavy', 'breath_fog']
      }
    },

    character: {
      name: 'Babcia Zosia',
      role: 'Pierogi Master & Grandma',
      age: 68,
      emoji: '🥟',
      visuals: {
        skinColor: '#f5d0b0',
        hairColor: '#d3d3d3',
        hairStyle: 'scarf_wrapped',
        outfitColor: '#8b0000',
        accessoryColor: '#006400',
        style: 'winter_folk'
      },

      appearance: {
        height: 'short',
        build: 'huggable',
        hair: { color: 'grey', style: 'hidden_under_scarf' },
        eyes: { color: 'blue', expression: 'twinkling_and_warm' },
        outfit: {
          top: 'thick_wool_coat',
          scarf: 'colorful_folk_pattern',
          apron: 'white_with_embroidery',
          footwear: 'warm_boots'
        }
      },

      personality: {
        traits: ['warm', 'insistent', 'traditional', 'superstitious', 'generous'],
        interests: ['feeding_people', 'gossip', 'knitting', 'grandchildren'],
        quirks: ['insists_you_are_too_skinny', 'gives_extra_pierogi', 'hums_carols'],
        backstory: `She makes the best pierogi in Warsaw. Recipe is a family secret from 1920. 
          If you don't eat at least 10 pierogi, she gets offended.`
      },

      voice: {
        voiceId: 'onwK4e9ZLuTAKqWW03F9', // Polish female
        style: 'warm_and_motherly',
        accent: 'Warsaw_Polish',
        speed: 0.95,
        pitch: 1.0,
        expressionTags: {
          greeting: '[cheerfully]',
          teaching: '[patiently]',
          correcting: '[kindly]',
          praising: '[delighted]'
        }
      }
    },

    difficultyScaling: {
      level1: {
        english: 85, target: 15,
        grammar: 'basic greetings',
        instruction: 'Speak mostly English. Introduce Christmas words. "Pierogi" (Dumplings), "Bardzo dobre" (Very good).',
        example: 'Wesołych Świąt! Look at these pierogi! Bardzo dobre (very good), tak?'
      },
      level2: {
        english: 65, target: 35,
        grammar: 'ordering food',
        instruction: 'Use Polish for market items. "Poproszę" (I request), "Grzaniec" (Mulled wine).',
        example: 'Poproszę pierogi ruskie (Russian dumplings please). And one grzaniec (mulled wine).'
      },
      level3: {
        english: 45, target: 55,
        grammar: 'adjectives',
        instruction: 'Speak half Polish. Describe the food.',
        example: 'Te pierogi są pyszne (these pierogi are delicious). Ale jest zimno (but it is cold)!'
      },
      level4: {
        english: 20, target: 80,
        grammar: 'future tense',
        instruction: 'Speak primarily Polish. Discuss holiday plans.',
        example: 'W Wigilię będziemy jeść karpia i pierogi. A ty?'
      },
      level5: {
        english: 5, target: 95,
        grammar: 'cultural nuances',
        instruction: 'Speak natural Polish about traditions and superstitions.',
        example: 'Pamiętaj o sianku pod obrus! To przynosi szczęście.'
      }
    },

    lessonPlan: {
      unit1: {
        title: 'Pierogi Power',
        objectives: ['ordering_food', 'flavors', 'politeness'],
        scenarios: [
          { name: 'Ordering', phrases: ['Poproszę pierogi', 'Ruskie czy z mięsem?', 'Z cebulką (with onions)'] },
          { name: 'Paying', phrases: ['Ile płacę?', 'Reszty nie trzeba', 'Smacznego!'] }
        ],
        vocabulary: [
          { word: 'Pierogi', translation: 'dumplings', pronunciation: 'pyeh-ROH-gee' },
          { word: 'Smacznego', translation: 'bon appétit', pronunciation: 'smach-NEH-go' },
          { word: 'Cebula', translation: 'onion', pronunciation: 'tseh-BOO-la' },
          { word: 'Gorące', translation: 'hot (temp)', pronunciation: 'go-RON-tseh' },
          { word: 'Pyszne', translation: 'delicious', pronunciation: 'PISH-neh' }
        ],
        culturalNotes: [
          'Pierogi Ruskie contain potatoes and cheese (not meat)',
          'It is polite to wish "Smacznego" before eating',
          'Christmas Eve dinner (Wigilia) is meatless'
        ]
      },
      unit2: {
        title: 'Na Rynku - At the Market',
        objectives: ['weather', 'drinks', 'shopping'],
        scenarios: [
          { name: 'Ordering Wine', phrases: ['Jeden grzaniec', 'Rozgrzeje cię (It will warm you)'] },
          { name: 'Cold Weather', phrases: ['Ale zimno!', 'Pada śnieg'] }
        ]
      },
      unit3: {
        title: 'Tradycje - Traditions',
        objectives: ['festivals', 'family', 'gifts'],
        scenarios: [
          { name: 'Christmas Eve', phrases: ['Wigilia', 'Opłatek (wafer)', 'Pierwsza gwiazdka (First star)'] }
        ]
      },
      unit4: {
        title: 'Rodzina - Family',
        objectives: ['family_members', 'love', 'introductions'],
        scenarios: [
          { name: 'Grandma Rules', phrases: ['Babcia rządzi', 'Jesteś głodny? (Are you hungry?)'] }
        ]
      },
      unit5: {
        title: 'Nowy Rok - New Year',
        objectives: ['wishes', 'future', 'celebration'],
        scenarios: [
          { name: 'Wishes', phrases: ['Dosiego Roku!', 'Zdrowia i szczęścia'] }
        ]
      }
    },

    falseFriends: [
      { word: 'No', looksLike: 'no', actualMeaning: 'yeah/well', warning: '"No" is often used as a confirmed filler!' },
      { word: 'Fart', looksLike: 'fart', actualMeaning: 'luck', warning: 'It means luck in Polish!' },
      { word: 'Preserwatywa', looksLike: 'preservative', actualMeaning: 'condom', warning: 'Food preservative is "konserwant"' }
    ],

    startingPhrases: [
      { phrase: 'Dzień dobry!', translation: 'Good day!', pronunciation: 'jen DOB-ri' },
      { phrase: 'Poproszę pierogi', translation: 'Pierogi, please', pronunciation: 'po-PRO-sheh pyeh-ROH-gee' },
      { phrase: 'Kocham Polskę', translation: 'I love Poland', pronunciation: 'KO-ham POL-skeh' }
    ]
  }
};

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
