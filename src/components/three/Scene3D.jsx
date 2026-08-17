import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScrollProgress, usePointerRef } from './useScrollProgress';

/* Palette mirrors the CSS custom properties so the 3D and the DOM agree. */
const ORANGE = '#FF6B00';
const ORANGE_LIGHT = '#FF8C33';
const AMBER = '#FFB573';
const FOG = '#FFF7F0';

/** Total camera travel along -Z across the full page scroll. */
const CORRIDOR_DEPTH = 260;

/**
 * Deterministic PRNG (mulberry32).
 *
 * Used instead of Math.random() so the particle field is identical on every
 * render, remount and hot reload — the layout is a fixed property of the scene,
 * not something that should reshuffle if the component happens to re-render.
 */
function makeRng(seed) {
    let t = seed >>> 0;
    return () => {
        t = (t + 0x6d2b79f5) >>> 0;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Static particle corridor.
 *
 * The geometry is built once and never touched again — only the camera moves
 * through it. Animating 2400 point positions per frame would mean re-uploading
 * a buffer to the GPU every frame; flying the camera through a fixed field
 * gives the same visual result for the cost of one matrix update.
 */
function ParticleCorridor({ count = 2400 }) {
    const positions = useMemo(() => {
        const rand = makeRng(0x5eed1234);
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Hollow cylinder: keeps particles out of the centre where the DOM text sits
            const radius = 14 + rand() * 46;
            const angle = rand() * Math.PI * 2;
            arr[i * 3] = Math.cos(angle) * radius;
            arr[i * 3 + 1] = Math.sin(angle) * radius * 0.7;
            arr[i * 3 + 2] = -rand() * (CORRIDOR_DEPTH + 60) + 30;
        }
        return arr;
    }, [count]);

    const ref = useRef();

    useFrame((_, delta) => {
        if (ref.current) {
            // Whole-field rotation is one matrix write, not 2400 buffer writes
            ref.current.rotation.z += delta * 0.012;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.42}
                color={ORANGE_LIGHT}
                transparent
                opacity={0.55}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

/**
 * A wireframe focal solid parked at a fixed depth. As the camera flies down the
 * corridor each one passes by, which is what gives scrolling its sense of travel.
 */
function FocalSolid({ geometry, position, color, scale = 1, spin = 0.15 }) {
    const ref = useRef();

    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.rotation.x += delta * spin * 0.6;
        ref.current.rotation.y += delta * spin;
    });

    return (
        <mesh ref={ref} position={position} scale={scale}>
            {geometry}
            <meshBasicMaterial
                color={color}
                wireframe
                transparent
                opacity={0.32}
                depthWrite={false}
            />
        </mesh>
    );
}

/**
 * Drives the camera from scroll. Runs entirely inside useFrame, reading refs —
 * no React state changes while scrolling, so no re-renders and no jank.
 */
function CameraRig({ scrollRef, pointerRef }) {
    const { camera } = useThree();
    const current = useRef(0);

    useFrame((_, delta) => {
        const target = scrollRef.current;

        // Frame-rate independent easing. The lerp is what smooths bursty wheel
        // and momentum-scroll events into continuous camera motion — the camera
        // chases the scroll position rather than being pinned to it.
        const ease = 1 - Math.pow(0.0015, delta);
        current.current += (target - current.current) * ease;

        const p = current.current;

        camera.position.z = 30 - p * CORRIDOR_DEPTH;

        // Gentle drift so the corridor never feels like a straight tube
        camera.position.x = Math.sin(p * Math.PI * 2) * 5 + pointerRef.current.x * 4;
        camera.position.y = Math.cos(p * Math.PI * 1.5) * 3 - pointerRef.current.y * 3;

        // lookAt writes the full orientation quaternion, so the roll has to be
        // applied *after* it — setting rotation.z first would be silently
        // overwritten and the camera would never bank.
        camera.lookAt(0, 0, camera.position.z - 40);
        camera.rotation.z = Math.sin(p * Math.PI) * 0.05;
    });

    return null;
}

/**
 * Adaptive resolution.
 *
 * Measures a rolling window of frame deltas and trades pixels for frames when
 * the GPU falls behind — dropping DPR is invisible on a soft-focus particle
 * field, whereas dropped frames during scroll are exactly what we promised not
 * to ship. Hysteresis (45fps down / 58fps up) plus a cooldown stops it
 * oscillating between quality levels.
 *
 * Hand-rolled rather than using drei's PerformanceMonitor: this was the only
 * thing the portfolio imported from drei, and dropping the dependency removes a
 * large slice of the lazy 3D chunk for ~30 lines of code.
 */
function AdaptiveQuality() {
    const setDpr = useThree((s) => s.setDpr);
    const frames = useRef(0);
    const elapsed = useRef(0);
    const dpr = useRef(1.25);
    const cooldown = useRef(0);

    useFrame((_, delta) => {
        if (cooldown.current > 0) {
            cooldown.current -= delta;
            return;
        }

        frames.current += 1;
        elapsed.current += delta;

        if (frames.current < 60) return;

        const fps = frames.current / elapsed.current;
        frames.current = 0;
        elapsed.current = 0;

        let next = dpr.current;
        if (fps < 45) next = Math.max(0.6, dpr.current - 0.25);
        else if (fps > 58) next = Math.min(1.5, dpr.current + 0.25);

        if (next !== dpr.current) {
            dpr.current = next;
            setDpr(next);
            cooldown.current = 1.5;
        }
    });

    return null;
}

function SceneContents() {
    const scrollRef = useScrollProgress();
    const pointerRef = usePointerRef();

    // Geometries are memoised so React re-renders never rebuild GPU buffers
    const geoms = useMemo(
        () => ({
            knot: <torusKnotGeometry args={[6, 1.1, 128, 16]} />,
            ico: <icosahedronGeometry args={[9, 1]} />,
            octa: <octahedronGeometry args={[7, 0]} />,
            dodeca: <dodecahedronGeometry args={[8, 0]} />
        }),
        []
    );

    return (
        <>
            {/* Fog dissolves the far end of the corridor into the page background,
                so the WebGL layer and the CSS background share one horizon. */}
            <fog attach="fog" args={[FOG, 40, 190]} />

            <ParticleCorridor />

            <FocalSolid geometry={geoms.knot} position={[-18, 6, -30]} color={ORANGE} spin={0.18} />
            <FocalSolid geometry={geoms.ico} position={[22, -8, -95]} color={AMBER} spin={0.12} />
            <FocalSolid geometry={geoms.octa} position={[-20, -5, -160]} color={ORANGE_LIGHT} spin={0.2} />
            <FocalSolid geometry={geoms.dodeca} position={[18, 9, -225]} color={ORANGE} spin={0.14} />

            <CameraRig scrollRef={scrollRef} pointerRef={pointerRef} />
            <AdaptiveQuality />
        </>
    );
}

export default function Scene3D({ paused = false }) {
    return (
        <Canvas
            className="scene3d-canvas"
            // 'never' halts the render loop outright while the walkthrough owns
            // the screen, so two WebGL contexts are never drawing at once.
            frameloop={paused ? 'never' : 'always'}
            dpr={1.25}
            gl={{
                antialias: false,
                alpha: true,
                powerPreference: 'high-performance',
                stencil: false,
                depth: true
            }}
            camera={{ fov: 60, near: 0.1, far: 260, position: [0, 0, 30] }}
        >
            <SceneContents />
        </Canvas>
    );
}
