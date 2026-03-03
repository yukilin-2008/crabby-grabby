import { useMemo } from "react";
import { MeshStandardMaterial } from "three";

export function OceanPlane() {
  const material = useMemo(() => new MeshStandardMaterial({
    color: "#3a7bd5",
    roughness: 0.5,
    metalness: 0.1,
  }), []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
      <planeGeometry args={[60, 60, 1, 1]} />
      <primitive object={material} />
    </mesh>
  );
}
