// Core logic for Exoplanet Detection System
// For full effect, use local server to run this project

// Display basic console message
console.log("Exoplanet Detection Visualization Loaded");

// Placeholder: Full 3D logic should be added here
// See your previously implemented HTML for Three.js setup
// and integrate all planet, orbit, detection box, lightcurve code

// Sample demo: rotating central star
const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000819);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

// Central star
const starGeom = new THREE.SphereGeometry(2, 32, 32);
const starMat = new THREE.MeshBasicMaterial({ color: 0xffdd88 });
const star = new THREE.Mesh(starGeom, starMat);
scene.add(star);

// Camera
camera.position.z = 10;
function animate() {
    requestAnimationFrame(animate);
    star.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
