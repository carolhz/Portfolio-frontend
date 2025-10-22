// src/components/Hero3D.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Torus } from '@react-three/drei';
import { useThemeStore } from '../store/themeStore';

// Ini adalah komponen Mesh 3D kita
const SceneContent = () => {
  // Kita ambil tema agar warna 3D bisa ikut berubah
  const theme = useThemeStore((state) => state.theme);

  // Tentukan warna berdasarkan tema
  const color = theme === 'light' ? '#FF69B4' : '#FF69B4'; // Tetap Pink
  const wireframeColor = theme === 'light' ? '#111111' : '#FFFFFF';

  return (
    <>
      {/* Pencahayaan */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Objek 3D (Torus/Donat) */}
      <Torus args={[2.5, 0.8, 16, 100]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color={color} />
      </Torus>

      {/* Objek 3D Wireframe (untuk efek) */}
      <Torus args={[2.5, 0.8, 16, 100]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color={wireframeColor} wireframe={true} />
      </Torus>

      {/* Kontrol: Izinkan user memutar objek dengan mouse */}
      <OrbitControls 
        enableZoom={false} // Matikan zoom
        autoRotate={true}   // Putar otomatis
        autoRotateSpeed={2} // Kecepatan putar
      />
    </>
  );
};

// Ini adalah wrapper utama
const Hero3D = () => {
  return (
    <div className="w-full h-96 md:h-full">
      {/* Canvas adalah 'panggung' 3D */}
      <Canvas camera={{ position: [0, 0, 8], fov: 25 }}>
        {/* Suspense diperlukan R3F untuk loading */}
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3D;