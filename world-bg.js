(function () {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 60;

    function waitForThree() {
        if (typeof THREE !== "undefined") {
            initWorld();
            return;
        }
        attempts++;
        if (attempts < MAX_ATTEMPTS) {
            setTimeout(waitForThree, 100);
        } else {
            console.warn("Cybro'X: three.js failed to load from any CDN. Falling back to the CSS gradient background.");
        }
    }

    function initWorld() {
        try {
            runScene();
        } catch (err) {
            console.error("Cybro'X: 3D background failed to initialize.", err);
        }
    }

    waitForThree();

    function runScene() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 0, 62);

    const GLOBE_COLOR = 0x00ff88;
    const GLOBE_OPACITY = 0.4;
    const GLOBE_RADIUS = 16;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const wireframeMaterial = new THREE.LineBasicMaterial({
        color: GLOBE_COLOR,
        transparent: true,
        opacity: GLOBE_OPACITY
    });

    const wireframeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 28, 20);
    const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(wireframeGeometry),
        wireframeMaterial
    );
    globeGroup.add(wireframe);

    const poleGeometry = new THREE.BufferGeometry();
    const polePositions = new Float32Array([
        0, -GLOBE_RADIUS, 0,
        0,  GLOBE_RADIUS, 0
    ]);
    poleGeometry.setAttribute("position", new THREE.BufferAttribute(polePositions, 3));
    const pole = new THREE.Line(poleGeometry, wireframeMaterial);
    globeGroup.add(pole);

    function resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    let pointerX = 0;
    let pointerY = 0;
    window.addEventListener("pointermove", (event) => {
        pointerX = (event.clientX / window.innerWidth - 0.5) * 6;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 6;
    });

    function renderStaticFrame() {
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    function animate() {
        globeGroup.rotation.y += reduceMotion ? 0 : 0.0015;

        camera.position.x += (pointerX - camera.position.x) * 0.02;
        camera.position.y += (-pointerY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    canvas.style.animation = "none";
    canvas.style.background = "transparent";
    window.dispatchEvent(new CustomEvent("worldready"));

    if (reduceMotion) {
        renderStaticFrame();
    } else {
        animate();
    }
    }
})();
