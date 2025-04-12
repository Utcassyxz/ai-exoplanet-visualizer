let scene, camera, renderer, controls;
let star, glow, orbit, planet, box;
let angle = 0, transit = false;

function initThree() {
  const container = document.getElementById('container');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Sci‑fi nebula background
  new THREE.TextureLoader().load(
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/nebula.jpg',
    tex => scene.background = tex
  );

  // OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.minDistance = 5;
  controls.maxDistance = 50;

  // Lights
  scene.add(new THREE.AmbientLight(0x888888));
  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(10, 10, 10);
  scene.add(light);

  // Star
  star = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffdd88 })
  );
  scene.add(star);
  glow = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.2 })
  );
  scene.add(glow);

  // Orbit
  orbit = new THREE.Mesh(
    new THREE.RingGeometry(6, 6.05, 128),
    new THREE.MeshBasicMaterial({ color: 0x47e3ff, side: THREE.DoubleSide })
  );
  orbit.rotation.x = Math.PI/2;
  scene.add(orbit);

  // Planet
  planet = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x3399ff })
  );
  scene.add(planet);

  // Detection box
  box = new THREE.BoxHelper(planet, 0x47e3ff);
  scene.add(box);
  box.visible = false;

  camera.position.set(0, 0, 15);
  controls.update();
}

function animate() {
  requestAnimationFrame(animate);
  angle += 0.01;
  planet.position.x = 6 * Math.cos(angle);
  planet.position.z = 6 * Math.sin(angle);
  star.rotation.y += 0.003;
  glow.rotation.y += 0.002;
  controls.update();
  renderer.render(scene, camera);
}

function toggleTransit() {
  transit = !transit;
  box.visible = transit;
  updateLightcurve();
}

function updateLightcurve() {
  const x = Array.from({ length: 100 }, (_, i) => i);
  const y = transit ? posMean : negMean;
  Plotly.newPlot('lightcurve-panel', [{
    x, y, type: 'scatter', mode: 'lines',
    line: { color: '#47e3ff', width: 2 },
    fill: 'tozeroy', fillcolor: 'rgba(71,227,255,0.1)'
  }], {
    title: { text: transit ? 'Transit Detected' : 'No Transit', font: { color: '#47e3ff' } },
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#47e3ff' },
    xaxis: { title: 'Time', gridcolor: '#1a3545' },
    yaxis: { title: 'Flux', gridcolor: '#1a3545', range: [0.75, 1.05] }
  });
}

// Initialize and start
initThree();
updateLightcurve();
animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

