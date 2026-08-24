import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Float,
    Environment,
    Lightformer,
    MeshDistortMaterial,
    PerformanceMonitor
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The single rendered 3D object on the site.
 *
 * Design intent: a matte ceramic form under soft studio light — the language of
 * a product photograph, not of a WebGL demo. There is no bloom, no emissive
 * glow and no wireframe. All of the depth comes from the lighting rig and the
 * contact shadow on the floor, which is what keeps it consistent with the flat,
 * quiet page around it.
 */

const ACCENT = '#EA580C';

/** Slow damping toward a target, frame-rate independent. */
function damp(current, target, lambda, dt) {
    return THREE.MathUtils.damp(current, target, lambda, dt);
}

/**
 * The form itself. An icosphere at high subdivision with a very low-amplitude
 * distortion, so it reads as a solid that breathes rather than as a blob that
 * wobbles — anything above ~0.3 distort immediately looks like a lava lamp.
 */
function Form({ pointer, quality }) {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (!mesh.current) return;
        const dt = Math.min(delta, 0.1);

        // Constant slow yaw gives the surface something to catch the light on
        mesh.current.rotation.y += dt * 0.16;

        // Lean toward the cursor. Clamped small: the object should acknowledge
        // the pointer, not chase it.
        const targetX = pointer.current.y * 0.25;
        const targetZ = -pointer.current.x * 0.18;
        mesh.current.rotation.x = damp(mesh.current.rotation.x, targetX, 2.5, dt);
        mesh.current.rotation.z = damp(mesh.current.rotation.z, targetZ, 2.5, dt);
    });

    return (
        <mesh ref={mesh}>
            <icosahedronGeometry args={[1.32, quality === 'high' ? 64 : 24]} />
            <MeshDistortMaterial
                color="#FFFFFF"
                distort={quality === 'high' ? 0.26 : 0.2}
                speed={1.1}
                roughness={0.32}
                metalness={0.06}
                clearcoat={0.4}
                envMapIntensity={0.85}
            />
        </mesh>
    );
}

/**
 * Two thin rings on crossed axes. They are the only accent-coloured element in
 * the scene, and they give the eye a scale reference — without them the sphere
 * has no size.
 */
function Rings({ pointer }) {
    const group = useRef();

    useFrame((state, delta) => {
        if (!group.current) return;
        const dt = Math.min(delta, 0.1);
        group.current.rotation.z += dt * 0.1;
        group.current.rotation.x = damp(group.current.rotation.x, 0.42 + pointer.current.y * 0.2, 2, dt);
        group.current.rotation.y = damp(group.current.rotation.y, pointer.current.x * 0.3, 2, dt);
    });

    /* Radii are sized against the visible frame, not chosen by eye. At fov 34 and
       a camera 7.4 units back, half the frame height at z=0 is
       tan(17deg) * 7.4 ≈ 2.26 — so anything past that is cut off by the canvas
       edge, which is why the rings previously rendered as severed arcs. */
    return (
        <group ref={group} rotation={[0.42, 0, 0]}>
            <mesh>
                <torusGeometry args={[1.9, 0.011, 12, 128]} />
                <meshBasicMaterial color={ACCENT} transparent opacity={0.55} />
            </mesh>
            <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
                <torusGeometry args={[2.14, 0.008, 12, 128]} />
                <meshBasicMaterial color="#101014" transparent opacity={0.16} />
            </mesh>
        </group>
    );
}

/**
 * Studio rig, built from Lightformers rather than a loaded HDR.
 *
 * An `<Environment preset>` would fetch a multi-megabyte .hdr from a CDN on
 * every visit; these are generated into a small in-memory cube target instead,
 * which costs nothing to download and cannot fail offline.
 */
function Studio() {
    return (
        <Environment resolution={128}>
            {/* Large soft key from above-left */}
            <Lightformer intensity={2.2} position={[-3, 4, 2]} scale={[8, 8, 1]} color="#FFFFFF" />
            {/* Cool fill from the right keeps the shadow side from going muddy */}
            <Lightformer intensity={0.9} position={[4, 1, 2]} scale={[6, 6, 1]} color="#E8EEF6" />
            {/* Warm rim behind, the only place the accent touches the form */}
            <Lightformer intensity={1.1} position={[2, -2, -4]} scale={[5, 5, 1]} color="#FFD9BE" />
        </Environment>
    );
}

/**
 * Drops resolution if the device cannot hold frame rate.
 *
 * This lives inside the Canvas so it can call `setDpr` on the renderer directly.
 * Driving the Canvas `dpr` prop from outside would mean either re-rendering the
 * whole React tree to change it, or reading a ref during render — and React is
 * explicit that a ref read during render is not guaranteed to be seen.
 */
function DprGovernor({ ceiling }) {
    const setDpr = useThree((state) => state.setDpr);

    return (
        <PerformanceMonitor
            onDecline={() => setDpr(1)}
            onIncline={() => setDpr(ceiling)}
        />
    );
}

function Scene({ pointer, quality }) {
    return (
        <>
            <ambientLight intensity={0.55} />
            <directionalLight position={[3, 5, 4]} intensity={1.5} />

            <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.5} floatingRange={[-0.08, 0.08]}>
                <Form pointer={pointer} quality={quality} />
                <Rings pointer={pointer} />
            </Float>

            {/* The contact shadow that grounds the form is drawn in CSS beneath
                the canvas, not with <ContactShadows>. Its shadow plane is a
                finite quad, and against a near-white page the un-occluded part
                of that quad reads as a visible rectangle behind the object. A
                CSS ellipse has no edge to betray, costs no render target, and is
                the same shape the no-WebGL fallback already draws. */}

            <Studio />
        </>
    );
}

const HeroObject = ({ quality = 'high' }) => {
    const pointer = useRef({ x: 0, y: 0 });
    const dprCeiling = quality === 'high' ? 1.75 : 1.25;

    /**
     * Pointer is tracked into a ref, never into state. Writing pointer position
     * to state would re-render the React tree on every mouse move; the render
     * loop can just sample the ref instead, so React is not involved in the
     * animation at all.
     */
    const handlePointerMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointer.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handlePointerLeave = () => {
        pointer.current.x = 0;
        pointer.current.y = 0;
    };

    return (
        <div
            className="hero-object"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            aria-hidden="true"
        >
            <Canvas
                dpr={[1, dprCeiling]}
                camera={{ position: [0, 0.25, 7.4], fov: 34 }}
                gl={{
                    antialias: quality === 'high',
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
                /* Transparent so the page backdrop shows through — the object is
                   part of the page, not a panel sitting on top of it. */
                style={{ background: 'transparent' }}
            >
                <DprGovernor ceiling={dprCeiling} />
                <Scene pointer={pointer} quality={quality} />
            </Canvas>
        </div>
    );
};

export default HeroObject;
