// 三维场景模块
const SceneModule = (() => {
    const config = {
        particleCount: 8000,
        bloomParams: [1.2, 0.4, 0.85]
    };

    let scene, camera, renderer, composer;
    let controls, particleSystem, nebulaMaterial;
    let transit = false;
    let autoRotation = true;

    const initScene = () => {
        // 场景初始化
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(renderer.domElement);

        // 后期处理
        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));
        const bloomPass = new THREE.UnrealBloomPass(...config.bloomParams);
        composer.addPass(bloomPass);

        // 动态星云背景
        initNebulaBackground();
        initParticleField();
        initLighting();
        initMainObjects();
        initControls();
        initHUD();
    };

    const initNebulaBackground = () => {
        const geometry = new THREE.PlaneGeometry(200, 200);
        nebulaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                
                vec3 palette(float t) {
                    vec3 a = vec3(0.5, 0.5, 0.5);
                    vec3 b = vec3(0.5, 0.5, 0.5);
                    vec3 c = vec3(1.0, 1.0, 1.0);
                    vec3 d = vec3(0.263,0.416,0.557);
                    return a + b*cos(6.28318*(c*t+d));
                }
                
                void main() {
                    vec2 uv = (vUv - 0.5) * 2.0;
                    vec3 finalColor = vec3(0.0);
                    for(float i = 0.0; i < 4.0; i++) {
                        uv = abs(uv * 1.5) - 1.0;
                        float d = length(uv) * exp(-length(uv));
                        vec3 col = palette(length(uv) + i*0.4 + time*0.4);
                        d = sin(d*8.0 + time)/8.0;
                        d = abs(d);
                        finalColor += col * d;
                    }
                    gl_FragColor = vec4(finalColor * 0.8, 1.0);
                }
            `
        });
        const nebula = new THREE.Mesh(geometry, nebulaMaterial);
        nebula.position.z = -100;
        scene.add(nebula);
    };

    const initParticleField = () => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);

        for(let i = 0; i < config.particleCount * 3; i += 3) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() - 0.5) * 2);
            const radius = 50 + Math.random() * 100;
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i+1] = radius * Math.cos(phi);
            positions[i+2] = radius * Math.sin(phi) * Math.sin(theta);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            size: 0.2,
            color: 0x47e3ff,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);
    };

    const initMainObjects = () => {
        // 恒星系统
        const starGeometry = new THREE.SphereGeometry(2, 64, 64);
        const starMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffdd88,
            emissive: 0xffaa44,
            emissiveIntensity: 0.5
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        scene.add(star);

        // 行星轨道
        const orbitGeometry = new THREE.RingGeometry(6, 6.1, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x47e3ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);

        // 行星
        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0x3399ff,
                metalness: 0.3,
                roughness: 0.1
            })
        );
        scene.add(planet);

        // 初始化摄像机位置
        camera.position.set(0, 15, 30);
        camera.lookAt(0, 0, 0);
    };

    // 其他功能保持不变，根据需要添加新功能...

    return {
        init: initScene,
        toggleTransit: () => {
            transit = !transit;
            updateHUD();
        }
    };
})();

// 初始化应用
window.addEventListener('DOMContentLoaded', () => {
    SceneModule.init();
    document.querySelector('.loader').style.display = 'none';
});
