import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Hero3DCanvas.css';

const Hero3DCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const container = canvasRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.z = 18;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        // Holographic wireframe + glowing points
        const group = new THREE.Group();

        // 1. Torus Knot
        const torusGeo = new THREE.TorusKnotGeometry(4.2, 0.8, 64, 12);
        const torusMat = new THREE.MeshBasicMaterial({
            color: 0xFF6B00,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        group.add(torus);

        // 2. Icosahedron Outer Cage
        const icoGeo = new THREE.IcosahedronGeometry(6.2, 1);
        const icoMat = new THREE.MeshBasicMaterial({
            color: 0xFF9933,
            wireframe: true,
            transparent: true,
            opacity: 0.18
        });
        const ico = new THREE.Mesh(icoGeo, icoMat);
        group.add(ico);

        // 3. Floating Glowing Core
        const coreGeo = new THREE.SphereGeometry(1.8, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xFF6B00,
            transparent: true,
            opacity: 0.12
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // 4. Point Vertices
        const pointsGeo = new THREE.IcosahedronGeometry(6.2, 1);
        const pointsMat = new THREE.PointsMaterial({
            color: 0xFF8C33,
            size: 0.25,
            transparent: true,
            opacity: 0.8
        });
        const points = new THREE.Points(pointsGeo, pointsMat);
        group.add(points);

        scene.add(group);

        let mouseX = 0;
        let mouseY = 0;
        let isVisible = true;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // IntersectionObserver to pause rendering when scrolled out of view
        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        }, { threshold: 0.05 });

        observer.observe(container);

        let animationFrameId;
        const animate = () => {
            if (isVisible) {
                group.rotation.x += 0.0025;
                group.rotation.y += 0.0035;

                // Mouse parallax
                group.rotation.x += (mouseY * 0.4 - group.rotation.x) * 0.02;
                group.rotation.y += (mouseX * 0.4 - group.rotation.y) * 0.02;

                renderer.render(scene, camera);
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            observer.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div ref={canvasRef} className="hero-3d-canvas-container" aria-hidden="true" />
    );
};

export default Hero3DCanvas;
