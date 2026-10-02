"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ACESFilmicToneMapping, Box3, Mesh, MeshPhysicalMaterial, Vector3, WebGLRenderer } from "three";
import gsap from "gsap";

export type HeroView = "3-4" | "front" | "side" | "rear" | "details";
export type HeroFinish = "carmine" | "graphite" | "pearl";

const MODEL_URL = "/models/institutional-car.glb";
const finishes: Record<HeroFinish, string> = {
  carmine: "#772531",
  graphite: "#424948",
  pearl: "#c9c8bd",
};

function InstitutionalCar({ finish }: { finish: HeroFinish }) {
  const { gl, size: viewport } = useThree();
  const { scene } = useGLTF(MODEL_URL, false, true, (loader) => {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("/basis/");
    ktx2Loader.detectSupport(gl as WebGLRenderer);
    loader.setKTX2Loader(ktx2Loader);
  });

  const model = useMemo(() => {
    const car = scene.clone(true);
    car.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      const clonedMaterials = materials.map((material) => material.clone());
      object.material = Array.isArray(object.material) ? clonedMaterials : clonedMaterials[0];
    });
    car.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(car);
    const modelSize = bounds.getSize(new Vector3());
    const scale = (viewport.width < 560 ? 3.35 : 4.7) / Math.max(modelSize.x, modelSize.z);
    car.scale.setScalar(scale);
    car.position.y = -bounds.min.y * scale;
    return car;
  }, [scene, viewport.width]);

  useEffect(() => {
    model.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (!material.name.toLowerCase().includes("paint")) return;
        const paint = material as MeshPhysicalMaterial;
        paint.color.set(finishes[finish]);
        paint.metalness = 0.72;
        paint.roughness = 0.23;
        paint.clearcoat = 0.82;
        paint.clearcoatRoughness = 0.18;
        paint.needsUpdate = true;
      });
    });
  }, [finish, model]);

  return <primitive object={model} castShadow receiveShadow />;
}

function Scene({ view, finish, rotating, onStart, onEnd }: {
  view: HeroView;
  finish: HeroFinish;
  rotating: boolean;
  onStart: () => void;
  onEnd: () => void;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  useEffect(() => {
    const angles: Record<HeroView, [number, number, number]> = {
      "3-4": [5.5, 2.45, 6.2],
      front: [0.1, 1.8, 7.1],
      side: [7.1, 1.9, 0.25],
      rear: [0.1, 1.85, -7.1],
      details: [4.1, 1.12, 2.2],
    };
    const [x, y, z] = angles[view];
    const target = controls.current?.target;
    const cameraTween = gsap.to(camera.position, { x, y, z, duration: 0.8, ease: "power3.inOut", onUpdate: () => controls.current?.update() });
    const targetTween = target ? gsap.to(target, { x: 0, y: 0.82, z: 0, duration: 0.8, ease: "power3.inOut", onUpdate: () => controls.current?.update() }) : undefined;
    return () => {
      cameraTween.kill();
      targetTween?.kill();
    };
  }, [camera, view]);

  return (
    <>
      <color attach="background" args={["#151713"]} />
      <hemisphereLight args={["#f3eee1", "#272923", 1.4]} />
      <directionalLight position={[4, 7, 5]} intensity={2.6} color="#fff6e8" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-6, 3, -2]} intensity={1.8} color="#b6c7dc" />
      <spotLight position={[0, 6, -4]} intensity={3} angle={0.7} penumbra={0.8} color="#edf2f4" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={4.5} color="#f5f1e9" position={[-5, 4, 3]} rotation={[0, Math.PI / 2.4, 0]} scale={[7, 2.4, 1]} />
        <Lightformer form="rect" intensity={3.2} color="#d6dfeb" position={[5, 3, -2]} rotation={[0, -Math.PI / 2.5, 0]} scale={[5, 2.8, 1]} />
        <Lightformer form="rect" intensity={2.8} color="#ffffff" position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 3, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <InstitutionalCar finish={finish} />
        <ContactShadows position={[0, 0.015, 0]} opacity={0.42} scale={9} blur={2.4} far={4} resolution={256} frames={1} />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0b0d0a" roughness={0.28} metalness={0.32} />
      </mesh>
      <OrbitControls
        ref={controls}
        makeDefault
        target={[0, 0.82, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
        autoRotate={!rotating}
        autoRotateSpeed={0.38}
        minDistance={2.2}
        maxDistance={9}
        minPolarAngle={0.88}
        maxPolarAngle={1.72}
        onStart={onStart}
        onEnd={onEnd}
      />
    </>
  );
}

export default function HeroVehicleCanvas({ view, finish, className = "" }: { view: HeroView; finish: HeroFinish; className?: string }) {
  const [rotating, setRotating] = useState(false);
  const { progress } = useProgress();

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.4]}
        camera={{ position: [5.5, 2.45, 6.2], fov: 30, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance", toneMapping: ACESFilmicToneMapping }}
        fallback={<div className="grid h-full place-items-center px-8 text-center text-sm text-white/50">Visualização 3D indisponível neste navegador. Você ainda pode explorar o estoque abaixo.</div>}
      >
        <Scene view={view} finish={finish} rotating={rotating} onStart={() => setRotating(true)} onEnd={() => setRotating(false)} />
      </Canvas>
      {progress < 100 && <div className="pointer-events-none absolute inset-0 grid place-items-center"><span className="border border-white/15 bg-[#151610]/90 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">Carregando modelo 3D {Math.round(progress)}%</span></div>}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#151713] to-transparent" />
      <p className="absolute bottom-3 right-4 text-[9px] font-medium uppercase tracking-[0.14em] text-white/35">Modelo institucional · não disponível para venda</p>
    </div>
  );
}