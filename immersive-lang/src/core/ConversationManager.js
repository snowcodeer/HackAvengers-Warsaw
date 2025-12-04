// ConversationManager - Handles voice conversations via ElevenLabs

export class ConversationManager {
  constructor(languageManager, glossaryManager, progressionSystem) {
    this.languageManager = languageManager;
    this.glossaryManager = glossaryManager;
    this.progressionSystem = progressionSystem;
    
    this.conversationHistory = [];
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioContext = null;
    this.currentAudio = null;
    
    this.conversationTurns = 0;
    this.wordsLearned = 0;
    
    this.setupAudio();
  }

  async setupAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.error('Failed to setup audio context:', error);
    }
  }

  async startConversation(character) {
    this.conversationHistory = [];
    this.conversationTurns = 0;
    
    // Generate initial scenario greeting
    const scenario = this.languageManager.currentScenario || 
                     await this.languageManager.generateScenario();
    
    // Add greeting to history
    this.conversationHistory.push({
      role: 'assistant',
      content: scenario.greeting
    });
    
    // Display and speak greeting
    this.displayMessage('npc', scenario.greeting, null);
    await this.speakText(scenario.greeting);
    
    // Show conversation UI
    this.showConversationUI();
    
    return scenario;
  }

  showConversationUI() {
    document.getElementById('conversationUI').classList.remove('hidden');
    document.getElementById('characterPanel').classList.remove('hidden');
  }

  hideConversationUI() {
    document.getElementById('conversationUI').classList.add('hidden');
  }

  displayMessage(type, text, translation) {
    const transcript = document.getElementById('transcript');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    
    let html = `<p class="message-text">${this.highlightErrors(text)}</p>`;
    if (translation) {
      html += `<p class="message-translation">${translation}</p>`;
    }
    
    message.innerHTML = html;
    transcript.appendChild(message);
    
    // Scroll to bottom
    const container = document.getElementById('transcriptContainer');
    container.scrollTop = container.scrollHeight;
  }

  highlightErrors(text) {
    // This would be enhanced with actual error detection
    return text;
  }

  async startRecording() {
    if (this.isRecording) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (e) => {
        this.audioChunks.push(e.data);
      };
      
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        await this.processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
      
      // Update UI
      document.getElementById('micBtn').classList.add('recording');
      document.getElementById('waveform').classList.remove('hidden');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Please allow microphone access to practice speaking!');
    }
  }

  stopRecording() {
    if (!this.isRecording || !this.mediaRecorder) return;
    
    this.mediaRecorder.stop();
    this.isRecording = false;
    
    // Update UI
    document.getElementById('micBtn').classList.remove('recording');
    document.getElementById('waveform').classList.add('hidden');
  }

  async processAudio(audioBlob) {
    try {
      // Convert to base64 for API
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        // Send to ElevenLabs for transcription
        const transcription = await this.transcribeAudio(base64Audio);
        
        if (transcription) {
          // Display user's message
          this.displayMessage('user', transcription, null);
          
          // Add to history
          this.conversationHistory.push({
            role: 'user',
            content: transcription
          });
          
          // Get AI response
          await this.getResponse(transcription);
        }
      };
    } catch (error) {
      console.error('Failed to process audio:', error);
    }
  }

  async transcribeAudio(base64Audio) {
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64Audio })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.text;
      }
    } catch (error) {
      console.error('Transcription failed:', error);
    }
    return null;
  }

  async getResponse(userInput) {
    // Get response from language manager (Claude)
    const response = await this.languageManager.generateResponse(
      userInput,
      this.conversationHistory
    );
    
    // Handle correction feedback
    if (response.correction) {
      this.showGrammarFeedback(response.correction);
    }
    
    // Add new vocabulary to glossary
    if (response.newVocabulary && response.newVocabulary.length > 0) {
      response.newVocabulary.forEach(vocab => {
        this.glossaryManager.addWord(
          this.languageManager.langCode,
          vocab
        );
        this.wordsLearned++;
      });
    }
    
    // Display and speak response
    this.displayMessage('npc', response.response, response.translation);
    await this.speakText(response.response);
    
    // Add to history
    this.conversationHistory.push({
      role: 'assistant',
      content: response.response
    });
    
    // Update progression
    this.conversationTurns++;
    this.progressionSystem.addXP(10);
    
    // Check for level up (every 10 turns)
    if (this.conversationTurns % 10 === 0) {
      this.checkDifficultyIncrease();
    }
  }

  showGrammarFeedback(correction) {
    const feedbackEl = document.getElementById('grammarFeedback');
    const textEl = document.getElementById('feedbackText');
    
    textEl.innerHTML = `
      <span class="error-word">"${correction.original}"</span> → 
      <span class="correction">"${correction.corrected}"</span><br>
      <small>${correction.explanation}</small>
    `;
    
    feedbackEl.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
      feedbackEl.classList.add('hidden');
    }, 5000);
  }

  async speakText(text) {
    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: this.languageManager.langCode,
          voice: this.languageManager.config.character.voice
        })
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Stop any current audio
        if (this.currentAudio) {
          this.currentAudio.pause();
        }
        
        this.currentAudio = new Audio(audioUrl);
        await this.currentAudio.play();
      }
    } catch (error) {
      console.error('Failed to speak:', error);
    }
  }

  checkDifficultyIncrease() {
    const leveledUp = this.languageManager.incrementLevel();
    if (leveledUp) {
      const newLevel = this.languageManager.currentLevel;
      const rewards = [
        `More ${this.languageManager.config.name} in conversations`,
        `New grammar focus: ${this.languageManager.getCurrentDifficulty().grammar}`,
        `Unlocked new vocabulary!`
      ];
      
      // Trigger level up modal
      window.linguaWorlds?.showLevelUp(newLevel, rewards);
    }
  }

  endConversation() {
    this.hideConversationUI();
    
    // Stop any playing audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    // Update final stats
    this.progressionSystem.recordConversation({
      turns: this.conversationTurns,
      wordsLearned: this.wordsLearned,
      language: this.languageManager.langCode
    });
  }
}

