import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ThreeDAnimalFollower.css';

const ThreeDAnimalFollower = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Disable on touch-only mobile devices to preserve touch battery & performance
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const container = containerRef.current;
        if (!container) return;

        // 1. Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // 2. Lighting
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xFFF0E6, 2.2);
        dirLight.position.set(10, 15, 12);
        scene.add(dirLight);

        const pointLight = new THREE.PointLight(0xFF6B00, 3, 25);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);

        // 3. Materials
        const primaryMat = new THREE.MeshStandardMaterial({
            color: 0xFF6B00, // Vibrant Orange
            roughness: 0.3,
            metalness: 0.25
        });

        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xFFAA33, // Warm Gold
            roughness: 0.2,
            metalness: 0.6
        });

        const bellyMat = new THREE.MeshStandardMaterial({
            color: 0xFFF5EE, // Warm Seashell White
            roughness: 0.35
        });

        const wingMat = new THREE.MeshPhysicalMaterial({
            color: 0xFF8C33,
            transparent: true,
            opacity: 0.75,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.4,
            side: THREE.DoubleSide
        });

        const eyeGlowMat = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        });

        const eyePupilMat = new THREE.MeshBasicMaterial({
            color: 0x1A1A1A
        });

        const hornMat = new THREE.MeshStandardMaterial({
            color: 0xFFCC44,
            metalness: 0.8,
            roughness: 0.2
        });

        // 4. Build Compact 3D Mini Flying Dragon Creature
        const creature = new THREE.Group();

        // Sleek Torso
        const bodyGeo = new THREE.ConeGeometry(0.85, 2.2, 16);
        bodyGeo.rotateX(-Math.PI / 2);
        const body = new THREE.Mesh(bodyGeo, primaryMat);
        body.scale.set(0.9, 0.75, 1);
        creature.add(body);

        // Soft Belly Plate
        const bellyGeo = new THREE.SphereGeometry(0.7, 14, 14);
        bellyGeo.scale(0.8, 0.55, 1.1);
        const belly = new THREE.Mesh(bellyGeo, bellyMat);
        belly.position.set(0, -0.2, 0.2);
        creature.add(belly);

        // Head Group (rotates towards cursor independently)
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.35, 1.2);

        // Head Base
        const headGeo = new THREE.SphereGeometry(0.65, 16, 16);
        headGeo.scale(0.9, 0.85, 1.1);
        const head = new THREE.Mesh(headGeo, primaryMat);
        headGroup.add(head);

        // Cute Snout
        const snoutGeo = new THREE.BoxGeometry(0.45, 0.35, 0.65);
        const snout = new THREE.Mesh(snoutGeo, primaryMat);
        snout.position.set(0, -0.1, 0.55);
        headGroup.add(snout);

        // Golden Horns (Cute mini dragon horns)
        const hornGeo = new THREE.ConeGeometry(0.12, 0.65, 8);
        
        const leftHorn = new THREE.Mesh(hornGeo, hornMat);
        leftHorn.position.set(-0.35, 0.45, -0.15);
        leftHorn.rotation.set(-0.4, 0, -0.35);

        const rightHorn = new THREE.Mesh(hornGeo, hornMat);
        rightHorn.position.set(0.35, 0.45, -0.15);
        rightHorn.rotation.set(-0.4, 0, 0.35);

        headGroup.add(leftHorn, rightHorn);

        // Expressive Eyes
        const eyeWhiteGeo = new THREE.SphereGeometry(0.14, 12, 12);
        const eyePupilGeo = new THREE.SphereGeometry(0.08, 10, 10);

        const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeGlowMat);
        leftEyeWhite.position.set(-0.28, 0.15, 0.45);
        const leftEyePupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
        leftEyePupil.position.set(-0.3, 0.16, 0.54);
        headGroup.add(leftEyeWhite, leftEyePupil);

        const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeGlowMat);
        rightEyeWhite.position.set(0.28, 0.15, 0.45);
        const rightEyePupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
        rightEyePupil.position.set(0.3, 0.16, 0.54);
        headGroup.add(rightEyeWhite, rightEyePupil);

        creature.add(headGroup);

        // Translucent Animated Flapping Wings
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.quadraticCurveTo(0.8, 1.2, 1.8, 1.0);
        wingShape.quadraticCurveTo(1.6, 0.2, 1.2, -0.3);
        wingShape.quadraticCurveTo(0.5, -0.2, 0, 0);

        const wingGeo = new THREE.ShapeGeometry(wingShape);

        // Left Wing Group
        const leftWingGroup = new THREE.Group();
        leftWingGroup.position.set(-0.4, 0.25, 0.2);
        const leftWingMesh = new THREE.Mesh(wingGeo, wingMat);
        leftWingMesh.rotation.y = Math.PI; // Face outwards
        leftWingGroup.add(leftWingMesh);
        creature.add(leftWingGroup);

        // Right Wing Group
        const rightWingGroup = new THREE.Group();
        rightWingGroup.position.set(0.4, 0.25, 0.2);
        const rightWingMesh = new THREE.Mesh(wingGeo, wingMat);
        rightWingGroup.add(rightWingMesh);
        creature.add(rightWingGroup);

        // Articulated Dragon Tail
        const tailGroup = new THREE.Group();
        tailGroup.position.set(0, 0, -1.0);

        const tailSeg1 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 10), primaryMat);
        tailSeg1.rotation.x = Math.PI / 2;
        tailSeg1.position.set(0, 0, -0.4);

        const tailSeg2 = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.8, 10), goldMat);
        tailSeg2.rotation.x = Math.PI / 2;
        tailSeg2.position.set(0, 0.05, -1.0);

        const tailTip = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), hornMat);
        tailTip.position.set(0, 0.1, -1.5);

        tailGroup.add(tailSeg1, tailSeg2, tailTip);
        creature.add(tailGroup);

        // Micro Floating Paws
        const pawGeo = new THREE.SphereGeometry(0.18, 8, 8);
        const leftPaw = new THREE.Mesh(pawGeo, goldMat);
        leftPaw.position.set(-0.45, -0.45, 0.3);
        const rightPaw = new THREE.Mesh(pawGeo, goldMat);
        rightPaw.position.set(0.45, -0.45, 0.3);
        creature.add(leftPaw, rightPaw);

        scene.add(creature);

        // Set refined, compact, small scale
        creature.scale.set(0.42, 0.42, 0.42);

        // 5. Floating Stardust Particle Trail
        const particleCount = 35;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = 0;
            particlePositions[i * 3 + 1] = -1000;
            particlePositions[i * 3 + 2] = 0;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: 0xFFAA33,
            size: 0.35,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        let particleIndex = 0;

        // 6. Coordinates & Tracking
        const mouse = { x: 0, y: 0, hasMoved: false };
        const targetPos = new THREE.Vector3(0, 0, 0);
        const currentPos = new THREE.Vector3(0, 0, 0);
        let spinAngle = 0;
        let isSpinning = false;

        const handleMouseMove = (e) => {
            mouse.hasMoved = true;
            // Normalized Device Coordinates
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            // Project to 3D World plane at Z = 0
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));

            // Float comfortably near top-right of cursor
            targetPos.x = pos.x + 1.8;
            targetPos.y = pos.y - 1.4;
            targetPos.z = 0;
        };

        const handleClick = () => {
            if (!isSpinning) {
                isSpinning = true;
                spinAngle = 0;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // 7. Animation Loop
        let clock = new THREE.Clock();
        let animationFrameId;

        const animate = () => {
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            if (mouse.hasMoved) {
                // Smooth slow spring/lerp follow
                const ease = 0.042;
                const prevX = currentPos.x;
                const prevY = currentPos.y;

                currentPos.x += (targetPos.x - currentPos.x) * ease;
                currentPos.y += (targetPos.y - currentPos.y) * ease;
                currentPos.z += (targetPos.z - currentPos.z) * ease;

                const vx = currentPos.x - prevX;
                const vy = currentPos.y - prevY;

                // Gentle floating levitation
                const hoverOffset = Math.sin(time * 4) * 0.25;
                creature.position.set(currentPos.x, currentPos.y + hoverOffset, currentPos.z);

                // Flapping Wings Animation (flaps faster when moving)
                const speed = Math.hypot(vx, vy);
                const flapSpeed = 12 + speed * 40;
                const wingFlap = Math.sin(time * flapSpeed) * 0.65;
                
                leftWingGroup.rotation.z = -wingFlap;
                rightWingGroup.rotation.z = wingFlap;

                // Dynamic Banking & Pitch into turns
                const targetRotZ = THREE.MathUtils.clamp(-vx * 5.5, -0.65, 0.65);
                const targetRotX = THREE.MathUtils.clamp(-vy * 4.0, -0.45, 0.45);
                
                creature.rotation.z += (targetRotZ - creature.rotation.z) * 0.12;
                creature.rotation.x += (targetRotX - creature.rotation.x) * 0.12;
                
                // Head tracks cursor position
                const dx = targetPos.x - currentPos.x;
                const dy = targetPos.y - currentPos.y;
                headGroup.rotation.y = THREE.MathUtils.clamp(dx * 0.2, -0.65, 0.65);
                headGroup.rotation.x = THREE.MathUtils.clamp(-dy * 0.2, -0.45, 0.45);

                // Tail sine wave wag
                tailGroup.rotation.y = Math.sin(time * 6) * 0.35 + vx * 2.5;
                tailGroup.rotation.x = Math.cos(time * 5) * 0.15;

                // Playful 360 Spin on Click
                if (isSpinning) {
                    spinAngle += delta * 15;
                    creature.rotation.y = spinAngle;
                    if (spinAngle >= Math.PI * 2) {
                        isSpinning = false;
                        creature.rotation.y = 0;
                    }
                } else {
                    creature.rotation.y = THREE.MathUtils.lerp(creature.rotation.y, 0, 0.1);
                }

                // Stardust particle emissions
                if (Math.random() > 0.45) {
                    const pIdx = particleIndex % particleCount;
                    const posArray = particleGeo.attributes.position.array;
                    posArray[pIdx * 3] = currentPos.x + (Math.random() - 0.5) * 0.4;
                    posArray[pIdx * 3 + 1] = currentPos.y + hoverOffset - 0.2;
                    posArray[pIdx * 3 + 2] = currentPos.z - 0.5;
                    particleIndex++;
                    particleGeo.attributes.position.needsUpdate = true;
                }
            }

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="three-d-animal-canvas-wrapper" aria-hidden="true" />
    );
};

export default ThreeDAnimalFollower;
