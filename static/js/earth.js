// earth.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('earth-container').appendChild(renderer.domElement);

// Ajouter une texture de la Terre
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/static/images/earth-texture.jpg');
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Positionner la caméra
camera.position.z = 15;

// Animation
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.005; // Faire tourner la Terre
    renderer.render(scene, camera);
}

animate();

// Redimensionner la scène lorsque la fenêtre est redimensionnée
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});