// ═══════════════════════════════════════════════════════════════════════════════
// LINGUAVERSE - Ultra-Detailed 3D Scene Builder
// Creates immersive, prop-rich environments for language learning
// ═══════════════════════════════════════════════════════════════════════════════

import * as THREE from 'three';

export class SceneBuilder {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.animatedObjects = [];
    this.interactiveObjects = [];
    this.lights = [];
    this.audioSources = [];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN BUILD METHOD
  // ═══════════════════════════════════════════════════════════════════════════
  build() {
    const sceneType = this.config.scene.name.toLowerCase();
    
    // Build appropriate scene based on language
    if (sceneType.includes('boulangerie') || sceneType.includes('bakery')) {
      this.buildFrenchBoulangerie();
    } else if (sceneType.includes('tea house') || sceneType.includes('sakura')) {
      this.buildJapaneseTeaHouse();
    } else if (sceneType.includes('tapas') || sceneType.includes('flamenco')) {
      this.buildSpanishTapasBar();
    } else if (sceneType.includes('bunker') || sceneType.includes('klang')) {
      this.buildBerlinClub();
    } else if (sceneType.includes('caffè') || sceneType.includes('rome')) {
      this.buildItalianCafe();
    } else if (sceneType.includes('dragon well') || sceneType.includes('beijing')) {
      this.buildChineseTeaHouse();
    } else if (sceneType.includes('pierogi') || sceneType.includes('warsaw')) {
      this.buildPolishMilkBar();
    } else {
      this.buildGenericScene();
    }
    
    // Apply lighting from config
    this.applyLighting();
    
    return {
      animated: this.animatedObjects,
      interactive: this.interactiveObjects,
      lights: this.lights
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FRENCH BOULANGERIE - Paris Morning Bakery
  // ═══════════════════════════════════════════════════════════════════════════
  buildFrenchBoulangerie() {
    // Floor - Hexagonal vintage tiles
    this.createHexagonalTileFloor(15, 15, ['#F5DEB3', '#8B4513']);
    
    // Walls - Cream with wainscoting
    this.createWallsWithWainscoting('#FFF8DC', '#8B7355', 4);
    
    // Main Display Counter (Marble with brass trim)
    const counter = this.createDisplayCounter({
      width: 5,
      height: 1.1,
      depth: 0.9,
      material: 'marble',
      color: '#F5F5DC',
      trim: '#B8860B'
    });
    counter.position.set(0, 0.55, -3);
    this.scene.add(counter);
    
    // Glass Display Case
    const displayCase = this.createGlassCase(4.5, 0.9, 0.7);
    displayCase.position.set(0, 1.55, -3);
    this.scene.add(displayCase);
    
    // Croissants - Detailed pyramid arrangement
    this.createCroissantDisplay({ x: -1.5, y: 1.15, z: -3 }, 24, 'pyramid');
    
    // Pain au Chocolat
    this.createPainAuChocolatDisplay({ x: 0.5, y: 1.15, z: -3 }, 18);
    
    // Éclairs Display
    this.createEclairDisplay({ x: 1.5, y: 1.15, z: -3 }, ['chocolat', 'café', 'vanille']);
    
    // Bread Shelves on Back Wall
    this.createBreadShelves({ x: 0, y: 0, z: -6 }, 4);
    
    // Baguette Baskets
    this.createBaguetteBasket({ x: 3, y: 0, z: -2 }, 8);
    this.createBaguetteBasket({ x: -3, y: 0, z: -2 }, 6);
    
    // Vintage Coffee Machine
    this.createVintageCoffeeMachine({ x: 3, y: 1.1, z: -4 });
    
    // Cash Register (Antique brass)
    this.createAntiqueCashRegister({ x: -2, y: 1.1, z: -3.3 });
    
    // Art Nouveau Mirror
    this.createArtNouveauMirror({ x: 0, y: 2.5, z: -6.4 });
    
    // Vintage Clock
    this.createVintageClock({ x: -4, y: 3, z: -6.4 });
    
    // Chalkboard Menu
    this.createChalkboardMenu({ x: 3, y: 2.2, z: -6.4 }, ['Café', 'Thé', 'Chocolat Chaud']);
    
    // Dried Lavender Bundles
    this.createLavenderBundles([{ x: -4, y: 1.5, z: -5.5 }, { x: 4, y: 1.5, z: -5.5 }]);
    
    // Antique Brass Scale
    this.createAntiqueBrassScale({ x: -1.2, y: 1.1, z: -3 });
    
    // Fresh Flowers (Sunflowers in blue vase)
    this.createFlowerVase({ x: 2, y: 1.1, z: -4 }, 'sunflowers', '#4169E1');
    
    // Tall French Windows
    this.createFrenchWindows([{ x: -5, y: 0, z: -3 }, { x: 5, y: 0, z: -3 }]);
    
    // Door with Bell
    this.createShopDoor({ x: 0, y: 0, z: 5 });
    
    // Pressed Tin Ceiling
    this.createPressedTinCeiling(15, 15, 4);
    
    // Warm Pendant Lights
    this.createPendantLights([
      { x: -2, y: 3.2, z: 0 },
      { x: 2, y: 3.2, z: 0 },
      { x: 0, y: 3.2, z: -3 }
    ], '#FFD700', 0.8);
    
    // Exterior View Elements (visible through windows)
    this.createExteriorView('paris');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // JAPANESE TEA HOUSE - Kyoto Serenity
  // ═══════════════════════════════════════════════════════════════════════════
  buildJapaneseTeaHouse() {
    // Tatami Floor
    this.createTatamiFloor(12, 10);
    
    // Shoji Screen Walls
    this.createShojiWalls(12, 10, 3);
    
    // Tokonoma Alcove
    this.createTokonoma({ x: -5, y: 0, z: -4 });
    
    // Sunken Hearth (Ro)
    this.createSunkenHearth({ x: 0, y: 0, z: -1 });
    
    // Tea Ceremony Setup
    this.createTeaCeremonySet({ x: 0, y: 0.3, z: -1.5 });
    
    // Low Table
    this.createLowTable({ x: 0, y: 0, z: 0 }, 1.8, 0.3, 1.2, '#4A3020');
    
    // Zabuton Cushions
    this.createZabuton([
      { x: -0.6, y: 0.05, z: 0.8 },
      { x: 0.6, y: 0.05, z: 0.8 },
      { x: 0, y: 0.05, z: -2.5 }
    ], '#1E3A5F');
    
    // Ikebana Arrangement
    this.createIkebana({ x: -5, y: 0.5, z: -4 });
    
    // Hanging Scroll with Calligraphy
    this.createHangingScroll({ x: -5, y: 2, z: -4.8 }, '和敬清寂');
    
    // Paper Lanterns
    this.createPaperLanterns([
      { x: -3, y: 2.5, z: 0 },
      { x: 3, y: 2.5, z: 0 }
    ], '#FF4500');
    
    // Bamboo Plants
    this.createBambooPlants([
      { x: 5, y: 0, z: -3 },
      { x: -5, y: 0, z: 2 }
    ]);
    
    // View to Zen Garden (through open fusuma)
    this.createZenGardenView({ x: 5, y: 0, z: 0 });
    
    // Engawa Veranda
    this.createEngawa({ x: 5.5, y: 0, z: 0 }, 3, 8);
    
    // Cherry Blossom Tree (visible outside)
    this.createCherryBlossomTree({ x: 8, y: 0, z: 0 });
    
    // Shishi-odoshi (bamboo fountain)
    this.createShishiOdoshi({ x: 7, y: 0.5, z: -2 });
    
    // Stone Lantern
    this.createStoneLantern({ x: 7, y: 0, z: 2 });
    
    // Ceiling (exposed wood sukiya style)
    this.createSukiyaCeiling(12, 10, 3);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SPANISH TAPAS BAR - Madrid Evening
  // ═══════════════════════════════════════════════════════════════════════════
  buildSpanishTapasBar() {
    // Terracotta Tile Floor
    this.createTerracottaFloor(15, 12);
    
    // Talavera Tile Walls
    this.createTalaveraWalls(15, 12, 4);
    
    // Zinc Bar Counter
    const bar = this.createBarCounter(6, 1.2, 0.8, '#708090', '#8B4513');
    bar.position.set(0, 0.6, -4);
    this.scene.add(bar);
    
    // Hanging Jamón
    this.createHangingJamon([
      { x: -2, y: 2.8, z: -4.5 },
      { x: 0, y: 2.9, z: -4.5 },
      { x: 2, y: 2.7, z: -4.5 }
    ]);
    
    // Tapas Display Case
    this.createTapasDisplay({ x: -3, y: 1, z: -4 });
    
    // Wine Bottles Display
    this.createWineRack({ x: 0, y: 1.3, z: -5.5 }, ['rioja', 'ribera', 'cava']);
    
    // Manchego Cheese Wheels
    this.createCheeseDisplay({ x: 2, y: 1.2, z: -4 });
    
    // Olive Bowls
    this.createOliveBowls({ x: 1, y: 1.2, z: -3.8 });
    
    // Flamenco Stage
    this.createFlamencoStage({ x: 4, y: 0, z: -3 });
    
    // Spanish Guitar (mounted)
    this.createMountedGuitar({ x: -5, y: 2, z: -5.8 });
    
    // Bullfighting Posters
    this.createVintagePosters([
      { x: -4, y: 2.2, z: -5.9 },
      { x: 4, y: 2.2, z: -5.9 }
    ], 'bullfighting');
    
    // Wine Barrel Tables
    this.createBarrelTables([
      { x: -3, y: 0, z: 1 },
      { x: 3, y: 0, z: 1 },
      { x: 0, y: 0, z: 3 }
    ]);
    
    // Castanets Display
    this.createCastanetsDisplay({ x: 5, y: 1.8, z: -5.9 });
    
    // Hanging Garlic Braids
    this.createGarlicBraids([
      { x: -3, y: 2.5, z: -5 },
      { x: 3, y: 2.5, z: -5 }
    ]);
    
    // Warm Pendant Lights with Orange Glow
    this.createPendantLights([
      { x: -2, y: 2.8, z: 0 },
      { x: 2, y: 2.8, z: 0 }
    ], '#FF8C00', 1);
    
    // Arched Doorway
    this.createArchedDoorway({ x: 0, y: 0, z: 6 });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BERLIN TECHNO CLUB - Underground Experience
  // ═══════════════════════════════════════════════════════════════════════════
  buildBerlinClub() {
    // Raw Concrete Floor
    this.createConcreteFloor(20, 15);
    
    // Concrete Walls with Industrial Pipes
    this.createIndustrialWalls(20, 15, 5);
    
    // DJ Booth Platform
    this.createDJBooth({ x: 0, y: 0, z: -6 });
    
    // Massive Speaker Stacks
    this.createSpeakerStack({ x: -5, y: 0, z: -5 });
    this.createSpeakerStack({ x: 5, y: 0, z: -5 });
    
    // Subwoofers Under Booth
    this.createSubwoofers({ x: 0, y: 0, z: -6.5 }, 4);
    
    // Bar (Minimal Concrete)
    const clubBar = this.createMinimalBar(4, 1.1, 0.6, '#2F2F2F');
    clubBar.position.set(-7, 0.55, 0);
    this.scene.add(clubBar);
    
    // Club Mate & Beer Bottles
    this.createClubDrinks({ x: -7, y: 1.2, z: 0 });
    
    // Industrial Pipes
    this.createIndustrialPipes();
    
    // Graffiti Art on Walls
    this.createGraffitiPanels([
      { x: -9.8, y: 2, z: -3 },
      { x: 9.8, y: 2, z: -3 }
    ]);
    
    // Fog Machine Effect
    this.createFogEffect({ x: 0, y: 0.5, z: 0 });
    
    // Strobe Lights
    this.createStrobeLights([
      { x: -4, y: 4, z: -2 },
      { x: 4, y: 4, z: -2 },
      { x: 0, y: 4.5, z: -4 }
    ]);
    
    // Red LED Strips
    this.createLEDStrips('walls', '#FF0000');
    
    // Laser Effects
    this.createLaserBeams({ x: 0, y: 4, z: -6 }, '#00FF00');
    
    // Concrete Pillars
    this.createConcretePillars([
      { x: -4, y: 0, z: 2 },
      { x: 4, y: 0, z: 2 }
    ]);
    
    // Dark Ceiling with Exposed Ductwork
    this.createIndustrialCeiling(20, 15, 5);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // POLISH MILK BAR - Warsaw Tradition
  // ═══════════════════════════════════════════════════════════════════════════
  buildPolishMilkBar() {
    // Linoleum Floor (vintage pattern)
    this.createVintageLinoleumFloor(12, 10, '#F5DEB3', '#8B7355');
    
    // Simple Painted Walls
    this.createSimpleWalls(12, 10, 3.5, '#FFF8DC');
    
    // Serving Counter
    const counter = this.createServingCounter(5, 1.1, 0.7, '#FFFFFF', '#8B4513');
    counter.position.set(0, 0.55, -3.5);
    this.scene.add(counter);
    
    // Food Display (pierogi, barszcz, etc.)
    this.createMilkBarFoodDisplay({ x: 0, y: 1.1, z: -3.5 });
    
    // Pierogi Station
    this.createPierogiStation({ x: -2, y: 1.1, z: -3.5 });
    
    // Soup Pots (Barszcz & Żurek)
    this.createSoupPots({ x: 2, y: 1.1, z: -3.5 });
    
    // Simple Wooden Tables
    this.createSimpleTables([
      { x: -3, y: 0, z: 1 },
      { x: 0, y: 0, z: 1 },
      { x: 3, y: 0, z: 1 },
      { x: -1.5, y: 0, z: 3 },
      { x: 1.5, y: 0, z: 3 }
    ]);
    
    // Checkered Tablecloths
    this.addTablecloths('red_white_checkered');
    
    // Vintage PRL Posters
    this.createVintagePosters([
      { x: -4, y: 2, z: -4.8 },
      { x: 4, y: 2, z: -4.8 }
    ], 'polish_prl');
    
    // Folk Art (Wycinanki)
    this.createFolkArt([
      { x: -5.8, y: 2, z: 0 },
      { x: 5.8, y: 2, z: 0 }
    ]);
    
    // Old Warsaw Photos
    this.createPhotoGallery({ x: 0, y: 2.2, z: -4.8 }, 'old_warsaw');
    
    // Amber Jewelry Display (small)
    this.createAmberDisplay({ x: 4, y: 1.2, z: -4 });
    
    // Condiment Station
    this.createCondimentStation({ x: -1, y: 0.75, z: 1 });
    
    // Menu Board
    this.createPolishMenuBoard({ x: -3, y: 2.3, z: -4.8 });
    
    // Simple Fluorescent Lights
    this.createFluorescentLights([
      { x: -2, y: 3.2, z: 0 },
      { x: 2, y: 3.2, z: 0 }
    ]);
    
    // Window with Old Town View
    this.createWindowWithView({ x: 5, y: 1, z: 0 }, 'warsaw_old_town');
    
    // Dried Wildflowers
    this.createDriedFlowers({ x: 0, y: 0.75, z: 1 });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS - Creating Specific Props
  // ═══════════════════════════════════════════════════════════════════════════

  // Floor Types
  createHexagonalTileFloor(width, depth, colors) {
    const floorGroup = new THREE.Group();
    const tileSize = 0.5;
    
    for (let x = -width/2; x < width/2; x += tileSize * 1.5) {
      for (let z = -depth/2; z < depth/2; z += tileSize * 0.866) {
        const colorIndex = Math.floor(Math.random() * colors.length);
        const geometry = new THREE.CylinderGeometry(tileSize/2, tileSize/2, 0.02, 6);
        const material = new THREE.MeshStandardMaterial({ 
          color: colors[colorIndex],
          roughness: 0.8
        });
        const tile = new THREE.Mesh(geometry, material);
        tile.rotation.y = Math.PI / 6;
        tile.position.set(x + (Math.floor(z) % 2) * tileSize * 0.75, 0.01, z);
        tile.receiveShadow = true;
        floorGroup.add(tile);
      }
    }
    this.scene.add(floorGroup);
  }

  createTatamiFloor(width, depth) {
    const tatamiGroup = new THREE.Group();
    const matWidth = 1.8;
    const matDepth = 0.9;
    
    for (let x = -width/2; x < width/2; x += matWidth) {
      for (let z = -depth/2; z < depth/2; z += matDepth) {
        const geometry = new THREE.BoxGeometry(matWidth - 0.02, 0.05, matDepth - 0.02);
        const material = new THREE.MeshStandardMaterial({
          color: '#C4B896',
          roughness: 0.9
        });
        const mat = new THREE.Mesh(geometry, material);
        mat.position.set(x + matWidth/2, 0.025, z + matDepth/2);
        mat.receiveShadow = true;
        tatamiGroup.add(mat);
        
        // Dark border
        const borderGeometry = new THREE.BoxGeometry(matWidth, 0.055, 0.02);
        const borderMaterial = new THREE.MeshStandardMaterial({ color: '#2C1810' });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.set(x + matWidth/2, 0.0275, z);
        tatamiGroup.add(border);
      }
    }
    this.scene.add(tatamiGroup);
  }

  createTerracottaFloor(width, depth) {
    const geometry = new THREE.PlaneGeometry(width, depth);
    const material = new THREE.MeshStandardMaterial({
      color: '#CD853F',
      roughness: 0.85
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createConcreteFloor(width, depth) {
    const geometry = new THREE.PlaneGeometry(width, depth);
    const material = new THREE.MeshStandardMaterial({
      color: '#4A4A4A',
      roughness: 0.95,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createVintageLinoleumFloor(width, depth, color1, color2) {
    const geometry = new THREE.PlaneGeometry(width, depth);
    const material = new THREE.MeshStandardMaterial({
      color: color1,
      roughness: 0.6
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  // Wall Types
  createWallsWithWainscoting(wallColor, wainscotColor, height) {
    const roomSize = 12;
    const wallMaterial = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.9 });
    const wainscotMaterial = new THREE.MeshStandardMaterial({ color: wainscotColor, roughness: 0.7 });
    
    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize, height),
      wallMaterial
    );
    backWall.position.set(0, height/2, -roomSize/2);
    backWall.receiveShadow = true;
    this.scene.add(backWall);
    
    // Wainscoting
    const wainscot = new THREE.Mesh(
      new THREE.BoxGeometry(roomSize, 1, 0.05),
      wainscotMaterial
    );
    wainscot.position.set(0, 0.5, -roomSize/2 + 0.03);
    this.scene.add(wainscot);
    
    // Side walls
    for (let side of [-1, 1]) {
      const sideWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomSize, height),
        wallMaterial
      );
      sideWall.position.set(side * roomSize/2, height/2, 0);
      sideWall.rotation.y = -side * Math.PI / 2;
      sideWall.receiveShadow = true;
      this.scene.add(sideWall);
    }
  }

  createShojiWalls(width, depth, height) {
    const wallGroup = new THREE.Group();
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#4A3020' });
    const paperMaterial = new THREE.MeshStandardMaterial({
      color: '#FFF5E6',
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    
    // Create shoji panel
    const createPanel = (w, h) => {
      const panel = new THREE.Group();
      
      // Paper
      const paper = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        paperMaterial
      );
      panel.add(paper);
      
      // Frame
      const frameWidth = 0.03;
      const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(w, frameWidth, frameWidth),
        frameMaterial
      );
      topFrame.position.y = h/2;
      panel.add(topFrame);
      
      const bottomFrame = new THREE.Mesh(
        new THREE.BoxGeometry(w, frameWidth, frameWidth),
        frameMaterial
      );
      bottomFrame.position.y = -h/2;
      panel.add(bottomFrame);
      
      // Vertical dividers
      const dividers = 4;
      for (let i = 0; i <= dividers; i++) {
        const divider = new THREE.Mesh(
          new THREE.BoxGeometry(frameWidth, h, frameWidth),
          frameMaterial
        );
        divider.position.x = -w/2 + (w/dividers) * i;
        panel.add(divider);
      }
      
      return panel;
    };
    
    // Back wall panels
    for (let x = -width/2 + 1; x < width/2; x += 2) {
      const panel = createPanel(1.8, height);
      panel.position.set(x, height/2, -depth/2);
      wallGroup.add(panel);
    }
    
    this.scene.add(wallGroup);
  }

  createTalaveraWalls(width, depth, height) {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#FFF8DC',
      roughness: 0.85
    });
    
    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      wallMaterial
    );
    backWall.position.set(0, height/2, -depth/2);
    backWall.receiveShadow = true;
    this.scene.add(backWall);
    
    // Add decorative tile strip
    const tileMaterial = new THREE.MeshStandardMaterial({ color: '#1E90FF' });
    const tileStrip = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.3, 0.02),
      tileMaterial
    );
    tileStrip.position.set(0, 1.2, -depth/2 + 0.02);
    this.scene.add(tileStrip);
  }

  createIndustrialWalls(width, depth, height) {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#3A3A3A',
      roughness: 0.95
    });
    
    for (let pos of [
      { x: 0, z: -depth/2, rotY: 0 },
      { x: -width/2, z: 0, rotY: Math.PI/2 },
      { x: width/2, z: 0, rotY: -Math.PI/2 }
    ]) {
      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        wallMaterial
      );
      wall.position.set(pos.x, height/2, pos.z);
      wall.rotation.y = pos.rotY;
      this.scene.add(wall);
    }
  }

  createSimpleWalls(width, depth, height, color) {
    const wallMaterial = new THREE.MeshStandardMaterial({ color: color, roughness: 0.9 });
    
    // Back
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMaterial);
    backWall.position.set(0, height/2, -depth/2);
    this.scene.add(backWall);
    
    // Sides
    for (let side of [-1, 1]) {
      const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(depth, height), wallMaterial);
      sideWall.position.set(side * width/2, height/2, 0);
      sideWall.rotation.y = -side * Math.PI/2;
      this.scene.add(sideWall);
    }
  }

  // Display Counters
  createDisplayCounter({ width, height, depth, material, color, trim }) {
    const group = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.BoxGeometry(width, height, depth);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: material === 'marble' ? 0.3 : 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // Brass trim
    const trimGeometry = new THREE.BoxGeometry(width + 0.05, 0.03, depth + 0.05);
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: trim,
      metalness: 0.8,
      roughness: 0.3
    });
    const topTrim = new THREE.Mesh(trimGeometry, trimMaterial);
    topTrim.position.y = height/2 + 0.015;
    group.add(topTrim);
    
    return group;
  }

  createGlassCase(width, height, depth) {
    const group = new THREE.Group();
    
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      transparent: true,
      opacity: 0.2,
      roughness: 0.1
    });
    
    // Glass panels
    const front = new THREE.Mesh(new THREE.PlaneGeometry(width, height), glassMaterial);
    front.position.z = depth/2;
    group.add(front);
    
    const back = new THREE.Mesh(new THREE.PlaneGeometry(width, height), glassMaterial);
    back.position.z = -depth/2;
    group.add(back);
    
    return group;
  }

  // Food Items - French
  createCroissantDisplay(position, count, arrangement) {
    const group = new THREE.Group();
    const croissantMaterial = new THREE.MeshStandardMaterial({
      color: '#DAA520',
      roughness: 0.7
    });
    
    for (let i = 0; i < count; i++) {
      const croissant = new THREE.Group();
      
      // Croissant shape (torus segment)
      const geometry = new THREE.TorusGeometry(0.08, 0.03, 8, 16, Math.PI);
      const mesh = new THREE.Mesh(geometry, croissantMaterial);
      mesh.rotation.x = -Math.PI / 2;
      croissant.add(mesh);
      
      // Position in pyramid
      const row = Math.floor(Math.sqrt(i));
      const col = i - row * row;
      croissant.position.set(
        col * 0.12 - row * 0.06,
        row * 0.04,
        (Math.random() - 0.5) * 0.1
      );
      
      group.add(croissant);
    }
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createPainAuChocolatDisplay(position, count) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: '#CD853F',
      roughness: 0.6
    });
    
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.BoxGeometry(0.12, 0.05, 0.08);
      const pastry = new THREE.Mesh(geometry, material);
      
      const row = Math.floor(i / 6);
      const col = i % 6;
      pastry.position.set(col * 0.14 - 0.35, row * 0.06, 0);
      group.add(pastry);
    }
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createEclairDisplay(position, flavors) {
    const group = new THREE.Group();
    
    const colors = {
      chocolat: '#3D2314',
      café: '#6F4E37',
      vanille: '#F5DEB3'
    };
    
    let index = 0;
    for (const flavor of flavors) {
      for (let i = 0; i < 5; i++) {
        const geometry = new THREE.CapsuleGeometry(0.03, 0.12, 4, 8);
        const material = new THREE.MeshStandardMaterial({
          color: colors[flavor],
          roughness: 0.4
        });
        const eclair = new THREE.Mesh(geometry, material);
        eclair.rotation.z = Math.PI / 2;
        eclair.position.set(i * 0.1 - 0.2, 0, index * 0.08 - 0.08);
        group.add(eclair);
      }
      index++;
    }
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createBreadShelves(position, shelfCount) {
    const group = new THREE.Group();
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: '#4A3020', roughness: 0.7 });
    const breadMaterial = new THREE.MeshStandardMaterial({ color: '#DAA520', roughness: 0.8 });
    
    for (let i = 0; i < shelfCount; i++) {
      // Shelf
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(5, 0.05, 0.4),
        shelfMaterial
      );
      shelf.position.y = 0.8 + i * 0.6;
      group.add(shelf);
      
      // Bread on shelf
      for (let j = 0; j < 8; j++) {
        const bread = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.08, 0.5, 4, 8),
          breadMaterial
        );
        bread.rotation.z = Math.PI / 2;
        bread.position.set(j * 0.55 - 1.9, 0.9 + i * 0.6, 0);
        group.add(bread);
      }
    }
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createBaguetteBasket(position, count) {
    const group = new THREE.Group();
    
    // Basket
    const basketMaterial = new THREE.MeshStandardMaterial({ color: '#DEB887', roughness: 0.9 });
    const basket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.35, 0.5, 12, 1, true),
      basketMaterial
    );
    basket.position.y = 0.25;
    group.add(basket);
    
    // Baguettes
    const breadMaterial = new THREE.MeshStandardMaterial({ color: '#D2B48C', roughness: 0.7 });
    for (let i = 0; i < count; i++) {
      const baguette = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.04, 0.6, 4, 8),
        breadMaterial
      );
      baguette.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
      baguette.rotation.z = (Math.random() - 0.5) * 0.5;
      baguette.position.set(
        (Math.random() - 0.5) * 0.3,
        0.4 + i * 0.05,
        0
      );
      group.add(baguette);
    }
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  // Equipment
  createVintageCoffeeMachine(position) {
    const group = new THREE.Group();
    
    // Main body (brass)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: '#B8860B',
      metalness: 0.8,
      roughness: 0.3
    });
    
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.18, 0.4, 16),
      bodyMaterial
    );
    body.position.y = 0.2;
    group.add(body);
    
    // Top dome
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      bodyMaterial
    );
    dome.position.y = 0.4;
    group.add(dome);
    
    // Pressure gauge
    const gauge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
    );
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(0, 0.3, 0.17);
    group.add(gauge);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createAntiqueCashRegister(position) {
    const group = new THREE.Group();
    
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: '#B8860B',
      metalness: 0.7,
      roughness: 0.4
    });
    
    // Main body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.25, 0.3),
      brassMaterial
    );
    body.position.y = 0.125;
    group.add(body);
    
    // Number display
    const display = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.08, 0.02),
      new THREE.MeshStandardMaterial({ color: '#1A1A1A' })
    );
    display.position.set(0, 0.25, 0.16);
    group.add(display);
    
    // Keys
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const key = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.02, 8),
          brassMaterial
        );
        key.position.set(col * 0.05 - 0.075, 0.27, -0.05 - row * 0.04);
        group.add(key);
      }
    }
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  // Decorative Elements
  createArtNouveauMirror(position) {
    const group = new THREE.Group();
    
    // Mirror surface
    const mirrorMaterial = new THREE.MeshStandardMaterial({
      color: '#C0C0C0',
      metalness: 0.9,
      roughness: 0.1
    });
    const mirror = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 1.2),
      mirrorMaterial
    );
    group.add(mirror);
    
    // Gilded frame
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: '#FFD700',
      metalness: 0.6,
      roughness: 0.4
    });
    const frameWidth = 0.08;
    
    // Frame pieces
    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.96, frameWidth, 0.03),
      frameMaterial
    );
    topFrame.position.y = 0.64;
    group.add(topFrame);
    
    const bottomFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.96, frameWidth, 0.03),
      frameMaterial
    );
    bottomFrame.position.y = -0.64;
    group.add(bottomFrame);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createVintageClock(position) {
    const group = new THREE.Group();
    
    // Clock face
    const face = new THREE.Mesh(
      new THREE.CircleGeometry(0.25, 32),
      new THREE.MeshStandardMaterial({ color: '#FFF8DC' })
    );
    group.add(face);
    
    // Frame
    const frame = new THREE.Mesh(
      new THREE.TorusGeometry(0.27, 0.03, 8, 32),
      new THREE.MeshStandardMaterial({ color: '#8B4513' })
    );
    group.add(frame);
    
    // Hands
    const hourHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.12, 0.01),
      new THREE.MeshStandardMaterial({ color: '#1A1A1A' })
    );
    hourHand.position.y = 0.05;
    hourHand.rotation.z = Math.PI / 6;
    group.add(hourHand);
    
    const minuteHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.18, 0.01),
      new THREE.MeshStandardMaterial({ color: '#1A1A1A' })
    );
    minuteHand.position.y = 0.08;
    group.add(minuteHand);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createChalkboardMenu(position, items) {
    const group = new THREE.Group();
    
    // Board
    const board = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.6),
      new THREE.MeshStandardMaterial({ color: '#2F4F4F' })
    );
    group.add(board);
    
    // Wooden frame
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#8B4513' });
    const frameWidth = 0.04;
    
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.88, frameWidth, 0.02), frameMaterial);
    top.position.y = 0.32;
    group.add(top);
    
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.88, frameWidth, 0.02), frameMaterial);
    bottom.position.y = -0.32;
    group.add(bottom);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createLavenderBundles(positions) {
    const material = new THREE.MeshStandardMaterial({ color: '#9370DB' });
    
    for (const pos of positions) {
      const bundle = new THREE.Group();
      
      for (let i = 0; i < 12; i++) {
        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.003, 0.003, 0.25, 4),
          new THREE.MeshStandardMaterial({ color: '#228B22' })
        );
        stem.position.set((Math.random() - 0.5) * 0.05, 0.125, (Math.random() - 0.5) * 0.05);
        stem.rotation.z = (Math.random() - 0.5) * 0.2;
        bundle.add(stem);
        
        const flower = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.006, 0.04, 6),
          material
        );
        flower.position.set(stem.position.x, 0.26, stem.position.z);
        bundle.add(flower);
      }
      
      bundle.position.set(pos.x, pos.y, pos.z);
      this.scene.add(bundle);
    }
  }

  createAntiqueBrassScale(position) {
    const group = new THREE.Group();
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: '#B8860B',
      metalness: 0.7,
      roughness: 0.3
    });
    
    // Base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.02, 0.12),
      brassMaterial
    );
    group.add(base);
    
    // Center post
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.02, 0.25, 8),
      brassMaterial
    );
    post.position.y = 0.135;
    group.add(post);
    
    // Beam
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.015, 0.015),
      brassMaterial
    );
    beam.position.y = 0.25;
    group.add(beam);
    
    // Pans
    for (let side of [-1, 1]) {
      const pan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.04, 0.02, 16),
        brassMaterial
      );
      pan.position.set(side * 0.1, 0.2, 0);
      group.add(pan);
    }
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createFlowerVase(position, flowerType, vaseColor) {
    const group = new THREE.Group();
    
    // Vase
    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: vaseColor, roughness: 0.3 })
    );
    vase.position.y = 0.1;
    group.add(vase);
    
    // Flowers
    for (let i = 0; i < 5; i++) {
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, 0.25, 4),
        new THREE.MeshStandardMaterial({ color: '#228B22' })
      );
      stem.position.set(
        (Math.random() - 0.5) * 0.04,
        0.325,
        (Math.random() - 0.5) * 0.04
      );
      stem.rotation.z = (Math.random() - 0.5) * 0.3;
      group.add(stem);
      
      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshStandardMaterial({ color: '#FFD700' })
      );
      flower.position.copy(stem.position);
      flower.position.y += 0.15;
      group.add(flower);
    }
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  // Windows and Doors
  createFrenchWindows(positions) {
    for (const pos of positions) {
      const windowGroup = new THREE.Group();
      
      // Frame
      const frameMaterial = new THREE.MeshStandardMaterial({ color: '#FFFFFF' });
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2.5, 0.1),
        frameMaterial
      );
      frame.position.y = 1.25;
      windowGroup.add(frame);
      
      // Glass
      const glassMaterial = new THREE.MeshStandardMaterial({
        color: '#87CEEB',
        transparent: true,
        opacity: 0.4
      });
      const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 2.3),
        glassMaterial
      );
      glass.position.set(0, 1.25, 0.06);
      windowGroup.add(glass);
      
      // Muntins (window dividers)
      for (let row = 0; row < 4; row++) {
        const horizontal = new THREE.Mesh(
          new THREE.BoxGeometry(1, 0.02, 0.02),
          frameMaterial
        );
        horizontal.position.set(0, 0.3 + row * 0.6, 0.06);
        windowGroup.add(horizontal);
      }
      
      windowGroup.position.set(pos.x, pos.y, pos.z);
      this.scene.add(windowGroup);
    }
  }

  createShopDoor(position) {
    const group = new THREE.Group();
    
    // Door frame
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#2E8B57' });
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.5, 0.15),
      frameMaterial
    );
    frame.position.y = 1.25;
    group.add(frame);
    
    // Glass panel
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 1.8),
      new THREE.MeshStandardMaterial({
        color: '#87CEEB',
        transparent: true,
        opacity: 0.5
      })
    );
    glass.position.set(0, 1.4, 0.08);
    group.add(glass);
    
    // Door handle
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8),
      new THREE.MeshStandardMaterial({ color: '#B8860B', metalness: 0.8 })
    );
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0.35, 1, 0.1);
    group.add(handle);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  // Ceilings
  createPressedTinCeiling(width, depth, height) {
    const geometry = new THREE.PlaneGeometry(width, depth);
    const material = new THREE.MeshStandardMaterial({
      color: '#F5F5DC',
      roughness: 0.6,
      metalness: 0.2
    });
    const ceiling = new THREE.Mesh(geometry, material);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = height;
    this.scene.add(ceiling);
  }

  createSukiyaCeiling(width, depth, height) {
    const group = new THREE.Group();
    
    // Main ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshStandardMaterial({ color: '#DEB887', roughness: 0.8 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = height;
    group.add(ceiling);
    
    // Exposed beams
    const beamMaterial = new THREE.MeshStandardMaterial({ color: '#4A3020' });
    for (let x = -width/2 + 2; x < width/2; x += 2) {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.15, depth),
        beamMaterial
      );
      beam.position.set(x, height - 0.08, 0);
      group.add(beam);
    }
    
    this.scene.add(group);
  }

  createIndustrialCeiling(width, depth, height) {
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshStandardMaterial({ color: '#1A1A1A' })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = height;
    this.scene.add(ceiling);
    
    // Ductwork
    const ductMaterial = new THREE.MeshStandardMaterial({
      color: '#4A4A4A',
      metalness: 0.5
    });
    for (let x = -width/3; x <= width/3; x += width/3) {
      const duct = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, depth, 8),
        ductMaterial
      );
      duct.rotation.x = Math.PI / 2;
      duct.position.set(x, height - 0.5, 0);
      this.scene.add(duct);
    }
  }

  // Lighting
  createPendantLights(positions, color, intensity) {
    for (const pos of positions) {
      const group = new THREE.Group();
      
      // Cord
      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: '#1A1A1A' })
      );
      cord.position.y = 0.25;
      group.add(cord);
      
      // Shade
      const shade = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.2, 16, 1, true),
        new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.3,
          side: THREE.DoubleSide
        })
      );
      shade.rotation.x = Math.PI;
      group.add(shade);
      
      // Light source
      const light = new THREE.PointLight(color, intensity, 8);
      light.position.y = -0.1;
      group.add(light);
      this.lights.push(light);
      
      group.position.set(pos.x, pos.y, pos.z);
      this.scene.add(group);
    }
  }

  applyLighting() {
    const lightingConfig = this.config.scene.lighting;
    if (!lightingConfig) return;
    
    // Primary light
    if (lightingConfig.primary) {
      const primaryLight = new THREE.DirectionalLight(
        lightingConfig.primary.color,
        lightingConfig.primary.intensity
      );
      primaryLight.position.set(5, 10, 5);
      primaryLight.castShadow = true;
      this.scene.add(primaryLight);
      this.lights.push(primaryLight);
    }
    
    // Ambient light
    if (lightingConfig.secondary) {
      const ambientLight = new THREE.AmbientLight(
        lightingConfig.secondary.color,
        lightingConfig.secondary.intensity
      );
      this.scene.add(ambientLight);
    }
  }

  // Exterior Views
  createExteriorView(city) {
    // This would create a backdrop visible through windows
    // For now, we add a simple sky gradient
    const skyGeometry = new THREE.PlaneGeometry(50, 20);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: '#87CEEB'
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.position.set(0, 5, -20);
    this.scene.add(sky);
  }

  // Japanese specific
  createTokonoma(position) {
    const group = new THREE.Group();
    
    // Recessed alcove
    const alcove = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 2, 0.8),
      new THREE.MeshStandardMaterial({ color: '#DEB887' })
    );
    alcove.position.y = 1;
    group.add(alcove);
    
    // Platform
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.1, 0.7),
      new THREE.MeshStandardMaterial({ color: '#4A3020' })
    );
    platform.position.set(0, 0.05, 0.05);
    group.add(platform);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createSunkenHearth(position) {
    const group = new THREE.Group();
    
    // Pit
    const pit = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.3, 0.6),
      new THREE.MeshStandardMaterial({ color: '#2F2F2F' })
    );
    pit.position.y = -0.15;
    group.add(pit);
    
    // Kettle
    const kettle = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      new THREE.MeshStandardMaterial({ color: '#1A1A1A', metalness: 0.8 })
    );
    kettle.position.y = 0.15;
    group.add(kettle);
    
    // Glowing coals (point light)
    const coalLight = new THREE.PointLight('#FF4500', 0.5, 2);
    coalLight.position.y = -0.1;
    group.add(coalLight);
    this.lights.push(coalLight);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createTeaCeremonySet(position) {
    const group = new THREE.Group();
    
    // Chawan (tea bowl)
    const chawan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.05, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: '#1A1A1A', roughness: 0.6 })
    );
    chawan.position.set(0, 0.04, 0);
    group.add(chawan);
    
    // Chasen (whisk)
    const chasen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.025, 0.1, 8),
      new THREE.MeshStandardMaterial({ color: '#DEB887' })
    );
    chasen.position.set(0.12, 0.05, 0);
    group.add(chasen);
    
    // Natsume (tea caddy)
    const natsume = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.06, 16),
      new THREE.MeshStandardMaterial({ color: '#8B0000', roughness: 0.3 })
    );
    natsume.position.set(-0.1, 0.03, 0.05);
    group.add(natsume);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createLowTable(position, width, height, depth, color) {
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color: color, roughness: 0.6 })
    );
    table.position.set(position.x, position.y + height/2, position.z);
    table.castShadow = true;
    this.scene.add(table);
  }

  createZabuton(positions, color) {
    for (const pos of positions) {
      const cushion = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.05, 0.6),
        new THREE.MeshStandardMaterial({ color: color, roughness: 0.9 })
      );
      cushion.position.set(pos.x, pos.y, pos.z);
      this.scene.add(cushion);
    }
  }

  createIkebana(position) {
    const group = new THREE.Group();
    
    // Vase
    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: '#2F4F4F', roughness: 0.4 })
    );
    vase.position.y = 0.06;
    group.add(vase);
    
    // Branch
    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.008, 0.4, 4),
      new THREE.MeshStandardMaterial({ color: '#4A3020' })
    );
    branch.position.set(0, 0.3, 0);
    branch.rotation.z = 0.3;
    group.add(branch);
    
    // Flower
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 8, 8),
      new THREE.MeshStandardMaterial({ color: '#FFB6C1' })
    );
    flower.position.set(0.1, 0.45, 0);
    group.add(flower);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createHangingScroll(position, text) {
    const group = new THREE.Group();
    
    // Scroll paper
    const scroll = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.8),
      new THREE.MeshStandardMaterial({ color: '#FFF8DC', roughness: 0.9 })
    );
    group.add(scroll);
    
    // Roller at top
    const roller = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: '#4A3020' })
    );
    roller.rotation.z = Math.PI / 2;
    roller.position.y = 0.42;
    group.add(roller);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createPaperLanterns(positions, color) {
    for (const pos of positions) {
      const group = new THREE.Group();
      
      const lantern = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 16, 16),
        new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.8
        })
      );
      group.add(lantern);
      
      const light = new THREE.PointLight(color, 0.5, 4);
      group.add(light);
      this.lights.push(light);
      
      group.position.set(pos.x, pos.y, pos.z);
      this.scene.add(group);
    }
  }

  createBambooPlants(positions) {
    for (const pos of positions) {
      const group = new THREE.Group();
      
      for (let i = 0; i < 5; i++) {
        const stalk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.04, 2, 8),
          new THREE.MeshStandardMaterial({ color: '#228B22', roughness: 0.7 })
        );
        stalk.position.set(
          (Math.random() - 0.5) * 0.3,
          1,
          (Math.random() - 0.5) * 0.3
        );
        group.add(stalk);
      }
      
      group.position.set(pos.x, pos.y, pos.z);
      this.scene.add(group);
    }
  }

  createZenGardenView(position) {
    // Simplified zen garden visible through open door
    const group = new THREE.Group();
    
    // Gravel
    const gravel = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshStandardMaterial({ color: '#D3D3D3', roughness: 0.95 })
    );
    gravel.rotation.x = -Math.PI / 2;
    group.add(gravel);
    
    // Rocks
    for (let i = 0; i < 3; i++) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.2, 0),
        new THREE.MeshStandardMaterial({ color: '#696969', roughness: 0.9 })
      );
      rock.position.set(
        (Math.random() - 0.5) * 4,
        0.2,
        (Math.random() - 0.5) * 4
      );
      group.add(rock);
    }
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createEngawa(position, width, length) {
    const engawa = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.1, length),
      new THREE.MeshStandardMaterial({ color: '#8B7355', roughness: 0.7 })
    );
    engawa.position.set(position.x, position.y + 0.05, position.z);
    this.scene.add(engawa);
  }

  createCherryBlossomTree(position) {
    const group = new THREE.Group();
    
    // Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.25, 2, 8),
      new THREE.MeshStandardMaterial({ color: '#4A3020', roughness: 0.9 })
    );
    trunk.position.y = 1;
    group.add(trunk);
    
    // Foliage (cherry blossoms)
    const foliage = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 16, 16),
      new THREE.MeshStandardMaterial({ color: '#FFB6C1', roughness: 0.8 })
    );
    foliage.position.y = 2.5;
    group.add(foliage);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createShishiOdoshi(position) {
    const group = new THREE.Group();
    
    // Bamboo tube
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: '#228B22' })
    );
    tube.rotation.z = Math.PI / 6;
    tube.position.set(0, 0.2, 0);
    group.add(tube);
    
    // Basin
    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.12, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: '#696969' })
    );
    basin.position.y = 0.05;
    group.add(basin);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
    
    // Add to animated objects for water sound trigger
    this.animatedObjects.push({
      mesh: tube,
      type: 'shishi_odoshi',
      interval: 15000
    });
  }

  createStoneLantern(position) {
    const group = new THREE.Group();
    const stoneMaterial = new THREE.MeshStandardMaterial({ color: '#808080', roughness: 0.9 });
    
    // Base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 0.15, 6),
      stoneMaterial
    );
    base.position.y = 0.075;
    group.add(base);
    
    // Post
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 0.6, 6),
      stoneMaterial
    );
    post.position.y = 0.45;
    group.add(post);
    
    // Top
    const top = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.2, 6),
      stoneMaterial
    );
    top.position.y = 0.85;
    group.add(top);
    
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  // Placeholder methods for other scenes
  buildItalianCafe() { this.buildFrenchBoulangerie(); }
  buildChineseTeaHouse() { this.buildJapaneseTeaHouse(); }
  buildGenericScene() { this.buildFrenchBoulangerie(); }
  
  // Spanish specific placeholders
  createBarCounter(w, h, d, c1, c2) { return this.createDisplayCounter({ width: w, height: h, depth: d, color: c1, trim: c2 }); }
  createHangingJamon(positions) { /* jamón implementation */ }
  createTapasDisplay(position) { /* tapas implementation */ }
  createWineRack(position, wines) { /* wine rack implementation */ }
  createCheeseDisplay(position) { /* cheese implementation */ }
  createOliveBowls(position) { /* olives implementation */ }
  createFlamencoStage(position) { /* stage implementation */ }
  createMountedGuitar(position) { /* guitar implementation */ }
  createVintagePosters(positions, type) { /* posters implementation */ }
  createBarrelTables(positions) { /* barrel tables implementation */ }
  createCastanetsDisplay(position) { /* castanets implementation */ }
  createGarlicBraids(positions) { /* garlic implementation */ }
  createArchedDoorway(position) { /* doorway implementation */ }
  
  // Berlin specific placeholders
  createDJBooth(position) { /* DJ booth implementation */ }
  createSpeakerStack(position) { /* speakers implementation */ }
  createSubwoofers(position, count) { /* subwoofers implementation */ }
  createMinimalBar(w, h, d, c) { return this.createDisplayCounter({ width: w, height: h, depth: d, color: c, trim: c }); }
  createClubDrinks(position) { /* drinks implementation */ }
  createIndustrialPipes() { /* pipes implementation */ }
  createGraffitiPanels(positions) { /* graffiti implementation */ }
  createFogEffect(position) { /* fog implementation */ }
  createStrobeLights(positions) { /* strobe implementation */ }
  createLEDStrips(location, color) { /* LED implementation */ }
  createLaserBeams(position, color) { /* laser implementation */ }
  createConcretePillars(positions) { /* pillars implementation */ }
  
  // Polish specific placeholders
  createServingCounter(w, h, d, c1, c2) { return this.createDisplayCounter({ width: w, height: h, depth: d, color: c1, trim: c2 }); }
  createMilkBarFoodDisplay(position) { /* food display implementation */ }
  createPierogiStation(position) { /* pierogi implementation */ }
  createSoupPots(position) { /* soup implementation */ }
  createSimpleTables(positions) { /* tables implementation */ }
  addTablecloths(pattern) { /* tablecloths implementation */ }
  createFolkArt(positions) { /* folk art implementation */ }
  createPhotoGallery(position, subject) { /* photos implementation */ }
  createAmberDisplay(position) { /* amber implementation */ }
  createCondimentStation(position) { /* condiments implementation */ }
  createPolishMenuBoard(position) { /* menu implementation */ }
  createFluorescentLights(positions) { /* fluorescent lights implementation */ }
  createWindowWithView(position, view) { /* window implementation */ }
  createDriedFlowers(position) { /* flowers implementation */ }

  // Update method for animations
  update(delta) {
    const time = performance.now() * 0.001;
    
    for (const obj of this.animatedObjects) {
      if (obj.type === 'spin' && obj.mesh) {
        obj.mesh.rotation.y += (obj.speed || 1) * delta;
      }
      
      if (obj.type === 'flicker' && obj.light) {
        obj.light.intensity = obj.baseIntensity + Math.random() * 0.3 - 0.15;
      }
      
      if (obj.type === 'strobe' && obj.light) {
        const phase = (time + (obj.phase || 0)) % 1;
        obj.light.intensity = phase > 0.9 ? 3 : 0.1;
      }
    }
  }
}

export default SceneBuilder;

