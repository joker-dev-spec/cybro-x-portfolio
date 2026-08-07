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

    function readSignalColor() {
        const value = getComputedStyle(document.body).getPropertyValue("--signal").trim();
        return new THREE.Color(value || "#0a8f7d");
    }

    const NODE_COUNT = 160;
    const BOUNDS = 65;
    const LINK_DISTANCE = 15;

    const positions = new Float32Array(NODE_COUNT * 3);
    const velocities = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * BOUNDS * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS * 2;
        velocities[i * 3] = (Math.random() - 0.5) * 0.035;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.035;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.035;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pointMaterial = new THREE.PointsMaterial({
        color: readSignalColor(),
        size: 1.5,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });

    const points = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(points);

    const MAX_SEGMENTS = NODE_COUNT * 6;
    const linePositions = new Float32Array(MAX_SEGMENTS * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setDrawRange(0, 0);

    const lineMaterial = new THREE.LineBasicMaterial({
        color: readSignalColor(),
        transparent: true,
        opacity: 0.16
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    function rebuildLinks() {
        let segmentIndex = 0;
        for (let i = 0; i < NODE_COUNT && segmentIndex < MAX_SEGMENTS; i++) {
            const ix = i * 3;
            for (let j = i + 1; j < NODE_COUNT && segmentIndex < MAX_SEGMENTS; j++) {
                const jx = j * 3;
                const dx = positions[ix] - positions[jx];
                const dy = positions[ix + 1] - positions[jx + 1];
                const dz = positions[ix + 2] - positions[jx + 2];
                const distSq = dx * dx + dy * dy + dz * dz;
                if (distSq < LINK_DISTANCE * LINK_DISTANCE) {
                    const base = segmentIndex * 6;
                    linePositions[base] = positions[ix];
                    linePositions[base + 1] = positions[ix + 1];
                    linePositions[base + 2] = positions[ix + 2];
                    linePositions[base + 3] = positions[jx];
                    linePositions[base + 4] = positions[jx + 1];
                    linePositions[base + 5] = positions[jx + 2];
                    segmentIndex++;
                }
            }
        }
        lineGeometry.setDrawRange(0, segmentIndex * 2);
        lineGeometry.attributes.position.needsUpdate = true;
    }

    function stepNodes() {
        for (let i = 0; i < NODE_COUNT; i++) {
            const idx = i * 3;
            for (let axis = 0; axis < 3; axis++) {
                positions[idx + axis] += velocities[idx + axis];
                if (positions[idx + axis] > BOUNDS || positions[idx + axis] < -BOUNDS) {
                    velocities[idx + axis] *= -1;
                }
            }
        }
        pointGeometry.attributes.position.needsUpdate = true;
    }

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
        pointerX = (event.clientX / window.innerWidth - 0.5) * 14;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 14;
    });

    window.addEventListener("themechange", () => {
        const color = readSignalColor();
        pointMaterial.color = color;
        lineMaterial.color = color;
    });

    function renderStaticFrame() {
        rebuildLinks();
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    function animate() {
        stepNodes();
        rebuildLinks();

        camera.position.x += (pointerX - camera.position.x) * 0.02;
        camera.position.y += (-pointerY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        scene.rotation.y += 0.0007;

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