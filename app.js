// 确保所有 Three.js 组件正确初始化
const SceneModule = (() => {
    const initScene = () => {
        // 1. 创建基础场景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance" // 强制启用硬件加速
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(renderer.domElement);

        // 2. 添加基础光照
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        // 3. 创建测试几何体（验证渲染是否正常）
        const testGeometry = new THREE.BoxGeometry(2, 2, 2);
        const testMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const testCube = new THREE.Mesh(testGeometry, testMaterial);
        scene.add(testCube);
        camera.position.z = 5;

        // 4. 基础渲染循环
        function animate() {
            requestAnimationFrame(animate);
            testCube.rotation.x += 0.01;
            testCube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    };

    return { init: initScene };
})();

// 安全初始化
window.addEventListener('DOMContentLoaded', () => {
    try {
        SceneModule.init();
        document.querySelector('.loader').style.display = 'none';
    } catch (error) {
        console.error('初始化失败:', error);
        document.getElementById('container').innerHTML = `
            <div style="color:red;padding:20px;">
                <h2>初始化错误</h2>
                <p>${error.message}</p>
                <p>请检查浏览器控制台获取详细信息</p>
            </div>
        `;
    }
});
