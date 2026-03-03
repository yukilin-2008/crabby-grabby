export function SkyBackdrop() {
  return (
    <mesh position={[0, 10, -15]}>
      <planeGeometry args={[40, 20]} />
      <meshBasicMaterial
        color="#a5d8ff"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
