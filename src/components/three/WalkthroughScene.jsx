import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

/**
 * Scroll-driven walkthrough scene.
 *
 * Five stations sit along the -Z axis. Scroll progress (a Framer MotionValue
 * passed in from the pinned section) moves the camera from one to the next, so
 * the 3D and the DOM chapters describe the same moment.
 *
 * The MotionValue is read with `.get()` inside useFrame rather than subscribed
 * to with React state — the scene re-renders zero times while you scroll.
 */

const STATION_GAP = 46;
const N_STATIONS = 5;

const STATIONS = [
    { color: '#FF6B00', kind: 'ico' },
    { color: '#FF8C33', kind: 'box' },
    { color: '#FFB573', kind: 'torus' },
    { color: '#FF6B00', kind: 'knot' },
    { color: '#FF8C33', kind: 'octa' }
];

function makeRng(seed) {
    let t = seed >>> 0;
    return () => {
        t = (t + 0x6d2b79f5) >>> 0;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

function StationGeometry({ kind }) {
    switch (kind) {
        case 'box':
            return <boxGeometry args={[9, 9, 9]} />;
        case 'torus':
            return <torusGeometry args={[6.5, 1.6, 16, 48]} />;
        case 'knot':
            return <torusKnotGeometry args={[5.5, 1.2, 128, 16]} />;
        case 'octa':
            return <octahedronGeometry args={[8, 0]} />;
        case 'ico':
        default:
            return <icosahedronGeometry args={[7.5, 1]} />;
    }
}

/** A landmark the camera flies up to, one per chapter. */
function Station({ index, station, progress }) {
    const ref = useRef();
    const z = -index * STATION_GAP;

    useFrame((_, delta) => {
        const mesh = ref.current;
        if (!mesh) return;

        mesh.rotation.x += delta * 0.1;
        mesh.rotation.y += delta * 0.16;

        // How close is the camera to this station, 0..1
        const p = progress.get() * (N_STATIONS - 1);
        const nearness = Math.max(0, 1 - Math.abs(p - index));

        // The active station brightens and swells; neighbours recede
        mesh.material.opacity = 0.12 + nearness * 0.4;
        const s = 0.82 + nearness * 0.3;
        mesh.scale.setScalar(s);
    });

    return (
        <mesh ref={ref} position={[index % 2 === 0 ? 15 : -15, index % 2 === 0 ? 4 : -5, z]}>
            <StationGeometry kind={station.kind} />
            <meshBasicMaterial
                color={station.color}
                wireframe
                transparent
                opacity={0.25}
                depthWrite={false}
            />
        </mesh>
    );
}

/** Ambient dust so the travel between stations reads as motion. */
function Dust({ count = 1200 }) {
    const positions = useMemo(() => {
        const rand = makeRng(0xa11ce);
        const arr = new Float32Array(count * 3);
        const depth = (N_STATIONS - 1) * STATION_GAP + 80;
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (rand() - 0.5) * 90;
            arr[i * 3 + 1] = (rand() - 0.5) * 60;
            arr[i * 3 + 2] = 30 - rand() * depth;
        }
        return arr;
    }, [count]);

    const ref = useRef();
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.z += delta * 0.02;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.32}
                color="#FF8C33"
                transparent
                opacity={0.5}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

function WalkCamera({ progress }) {
    const { camera } = useThree();
    const eased = useRef(0);

    useFrame((_, delta) => {
        const target = progress.get();

        // Frame-rate independent easing. The camera chases scroll rather than
        // being pinned to it, which turns bursty wheel and trackpad momentum
        // into continuous travel.
        const k = 1 - Math.pow(0.002, delta);
        eased.current += (target - eased.current) * k;

        const p = eased.current;
        const travel = (N_STATIONS - 1) * STATION_GAP;

        camera.position.z = 26 - p * travel;
        // Weave between the alternating station positions
        camera.position.x = Math.sin(p * Math.PI * (N_STATIONS - 1)) * 7;
        camera.position.y = Math.cos(p * Math.PI * (N_STATIONS - 1) * 0.7) * 4;

        camera.lookAt(0, 0, camera.position.z - 30);
        // Roll must come after lookAt, which writes the whole orientation
        camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.04;
    });

    return null;
}

/** Trades resolution for frame rate when the GPU falls behind. */
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

export default function WalkthroughScene({ progress }) {
    return (
        <Canvas
            dpr={1.25}
            gl={{
                antialias: false,
                alpha: true,
                powerPreference: 'high-performance',
                stencil: false
            }}
            camera={{ fov: 62, near: 0.1, far: 320, position: [0, 0, 26] }}
        >
            {/* Fades the far end of the walk into the page background */}
            <fog attach="fog" args={['#FFF7F0', 30, 165]} />

            <Dust />
            {STATIONS.map((station, i) => (
                <Station key={i} index={i} station={station} progress={progress} />
            ))}

            <WalkCamera progress={progress} />
            <AdaptiveQuality />
        </Canvas>
    );
}
