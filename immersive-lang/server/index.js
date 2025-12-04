// LinguaWorlds Backend Server
// Handles Claude, ElevenLabs, and Decart API integrations

import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const PORT = process.env.PORT || 3001;

// API Keys - set these in your .env file
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const DECART_API_KEY = process.env.DECART_API_KEY || '';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ==========================================
// Claude API - Lesson Generation & Conversation
// ==========================================

app.post('/api/generate-lesson', async (req, res) => {
  try {
    const { prompt, language, level } = req.body;
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      system: `You are an expert language teacher creating immersive learning scenarios. 
Always respond with valid JSON. Be culturally accurate and engaging.
For level ${level}/5, adjust complexity accordingly.`
    });
    
    // Extract text content
    const responseText = message.content[0].text;
    
    // Try to parse as JSON
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        res.json(parsed);
      } else {
        res.json({ response: responseText });
      }
    } catch {
      res.json({ response: responseText });
    }
    
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: 'Failed to generate lesson' });
  }
});

app.post('/api/conversation', async (req, res) => {
  try {
    const { prompt, language, level, userInput, history } = req.body;
    
    const messages = history.map(h => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: h.content
    }));
    
    messages.push({
      role: 'user',
      content: prompt
    });
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages,
      system: `You are a native speaker character in a language learning game.
Stay in character and respond naturally. Gently correct any language mistakes.
Always respond with valid JSON containing: response, translation (if needed), correction (if any), newVocabulary, encouragement.`
    });
    
    const responseText = message.content[0].text;
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        res.json(JSON.parse(jsonMatch[0]));
      } else {
        res.json({
          response: responseText,
          translation: null,
          correction: null,
          newVocabulary: [],
          encouragement: 'Keep practicing!'
        });
      }
    } catch {
      res.json({
        response: responseText,
        translation: null,
        correction: null,
        newVocabulary: [],
        encouragement: 'Keep practicing!'
      });
    }
    
  } catch (error) {
    console.error('Conversation error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// ==========================================
// ElevenLabs API - Speech Synthesis & Recognition
// ==========================================

app.post('/api/speak', async (req, res) => {
  try {
    const { text, language, voice } = req.body;
    
    // Get voice ID based on language (or use default multilingual)
    const voiceId = await getVoiceIdForLanguage(language);
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status}`);
    }
    
    const audioBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
    
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

app.post('/api/transcribe', async (req, res) => {
  try {
    const { audio } = req.body;
    
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64');
    
    // Create form data
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/webm' });
    formData.append('audio', blob, 'audio.webm');
    
    const response = await fetch(
      'https://api.elevenlabs.io/v1/speech-to-text',
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: formData
      }
    );
    
    if (!response.ok) {
      throw new Error(`Transcription error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({ text: data.text });
    
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Get ElevenLabs voices
app.get('/api/voices', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/voices',
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        }
      }
    );
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Voices error:', error);
    res.status(500).json({ error: 'Failed to get voices' });
  }
});

// Helper to get appropriate voice ID
async function getVoiceIdForLanguage(language) {
  // Default multilingual voices that work well for different languages
  const voiceMap = {
    fr: '21m00Tcm4TlvDq8ikWAM', // Rachel - good for French
    de: 'AZnzlk1XvdvUeBnXmlld', // Domi - good for German
    es: 'EXAVITQu4vr4xnSDxMaL', // Bella - good for Spanish
    it: 'MF3mGyEYCl7XYWbV9V6O', // Elli - good for Italian
    pl: '21m00Tcm4TlvDq8ikWAM', // Rachel - works for Polish
    zh: 'g5CIjZEefAph4nQFvHAz', // Freya - works for Mandarin
    ja: 'XB0fDUnXU5powFXDhCwa', // Charlotte - works for Japanese
    en: 'pNInz6obpgDQGcFmaJgB', // Adam - British English
  };
  
  return voiceMap[language] || '21m00Tcm4TlvDq8ikWAM';
}

// ==========================================
// Decart API - Visual Enhancement
// ==========================================

app.post('/api/decart/session', async (req, res) => {
  try {
    const { model, style, resolution } = req.body;
    
    // Create a Decart session for real-time video processing
    const response = await fetch(
      'https://api.decart.ai/v1/sessions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DECART_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'mirage-lsd',
          config: {
            style_preset: style,
            resolution,
            fps: 30
          }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Decart error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({
      sessionId: data.session_id,
      sessionUrl: data.websocket_url
    });
    
  } catch (error) {
    console.error('Decart session error:', error);
    // Return fallback - app will use CSS effects
    res.status(200).json({ fallback: true });
  }
});

app.post('/api/decart/enhance-image', async (req, res) => {
  try {
    const { image, style } = req.body;
    
    const response = await fetch(
      'https://api.decart.ai/v1/enhance',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DECART_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image,
          model: 'lucy-image-edit',
          style_preset: style
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Decart enhance error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Decart enhance error:', error);
    res.status(500).json({ error: 'Failed to enhance image' });
  }
});

// ==========================================
// ElevenLabs Conversational AI Agent
// ==========================================

app.post('/api/create-agent', async (req, res) => {
  try {
    const { name, personality, language, firstMessage } = req.body;
    
    const response = await fetch(
      'https://api.elevenlabs.io/v1/convai/agents',
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          conversation_config: {
            agent: {
              prompt: {
                prompt: `You are ${name}, a native ${language} speaker. ${personality}
                
Your role is to help the user learn ${language} through immersive conversation.
- Start conversations naturally
- Gently correct pronunciation and grammar mistakes
- Gradually introduce more complex vocabulary
- Be encouraging and patient
- Stay in character throughout`,
              },
              first_message: firstMessage,
              language,
            },
            tts: {
              model_id: 'eleven_multilingual_v2',
            }
          }
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Agent creation error: ${error}`);
    }
    
    const data = await response.json();
    res.json({
      agentId: data.agent_id,
      widgetUrl: `https://elevenlabs.io/convai/${data.agent_id}`
    });
    
  } catch (error) {
    console.error('Agent creation error:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// ==========================================
// Health Check
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    services: {
      anthropic: !!ANTHROPIC_API_KEY,
      elevenlabs: !!ELEVENLABS_API_KEY,
      decart: !!DECART_API_KEY
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║     LinguaWorlds Backend Server Started        ║
║     http://localhost:${PORT}                      ║
╚════════════════════════════════════════════════╝
  `);
});

export default app;

