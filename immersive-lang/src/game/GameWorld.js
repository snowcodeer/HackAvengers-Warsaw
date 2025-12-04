// GameWorld - 3D immersive environment using Three.js
import * as THREE from 'three';
import { EnvironmentBuilder } from './EnvironmentBuilder.js';

export class GameWorld {
  constructor(canvas, languageConfig, conversationManager) {
    this.canvas = canvas;
    this.config = languageConfig;
    this.conversationManager = conversationManager;
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    
    this.player = { position: new THREE.Vector3(0, 1.6, 5), rotation: 0 };
    this.npc = null;
    this.environment = null;
    
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.isPointerLocked = false;
    this.isInConversation = false;
    
    this.init();
  }

  init() {
    this.setupScene();
    this.setupRenderer();
    this.setupCamera();
    this.setupLighting();
    this.setupControls();
    
    // Build environment based on language config
    this.environment = new EnvironmentBuilder(this.scene, this.config);
    this.environment.build();
    
    // Create NPC
    this.createNPC();
    
    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  setupScene() {
    this.scene = new THREE.Scene();
    
    // Set background based on theme
    const theme = this.config.visualStyle.theme;
    if (theme.includes('night') || theme.includes('industrial')) {
      this.scene.background = new THREE.Color(0x0a0a0f);
      this.scene.fog = new THREE.Fog(0x0a0a0f, 5, 30);
    } else if (theme.includes('morning')) {
      this.scene.background = new THREE.Color(0x87ceeb);
      this.scene.fog = new THREE.Fog(0xf5e6d3, 10, 50);
    } else {
      this.scene.background = new THREE.Color(0x1a1a2e);
      this.scene.fog = new THREE.Fog(0x1a1a2e, 8, 40);
    }
    
    this.clock = new THREE.Clock();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.copy(this.player.position);
  }

  setupLighting() {
    const theme = this.config.visualStyle.theme;
    
    // Ambient light
    const ambientIntensity = theme.includes('night') ? 0.2 : 0.5;
    const ambient = new THREE.AmbientLight(0xffffff, ambientIntensity);
    this.scene.add(ambient);
    
    // Main directional light
    if (theme.includes('morning')) {
      // Warm morning light
      const sunlight = new THREE.DirectionalLight(0xffd4a6, 1.2);
      sunlight.position.set(5, 10, 5);
      sunlight.castShadow = true;
      sunlight.shadow.mapSize.width = 2048;
      sunlight.shadow.mapSize.height = 2048;
      sunlight.shadow.camera.near = 0.5;
      sunlight.shadow.camera.far = 50;
      this.scene.add(sunlight);
    } else if (theme.includes('night') || theme.includes('industrial')) {
      // Moody club lighting
      const redLight = new THREE.SpotLight(0xff0000, 2);
      redLight.position.set(-5, 8, 0);
      redLight.angle = Math.PI / 4;
      redLight.penumbra = 0.3;
      this.scene.add(redLight);
      
      const blueLight = new THREE.SpotLight(0x0066ff, 1.5);
      blueLight.position.set(5, 8, 0);
      blueLight.angle = Math.PI / 4;
      blueLight.penumbra = 0.3;
      this.scene.add(blueLight);
    } else {
      // Standard warm lighting
      const mainLight = new THREE.DirectionalLight(0xffeedd, 0.8);
      mainLight.position.set(3, 8, 5);
      mainLight.castShadow = true;
      this.scene.add(mainLight);
    }
    
    // Point lights for atmosphere
    const accentColor = new THREE.Color(this.config.visualStyle.accentColor);
    const accentLight = new THREE.PointLight(accentColor, 0.5, 10);
    accentLight.position.set(0, 3, 0);
    this.scene.add(accentLight);
  }

  createNPC() {
    this.npc = new THREE.Group();
    
    const character = this.config.character;
    
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 8, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.visualStyle.primaryColor),
      roughness: 0.7,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    this.npc.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd5c2,
      roughness: 0.8
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.85;
    head.castShadow = true;
    this.npc.add(head);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x2c2c2c });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.08, 1.88, 0.2);
    this.npc.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.08, 1.88, 0.2);
    this.npc.add(rightEye);
    
    // Character-specific accessories
    this.addCharacterAccessories(character);
    
    // Position NPC in scene
    this.npc.position.set(0, 0, 0);
    this.npc.userData.name = character.name;
    this.npc.userData.isNPC = true;
    
    this.scene.add(this.npc);
  }

  addCharacterAccessories(character) {
    // Add character-specific items based on emoji/role
    const emoji = character.emoji;
    
    if (emoji === '👩‍🍳' || emoji === '☕') {
      // Chef/Barista - add apron
      const apronGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.1);
      const apronMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const apron = new THREE.Mesh(apronGeometry, apronMaterial);
      apron.position.set(0, 0.8, 0.25);
      this.npc.add(apron);
    }
    
    if (emoji === '🎧') {
      // DJ - add headphones
      const headphoneGeometry = new THREE.TorusGeometry(0.28, 0.04, 8, 16, Math.PI);
      const headphoneMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
      const headphones = new THREE.Mesh(headphoneGeometry, headphoneMaterial);
      headphones.rotation.z = Math.PI;
      headphones.position.set(0, 2, 0);
      this.npc.add(headphones);
    }
    
    if (emoji === '🍺') {
      // Pub landlady - add mug
      const mugGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.12, 8);
      const mugMaterial = new THREE.MeshStandardMaterial({ color: 0xc77c48 });
      const mug = new THREE.Mesh(mugGeometry, mugMaterial);
      mug.position.set(0.4, 1.2, 0.2);
      this.npc.add(mug);
    }
    
    if (emoji === '💃') {
      // Flamenco dancer - add flower
      const flowerGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const flowerMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
      const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
      flower.position.set(0.2, 2, 0);
      this.npc.add(flower);
    }
  }

  setupControls() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      
      // Interact with NPC
      if (e.code === 'KeyE' && this.isNearNPC() && !this.isInConversation) {
        this.startConversation();
      }
      
      // Escape to end conversation
      if (e.code === 'Escape' && this.isInConversation) {
        this.endConversation();
      }
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    
    // Mouse controls
    this.canvas.addEventListener('click', () => {
      if (!this.isInConversation) {
        this.canvas.requestPointerLock();
      }
    });
    
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.canvas;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked && !this.isInConversation) {
        this.mouseX += e.movementX * 0.002;
        this.mouseY += e.movementY * 0.002;
        this.mouseY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.mouseY));
      }
    });
    
    // Microphone controls
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
      micBtn.addEventListener('mousedown', () => {
        if (this.isInConversation) {
          this.conversationManager.startRecording();
        }
      });
      
      micBtn.addEventListener('mouseup', () => {
        if (this.isInConversation) {
          this.conversationManager.stopRecording();
        }
      });
      
      micBtn.addEventListener('mouseleave', () => {
        if (this.isInConversation) {
          this.conversationManager.stopRecording();
        }
      });
    }
  }

  isNearNPC() {
    if (!this.npc) return false;
    const distance = this.camera.position.distanceTo(this.npc.position);
    return distance < 3;
  }

  async startConversation() {
    this.isInConversation = true;
    document.exitPointerLock();
    
    // Show interaction prompt
    document.getElementById('interactPrompt').classList.add('hidden');
    
    // Face the NPC
    const dirToNPC = new THREE.Vector3()
      .subVectors(this.npc.position, this.camera.position)
      .normalize();
    this.player.rotation = Math.atan2(dirToNPC.x, dirToNPC.z);
    
    // Make NPC face player
    const dirToPlayer = new THREE.Vector3()
      .subVectors(this.camera.position, this.npc.position)
      .normalize();
    this.npc.rotation.y = Math.atan2(dirToPlayer.x, dirToPlayer.z);
    
    // Start conversation through manager
    await this.conversationManager.startConversation(this.config.character);
  }

  endConversation() {
    this.isInConversation = false;
    this.conversationManager.endConversation();
  }

  updatePlayer(delta) {
    if (this.isInConversation) return;
    
    const speed = 4;
    const direction = new THREE.Vector3();
    
    // Get camera direction
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mouseX);
    
    const right = new THREE.Vector3(1, 0, 0);
    right.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mouseX);
    
    // Movement
    if (this.keys['KeyW']) direction.add(forward);
    if (this.keys['KeyS']) direction.sub(forward);
    if (this.keys['KeyA']) direction.sub(right);
    if (this.keys['KeyD']) direction.add(right);
    
    if (direction.length() > 0) {
      direction.normalize();
      this.player.position.add(direction.multiplyScalar(speed * delta));
      this.player.position.y = 1.6; // Keep at eye level
    }
    
    // Update camera
    this.camera.position.copy(this.player.position);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = -this.mouseX;
    this.camera.rotation.x = -this.mouseY;
  }

  updateNPC(delta) {
    if (!this.npc) return;
    
    // Idle animation - subtle breathing/movement
    const time = this.clock.getElapsedTime();
    this.npc.position.y = Math.sin(time * 2) * 0.02;
    
    // Face player when nearby
    if (this.isNearNPC() && !this.isInConversation) {
      const dirToPlayer = new THREE.Vector3()
        .subVectors(this.camera.position, this.npc.position)
        .normalize();
      const targetRotation = Math.atan2(dirToPlayer.x, dirToPlayer.z);
      this.npc.rotation.y += (targetRotation - this.npc.rotation.y) * 0.05;
    }
    
    // Show/hide interaction prompt
    const prompt = document.getElementById('interactPrompt');
    if (this.isNearNPC() && !this.isInConversation) {
      prompt.classList.remove('hidden');
    } else if (!this.isInConversation) {
      prompt.classList.add('hidden');
    }
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  start() {
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    
    this.updatePlayer(delta);
    this.updateNPC(delta);
    
    if (this.environment) {
      this.environment.update(delta);
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

