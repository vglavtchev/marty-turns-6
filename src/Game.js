import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Game = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    // Track
    const trackWidth = 20;
    const trackLength = 10000;
    const trackGeometry = new THREE.PlaneGeometry(trackWidth, trackLength);
    const trackMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.rotation.x = -Math.PI / 2;
    track.position.z = -trackLength / 2 + 50;
    scene.add(track);

    // F1 Car (Simplified with primitives)
    const carGroup = new THREE.Group();
    
    // Body
    const bodyGeom = new THREE.BoxGeometry(1, 0.4, 2.5);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    carGroup.add(body);

    // Front wing
    const wingGeom = new THREE.BoxGeometry(1.8, 0.1, 0.5);
    const wing = new THREE.Mesh(wingGeom, bodyMat);
    wing.position.z = 1.3;
    carGroup.add(wing);

    // Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32);
    const wheelMat = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const createWheel = (x, z) => {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, -0.1, z);
      return wheel;
    };
    carGroup.add(createWheel(0.6, 0.8));
    carGroup.add(createWheel(-0.6, 0.8));
    carGroup.add(createWheel(0.6, -0.8));
    carGroup.add(createWheel(-0.6, -0.8));

    scene.add(carGroup);
    carGroup.position.y = 0.3;

    // Banners with Marty's pictures
    const bannerInterval = 100;
    const images = ['0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg'];
    const textureLoader = new THREE.TextureLoader();

    // Canvas texture for text
    const createTextTexture = (text) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const context = canvas.getContext('2d');
      context.fillStyle = '#ff0000';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = 'Bold 40px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText(text, canvas.width / 2, canvas.height / 2 + 15);
      return new THREE.CanvasTexture(canvas);
    };

    const textTexture = createTextTexture('HAPPY BIRTHDAY MARTY!');

    for (let i = 0; i < 80; i++) {
      const bannerGroup = new THREE.Group();
      
      // Posts
      const postGeom = new THREE.CylinderGeometry(0.1, 0.1, 8);
      const postMat = new THREE.MeshPhongMaterial({ color: 0x888888 });
      const postL = new THREE.Mesh(postGeom, postMat);
      postL.position.x = -trackWidth/2 - 0.5;
      const postR = new THREE.Mesh(postGeom, postMat);
      postR.position.x = trackWidth/2 + 0.5;
      bannerGroup.add(postL, postR);

      // Banner board
      const boardGeom = new THREE.BoxGeometry(trackWidth + 2, 3, 0.2);
      const imgPath = require(`./static/${images[i % images.length]}`);
      const texture = textureLoader.load(imgPath);
      
      const boardMat = [
        new THREE.MeshPhongMaterial({ color: 0x888888 }), // right
        new THREE.MeshPhongMaterial({ color: 0x888888 }), // left
        new THREE.MeshPhongMaterial({ color: 0x888888 }), // top
        new THREE.MeshPhongMaterial({ color: 0x888888 }), // bottom
        new THREE.MeshPhongMaterial({ map: texture }),    // front
        new THREE.MeshPhongMaterial({ map: textTexture }), // back
      ];

      const board = new THREE.Mesh(boardGeom, boardMat);
      board.position.y = 6;
      bannerGroup.add(board);

      bannerGroup.position.z = -i * bannerInterval;
      scene.add(bannerGroup);
    }

    // Controls
    const keys = { w: false, s: false, a: false, d: false, arrowup: false, arrowdown: false, arrowleft: false, arrowright: false };
    const onKeyDown = (e) => { 
      const key = e.key.toLowerCase();
      if (keys.hasOwnProperty(key)) keys[key] = true; 
    };
    const onKeyUp = (e) => { 
      const key = e.key.toLowerCase();
      if (keys.hasOwnProperty(key)) keys[key] = false; 
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Physics constants
    let speed = 0;
    const maxSpeed = 2.5;
    const acceleration = 0.04;
    const friction = 0.015;
    const turnSpeed = 0.1;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Movement
      if (keys.w || keys.arrowup) speed = Math.min(speed + acceleration, maxSpeed);
      if (keys.s || keys.arrowdown) speed = Math.max(speed - acceleration, -maxSpeed / 2);
      
      // Friction
      if (!keys.w && !keys.s && !keys.arrowup && !keys.arrowdown) {
        if (speed > 0) speed = Math.max(0, speed - friction);
        if (speed < 0) speed = Math.min(0, speed + friction);
      }

      carGroup.position.z -= speed;

      // Steering
      if (Math.abs(speed) > 0.1) {
        if (keys.a || keys.arrowleft) carGroup.position.x -= turnSpeed * (speed / maxSpeed);
        if (keys.d || keys.arrowright) carGroup.position.x += turnSpeed * (speed / maxSpeed);
      }

      // Constraints
      carGroup.position.x = Math.max(-trackWidth/2 + 1, Math.min(trackWidth/2 - 1, carGroup.position.x));

      // Camera follow
      camera.position.x = carGroup.position.x;
      camera.position.z = carGroup.position.z + 5;
      camera.position.y = carGroup.position.y + 2;
      camera.lookAt(carGroup.position.x, carGroup.position.y, carGroup.position.z - 10);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
};

export default Game;
