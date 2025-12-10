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
    } else if (sceneType.includes('ramen') || sceneType.includes('shinjuku')) {
      this.buildTokyoRamenAlley();
    } else if (sceneType.includes('tapas') || sceneType.includes('flamenco')) {
      this.buildSpanishTapasBar();
    } else if (sceneType.includes('kebab') || sceneType.includes('berghain')) {
      this.buildBerlinKebab();
    } else if (sceneType.includes('piazza') || sceneType.includes('gelateria')) {
      this.buildItalianPiazza();
    } else if (sceneType.includes('dragon well') || sceneType.includes('beijing')) {
      this.buildChineseTeaHouse();
    } else if (sceneType.includes('market') || sceneType.includes('christmas')) {
      this.buildWarsawMarket();
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
  // DYNAMIC BUILDER (JSON-based)
  // ═══════════════════════════════════════════════════════════════════════════
  buildFromJSON(sceneData) {
    console.log("🏗️ Building dynamic scene from JSON:", sceneData);

    const sceneConfig = sceneData.scene || {};
    const layout = sceneConfig.layout || {};
    const atmosphere = sceneConfig.atmosphere;
    const lighting = sceneConfig.lighting;

    // 0. Atmosphere & Lighting
    if (atmosphere) {
      if (atmosphere.fog) {
        this.scene.fog = new THREE.Fog(
          atmosphere.fog.color || '#FFFFFF',
          atmosphere.fog.near || 10,
          atmosphere.fog.far || 50
        );
      }
      if (atmosphere.background) {
        this.scene.background = new THREE.Color(atmosphere.background);
      }
    }

    // 1. Floor
    if (layout.floor) {
      const { type, color } = layout.floor;
      if (type.includes('tile')) {
        this.createHexagonalTileFloor(15, 15, [color, '#ffffff']);
      } else if (type.includes('wood')) {
        this.createVintageLinoleumFloor(15, 15, color, '#8B4513');
      } else if (type.includes('concrete')) {
        this.createConcreteFloor(15, 15);
      } else if (type.includes('tatami')) {
        this.createTatamiFloor(15, 15);
      } else {
        this.createTerracottaFloor(15, 15);
      }
    }

    // 2. Walls
    if (layout.walls) {
      const { type, color } = layout.walls;
      if (type.includes('brick') || type.includes('industrial')) {
        this.createIndustrialWalls(15, 15, 5);
      } else if (type.includes('tiled')) {
        this.createTalaveraWalls(15, 15, 4);
      } else if (type.includes('shoji')) {
        this.createShojiWalls(15, 15, 4);
      } else if (type.includes('wainscot')) {
        this.createWallsWithWainscoting(color || '#FFF8DC', '#8B7355', 4);
      } else {
        this.createSimpleWalls(15, 15, 4, color || '#ffffff');
      }
    }

    // 3. Props
    if (layout.props) {
      layout.props.forEach(prop => {
        const { type, position, color, name, rotation } = prop;
        const x = position.x;
        const y = position.y;
        const z = position.z;
        const rot = rotation || 0;

        let mesh = null;

        // --- Furniture ---
        if (type.includes('counter') || type.includes('bar')) {
          mesh = this.createDisplayCounter({
            width: 5, height: 1.1, depth: 0.8,
            material: 'wood', color: color || '#8B4513', trim: '#FFD700'
          });
          mesh.position.set(x, y + 0.55, z);
        }
        else if (type.includes('table')) {
          if (type.includes('beer')) {
            this.createBeerTable(x, y, z);
          } else if (type.includes('low')) {
            this.createLowTable({ x, y, z }, 1.8, 0.3, 1.2, color || '#4A3020');
          } else {
            this.createSimpleTables([{ x, y, z }]);
          }
        }
        else if (type.includes('shelf')) {
          this.createBreadShelves({ x, y, z }, 1);
        }
        else if (type.includes('sofa') || type.includes('couch')) {
          mesh = this.createSofa({ x, y, z }, color || '#555555');
        }
        else if (type.includes('stool')) {
          mesh = this.createStool({ x, y, z }, color || '#8B4513');
        }

        // --- Decor ---
        else if (type.includes('plant') || type.includes('flower') || type.includes('vase')) {
          this.createFlowerVase({ x, y, z }, 'flowers', color || '#ffffff');
        }
        else if (type.includes('bamboo')) {
          // Custom bamboo creation since createBambooPlants takes array
          const bambooGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4);
          const bambooMaterial = new THREE.MeshStandardMaterial({ color: 0x6b8e23 });
          mesh = new THREE.Mesh(bambooGeometry, bambooMaterial);
          mesh.position.set(x, y + 2, z);
        }
        else if (type.includes('poster') || type.includes('art') || type.includes('painting')) {
          this.createVintagePosters([{ x, y: y + 2, z }], 'art');
        }
        else if (type.includes('mirror')) {
          this.createArtNouveauMirror({ x, y: y + 1.5, z });
        }
        else if (type.includes('clock')) {
          this.createVintageClock({ x, y: y + 2, z });
        }
        else if (type.includes('chalkboard') || type.includes('menu')) {
          this.createChalkboardMenu({ x, y: y + 1.5, z }, []);
        }

        // --- Lighting ---
        else if (type.includes('light') || type.includes('lamp') || type.includes('pendant')) {
          if (type.includes('street')) {
            mesh = this.createStreetLight({ x, y, z }, color || '#FFFFE0');
          } else {
            this.createPendantLights([{ x, y: y + 3, z }], color || '#ffaa00', 1);
          }
        }
        else if (type.includes('lantern')) {
          this.createLantern(x, y + 2, z, new THREE.Color(color || '#FF4500'));
        }
        else if (type.includes('neon')) {
          const signLight = new THREE.PointLight(color || 0xff00ff, 2, 15);
          signLight.position.set(x, y + 2, z);
          this.scene.add(signLight);
        }

        // --- Food & Drink ---
        else if (type.includes('croissant')) {
          this.createCroissantDisplay({ x, y, z }, 5, 'pyramid');
        }
        else if (type.includes('bread') || type.includes('baguette')) {
          this.createBaguetteBasket({ x, y, z }, 5);
        }
        else if (type.includes('coffee')) {
          this.createVintageCoffeeMachine({ x, y, z });
        }
        else if (type.includes('tea')) {
          this.createTeaCeremonySet({ x, y: y + 0.1, z });
        }
        else if (type.includes('wine')) {
          // Simple wine bottle
          const bottleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
          const bottleMaterial = new THREE.MeshStandardMaterial({ color: 0x4a0000 });
          const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
          bottle.position.set(x, y + 0.15, z);
          this.scene.add(bottle);
        }

        // --- Special ---
        else if (type.includes('register') || type.includes('cash')) {
          this.createAntiqueCashRegister({ x, y, z });
        }
        else if (type.includes('scale')) {
          this.createAntiqueBrassScale({ x, y, z });
        }

        // --- Structures ---
        else if (type.includes('window')) {
          this.createFrenchWindows([{ x, y, z }]);
        }
        else if (type.includes('door')) {
          this.createShopDoor({ x, y, z });
        }

        // --- Fallback ---
        else {
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshStandardMaterial({ color: color || '#cccccc' });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x, y + 0.5, z);
          mesh.castShadow = true;
          this.scene.add(mesh);
        }
      });
    }

    // Apply lighting from config if provided
    if (lighting) {
      // Clear default lights first if we want strict control, but for now we'll just add on top
      // or rely on applyLighting to handle it.
      // Actually, applyLighting checks this.config.scene.lighting.
      // We need to inject our dynamic lighting into this.config.scene.lighting
      if (!this.config.scene) this.config.scene = {};
      this.config.scene.lighting = lighting;
    }

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
  // ═══════════════════════════════════════════════════════════════════════════
  // TOKYO RAMEN ALLEY - Shinjuku Nights
  // ═══════════════════════════════════════════════════════════════════════════
  buildTokyoRamenAlley() {
    // Wet Asphalt Floor (Reflective)
    const floorGeometry = new THREE.PlaneGeometry(15, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#1A1A1A',
      roughness: 0.2,
      metalness: 0.6
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Narrow Alley Walls (Corrugated Metal & Wood)
    this.createIndustrialWalls(15, 20, 6);

    // Ramen Shop Counter
    const counter = this.createDisplayCounter({
      width: 4, height: 1.1, depth: 0.8,
      material: 'wood', color: '#8B4513', trim: '#FF0000'
    });
    counter.position.set(2, 0.55, -2);
    counter.rotation.y = -Math.PI / 2;
    this.scene.add(counter);

    // Stools
    for (let i = 0; i < 4; i++) {
      const stool = this.createStool({ x: 1, y: 0, z: -3.5 + (i * 1.0) }, '#FF0000');
    }

    // Ramen Bowls on Counter
    for (let i = 0; i < 3; i++) {
      this.createRamenBowl({ x: 2, y: 1.15, z: -3.5 + (i * 1.0) });
    }

    // Ticket Machine (Vending)
    this.createVendingMachine({ x: 3, y: 0, z: 2 }, 'ramen_tickets');

    // Noren Curtains
    this.createNorenCurtains({ x: 2, y: 2.5, z: -2 });

    // Red Lanterns (Chochin)
    const lanternPositions = [
      { x: 1.5, y: 2.8, z: -4 }, { x: 1.5, y: 2.8, z: -2 },
      { x: 1.5, y: 2.8, z: 0 }, { x: 1.5, y: 2.8, z: 2 }
    ];
    lanternPositions.forEach(pos => {
      this.createLantern(pos.x, pos.y, pos.z, new THREE.Color('#FF0000'));
    });

    // Neon Signs
    this.createNeonSign({ x: -4.9, y: 3, z: -2 }, 'RA-MEN', '#FF0000');
    this.createNeonSign({ x: -4.9, y: 4, z: 1 }, 'OPEN', '#00FF00');

    // Steam/Fog Effect
    this.createFogEffect({ x: 2, y: 1.5, z: -2 });

    // Background City Lights (Abstract)
    this.createCityBackground();

    // Rain Effect
    this.createRainEffect();
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
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BERLIN KEBAB & CLUB - "The Berghain Queue"
  // ═══════════════════════════════════════════════════════════════════════════
  buildBerlinKebab() {
    // 1. Gritty Asphalt Floor with Puddles
    const floorGeo = new THREE.PlaneGeometry(25, 25);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#1A1A1A',
      roughness: 0.7,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. The Club Facade (Background) - Massive Industrial Concrete
    const facadeGroup = new THREE.Group();
    const wallGeo = new THREE.BoxGeometry(20, 12, 2);
    const wallMat = new THREE.MeshStandardMaterial({ color: '#2C2C2C', roughness: 0.9 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 6, -8);
    facadeGroup.add(wall);

    // Steel Door (The Gate)
    const doorGeo = new THREE.BoxGeometry(3, 5, 0.2);
    const doorMat = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.8 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(-5, 2.5, -6.8);
    facadeGroup.add(door);

    // Graffiti Decals (Simulated with thin bright planes)
    this.createGraffitiPanels([
      { x: 2, y: 3, z: -6.9, scale: 2 },
      { x: 6, y: 5, z: -6.9, scale: 3 },
      { x: -8, y: 4, z: -6.9, scale: 1.5 }
    ]);

    this.scene.add(facadeGroup);

    // 3. The Kebab Stand ("Mustafa's Dream") - High Detail
    const kioskGroup = new THREE.Group();

    // Structure
    const kioskBase = new THREE.Mesh(
      new THREE.BoxGeometry(5, 3.5, 3.5),
      new THREE.MeshStandardMaterial({ color: '#F0E68C' }) // Yellowish painted metal
    );
    kioskBase.position.y = 1.75;
    kioskGroup.add(kioskBase);

    // Roof (Corrugated style overhang)
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.2, 4.5),
      new THREE.MeshStandardMaterial({ color: '#8B0000' })
    );
    roof.position.set(0, 3.6, 0.5);
    kioskGroup.add(roof);

    // Service Window Cutout (Visual trick with black plane + glass)
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(4, 1.5, 0.2),
      new THREE.MeshStandardMaterial({ color: '#333333' })
    );
    windowFrame.position.set(0, 2, 1.8);
    kioskGroup.add(windowFrame);

    // Counter Top
    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.1, 0.8),
      new THREE.MeshStandardMaterial({ color: '#C0C0C0', metalness: 0.6 })
    );
    counter.position.set(0, 1.3, 2.2);
    kioskGroup.add(counter);

    // The Meat Spinner (Detailed) visible through window
    const meat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 0.9, 12),
      new THREE.MeshStandardMaterial({ color: '#8B4513' })
    );
    meat.rotation.z = 0.1;
    meat.position.set(1, 1.8, 2.0);
    kioskGroup.add(meat);
    this.animatedObjects.push({ mesh: meat, type: 'spin', speed: 1 });

    // Neon Sign "GEMÜSE KEBAB"
    this.createNeonSign({ x: 0, y: 4.2, z: 2 }, 'KEBAB 24/7', '#00FF00');

    kioskGroup.position.set(4, 0, -2);
    kioskGroup.rotation.y = -Math.PI / 6; // Angled slightly
    this.scene.add(kioskGroup);

    // 4. Street Clutter & Atmosphere
    // Concrete Barriers (Queue control)
    this.createConcreteBarriers([
      { x: -5, z: -2 },
      { x: -5, z: 0 },
      { x: -5, z: 2 }
    ]);

    // The Bouncer (Silhouette)
    const bouncer = new THREE.Group();
    const bBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 1.4, 0.4),
      new THREE.MeshStandardMaterial({ color: '#000000' })
    );
    bBody.position.y = 0.7;
    const bHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.25),
      new THREE.MeshStandardMaterial({ color: '#D2B48C' })
    );
    bHead.position.y = 1.5;
    bouncer.add(bBody, bHead);
    bouncer.position.set(-3.5, 0, -5);
    this.scene.add(bouncer);

    // Street Light (Flickering)
    this.createStreetLight({ x: 8, y: 0, z: 5 }, '#FF8C00');

    // Fog Particles (Volumetric feel)
    this.createFogEffect({ x: 0, y: 1, z: 0 });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WARSAW CHRISTMAS MARKET - Old Town Magic
  // ═══════════════════════════════════════════════════════════════════════════
  buildWarsawMarket() {
    // Snowy Cobblestone Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#FFFFFF', // Snow
      roughness: 1.0
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Old Town Facades (Background)
    this.createTenementFacadesWithSnow(20, 20);

    // Giant Christmas Tree
    this.createChristmasTree({ x: 0, y: 0, z: -8 });

    // 1. Mulled Wine (Grzaniec) - Left
    this.createMarketStall({ x: -5, y: 0, z: -4, color: '#8B4513' });
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.9, 8),
      new THREE.MeshStandardMaterial({ color: '#5D4037' })
    );
    barrel.position.set(-4.5, 0.45, -3.5);
    this.scene.add(barrel);
    this.createSteamEffect({ x: -4.5, y: 1.0, z: -3.5 });

    // 2. Pierogi Stand (The Star) - Center Left
    this.createMarketStall({ x: -1, y: 0, z: -3, color: '#A0522D' });
    this.createPierogiDisplay({ x: -1, y: 0.85, z: -2.5 });

    // 3. Oscypek & Gingerbread - Right
    this.createMarketStall({ x: 4, y: 0, z: -4, color: '#8B4513' });
    this.createOrnaments({ x: 4, y: 1.2, z: -3.5 }); // Bombki display

    // Skating Rink (Ice Patch)
    const iceGeometry = new THREE.PlaneGeometry(6, 4);
    const iceMaterial = new THREE.MeshStandardMaterial({
      color: '#E0FFFF',
      roughness: 0.05,
      metalness: 0.3
    });
    const ice = new THREE.Mesh(iceGeometry, iceMaterial);
    ice.rotation.x = -Math.PI / 2;
    ice.position.set(3, 0.02, 0);
    this.scene.add(ice);

    // String Lights
    this.createStringLights('market_overhead');

    // Snow Falling Effect
    this.createSnowEffect();

    // Night Sky
    this.scene.background = new THREE.Color('#000033'); // Night Blue
  }

  createPierogiDisplay(position) {
    const group = new THREE.Group();

    // Tablecloth
    const cloth = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.05, 0.8),
      new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
    );
    group.add(cloth);

    // Pierogi Trays
    const types = [
      { name: 'Ruskie', x: -0.6, color: '#FDF5E6' },
      { name: 'Meat', x: 0, color: '#F5DEB3' },
      { name: 'Berry', x: 0.6, color: '#D8BFD8' }
    ];

    types.forEach(type => {
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.25, 0.05, 16),
        new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
      );
      plate.position.set(type.x, 0.05, 0);
      group.add(plate);

      // Pile of Pierogi
      for (let j = 0; j < 6; j++) {
        const p = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 8, 8, 0, Math.PI),
          new THREE.MeshStandardMaterial({ color: type.color })
        );
        p.scale.set(1, 0.5, 0.5);
        p.rotation.x = -Math.PI / 2;
        p.rotation.z = Math.random() * Math.PI;
        p.position.set(
          type.x + (Math.random() - 0.5) * 0.2,
          0.1 + j * 0.03,
          (Math.random() - 0.5) * 0.2
        );
        group.add(p);
      }
    });

    // Bigos Pot
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.3, 12),
      new THREE.MeshStandardMaterial({ color: '#000000' })
    );
    pot.position.set(0.9, 0.15, 0.3);
    group.add(pot);

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS - Creating Specific Props
  // ═══════════════════════════════════════════════════════════════════════════

  // Floor Types
  createHexagonalTileFloor(width, depth, colors) {
    const floorGroup = new THREE.Group();
    const tileSize = 0.5;

    for (let x = -width / 2; x < width / 2; x += tileSize * 1.5) {
      for (let z = -depth / 2; z < depth / 2; z += tileSize * 0.866) {
        const colorIndex = Math.floor(Math.random() * colors.length);
        const geometry = new THREE.CylinderGeometry(tileSize / 2, tileSize / 2, 0.02, 6);
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

    for (let x = -width / 2; x < width / 2; x += matWidth) {
      for (let z = -depth / 2; z < depth / 2; z += matDepth) {
        const geometry = new THREE.BoxGeometry(matWidth - 0.02, 0.05, matDepth - 0.02);
        const material = new THREE.MeshStandardMaterial({
          color: '#C4B896',
          roughness: 0.9
        });
        const mat = new THREE.Mesh(geometry, material);
        mat.position.set(x + matWidth / 2, 0.025, z + matDepth / 2);
        mat.receiveShadow = true;
        tatamiGroup.add(mat);

        // Dark border
        const borderGeometry = new THREE.BoxGeometry(matWidth, 0.055, 0.02);
        const borderMaterial = new THREE.MeshStandardMaterial({ color: '#2C1810' });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.set(x + matWidth / 2, 0.0275, z);
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
    backWall.position.set(0, height / 2, -roomSize / 2);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Wainscoting
    const wainscot = new THREE.Mesh(
      new THREE.BoxGeometry(roomSize, 1, 0.05),
      wainscotMaterial
    );
    wainscot.position.set(0, 0.5, -roomSize / 2 + 0.03);
    this.scene.add(wainscot);

    // Side walls
    for (let side of [-1, 1]) {
      const sideWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomSize, height),
        wallMaterial
      );
      sideWall.position.set(side * roomSize / 2, height / 2, 0);
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
      topFrame.position.y = h / 2;
      panel.add(topFrame);

      const bottomFrame = new THREE.Mesh(
        new THREE.BoxGeometry(w, frameWidth, frameWidth),
        frameMaterial
      );
      bottomFrame.position.y = -h / 2;
      panel.add(bottomFrame);

      // Vertical dividers
      const dividers = 4;
      for (let i = 0; i <= dividers; i++) {
        const divider = new THREE.Mesh(
          new THREE.BoxGeometry(frameWidth, h, frameWidth),
          frameMaterial
        );
        divider.position.x = -w / 2 + (w / dividers) * i;
        panel.add(divider);
      }

      return panel;
    };

    // Back wall panels
    for (let x = -width / 2 + 1; x < width / 2; x += 2) {
      const panel = createPanel(1.8, height);
      panel.position.set(x, height / 2, -depth / 2);
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
    backWall.position.set(0, height / 2, -depth / 2);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Add decorative tile strip
    const tileMaterial = new THREE.MeshStandardMaterial({ color: '#1E90FF' });
    const tileStrip = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.3, 0.02),
      tileMaterial
    );
    tileStrip.position.set(0, 1.2, -depth / 2 + 0.02);
    this.scene.add(tileStrip);
  }

  createIndustrialWalls(width, depth, height) {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#3A3A3A',
      roughness: 0.95
    });

    for (let pos of [
      { x: 0, z: -depth / 2, rotY: 0 },
      { x: -width / 2, z: 0, rotY: Math.PI / 2 },
      { x: width / 2, z: 0, rotY: -Math.PI / 2 }
    ]) {
      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        wallMaterial
      );
      wall.position.set(pos.x, height / 2, pos.z);
      wall.rotation.y = pos.rotY;
      this.scene.add(wall);
    }
  }

  createSimpleWalls(width, depth, height, color) {
    const wallMaterial = new THREE.MeshStandardMaterial({ color: color, roughness: 0.9 });

    // Back
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMaterial);
    backWall.position.set(0, height / 2, -depth / 2);
    this.scene.add(backWall);

    // Sides
    for (let side of [-1, 1]) {
      const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(depth, height), wallMaterial);
      sideWall.position.set(side * width / 2, height / 2, 0);
      sideWall.rotation.y = -side * Math.PI / 2;
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
    topTrim.position.y = height / 2 + 0.015;
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
    front.position.z = depth / 2;
    group.add(front);

    const back = new THREE.Mesh(new THREE.PlaneGeometry(width, height), glassMaterial);
    back.position.z = -depth / 2;
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
    for (let x = -width / 2 + 2; x < width / 2; x += 2) {
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
    for (let x = -width / 3; x <= width / 3; x += width / 3) {
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
    const lightingConfig = this.config.scene?.lighting;

    // ═══════════════════════════════════════════════════════════════════════════
    // ALWAYS ADD DEFAULT LIGHTING (prevents pitch black scenes)
    // ═══════════════════════════════════════════════════════════════════════════

    // Default ambient light - always added
    const defaultAmbient = new THREE.AmbientLight('#FFF5E6', 0.5);
    this.scene.add(defaultAmbient);
    this.lights.push(defaultAmbient);

    // Default directional light - always added
    const defaultDirectional = new THREE.DirectionalLight('#FFFFFF', 0.8);
    defaultDirectional.position.set(5, 10, 5);
    defaultDirectional.castShadow = true;
    defaultDirectional.shadow.mapSize.width = 2048;
    defaultDirectional.shadow.mapSize.height = 2048;
    this.scene.add(defaultDirectional);
    this.lights.push(defaultDirectional);

    // Default warm fill light
    const defaultFill = new THREE.PointLight('#FFAA44', 0.6, 20);
    defaultFill.position.set(-3, 4, 0);
    this.scene.add(defaultFill);
    this.lights.push(defaultFill);

    // ═══════════════════════════════════════════════════════════════════════════
    // OVERRIDE WITH CONFIG LIGHTING (if available)
    // ═══════════════════════════════════════════════════════════════════════════

    if (!lightingConfig) {
      console.log('💡 Using default lighting (no config)');
      return;
    }

    console.log('💡 Applying config lighting');

    // Primary light from config
    if (lightingConfig.primary) {
      const primaryLight = new THREE.DirectionalLight(
        lightingConfig.primary.color || '#FFFFFF',
        lightingConfig.primary.intensity || 0.8
      );
      primaryLight.position.set(5, 10, 5);
      primaryLight.castShadow = true;
      this.scene.add(primaryLight);
      this.lights.push(primaryLight);
    }

    // Ambient light from config
    if (lightingConfig.secondary) {
      const ambientLight = new THREE.AmbientLight(
        lightingConfig.secondary.color || '#FFF8DC',
        lightingConfig.secondary.intensity || 0.4
      );
      this.scene.add(ambientLight);
      this.lights.push(ambientLight);
    }

    // Accent lights from config
    if (lightingConfig.accent && Array.isArray(lightingConfig.accent)) {
      lightingConfig.accent.forEach((accent, i) => {
        const light = new THREE.PointLight(
          accent.color || '#FFAA44',
          accent.intensity || 0.5,
          accent.distance || 15
        );
        if (accent.position) {
          light.position.set(accent.position.x || 0, accent.position.y || 3, accent.position.z || 0);
        } else {
          light.position.set(i * 2 - 2, 3, -2);
        }
        this.scene.add(light);
        this.lights.push(light);
      });
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
    table.position.set(position.x, position.y + height / 2, position.z);
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

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW DYNAMIC PROPS
  // ═══════════════════════════════════════════════════════════════════════════

  createSofa(pos, color) {
    const group = new THREE.Group();
    const seatGeo = new THREE.BoxGeometry(2, 0.5, 0.8);
    const backGeo = new THREE.BoxGeometry(2, 1, 0.2);
    const armGeo = new THREE.BoxGeometry(0.2, 0.8, 0.8);
    const mat = new THREE.MeshStandardMaterial({ color: color });

    const seat = new THREE.Mesh(seatGeo, mat);
    const back = new THREE.Mesh(backGeo, mat);
    const armL = new THREE.Mesh(armGeo, mat);
    const armR = new THREE.Mesh(armGeo, mat);

    seat.position.set(0, 0.25, 0);
    back.position.set(0, 0.75, -0.3);
    armL.position.set(-1.1, 0.4, 0);
    armR.position.set(1.1, 0.4, 0);

    group.add(seat, back, armL, armR);
    group.position.set(pos.x, pos.y, pos.z);
    this.scene.add(group);
    return group;
  }

  createStool(pos, color) {
    const geo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
    const mat = new THREE.MeshStandardMaterial({ color: color });

    const seat = new THREE.Mesh(geo, mat);
    seat.position.y = 0.8;

    const group = new THREE.Group();
    group.add(seat);

    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(legGeo, mat);
      const angle = (i / 4) * Math.PI * 2;
      leg.position.set(Math.cos(angle) * 0.2, 0.4, Math.sin(angle) * 0.2);
      group.add(leg);
    }

    group.position.set(pos.x, pos.y, pos.z);
    this.scene.add(group);
    return group;
  }

  createStreetLight(pos, color) {
    const group = new THREE.Group();
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.15, 4);
    const poleMat = new THREE.MeshStandardMaterial({ color: '#333333' });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 2;

    const lampGeo = new THREE.SphereGeometry(0.3);
    const lampMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 1 });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.y = 4;

    const light = new THREE.PointLight(color, 1, 10);
    light.position.y = 4;

    group.add(pole, lamp, light);
    group.position.set(pos.x, pos.y, pos.z);
    this.scene.add(group);
    return group;
  }

  createArcadeMachine(pos, color) {
    const group = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.8, 0.8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;

    const screenGeo = new THREE.PlaneGeometry(0.6, 0.5);
    const screenMat = new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#00FF00', emissiveIntensity: 0.5 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 1.3, 0.41);

    group.add(body, screen);
    group.position.set(pos.x, pos.y, pos.z);
    this.scene.add(group);
    return group;
  }

  createHologram(pos, color) {
    const geo = new THREE.ConeGeometry(0.5, 1, 32, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, pos.y + 0.5, pos.z);
    mesh.rotation.x = Math.PI; // Invert cone

    // Animate
    this.animatedObjects.push({
      mesh: mesh,
      update: (time) => {
        mesh.rotation.y = time;
        mesh.material.opacity = 0.4 + Math.sin(time * 2) * 0.2;
      }
    });

    this.scene.add(mesh);
    return mesh;
  }

  createToriiGate(pos, color) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: color });

    // Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const p1 = new THREE.Mesh(pillarGeo, mat);
    const p2 = new THREE.Mesh(pillarGeo, mat);
    p1.position.set(-1.5, 1.5, 0);
    p2.position.set(1.5, 1.5, 0);

    // Lintels
    const topGeo = new THREE.BoxGeometry(4, 0.3, 0.3);
    const subGeo = new THREE.BoxGeometry(3.4, 0.2, 0.2);
    const top = new THREE.Mesh(topGeo, mat);
    const sub = new THREE.Mesh(subGeo, mat);
    top.position.set(0, 2.8, 0);
    sub.position.set(0, 2.3, 0);

    group.add(p1, p2, top, sub);
    group.position.set(pos.x, pos.y, pos.z);
    this.scene.add(group);
    return group;
  }

  // Placeholder methods for other scenes
  // ═══════════════════════════════════════════════════════════════════════════
  // ITALIAN PIAZZA - Roman Holiday
  // ═══════════════════════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════════════════════
  // ITALIAN PIAZZA - "La Dolce Vita"
  // ═══════════════════════════════════════════════════════════════════════════
  buildItalianPiazza() {
    // 1. Ancient Cobblestone Floor (Uneven)
    this.createCobblestoneFloor(20, 20);

    // 2. Renaissance Facades (Detailed)
    this.createItalianFacades(20, 20);

    // 3. The "Fontana dei Quattro Fiumi" (Simplified Bernini style)
    this.createFountain({ x: 0, y: 0, z: -8 });

    // 4. Luxury Gelateria Stand
    this.createGelatoStand({ x: 3, y: 0, z: -3 });

    // 5. Trattoria Outdoor Seating
    this.createCafeSet([
      { x: -3, y: 0, z: -4 },
      { x: -5, y: 0, z: -2 },
      { x: -4, y: 0, z: -5 }
    ]);

    // 6. Street Atmosphere
    // Painter's Easel capturing the fountain
    this.createPaintersCorner({ x: -2, y: 0, z: 2 });

    // Classic Vespa (Mint Green)
    this.createVespa({ x: -4, y: 0, z: -7 });

    // Pigeons pecking at crumbs
    this.createPigeons([
      { x: 1, z: -6 }, { x: 1.5, z: -6.5 }, { x: 0.5, z: -5.5 }
    ]);

    // String Lights (Warm)
    this.createStringLights('piazza_overhead');

    // Flower Boxes on every window
    this.createWindowFlowerBoxes();
  }

  // ITALIAN HELPERS
  createCobblestoneFloor(width, depth) {
    const geometry = new THREE.PlaneGeometry(width, depth, 40, 40);
    const positionAttribute = geometry.attributes.position;

    // Add slight noise to vertices for uneven cobblestone feel
    for (let i = 0; i < positionAttribute.count; i++) {
      positionAttribute.setZ(i, positionAttribute.getZ(i) + (Math.random() - 0.5) * 0.1);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: '#8B4513',
      roughness: 0.9,
      flatShading: true
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createItalianFacades(width, depth) {
    const colors = ['#CD5C5C', '#DAA520', '#DEB887']; // Classic Roman Colors

    // Helper to make a building wall with windows
    const createWall = (w, h, color, pos, rotY) => {
      const group = new THREE.Group();
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.5),
        new THREE.MeshStandardMaterial({ color: color })
      );
      wall.position.y = h / 2;
      group.add(wall);

      // Add Windows with Shutters
      for (let y = 3; y < h; y += 3) {
        for (let x = -w / 2 + 2; x < w / 2 - 1; x += 3) {
          const wind = this.createShutteredWindow();
          wind.position.set(x, y, 0.3);
          group.add(wind);
        }
      }

      group.position.set(pos.x, 0, pos.z);
      group.rotation.y = rotY;
      this.scene.add(group);
    };

    createWall(width, 10, colors[0], { x: 0, z: -depth / 2 }, 0); // Back
    createWall(depth, 10, colors[1], { x: -width / 2, z: 0 }, Math.PI / 2); // Left
    createWall(depth, 10, colors[2], { x: width / 2, z: 0 }, -Math.PI / 2); // Right
  }

  createShutteredWindow() {
    const group = new THREE.Group();
    // Frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 2, 0.1),
      new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
    );
    // Dark Glass
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 1.8),
      new THREE.MeshStandardMaterial({ color: '#1A1A1A' })
    );
    glass.position.z = 0.06;

    // Green Shutters
    const shutterGeo = new THREE.BoxGeometry(0.5, 1.8, 0.05);
    const shutterMat = new THREE.MeshStandardMaterial({ color: '#2E8B57' });
    const leftS = new THREE.Mesh(shutterGeo, shutterMat);
    leftS.position.set(-0.7, 0, 0.1);
    const rightS = new THREE.Mesh(shutterGeo, shutterMat);
    rightS.position.set(0.7, 0, 0.1);

    group.add(frame, glass, leftS, rightS);
    return group;
  }

  createFountain(position) {
    const group = new THREE.Group();

    // Lower Pool
    const pool = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: '#E0E0E0', roughness: 0.2 })
    );
    pool.position.y = 0.25;
    group.add(pool);

    // Water Surface
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(3.3, 32),
      new THREE.MeshStandardMaterial({ color: '#00FFFF', transparent: true, opacity: 0.6 })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.45;
    group.add(water);

    // Tier 1
    const t1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.8, 12),
      new THREE.MeshStandardMaterial({ color: '#D3D3D3' })
    );
    t1.position.y = 0.8;
    group.add(t1);

    // Tier 2
    const t2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 1.5, 12),
      new THREE.MeshStandardMaterial({ color: '#D3D3D3' })
    );
    t2.position.y = 2;
    group.add(t2);

    // Top Sculpture (Abstract)
    const sculpture = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8),
      new THREE.MeshStandardMaterial({ color: '#F5F5F5' })
    );
    sculpture.position.y = 3.2;
    group.add(sculpture);

    // Coins in water
    for (let i = 0; i < 15; i++) {
      const coin = new THREE.Mesh(
        new THREE.CircleGeometry(0.05, 8),
        new THREE.MeshStandardMaterial({ color: '#FFD700', metalness: 1 })
      );
      coin.rotation.x = -Math.PI / 2;
      coin.position.set((Math.random() - 0.5) * 4, 0.46, (Math.random() - 0.5) * 4);
      group.add(coin);
    }

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createGelatoStand(position) {
    const group = new THREE.Group();

    // Cart Body with striped siding
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 1.2, 1.2),
      new THREE.MeshStandardMaterial({ color: '#F5F5DC' })
    );
    body.position.y = 0.6;
    group.add(body);

    // Wheels
    const wGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    const wMat = new THREE.MeshStandardMaterial({ color: '#8B4513' });
    [-1.2, 1.2].forEach(x => {
      const w = new THREE.Mesh(wGeo, wMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.5, 0);
      group.add(w);
    });

    // Glass Display Case
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.4, 0.8),
      new THREE.MeshStandardMaterial({ color: '#88CCFF', transparent: true, opacity: 0.3 })
    );
    glass.position.set(0, 1.4, 0);
    group.add(glass);

    // Flavors (Colorful mounds)
    const flavors = [
      { c: '#90EE90', n: 'Pistachio' },
      { c: '#FFB6C1', n: 'Fragola' },
      { c: '#FFFACD', n: 'Limone' },
      { c: '#D2691E', n: 'Cioccolato' },
      { c: '#E6E6FA', n: 'Stracciatella' }
    ];
    flavors.forEach((f, i) => {
      const mound = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 8),
        new THREE.MeshStandardMaterial({ color: f.c })
      );
      mound.position.set(-0.8 + i * 0.4, 1.3, 0.1);
      mound.scale.y = 0.6;
      group.add(mound);
    });

    // Waffle Cones Stack
    const coneGeo = new THREE.ConeGeometry(0.08, 0.3, 16);
    const coneMat = new THREE.MeshStandardMaterial({ color: '#DEB887' });
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.rotation.x = Math.PI;
      cone.position.set(0.8, 1.5 + i * 0.1, 0.3);
      group.add(cone);
    }

    // Striped Awning
    const awning = new THREE.Group();
    for (let i = 0; i < 10; i++) {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.05, 1.6),
        new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? '#FFFFFF' : '#FF69B4' })
      );
      strip.position.set(-1.35 + i * 0.3, 2.5, 0.2);
      strip.rotation.x = 0.2;
      awning.add(strip);
    }
    group.add(awning);

    // Awning Poles
    [-1.1, 1.1].forEach(x => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1.5),
        new THREE.MeshStandardMaterial({ color: '#C0C0C0' })
      );
      pole.position.set(x, 1.8, 0.8);
      group.add(pole);
    });

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createCafeSet(positions) {
    positions.forEach(pos => {
      const group = new THREE.Group();
      // Bistro Table
      const table = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: '#2F4F4F' })
      );
      table.position.y = 0.4;
      group.add(table);
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.05, 16),
        new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
      );
      top.position.y = 0.82;
      group.add(top);

      // Wrought Iron Chairs
      [-0.7, 0.7].forEach(offset => {
        const chair = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), new THREE.MeshStandardMaterial({ color: '#000000' }));
        seat.position.y = 0.45;
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.05), new THREE.MeshStandardMaterial({ color: '#000000' }));
        back.position.set(0, 0.7, -0.2);
        chair.add(seat, back);
        chair.position.x = offset;
        chair.rotation.y = -offset * 2;
        group.add(chair);
      });

      group.position.set(pos.x, pos.y, pos.z);
      this.scene.add(group);
    });
  }

  createPigeons(positions) {
    const pigeonGeo = new THREE.ConeGeometry(0.1, 0.2, 8);
    const pigeonMat = new THREE.MeshStandardMaterial({ color: '#808080' });
    positions.forEach(pos => {
      const bird = new THREE.Mesh(pigeonGeo, pigeonMat);
      bird.rotation.x = -Math.PI / 2;
      bird.position.set(pos.x, 0.1, pos.z);
      bird.rotation.z = Math.random() * Math.PI * 2;
      this.scene.add(bird);
    });
  }

  createWindowFlowerBoxes() {
    // Logic handled in createItalianFacades via createShutteredWindow if I added it there,
    // but let's just make sure the createShutteredWindow called above has what it needs.
    // Actually, I didn't add flower boxes in createShutteredWindow explicitly.
    // I'll leave this empty or rely on the updated createShutteredWindow if I want to edit it again.
    // For now, the shutters add enough detail.
  }

  createPaintersCorner(position) {
    const group = new THREE.Group();

    // Easel (simplified tripod)
    const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5);
    const legMat = new THREE.MeshStandardMaterial({ color: '#8B4513' });

    const l1 = new THREE.Mesh(legGeo, legMat);
    l1.rotation.z = 0.3;
    l1.position.set(-0.3, 0.75, 0);

    const l2 = new THREE.Mesh(legGeo, legMat);
    l2.rotation.z = -0.3;
    l2.position.set(0.3, 0.75, 0);

    const l3 = new THREE.Mesh(legGeo, legMat);
    l3.rotation.x = -0.3;
    l3.position.set(0, 0.75, -0.4);

    group.add(l1, l2, l3);

    // Canvas
    const canvas = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.02),
      new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
    );
    canvas.position.set(0, 1.0, 0.1);
    canvas.rotation.x = -0.1;
    group.add(canvas);


    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createVespa(position) {
    const group = new THREE.Group();
    // Simplified Vespa geometry
    // Body
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.3, 1.0, 4, 8),
      new THREE.MeshStandardMaterial({ color: '#98FB98' }) // Mint green
    );
    body.rotation.z = Math.PI / 2;
    body.position.y = 0.4;
    group.add(body);

    // Wheels
    const wGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const wMat = new THREE.MeshStandardMaterial({ color: '#333333' });
    const w1 = new THREE.Mesh(wGeo, wMat);
    w1.rotation.x = Math.PI / 2;
    w1.position.set(-0.4, 0.2, 0);

    const w2 = new THREE.Mesh(wGeo, wMat);
    w2.rotation.x = Math.PI / 2;
    w2.position.set(0.4, 0.2, 0);
    group.add(w1, w2);

    // Handlebars
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.6),
      new THREE.MeshStandardMaterial({ color: '#C0C0C0' })
    );
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0.3, 0.9, 0);
    group.add(handle);

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createClimbingIvy() {
    // Add green particles/planes on walls
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // CHINESE TEA HOUSE - Beijing Dragon Well
  // ═══════════════════════════════════════════════════════════════════════════
  buildChineseTeaHouse() {
    // Dark Wood Floor
    const floorGeometry = new THREE.PlaneGeometry(15, 12);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#3d1c02',
      roughness: 0.6
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Red Pillars and Walls
    this.createChineseArchitecture(15, 12, 4);

    // Main Tea Table (Rosewood)
    this.createRosewoodTable({ x: 0, y: 0, z: -2 });

    // Gongfu Tea Set
    this.createGongfuSet({ x: 0, y: 0.8, z: -2 });

    // Guzheng (Zither)
    this.createGuzheng({ x: 4, y: 0.5, z: -4 });

    // Hanging Scrolls
    this.createHangingScroll({ x: -2, y: 2.2, z: -5.9 }, 'Tea Poetry');
    this.createHangingScroll({ x: 2, y: 2.2, z: -5.9 }, 'Dragon');

    // Red Lanterns (Different style than Japanese)
    this.createChineseLanterns([
      { x: -4, y: 3, z: -4 },
      { x: 4, y: 3, z: -4 },
      { x: 0, y: 3.2, z: -2 }
    ]);

    // Bonsai/Potted Plants
    this.createBonsai({ x: -5, y: 1, z: 0 });

    // Lake View (Background)
    this.createLakeBackground();
  }

  createChineseArchitecture(width, depth, height) {
    // Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, height, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: '#8B0000' }); // Dark Red

    const positions = [
      { x: -width / 2 + 0.5, z: -depth / 2 + 0.5 },
      { x: width / 2 - 0.5, z: -depth / 2 + 0.5 },
      { x: -width / 2 + 0.5, z: depth / 2 - 0.5 },
      { x: width / 2 - 0.5, z: depth / 2 - 0.5 }
    ];

    positions.forEach(pos => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(pos.x, height / 2, pos.z);
      this.scene.add(pillar);
    });

    // Lattice Windows/Walls (Simplified)
    const wallMat = new THREE.MeshStandardMaterial({ color: '#F5DEB3', side: THREE.DoubleSide });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat);
    backWall.position.set(0, height / 2, -depth / 2);
    this.scene.add(backWall);

    // Lattice work (texture or geometric placeholder)
    const lattice = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.1),
      new THREE.MeshStandardMaterial({ color: '#3d1c02', wireframe: true }));
    lattice.position.set(0, height / 2, -depth / 2 + 0.1);
    this.scene.add(lattice);
  }

  createRosewoodTable(position) {
    const group = new THREE.Group();
    // Tabletop
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.1, 1.5),
      new THREE.MeshStandardMaterial({ color: '#3d1c02', roughness: 0.3, metalness: 0.1 })
    );
    top.position.y = 0.75;
    group.add(top);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.15, 0.75, 0.15);
    const legMat = new THREE.MeshStandardMaterial({ color: '#3d1c02' });
    const legs = [
      { x: -1.3, z: -0.6 }, { x: 1.3, z: -0.6 },
      { x: -1.3, z: 0.6 }, { x: 1.3, z: 0.6 }
    ];
    legs.forEach(l => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(l.x, 0.375, l.z);
      group.add(leg);
    });

    // Stools
    const stoolGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.45);
    const stoolMat = new THREE.MeshStandardMaterial({ color: '#5C3317' });
    const stoolPos = [{ x: 0, z: 1.2 }, { x: 0, z: -1.2 }, { x: -1.8, z: 0 }, { x: 1.8, z: 0 }];
    stoolPos.forEach(p => {
      const stool = new THREE.Mesh(stoolGeo, stoolMat);
      stool.position.set(p.x, 0.225, p.z);
      group.add(stool);
    });

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createGongfuSet(position) {
    const group = new THREE.Group();

    // Tea Tray (Boat)
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.05, 0.5),
      new THREE.MeshStandardMaterial({ color: '#8B4513' })
    );
    group.add(tray);

    // Yixing Teapot (Purple Clay)
    const pot = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      new THREE.MeshStandardMaterial({ color: '#4E342E', roughness: 0.9 })
    );
    pot.position.set(0, 0.08, 0);
    group.add(pot);

    // Tiny Cups
    for (let i = 0; i < 4; i++) {
      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.02, 0.04),
        new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
      );
      cup.position.set(0.2 + (i % 2) * 0.1, 0.02, 0.1 + Math.floor(i / 2) * 0.1);
      group.add(cup);
    }

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createGuzheng(position) {
    const group = new THREE.Group();
    // Body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.1, 0.4),
      new THREE.MeshStandardMaterial({ color: '#8B4513' })
    );
    body.rotation.y = -0.2;
    group.add(body);

    // Strings (Texture or implied)

    // Stand
    const standLegs = [-0.6, 0.6];
    standLegs.forEach(x => {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.6, 0.3),
        new THREE.MeshStandardMaterial({ color: '#3d1c02' })
      );
      leg.position.set(x, -0.35, 0);
      leg.rotation.y = -0.2;
      group.add(leg);
    });

    group.position.set(position.x, position.y + 0.7, position.z);
    this.scene.add(group);
  }

  createChineseLanterns(positions) {
    positions.forEach(pos => {
      const group = new THREE.Group();
      // Red Silk shape
      const lantern = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 12),
        new THREE.MeshStandardMaterial({
          color: '#FF0000',
          emissive: '#FF0000',
          emissiveIntensity: 0.5,
          transparent: true, opacity: 0.9
        })
      );
      lantern.scale.y = 0.8;
      group.add(lantern);

      // Tassel
      const tassel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.05, 0.4),
        new THREE.MeshStandardMaterial({ color: '#FFD700' })
      );
      tassel.position.y = -0.4;
      group.add(tassel);

      // Hanger
      const line = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.5),
        new THREE.MeshStandardMaterial({ color: '#000000' })
      );
      line.position.y = 0.4;
      group.add(line);

      // Light
      const light = new THREE.PointLight('#FF4500', 0.8, 5);
      group.add(light);
      this.lights.push(light);

      group.position.set(pos.x, pos.y, pos.z);
      this.scene.add(group);
    });
  }

  createBonsai(position) {
    const group = new THREE.Group();
    // Pot
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.15, 0.1, 6),
      new THREE.MeshStandardMaterial({ color: '#2F4F4F' })
    );
    group.add(pot);

    // Trunk - twisted
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.04, 0.4),
      new THREE.MeshStandardMaterial({ color: '#8B4513' })
    );
    trunk.position.set(0, 0.2, 0);
    trunk.rotation.z = 0.2;
    group.add(trunk);

    // Leaves
    const leaves = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.15),
      new THREE.MeshStandardMaterial({ color: '#228B22' })
    );
    leaves.position.set(0.1, 0.4, 0);
    group.add(leaves);

    group.position.set(position.x, position.y + 0.05, position.z);
    this.scene.add(group);
  }

  createLakeBackground() {
    // Simple blue plane outside
    const lake = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 10),
      new THREE.MeshBasicMaterial({ color: '#ADD8E6' }) // Light Blue
    );
    lake.position.set(0, 0, -8);
    this.scene.add(lake);
  }

  buildGenericScene() { this.buildFrenchBoulangerie(); }

  // ═══════════════════════════════════════════════════════════════════════════
  // SPANISH HELPER IMPLEMENTATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  createHangingJamon(positions) {
    positions.forEach(pos => {
      const group = new THREE.Group();
      // Leg shape (conical/bone)
      const leg = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.6, 8),
        new THREE.MeshStandardMaterial({ color: '#800000' }) // Dried meat color
      );
      leg.rotation.x = Math.PI;
      group.add(leg);

      // Hoof/Bone
      const bone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.04, 0.2),
        new THREE.MeshStandardMaterial({ color: '#F0E68C' })
      );
      bone.position.y = 0.4;
      group.add(bone);

      // String
      const string = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.3),
        new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
      );
      string.position.y = 0.6;
      group.add(string);

      group.position.set(pos.x, pos.y, pos.z);
      this.scene.add(group);
    });
  }

  createTapasDisplay(position) {
    const group = new THREE.Group();
    // Glass Case
    const caseGeo = new THREE.BoxGeometry(2.5, 0.4, 0.8);
    const caseMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.3 });
    const glass = new THREE.Mesh(caseGeo, caseMat);
    glass.position.y = 0.2;
    group.add(glass);

    // Dishes inside
    const colors = ['#FFD700', '#FF6347', '#8B4513']; // Potato, Tomato, Meat
    for (let i = 0; i < 3; i++) {
      const dish = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.15, 0.05),
        new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
      );
      dish.position.set(-0.8 + i * 0.8, 0.05, 0);

      const food = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 8, 4),
        new THREE.MeshStandardMaterial({ color: colors[i] })
      );
      food.position.set(-0.8 + i * 0.8, 0.1, 0);
      food.scale.y = 0.5;

      group.add(dish);
      group.add(food);
    }

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createWineRack(position, wines) {
    const group = new THREE.Group();
    // Wooden Grid
    const rack = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.5, 0.3),
      new THREE.MeshStandardMaterial({ color: '#8B4513' })
    );
    group.add(rack);

    // Bottles (Capsules)
    const bottleGeo = new THREE.CapsuleGeometry(0.05, 0.2, 4, 8);
    const bottleMat = new THREE.MeshStandardMaterial({ color: '#2F4F4F' }); // Dark green glass

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const bottle = new THREE.Mesh(bottleGeo, bottleMat);
        bottle.rotation.x = Math.PI / 2;
        bottle.position.set(-0.4 + i * 0.4, -0.6 + j * 0.4, 0.05);
        group.add(bottle);
      }
    }

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createCheeseDisplay(position) { /* reused in TapasDisplay simplified */ }
  createOliveBowls(position) { /* reused in TapasDisplay simplified */ }

  createFlamencoStage(position) {
    const group = new THREE.Group();
    // Wooden Platform
    const stage = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.3, 2),
      new THREE.MeshStandardMaterial({ color: '#8B4513' })
    );
    group.add(stage);

    // Chair for Guitarist
    const chair = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.5, 0.4),
      new THREE.MeshStandardMaterial({ color: '#000000' })
    );
    chair.position.set(-0.8, 0.6, -0.5);
    group.add(chair);

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createMountedGuitar(position) {
    const group = new THREE.Group();
    // Simplified Guitar Shape
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.35, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: '#CD853F' })
    );
    body.scale.z = 0.2;
    group.add(body);

    const neck = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.8, 0.05),
      new THREE.MeshStandardMaterial({ color: '#3d1c02' })
    );
    neck.position.y = 0.6;
    group.add(neck);

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createVintagePosters(positions, type) {
    const mat = new THREE.MeshStandardMaterial({ color: '#F0E68C' }); // Paper color
    positions.forEach(pos => {
      const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.9), mat);
      poster.position.set(pos.x, pos.y, pos.z);
      // Assuming z alignment logic is handled by position or parent
      if (pos.z < -1) poster.rotation.y = 0; // Back wall
      else if (Math.abs(pos.x) > 1) poster.rotation.y = pos.x > 0 ? -Math.PI / 2 : Math.PI / 2; // Side walls

      this.scene.add(poster);
    });
  }

  createBarrelTables(positions) {
    const barrelGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.0, 16);
    const barrelMat = new THREE.MeshStandardMaterial({ color: '#8B4513' });

    positions.forEach(pos => {
      const barrel = new THREE.Mesh(barrelGeo, barrelMat);
      barrel.position.set(pos.x, pos.y + 0.5, pos.z);
      this.scene.add(barrel);
    });
  }

  createCastanetsDisplay(position) {
    // Just a small decor item
    const group = new THREE.Group();
    const castanet = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshStandardMaterial({ color: '#000000' })
    );
    castanet.scale.z = 0.5;

    const c1 = castanet.clone(); c1.position.x = -0.05;
    const c2 = castanet.clone(); c2.position.x = 0.05;
    group.add(c1, c2);

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createGarlicBraids(positions) {
    positions.forEach(pos => {
      const group = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 8, 8),
          new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
        );
        bulb.position.y = -i * 0.08;
        bulb.position.x = (Math.random() - 0.5) * 0.05;
        bulb.position.z = (Math.random() - 0.5) * 0.05;
        group.add(bulb);
      }
      group.position.set(pos.x, pos.y, pos.z);
      this.scene.add(group);
    });
  }

  createArchedDoorway(position) {
    const group = new THREE.Group();
    // Wall Hole mask (visual trick: black plane)
    const hole = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 2.5),
      new THREE.MeshBasicMaterial({ color: '#000000' })
    );
    hole.position.y = 1.25;
    group.add(hole);

    // Arch Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: '#8B4513' });
    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.0, 0.3), frameMat);
    sideL.position.set(-0.85, 1.0, 0);
    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.0, 0.3), frameMat);
    sideR.position.set(0.85, 1.0, 0);
    group.add(sideL, sideR);

    // Top Arch
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.1, 8, 16, Math.PI),
      frameMat
    );
    arch.position.set(0, 2.0, 0);
    group.add(arch);

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MISSING HELPER IMPLEMENTATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  createNeonSign(position, text, color) {
    const group = new THREE.Group();

    // Create text geometry (simplified as blocks for now or use texture)
    // For a 3D primitive approach, we'll use a glowing box/plane
    const signGeo = new THREE.BoxGeometry(text.length * 0.4, 0.5, 0.1);
    const signMat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 2.0,
      toneMapped: false
    });
    const sign = new THREE.Mesh(signGeo, signMat);
    group.add(sign);

    // Light
    const light = new THREE.PointLight(color, 1.5, 8);
    light.position.z = 0.5;
    group.add(light);
    this.lights.push(light);

    // Strobe/Flicker effect
    this.animatedObjects.push({
      mesh: sign,
      light: light,
      type: 'flicker',
      baseIntensity: 1.5
    });

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createVegetableTrays(position) {
    const group = new THREE.Group();

    const trayColors = ['#228B22', '#FF6347', '#FFFF00', '#F5DEB3']; // Lettuce, Tomato, Corn/Onion, Sauce

    for (let i = 0; i < 4; i++) {
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.1, 0.3),
        new THREE.MeshStandardMaterial({ color: '#C0C0C0' })
      );
      tray.position.set(i * 0.6, 0, 0);

      const veg = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.05, 0.25),
        new THREE.MeshStandardMaterial({ color: trayColors[i] })
      );
      veg.position.set(i * 0.6, 0.05, 0);

      group.add(tray);
      group.add(veg);
    }

    group.position.set(position.x - 1, position.y + 0.1, position.z);
    this.scene.add(group);
  }

  createGraffitiPanels(positions) {
    const colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0000'];

    positions.forEach(pos => {
      const group = new THREE.Group();
      // Abstract art panels
      for (let i = 0; i < 5; i++) {
        const splat = new THREE.Mesh(
          new THREE.CircleGeometry(0.3 + Math.random() * 0.3, 8),
          new THREE.MeshBasicMaterial({ color: colors[Math.floor(Math.random() * colors.length)] })
        );
        splat.position.set(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1.5,
          0.01 + i * 0.001
        );
        group.add(splat);
      }
      group.position.set(pos.x, pos.y, pos.z);
      // Rotate to align with wall if needed - usually passed pre-rotated or we assume z-aligned
      this.scene.add(group);
    });
  }

  createVendingMachine(position, type) {
    const group = new THREE.Group();

    // Body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.2, 0.8),
      new THREE.MeshStandardMaterial({ color: '#EDEADE', roughness: 0.2 })
    );
    body.position.y = 1.1;
    group.add(body);

    // Window/Buttons
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.0, 1.2),
      new THREE.MeshStandardMaterial({ color: '#87CEEB', emissive: '#87CEEB', emissiveIntensity: 0.2 })
    );
    glass.position.set(0, 1.4, 0.41);
    group.add(glass);

    // Glow
    const light = new THREE.PointLight('#FFFFFF', 0.5, 3);
    light.position.set(0, 1.5, 0.5);
    group.add(light);

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createNorenCurtains(position) {
    const group = new THREE.Group();
    const clothColor = '#8B0000';

    for (let i = 0; i < 3; i++) {
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(0.6, 0.8),
        new THREE.MeshStandardMaterial({ color: clothColor, side: THREE.DoubleSide })
      );
      panel.position.set(i * 0.62 - 0.62, 0, 0);
      group.add(panel);
    }

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createFogEffect(position) {
    // Visual placeholder for fog (particles would be better, but simplified here)
    // We rely on scene.fog mostly, but this adds local steam
    const steamGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const steamMat = new THREE.MeshBasicMaterial({
      color: '#FFFFFF',
      transparent: true,
      opacity: 0.2
    });

    for (let i = 0; i < 5; i++) {
      const steam = new THREE.Mesh(steamGeo, steamMat);
      steam.position.set(
        (Math.random() - 0.5),
        i * 0.3,
        (Math.random() - 0.5)
      );
      steam.position.add(position);
      this.scene.add(steam);

      this.animatedObjects.push({
        mesh: steam,
        update: (t) => {
          steam.position.y = position.y + (t * 0.5 + i) % 2;
          steam.material.opacity = 0.3 * (1 - (steam.position.y - position.y) / 2);
        }
      });
    }
  }

  createRainEffect() {
    // Simple rain particles
    const count = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        Math.random() * 10,
        (Math.random() - 0.5) * 20
      );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: '#AAAAAA',
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });

    const rainSystem = new THREE.Points(geometry, material);
    this.scene.add(rainSystem);

    this.animatedObjects.push({
      mesh: rainSystem,
      update: (t) => {
        const positions = rainSystem.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 0.2;
          if (positions[i] < 0) positions[i] = 10;
        }
        rainSystem.geometry.attributes.position.needsUpdate = true;
      }
    });
  }

  createCityBackground() {
    // Background buildings
    const group = new THREE.Group();
    const windowsMat = new THREE.MeshBasicMaterial({ color: '#FFFF00' });
    const darkMat = new THREE.MeshBasicMaterial({ color: '#000000' });

    for (let i = 0; i < 10; i++) {
      const w = 1 + Math.random() * 2;
      const h = 5 + Math.random() * 10;
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, w),
        darkMat
      );
      building.position.set(
        (Math.random() - 0.5) * 40,
        h / 2,
        -15 - Math.random() * 10
      );
      group.add(building);
    }
    this.scene.add(group);
  }

  createRamenBowl(position) {
    const group = new THREE.Group();
    // Bowl
    const bowl = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: '#FFFFFF', side: THREE.DoubleSide })
    );
    bowl.rotation.x = Math.PI;
    group.add(bowl);

    // Soup
    const soup = new THREE.Mesh(
      new THREE.CircleGeometry(0.14, 16),
      new THREE.MeshStandardMaterial({ color: '#D2691E' })
    );
    soup.rotation.x = -Math.PI / 2;
    soup.position.y = 0.05;
    group.add(soup);

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createSteamEffect(position) {
    this.createFogEffect(position); // reuse fog
  }

  createSnowEffect() {
    const count = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        Math.random() * 10,
        (Math.random() - 0.5) * 20
      );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: '#FFFFFF',
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });

    const snowSystem = new THREE.Points(geometry, material);
    this.scene.add(snowSystem);

    this.animatedObjects.push({
      mesh: snowSystem,
      update: (t) => {
        const positions = snowSystem.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 0.05;
          if (positions[i] < 0) positions[i] = 10;
        }
        snowSystem.geometry.attributes.position.needsUpdate = true;
      }
    });
  }

  createChristmasTree(position) {
    const group = new THREE.Group();
    const leavesMat = new THREE.MeshStandardMaterial({ color: '#006400', roughness: 0.8 });
    // Layers of cone
    for (let i = 0; i < 5; i++) {
      const layer = new THREE.Mesh(
        new THREE.ConeGeometry(2.5 - i * 0.4, 2.0, 16),
        leavesMat
      );
      layer.position.y = 2 + i * 1.2;
      group.add(layer);
    }

    // Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.6, 2),
      new THREE.MeshStandardMaterial({ color: '#4A3020' })
    );
    trunk.position.y = 1;
    group.add(trunk);

    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createMarketStall(pos) {
    const group = new THREE.Group();

    // Base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 1, 1.5),
      new THREE.MeshStandardMaterial({ color: pos.color || '#8B4513' })
    );
    base.position.y = 0.5;
    group.add(base);

    // Roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(2.0, 1.0, 4),
      new THREE.MeshStandardMaterial({ color: '#2F4F4F' })
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 2.0;
    group.add(roof);

    // Supports
    const poles = [-1, 1].map(side => {
      const p = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.5),
        new THREE.MeshStandardMaterial({ color: '#4A3020' })
      );
      p.position.set(side, 1.25, 0.6);
      return p;
    });
    group.add(...poles);

    group.position.set(pos.x, pos.y, pos.z);
    this.scene.add(group);
  }

  createOrnaments(position) {
    // Just some colorful spheres
    const group = new THREE.Group();
    const colors = ['#FF0000', '#FFD700', '#C0C0C0', '#0000FF'];
    for (let i = 0; i < 10; i++) {
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshStandardMaterial({ color: colors[i % 4], metalness: 0.8, roughness: 0.2 })
      );
      ball.position.set(
        (Math.random() - 0.5) * 1.5,
        0.1 + Math.random() * 0.2,
        (Math.random() - 0.5) * 1.0
      );
      group.add(ball);
    }
    group.position.set(position.x, position.y, position.z);
    this.scene.add(group);
  }

  createStringLights(type) {
    // Simple string lights overhead
    if (type === 'market_overhead') {
      const count = 20;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 4, -10),
        new THREE.Vector3(0, 3.5, 0),
        new THREE.Vector3(10, 4, 10)
      ]);

      const pts = curve.getPoints(count);
      const group = new THREE.Group();

      pts.forEach((pt, i) => {
        const light = new THREE.PointLight(i % 2 == 0 ? '#FFD700' : '#FF0000', 0.5, 5);
        light.position.copy(pt);
        group.add(light);
      });

      this.scene.add(group);
    }
  }

  createTenementFacadesWithSnow(width, depth) {
    // Background walls
  }

  // Placeholder fillers
  createClubDrinks(p) { }
  createIndustrialPipes() { }
  createStrobeLights(p) { }
  createLEDStrips(l, c) { }
  createLaserBeams(p, c) { }
  createConcretePillars(p) { }
  createMilkBarFoodDisplay(p) { }
  createPierogiStation(p) { }
  createSoupPots(p) { }
  createSimpleTables(p) { }
  addTablecloths(p) { }
  createFolkArt(p) { }
  createPhotoGallery(p, s) { }
  createAmberDisplay(p) { }
  createCondimentStation(p) { }
  createPolishMenuBoard(p) { }
  createFluorescentLights(p) { }
  createWindowWithView(p, v) { }
  createDriedFlowers(p) { }

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

