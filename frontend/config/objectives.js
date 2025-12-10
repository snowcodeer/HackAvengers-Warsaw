// ═══════════════════════════════════════════════════════════════════════════════
// SCENE OBJECTIVES
// Progressive learning goals for each language and level
// ═══════════════════════════════════════════════════════════════════════════════

export const SCENE_OBJECTIVES = {
    french: {
        1: [ // Level 1 - First Contact (simple greetings)
            { target: "Bonjour!", english: "Hello!", hint: '"Bonjour!" or "Salut!"', keywords: ['bonjour', 'salut', 'hello', 'hi', 'bon'] },
            { target: "Ça va?", english: "How are you?", hint: '"Ça va?" or "Comment ça va?"', keywords: ['ça va', 'ca va', 'comment', 'how', 'are you'] }
        ],
        2: [ // Level 2 - Getting Comfortable (ordering basics)
            { target: "Un croissant, s'il vous plaît.", english: "A croissant, please.", hint: '"Un croissant, s\'il vous plaît"', keywords: ['croissant', 'pain', 'please', 'plaît', 'plait', 'sil', 'vous'] },
            { target: "C'est combien?", english: "How much is it?", hint: '"C\'est combien?" or "Quel est le prix?"', keywords: ['combien', 'prix', 'price', 'cost', 'how much', 'euro'] }
        ],
        3: [ // Level 3 - Conversational (preferences)
            { target: "Je voudrais deux croissants.", english: "I would like two croissants.", hint: '"Je voudrais..." + item', keywords: ['voudrais', 'would', 'like', 'want', 'deux', 'three', 'un', 'une'] },
            { target: "Qu'est-ce que vous recommandez?", english: "What do you recommend?", hint: '"Qu\'est-ce que vous recommandez?"', keywords: ['recommand', 'suggest', 'what', 'best', 'prefer'] }
        ],
        4: [ // Level 4 - Advanced (complex ordering)
            { target: "Je suis allergique aux noix.", english: "I am allergic to nuts.", hint: '"Je suis allergique à..."', keywords: ['allergique', 'allergy', 'noix', 'nuts', 'gluten', 'lactose'] },
            { target: "Est-ce que c'est fait maison?", english: "Is it homemade?", hint: '"Est-ce que c\'est fait maison?"', keywords: ['maison', 'home', 'made', 'fresh', 'today', 'fait'] }
        ],
        5: [ // Level 5 - Fluent (natural conversation)
            { target: "Depuis quand faites-vous ce métier?", english: "How long have you been doing this job?", hint: 'Ask about their career/story', keywords: ['depuis', 'how long', 'years', 'work', 'job', 'métier', 'boulang'] },
            { target: "Merci beaucoup, c'était délicieux!", english: "Thank you, it was delicious!", hint: '"Merci beaucoup! C\'était délicieux!"', keywords: ['merci', 'thank', 'delici', 'bon', 'good', 'excellent', 'parfait'] }
        ]
    },
    japanese: {
        1: [
            { target: "こんにちは！", english: "Hello!", hint: '"こんにちは" (Konnichiwa)', keywords: ['konnichiwa', 'konichiwa', 'hello', 'hi', 'こんにちは', 'ohayo'] },
            { target: "お元気ですか？", english: "How are you?", hint: '"お元気ですか？" (Ogenki desu ka?)', keywords: ['genki', 'ogenki', 'how', 'are', '元気'] }
        ],
        2: [
            { target: "お茶をください。", english: "Tea, please.", hint: '"お茶をください" (Ocha wo kudasai)', keywords: ['ocha', 'tea', 'kudasai', 'please', 'お茶', 'ください'] },
            { target: "いくらですか？", english: "How much is it?", hint: '"いくらですか？" (Ikura desu ka?)', keywords: ['ikura', 'how much', 'price', 'cost', 'いくら', 'yen'] }
        ],
        3: [
            { target: "これは何ですか？", english: "What is this?", hint: '"これは何ですか？" (Kore wa nan desu ka?)', keywords: ['nan', 'what', 'kore', 'this', '何', 'これ'] },
            { target: "おすすめは何ですか？", english: "What do you recommend?", hint: '"おすすめは何ですか？"', keywords: ['osusume', 'recommend', 'suggest', 'best', 'popular'] }
        ],
        4: [
            { target: "抹茶と煎茶の違いは何ですか？", english: "What's the difference between matcha and sencha?", hint: 'Ask about tea differences', keywords: ['matcha', 'sencha', 'difference', 'chigai', 'which', 'better'] },
            { target: "おいしいですか？", english: "Is it delicious?", hint: '"おいしいですか？" (Oishii desu ka?)', keywords: ['oishii', 'delicious', 'tasty', 'good', 'おいしい'] }
        ],
        5: [
            { target: "お茶の作り方を教えてください。", english: "Please teach me how to make tea.", hint: 'Ask about the tea ceremony', keywords: ['teach', 'how', 'make', 'ceremony', 'tradition', 'oshiete'] },
            { target: "ありがとうございました！", english: "Thank you very much!", hint: '"ありがとうございました！"', keywords: ['arigatou', 'arigatō', 'thank', 'ありがとう', 'domo'] }
        ]
    },
    spanish: {
        1: [
            { target: "¡Hola!", english: "Hello!", hint: '"¡Hola!" or "Buenos días"', keywords: ['hola', 'hello', 'hi', 'buenos', 'buenas'] },
            { target: "¿Cómo estás?", english: "How are you?", hint: '"¿Cómo estás?" or "¿Qué tal?"', keywords: ['como', 'estas', 'tal', 'how', 'are'] }
        ],
        2: [
            { target: "Un café, por favor.", english: "A coffee, please.", hint: '"Un café, por favor"', keywords: ['cafe', 'café', 'coffee', 'por favor', 'please', 'favor'] },
            { target: "¿Cuánto cuesta?", english: "How much does it cost?", hint: '"¿Cuánto cuesta?"', keywords: ['cuanto', 'cuánto', 'cuesta', 'cost', 'price', 'euro'] }
        ],
        3: [
            { target: "¿Qué me recomiendas?", english: "What do you recommend?", hint: '"¿Qué recomiendas?"', keywords: ['recomiend', 'recommend', 'suggest', 'best'] },
            { target: "Me gustaría probar algo típico.", english: "I would like to try something typical.", hint: '"Me gustaría probar..."', keywords: ['gustaría', 'probar', 'try', 'típico', 'typical', 'local'] }
        ],
        4: [
            { target: "¿Tienen opciones vegetarianas?", english: "Do you have vegetarian options?", hint: '"¿Tienen opciones vegetarianas?"', keywords: ['vegetarian', 'vegan', 'opciones', 'tienen', 'sin carne', 'meat'] },
            { target: "¿Está hecho con ingredientes frescos?", english: "Is it made with fresh ingredients?", hint: 'Ask about freshness', keywords: ['fresco', 'fresh', 'hecho', 'made', 'today', 'ingredientes'] }
        ],
        5: [
            { target: "¿Cuál es la historia de este plato?", english: "What is the history of this dish?", hint: 'Ask about the dish\'s origin', keywords: ['historia', 'history', 'origen', 'tradition', 'receta', 'recipe'] },
            { target: "¡Estuvo delicioso! ¡Gracias!", english: "It was delicious! Thanks!", hint: '"¡Estuvo delicioso! ¡Gracias!"', keywords: ['delicioso', 'gracias', 'thank', 'delicious', 'excellent', 'bueno'] }
        ]
    },
    german: {
        1: [
            { target: "Guten Tag!", english: "Good day!", hint: '"Guten Tag!" or "Hallo!"', keywords: ['guten', 'tag', 'hallo', 'hello', 'hi', 'morgen'] },
            { target: "Wie geht es Ihnen?", english: "How are you?", hint: '"Wie geht es Ihnen?"', keywords: ['wie', 'geht', 'how', 'are', 'gut'] }
        ],
        2: [
            { target: "Ein Bier, bitte.", english: "A beer, please.", hint: '"Ein Bier, bitte"', keywords: ['bier', 'beer', 'bitte', 'please'] },
            { target: "Was kostet das?", english: "How much does this cost?", hint: '"Was kostet das?"', keywords: ['kostet', 'cost', 'preis', 'price', 'euro', 'was'] }
        ],
        3: [
            { target: "Die Speisekarte, bitte.", english: "The menu, please.", hint: '"Die Speisekarte, bitte"', keywords: ['speisekarte', 'menu', 'karte', 'bitte'] },
            { target: "Was empfehlen Sie?", english: "What do you recommend?", hint: '"Was empfehlen Sie?"', keywords: ['empfehl', 'recommend', 'suggest', 'best', 'gut'] }
        ],
        4: [
            { target: "Haben Sie etwas Vegetarisches?", english: "Do you have something vegetarian?", hint: '"Haben Sie vegetarische Optionen?"', keywords: ['vegetarisch', 'vegetarian', 'haben', 'have', 'vegan'] },
            { target: "Ist das hausgemacht?", english: "Is that homemade?", hint: '"Ist das hausgemacht?"', keywords: ['hausgemacht', 'homemade', 'haus', 'frisch', 'fresh'] }
        ],
        5: [
            { target: "Können Sie mir mehr über dieses Gericht erzählen?", english: "Can you tell me more about this dish?", hint: 'Ask about the dish\'s story', keywords: ['erzähl', 'tell', 'mehr', 'more', 'gericht', 'dish', 'tradition'] },
            { target: "Vielen Dank, das war ausgezeichnet!", english: "Thank you, that was excellent!", hint: '"Vielen Dank! Das war ausgezeichnet!"', keywords: ['dank', 'thank', 'ausgezeichnet', 'excellent', 'gut', 'lecker'] }
        ]
    },
    italian: {
        1: [
            { target: "Ciao!", english: "Hello!", hint: '"Ciao!" or "Buongiorno!"', keywords: ['ciao', 'hello', 'hi', 'buongiorno', 'buon'] },
            { target: "Come stai?", english: "How are you?", hint: '"Come stai?" or "Come sta?"', keywords: ['come', 'stai', 'sta', 'how', 'are', 'bene'] }
        ],
        2: [
            { target: "Un espresso, per favore.", english: "An espresso, please.", hint: '"Un espresso, per favore"', keywords: ['espresso', 'caffe', 'caffè', 'per favore', 'please', 'favore'] },
            { target: "Quanto costa?", english: "How much does it cost?", hint: '"Quanto costa?"', keywords: ['quanto', 'costa', 'cost', 'price', 'euro'] }
        ],
        3: [
            { target: "Cosa mi consiglia?", english: "What do you recommend?", hint: '"Cosa mi consiglia?"', keywords: ['consiglia', 'recommend', 'cosa', 'what', 'best'] },
            { target: "Vorrei provare qualcosa di tipico.", english: "I would like to try something typical.", hint: '"Vorrei provare..."', keywords: ['vorrei', 'would', 'provare', 'try', 'tipico', 'typical'] }
        ],
        4: [
            { target: "Avete opzioni senza glutine?", english: "Do you have gluten-free options?", hint: '"Avete opzioni senza glutine?"', keywords: ['glutine', 'gluten', 'avete', 'have', 'senza', 'without', 'vegano'] },
            { target: "È fatto in casa?", english: "Is it homemade?", hint: '"È fatto in casa?"', keywords: ['casa', 'home', 'fatto', 'made', 'fresco', 'fresh'] }
        ],
        5: [
            { target: "Qual è la storia di questo piatto?", english: "What is the history of this dish?", hint: 'Ask about origins and traditions', keywords: ['storia', 'history', 'tradizione', 'tradition', 'origine', 'origin', 'ricetta'] },
            { target: "Grazie mille, era squisito!", english: "Thank you, it was exquisite!", hint: '"Grazie mille! Era squisito!"', keywords: ['grazie', 'thank', 'squisito', 'delizioso', 'buono', 'excellent'] }
        ]
    },
    polish: {
        1: [
            { target: "Dzień dobry!", english: "Good day!", hint: '"Dzień dobry!" or "Cześć!"', keywords: ['dzień', 'dzien', 'dobry', 'cześć', 'czesc', 'hello', 'hi'] },
            { target: "Jak się masz?", english: "How are you?", hint: '"Jak się masz?"', keywords: ['jak', 'masz', 'how', 'are', 'dobrze'] }
        ],
        2: [
            { target: "Poproszę pierogi.", english: "Pierogi, please.", hint: '"Poproszę pierogi"', keywords: ['poproszę', 'poprosze', 'proszę', 'pierogi', 'please'] },
            { target: "Ile to kosztuje?", english: "How much does it cost?", hint: '"Ile to kosztuje?"', keywords: ['ile', 'kosztuje', 'cost', 'price', 'złoty', 'zloty'] }
        ],
        3: [
            { target: "Co poleca pan/pani?", english: "What do you recommend?", hint: '"Co poleca pan/pani?"', keywords: ['poleca', 'recommend', 'suggest', 'co', 'what', 'najlepsze'] },
            { target: "Chciałbym spróbować czegoś tradycyjnego.", english: "I would like to try something traditional.", hint: '"Chciałbym spróbować..."', keywords: ['chciałbym', 'chcialbym', 'spróbować', 'try', 'tradycyjn', 'traditional'] }
        ],
        4: [
            { target: "Czy macie opcje wegetariańskie?", english: "Do you have vegetarian options?", hint: '"Czy macie opcje wegetariańskie?"', keywords: ['wegetariańsk', 'wegetariansk', 'vegetarian', 'macie', 'have', 'bez mięsa'] },
            { target: "Czy to jest domowej roboty?", english: "Is this homemade?", hint: '"Czy to jest domowej roboty?"', keywords: ['domow', 'home', 'roboty', 'made', 'świeże', 'swieze', 'fresh'] }
        ],
        5: [
            { target: "Jaka jest historia tego dania?", english: "What is the history of this dish?", hint: 'Ask about Polish culinary traditions', keywords: ['historia', 'history', 'tradycja', 'tradition', 'danie', 'dish', 'przepis'] },
            { target: "Dziękuję, było pyszne!", english: "Thank you, it was delicious!", hint: '"Dziękuję! Było pyszne!"', keywords: ['dziękuję', 'dziekuje', 'thank', 'pyszne', 'delicious', 'dobre', 'smaczne'] }
        ]
    },
    mandarin: {
        1: [
            { target: "你好！", english: "Hello!", hint: '"你好！" (Nǐ hǎo!)', keywords: ['你好', 'nihao', 'ni hao', 'hello', 'hi'] },
            { target: "你好吗？", english: "How are you?", hint: '"你好吗？" (Nǐ hǎo ma?)', keywords: ['好吗', 'hao ma', 'how', 'are', 'fine'] }
        ],
        2: [
            { target: "我要一杯茶。", english: "I want a cup of tea.", hint: '"我要一杯茶" (Wǒ yào yī bēi chá)', keywords: ['茶', 'cha', 'tea', '要', 'yao', 'want', '杯', 'bei'] },
            { target: "多少钱？", english: "How much?", hint: '"多少钱？" (Duōshao qián?)', keywords: ['多少', 'duoshao', 'how much', '钱', 'qian', 'money', 'yuan'] }
        ],
        3: [
            { target: "这是什么？", english: "What is this?", hint: '"这是什么？" (Zhè shì shénme?)', keywords: ['什么', 'shenme', 'what', '这', 'zhe', 'this'] },
            { target: "你推荐什么？", english: "What do you recommend?", hint: '"你推荐什么？" (Nǐ tuījiàn shénme?)', keywords: ['推荐', 'tuijian', 'recommend', 'suggest', 'best'] }
        ],
        4: [
            { target: "有素食的选择吗？", english: "Are there vegetarian options?", hint: '"有素食的选择吗？"', keywords: ['素食', 'sushi', 'vegetarian', '选择', 'xuanze', 'option', '有', 'you'] },
            { target: "这是自己做的吗？", english: "Is this homemade?", hint: '"这是自己做的吗？"', keywords: ['自己', 'ziji', 'home', '做', 'zuo', 'made', 'fresh', '新鲜'] }
        ],
        5: [
            { target: "这道菜的故事是什么？", english: "What is the story of this dish?", hint: 'Ask about traditions and origins', keywords: ['故事', 'gushi', 'story', 'history', '传统', 'chuantong', 'tradition'] },
            { target: "谢谢，非常好吃！", english: "Thank you, very delicious!", hint: '"谢谢！非常好吃！" (Xièxiè! Fēicháng hǎo chī!)', keywords: ['谢谢', 'xiexie', 'thank', '好吃', 'haochi', 'delicious', '非常', 'feichang'] }
        ]
    },
    english: {
        1: [
            { target: "Hello!", english: "Hello!", hint: '"Hello!" or "Hi there!"', keywords: ['hello', 'hi', 'hey', 'good morning', 'good day'] },
            { target: "How are you?", english: "How are you?", hint: '"How are you?" or "How\'s it going?"', keywords: ['how', 'are', 'you', 'doing', 'going'] }
        ],
        2: [
            { target: "I would like a coffee, please.", english: "I would like a coffee, please.", hint: '"I would like... please"', keywords: ['would', 'like', 'please', 'want', 'coffee', 'tea'] },
            { target: "How much is this?", english: "How much is this?", hint: '"How much is this?"', keywords: ['how much', 'price', 'cost', 'dollar', 'pay'] }
        ],
        3: [
            { target: "What do you recommend?", english: "What do you recommend?", hint: '"What do you recommend?"', keywords: ['recommend', 'suggest', 'best', 'popular', 'favorite'] },
            { target: "I'd like to try something new.", english: "I'd like to try something new.", hint: '"I\'d like to try..."', keywords: ['try', 'new', 'something', 'different', 'special'] }
        ],
        4: [
            { target: "Do you have any vegetarian options?", english: "Do you have any vegetarian options?", hint: '"Do you have vegetarian options?"', keywords: ['vegetarian', 'vegan', 'options', 'have', 'without meat'] },
            { target: "Is this made fresh daily?", english: "Is this made fresh daily?", hint: '"Is this fresh?"', keywords: ['fresh', 'made', 'today', 'daily', 'homemade'] }
        ],
        5: [
            { target: "What's the story behind this dish?", english: "What's the story behind this dish?", hint: 'Ask about the history or origin', keywords: ['story', 'history', 'behind', 'origin', 'tradition', 'where'] },
            { target: "Thank you, that was wonderful!", english: "Thank you, that was wonderful!", hint: '"Thank you! That was wonderful!"', keywords: ['thank', 'wonderful', 'great', 'delicious', 'amazing', 'excellent'] }
        ]
    }
};
