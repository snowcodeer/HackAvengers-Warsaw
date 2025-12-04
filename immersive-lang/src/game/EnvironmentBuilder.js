// EnvironmentBuilder - Creates themed 3D environments
import * as THREE from 'three';

export class EnvironmentBuilder {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.animatedObjects = [];
  }

  build() {
    // Create floor
    this.createFloor();
    
    // Build environment based on type
    const envType = this.config.environment.type;
    
    switch (envType) {
      case 'bakery':
        this.buildBakery();
        break;
      case 'nightclub':
        this.buildNightclub();
        break;
      case 'pub':
        this.buildPub();
        break;
      case 'teahouse':
        this.buildTeahouse();
        break;
      case 'tapas_bar':
        this.buildTapasBar();
        break;
      case 'tea_garden':
        this.buildTeaGarden();
        break;
      case 'cafe':
        this.buildCafe();
        break;
      case 'old_town':
        this.buildOldTown();
        break;
      default:
        this.buildGenericRoom();
    }
    
    // Add walls
    this.createWalls();
  }

  createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.visualStyle.primaryColor).multiplyScalar(1.5),
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.config.visualStyle.primaryColor),
      roughness: 0.9,
      side: THREE.DoubleSide
    });
    
    const wallHeight = 4;
    const roomSize = 10;
    
    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize * 2, wallHeight),
      wallMaterial
    );
    backWall.position.set(0, wallHeight / 2, -roomSize);
    backWall.receiveShadow = true;
    this.scene.add(backWall);
    
    // Side walls
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize * 2, wallHeight),
      wallMaterial
    );
    leftWall.position.set(-roomSize, wallHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    this.scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize * 2, wallHeight),
      wallMaterial
    );
    rightWall.position.set(roomSize, wallHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    this.scene.add(rightWall);
  }

  buildBakery() {
    // Display counter
    const counterGeometry = new THREE.BoxGeometry(4, 1, 1);
    const counterMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.6
    });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(0, 0.5, -2);
    counter.castShadow = true;
    counter.receiveShadow = true;
    this.scene.add(counter);
    
    // Glass display case on counter
    const glassGeometry = new THREE.BoxGeometry(3.5, 0.8, 0.8);
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(0, 1.4, -2);
    this.scene.add(glass);
    
    // Croissants in display
    for (let i = 0; i < 5; i++) {
      const croissant = this.createCroissant();
      croissant.position.set(-1.5 + i * 0.7, 1.1, -2);
      this.scene.add(croissant);
    }
    
    // Baguettes in basket
    const basketGeometry = new THREE.CylinderGeometry(0.4, 0.3, 0.3, 8);
    const basketMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
    const basket = new THREE.Mesh(basketGeometry, basketMaterial);
    basket.position.set(2.5, 0.8, -1.5);
    this.scene.add(basket);
    
    for (let i = 0; i < 4; i++) {
      const baguette = this.createBaguette();
      baguette.position.set(2.5 + (Math.random() - 0.5) * 0.3, 1 + i * 0.1, -1.5);
      baguette.rotation.y = Math.random() * Math.PI;
      baguette.rotation.z = Math.random() * 0.3 - 0.15;
      this.scene.add(baguette);
    }
    
    // Shelves on back wall
    for (let y = 1.5; y < 3.5; y += 0.8) {
      const shelfGeometry = new THREE.BoxGeometry(6, 0.1, 0.5);
      const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3020 });
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.set(0, y, -9.7);
      shelf.castShadow = true;
      this.scene.add(shelf);
    }
    
    // Warm ceiling lights
    for (let x = -2; x <= 2; x += 2) {
      const light = new THREE.PointLight(0xffd4a6, 0.8, 8);
      light.position.set(x, 3.5, 0);
      this.scene.add(light);
      
      // Light fixture
      const fixtureGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.3, 8);
      const fixtureMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd4a6,
        emissive: 0xffd4a6,
        emissiveIntensity: 0.5
      });
      const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
      fixture.position.set(x, 3.7, 0);
      this.scene.add(fixture);
    }
  }

  createCroissant() {
    const group = new THREE.Group();
    const geometry = new THREE.TorusGeometry(0.1, 0.05, 8, 16, Math.PI);
    const material = new THREE.MeshStandardMaterial({
      color: 0xdaa520,
      roughness: 0.7
    });
    const croissant = new THREE.Mesh(geometry, material);
    croissant.rotation.x = -Math.PI / 2;
    group.add(croissant);
    return group;
  }

  createBaguette() {
    const geometry = new THREE.CapsuleGeometry(0.05, 0.6, 4, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0xdaa520,
      roughness: 0.8
    });
    const baguette = new THREE.Mesh(geometry, material);
    baguette.rotation.z = Math.PI / 2;
    return baguette;
  }

  buildNightclub() {
    // DJ Booth
    const boothGeometry = new THREE.BoxGeometry(3, 1.2, 1.5);
    const boothMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.8,
      roughness: 0.2
    });
    const booth = new THREE.Mesh(boothGeometry, boothMaterial);
    booth.position.set(0, 0.6, -8);
    booth.castShadow = true;
    this.scene.add(booth);
    
    // Turntables
    for (let x = -0.8; x <= 0.8; x += 1.6) {
      const turntableGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
      const turntableMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9
      });
      const turntable = new THREE.Mesh(turntableGeometry, turntableMaterial);
      turntable.position.set(x, 1.25, -8);
      this.scene.add(turntable);
      this.animatedObjects.push({
        mesh: turntable,
        type: 'spin',
        speed: 0.5
      });
    }
    
    // Speakers
    for (let x = -4; x <= 4; x += 8) {
      const speakerGeometry = new THREE.BoxGeometry(1.5, 2.5, 1);
      const speakerMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.5
      });
      const speaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
      speaker.position.set(x, 1.25, -7);
      speaker.castShadow = true;
      this.scene.add(speaker);
      
      // Speaker cone
      const coneGeometry = new THREE.CircleGeometry(0.4, 32);
      const coneMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.3
      });
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.set(x, 1.25, -6.49);
      this.scene.add(cone);
    }
    
    // Strobe lights
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const strobeLight = new THREE.SpotLight(
        i % 2 === 0 ? 0xff0000 : 0x0066ff,
        2,
        15,
        Math.PI / 6,
        0.5
      );
      strobeLight.position.set(
        Math.cos(angle) * 5,
        3.5,
        Math.sin(angle) * 5
      );
      strobeLight.target.position.set(0, 0, -5);
      this.scene.add(strobeLight);
      this.scene.add(strobeLight.target);
      
      this.animatedObjects.push({
        light: strobeLight,
        type: 'strobe',
        phase: i * 0.25
      });
    }
    
    // Bar counter
    const barGeometry = new THREE.BoxGeometry(5, 1.2, 0.8);
    const barMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c2c2c,
      metalness: 0.5,
      roughness: 0.3
    });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(-6, 0.6, 0);
    this.scene.add(bar);
  }

  buildPub() {
    // Bar counter
    const barGeometry = new THREE.BoxGeometry(5, 1.1, 1);
    const barMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2c1d,
      roughness: 0.6
    });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(0, 0.55, -3);
    bar.castShadow = true;
    this.scene.add(bar);
    
    // Bar top
    const barTopGeometry = new THREE.BoxGeometry(5.2, 0.1, 1.2);
    const barTopMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c1810,
      roughness: 0.4
    });
    const barTop = new THREE.Mesh(barTopGeometry, barTopMaterial);
    barTop.position.set(0, 1.15, -3);
    this.scene.add(barTop);
    
    // Beer taps
    for (let x = -1.5; x <= 1.5; x += 0.75) {
      const tapGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
      const tapMaterial = new THREE.MeshStandardMaterial({
        color: 0xc77c48,
        metalness: 0.8
      });
      const tap = new THREE.Mesh(tapGeometry, tapMaterial);
      tap.position.set(x, 1.4, -3.3);
      this.scene.add(tap);
    }
    
    // Fireplace
    const fireplaceGeometry = new THREE.BoxGeometry(2, 1.5, 0.5);
    const fireplaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.9
    });
    const fireplace = new THREE.Mesh(fireplaceGeometry, fireplaceMaterial);
    fireplace.position.set(-7, 0.75, -9.7);
    this.scene.add(fireplace);
    
    // Fire light
    const fireLight = new THREE.PointLight(0xff6600, 1.5, 8);
    fireLight.position.set(-7, 1, -9);
    this.scene.add(fireLight);
    this.animatedObjects.push({
      light: fireLight,
      type: 'flicker',
      baseIntensity: 1.5
    });
    
    // Tables
    for (let i = 0; i < 3; i++) {
      const table = this.createWoodenTable();
      table.position.set(-5 + i * 4, 0, 3);
      this.scene.add(table);
    }
    
    // Dart board
    const dartboardGeometry = new THREE.CircleGeometry(0.4, 32);
    const dartboardMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c1810
    });
    const dartboard = new THREE.Mesh(dartboardGeometry, dartboardMaterial);
    dartboard.position.set(7, 1.8, -9.9);
    this.scene.add(dartboard);
  }

  createWoodenTable() {
    const group = new THREE.Group();
    
    // Table top
    const topGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.08, 16);
    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2c1d,
      roughness: 0.7
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.8;
    group.add(top);
    
    // Leg
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c1810 });
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.y = 0.4;
    group.add(leg);
    
    return group;
  }

  buildTeahouse() {
    // Low traditional table
    const tableGeometry = new THREE.BoxGeometry(2, 0.3, 1.2);
    const tableMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2c1d,
      roughness: 0.6
    });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 0.15, -2);
    this.scene.add(table);
    
    // Tea set
    const teapotGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const teapotMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      roughness: 0.4
    });
    const teapot = new THREE.Mesh(teapotGeometry, teapotMaterial);
    teapot.position.set(0, 0.45, -2);
    this.scene.add(teapot);
    
    // Tea cups
    for (let x = -0.5; x <= 0.5; x += 0.5) {
      const cupGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.08, 16);
      const cupMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3
      });
      const cup = new THREE.Mesh(cupGeometry, cupMaterial);
      cup.position.set(x, 0.35, -1.7);
      this.scene.add(cup);
    }
    
    // Paper lanterns
    for (let x = -4; x <= 4; x += 4) {
      const lantern = this.createPaperLantern();
      lantern.position.set(x, 3, 0);
      this.scene.add(lantern);
      
      const lanternLight = new THREE.PointLight(0xffd700, 0.5, 5);
      lanternLight.position.set(x, 2.8, 0);
      this.scene.add(lanternLight);
    }
    
    // Bamboo plants
    for (let i = 0; i < 3; i++) {
      const bamboo = this.createBamboo();
      bamboo.position.set(-8 + i * 2, 0, -9);
      this.scene.add(bamboo);
    }
    
    // Calligraphy scroll on wall
    const scrollGeometry = new THREE.PlaneGeometry(0.8, 1.5);
    const scrollMaterial = new THREE.MeshStandardMaterial({
      color: 0xfaf0e6,
      roughness: 0.9
    });
    const scroll = new THREE.Mesh(scrollGeometry, scrollMaterial);
    scroll.position.set(0, 2.5, -9.9);
    this.scene.add(scroll);
  }

  createPaperLantern() {
    const group = new THREE.Group();
    
    const lanternGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const lanternMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.8
    });
    const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
    group.add(lantern);
    
    return group;
  }

  createBamboo() {
    const group = new THREE.Group();
    
    for (let i = 0; i < 3; i++) {
      const stalkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
      const stalkMaterial = new THREE.MeshStandardMaterial({
        color: 0x228b22,
        roughness: 0.7
      });
      const stalk = new THREE.Mesh(stalkGeometry, stalkMaterial);
      stalk.position.set((Math.random() - 0.5) * 0.3, 1.5, (Math.random() - 0.5) * 0.3);
      group.add(stalk);
    }
    
    return group;
  }

  buildTapasBar() {
    // Similar to pub but with Spanish flair
    this.buildPub();
    
    // Add Spanish elements
    const guitarGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.1);
    const guitarMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
    const guitar = new THREE.Mesh(guitarGeometry, guitarMaterial);
    guitar.position.set(8, 2, -9.9);
    guitar.rotation.z = 0.2;
    this.scene.add(guitar);
  }

  buildTeaGarden() {
    // Outdoor zen garden feel
    this.createFloor();
    
    // Cherry blossom tree
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2c1d,
      roughness: 0.9
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(-5, 1.5, -5);
    this.scene.add(trunk);
    
    // Pink foliage
    const foliageGeometry = new THREE.SphereGeometry(2, 16, 16);
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.8
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(-5, 4, -5);
    this.scene.add(foliage);
    
    // Stone lantern
    const lanternBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.3, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    lanternBase.position.set(3, 0.15, -3);
    this.scene.add(lanternBase);
  }

  buildCafe() {
    // Italian cafe
    this.buildBakery();
    
    // Espresso machine
    const machineGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.5);
    const machineMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.8
    });
    const machine = new THREE.Mesh(machineGeometry, machineMaterial);
    machine.position.set(-1.5, 1.4, -2.8);
    this.scene.add(machine);
  }

  buildOldTown() {
    // Polish old town square feel
    // Cobblestone floor
    const cobbleGeometry = new THREE.PlaneGeometry(20, 20, 20, 20);
    const cobbleMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.95
    });
    const cobbles = new THREE.Mesh(cobbleGeometry, cobbleMaterial);
    cobbles.rotation.x = -Math.PI / 2;
    cobbles.position.y = 0.01;
    this.scene.add(cobbles);
    
    // Market stall
    const stallGeometry = new THREE.BoxGeometry(3, 0.1, 1.5);
    const stallMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const stall = new THREE.Mesh(stallGeometry, stallMaterial);
    stall.position.set(0, 1, -2);
    this.scene.add(stall);
    
    // Colorful buildings as backdrop
    const colors = [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71];
    for (let i = 0; i < 4; i++) {
      const buildingGeometry = new THREE.BoxGeometry(4, 6, 2);
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: colors[i],
        roughness: 0.8
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(-7 + i * 4.5, 3, -9);
      this.scene.add(building);
    }
  }

  buildGenericRoom() {
    // Fallback generic interior
    const tableGeometry = new THREE.BoxGeometry(2, 0.8, 1);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 0.4, -2);
    this.scene.add(table);
  }

  update(delta) {
    const time = performance.now() * 0.001;
    
    this.animatedObjects.forEach(obj => {
      if (obj.type === 'spin' && obj.mesh) {
        obj.mesh.rotation.y += obj.speed * delta;
      }
      
      if (obj.type === 'strobe' && obj.light) {
        const intensity = Math.sin(time * 4 + obj.phase * Math.PI * 2) > 0.7 ? 3 : 0.5;
        obj.light.intensity = intensity;
      }
      
      if (obj.type === 'flicker' && obj.light) {
        const flicker = obj.baseIntensity + Math.random() * 0.5 - 0.25;
        obj.light.intensity = flicker;
      }
    });
  }
}

