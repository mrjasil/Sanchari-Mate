"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeJSEarth() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const airplaneRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
    
    // Earth material with blue color and some specular for water effect
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x1E90FF, // Dodger blue
      specular: 0x555555,
      shininess: 30,
      transparent: true,
      opacity: 0.9
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthRef.current = earth;
    scene.add(earth);

    // Add cloud layer
    const cloudGeometry = new THREE.SphereGeometry(2.1, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earth.add(clouds);

    // Create location markers (emoji positions)
    const locations = [
      { position: new THREE.Vector3(1.5, 0.5, 1.2), emoji: "🗽", name: "New York" },
      { position: new THREE.Vector3(-1.2, 0.3, -1.5), emoji: "🗼", name: "Paris" },
      { position: new THREE.Vector3(0.8, -0.7, 1.8), emoji: "🏯", name: "Tokyo" },
      { position: new THREE.Vector3(-1.8, -0.4, 0.5), emoji: "🏛️", name: "Rome" },
      { position: new THREE.Vector3(1.2, 0.8, -1.2), emoji: "🏔️", name: "Switzerland" },
      { position: new THREE.Vector3(-0.5, 1.1, 1.3), emoji: "🏜️", name: "Dubai" }
    ];

    // Create airplane
    const createAirplane = () => {
      const airplaneGroup = new THREE.Group();
      
      // Airplane body
      const bodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;
      airplaneGroup.add(body);

      // Airplane wings
      const wingGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.1);
      const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
      const wings = new THREE.Mesh(wingGeometry, wingMaterial);
      airplaneGroup.add(wings);

      // Airplane tail
      const tailGeometry = new THREE.BoxGeometry(0.02, 0.1, 0.05);
      const tailMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
      const tail = new THREE.Mesh(tailGeometry, tailMaterial);
      tail.position.set(-0.15, 0, 0);
      airplaneGroup.add(tail);

      airplaneGroup.scale.set(2, 2, 2);
      airplaneGroup.position.set(3, 0, 0);
      
      return airplaneGroup;
    };

    const airplane = createAirplane();
    airplaneRef.current = airplane;
    scene.add(airplane);

    // Add location markers as HTML elements
    locations.forEach((location, index) => {
      // Create a small sphere for the location
      const markerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const markerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffd700, // Gold color
        emissive: 0xffa500,
        emissiveIntensity: 0.5
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(location.position);
      earth.add(marker);

      // Create HTML element for emoji
      const emojiElement = document.createElement('div');
      emojiElement.className = 'absolute text-2xl pointer-events-none';
      emojiElement.innerHTML = location.emoji;
      emojiElement.style.color = 'white';
      emojiElement.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
      mountRef.current?.appendChild(emojiElement);

      // Function to update emoji position
      const updateEmojiPosition = () => {
        const vector = location.position.clone();
        earth.localToWorld(vector);
        vector.project(camera);

        const x = (vector.x * 0.5 + 0.5) * mountRef.current!.clientWidth;
        const y = (-(vector.y * 0.5 + 0.5)) * mountRef.current!.clientHeight;

        emojiElement.style.transform = `translate(${x}px, ${y}px)`;
        emojiElement.style.opacity = vector.z > 1 ? '0' : '1';
      };

      // Store update function for animation loop
      marker.userData.updateEmoji = updateEmojiPosition;
    });

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (earthRef.current) {
        // Rotate Earth
        earthRef.current.rotation.y += 0.002;
        
        // Rotate clouds slightly faster for drifting effect
        const clouds = earthRef.current.children[0];
        clouds.rotation.y += 0.003;
      }

      if (airplaneRef.current) {
        // Animate airplane orbiting around Earth
        const time = Date.now() * 0.001;
        const radius = 3.5;
        
        airplaneRef.current.position.x = Math.cos(time) * radius;
        airplaneRef.current.position.z = Math.sin(time) * radius;
        airplaneRef.current.position.y = Math.sin(time * 2) * 0.5;
        
        // Make airplane always point in direction of travel
        airplaneRef.current.lookAt(earthRef.current!.position);
        
        // Add slight rocking motion
        airplaneRef.current.rotation.z = Math.sin(time * 4) * 0.1;
      }

      // Update emoji positions
      scene.traverse((object) => {
        if (object.userData.updateEmoji) {
          object.userData.updateEmoji();
        }
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      // Clean up HTML emoji elements
      const emojiElements = mountRef.current?.querySelectorAll('[class*="absolute"]');
      emojiElements?.forEach(el => el.remove());

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mountRef} 
        className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm"
      />
      
      {/* Overlay title */}
      <div className="absolute top-6 left-6 text-white">
        <h3 className="font-serif text-2xl font-light">Explore Our World</h3>
        <p className="text-sm opacity-80">Real-time travel destinations</p>
      </div>
    </div>
  );
}