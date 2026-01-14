import { useRef, useState } from 'react';
import { OrbitControls, PerspectiveCamera, Environment, Html, Float, ContactShadows, useCursor } from '@react-three/drei';
import type { Fingering } from '../data/fingerings';
import type * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface RecorderModelProps {
  currentFingering: Fingering | null;
}

// リコーダーの配色定数
const COLORS = {
  BODY: "#3e2723", // ダークブラウン
  JOINT: "#f5f5dc", // ベージュ/アイボリー
  HOLE_OPEN: "#1a0500", // 穴の中（暗い）
  FINGER_CLOSE: "#60a5fa", // 指で押さえている色（明るい青）
  FINGER_GHOST: "#93c5fd", // 押さえるべき場所のガイド色
};

const RecorderBody = () => {
  return (
    <group>
      {/* --- 頭部管 (Head Joint) --- */}
      <group position={[0, 4.8, 0]}>
        {/* 本体 */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 3.2, 32]} />
          <meshStandardMaterial color={COLORS.BODY} roughness={0.2} metalness={0.1} />
        </mesh>
        
        {/* 吹き口 (Mouthpiece) - ビーク形状 */}
        <mesh position={[0, 1.4, 0.25]} rotation={[-0.15, 0, 0]}>
           <boxGeometry args={[0.75, 1.2, 0.9]} />
           <meshStandardMaterial color={COLORS.BODY} roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 2.0, 0.25]} rotation={[-0.4, 0, 0]}>
           <boxGeometry args={[0.75, 0.6, 0.8]} />
           <meshStandardMaterial color={COLORS.BODY} roughness={0.2} metalness={0.1} />
        </mesh>

        {/* ウィンドウェイ（空気の通り道）の表現 */}
        <mesh position={[0, 1.9, 0.68]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.5, 0.2, 0.1]} />
          <meshStandardMaterial color="#111" />
        </mesh>

        {/* 窓（ラビューム） */}
        <mesh position={[0, 0.4, 0.35]} rotation={[0.4, 0, 0]}>
           <boxGeometry args={[0.5, 0.6, 0.2]} />
           <meshStandardMaterial color="#222" />
        </mesh>

        {/* 装飾リング（上） */}
        <mesh position={[0, 1.6, 0]}>
          <torusGeometry args={[0.66, 0.04, 16, 32]} />
          <meshStandardMaterial color={COLORS.JOINT} roughness={0.4} />
        </mesh>
      </group>

      {/* ジョイントリング（頭部管と中部管の間） */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.4, 32]} />
        <meshStandardMaterial color={COLORS.JOINT} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <torusGeometry args={[0.72, 0.05, 16, 32]} />
        <meshStandardMaterial color="#dcdcdc" roughness={0.1} metalness={0.5} />
      </mesh>

      {/* --- 中部管 (Middle Joint) --- */}
      <group position={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.6, 0.55, 6, 32]} />
          <meshStandardMaterial color={COLORS.BODY} roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

      {/* ジョイントリング（中部管と足部管の間） */}
      <mesh position={[0, -3.1, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.3, 32]} />
        <meshStandardMaterial color={COLORS.JOINT} roughness={0.3} />
      </mesh>
      <mesh position={[0, -3.1, 0]}>
        <torusGeometry args={[0.68, 0.04, 16, 32]} />
        <meshStandardMaterial color="#dcdcdc" roughness={0.1} metalness={0.5} />
      </mesh>

      {/* --- 足部管 (Foot Joint) --- */}
      <group position={[0, -4.4, 0]} rotation={[0, 0.2, 0]}> {/* 足部管は少し右に回すのが一般的 */}
        <mesh>
          <cylinderGeometry args={[0.55, 0.7, 2.3, 32]} />
          <meshStandardMaterial color={COLORS.BODY} roughness={0.2} metalness={0.1} />
        </mesh>
        {/* 先端のリング */}
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.3, 32]} />
          <meshStandardMaterial color={COLORS.JOINT} roughness={0.3} />
        </mesh>
        {/* ベルの穴 */}
        <mesh position={[0, -1.16, 0]}>
           <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
           <meshStandardMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
};

const FingerIndicator = ({ isOpen, isThumb }: { isOpen: boolean, isThumb: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // ふわふわ浮かせるアニメーション
      if (!isOpen) {
        meshRef.current.position.z = isThumb 
          ? -0.2 + Math.sin(state.clock.elapsedTime * 4) * 0.02
          : 0.2 + Math.sin(state.clock.elapsedTime * 4) * 0.02;
      }
    }
  });

  if (isOpen) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, isThumb ? -0.2 : 0.2]}>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial 
        color={COLORS.FINGER_CLOSE} 
        roughness={0.2} 
        emissive={COLORS.FINGER_CLOSE}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

const Hole = ({ position, isOpen, label, isThumb = false, handLabel }: { 
  position: [number, number, number], 
  isOpen: boolean, 
  label?: string, 
  isThumb?: boolean,
  handLabel?: string
}) => {
  const [hovered] = useState(false);
  useCursor(hovered);

  return (
    <group position={position}>
      {/* 穴の縁 (リム) */}
      <mesh rotation={[isThumb ? 0 : Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[0.15, 0.03, 16, 32]} />
        <meshStandardMaterial color="#2a1a15" roughness={0.5} />
      </mesh>

      {/* 穴の中 */}
      <mesh rotation={[isThumb ? 0 : Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.1, 32]} />
        <meshStandardMaterial color={COLORS.HOLE_OPEN} />
      </mesh>

      {/* 指のインジケーター */}
      <FingerIndicator isOpen={isOpen} isThumb={isThumb} />

      {/* 番号ラベル */}
      {label && (
        <Html
          position={[isThumb ? 0.8 : -0.8, 0, 0]}
          center
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          zIndexRange={[100, 0]}
        >
          <div className="flex flex-col items-center">
            {handLabel && (
              <div className="text-[10px] font-bold text-slate-400 mb-0.5 tracking-tighter uppercase">
                {handLabel}
              </div>
            )}
            <div className={`
              flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shadow-sm transition-colors duration-200
              ${!isOpen 
                ? 'bg-blue-500 text-white ring-2 ring-blue-200' 
                : 'bg-white/80 text-slate-400 border border-slate-200'}
            `}>
              {label}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// 手のガイド線を描画するコンポーネント
const HandGuide = () => {
  return (
    <group>
      {/* 左手エリアのブラケット的な表現 */}
      <Html position={[-1.2, 0.8, 0]} center zIndexRange={[0, 0]} style={{ pointerEvents: 'none' }}>
        <div className="h-24 w-4 border-l-2 border-slate-300/50 rounded-l-md" />
      </Html>
      
      {/* 右手エリアのブラケット的な表現 */}
      <Html position={[-1.2, -2.2, 0]} center zIndexRange={[0, 0]} style={{ pointerEvents: 'none' }}>
        <div className="h-32 w-4 border-l-2 border-slate-300/50 rounded-l-md" />
      </Html>
    </group>
  )
}

export const RecorderScene: React.FC<RecorderModelProps> = ({ currentFingering }) => {
  const holes = currentFingering?.holes || [false, false, false, false, false, false, false, false];

  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Environment preset="city" />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group position={[0, 0.5, 0]}>
          <RecorderBody />

          {/* --- HOLES --- */}
          
          {/* 0: Thumb (Left Hand) */}
          <Hole 
            position={[0, 2.2, -0.55]} 
            isOpen={!holes[0]} 
            label="0" 
            isThumb={true} 
            handLabel="親"
          />

          {/* Left Hand (1, 2, 3) */}
          <Hole position={[0, 1.4, 0.52]} isOpen={!holes[1]} label="1" handLabel="左" />
          <Hole position={[0, 0.6, 0.52]} isOpen={!holes[2]} label="2" />
          <Hole position={[0, -0.2, 0.52]} isOpen={!holes[3]} label="3" />

          {/* Right Hand (4, 5, 6, 7) */}
          <Hole position={[0, -1.3, 0.52]} isOpen={!holes[4]} label="4" handLabel="右" />
          <Hole position={[0, -2.0, 0.52]} isOpen={!holes[5]} label="5" />
          <Hole position={[0, -2.7, 0.52]} isOpen={!holes[6]} label="6" />
          
          {/* 7番穴はダブルホールの下の穴をイメージして少し右下にずらす */}
          <group position={[0, -3.5, 0.55]} rotation={[0, 0.2, 0]}>
             <Hole position={[0.1, 0, 0]} isOpen={!holes[7]} label="7" />
          </group>

          <HandGuide />
        </group>
      </Float>

      <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={10} blur={2.5} far={10} />

      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.5}
        // 自動回転を少し入れて、立体感を見せる
        autoRotate={false}
      />
      <PerspectiveCamera makeDefault position={[4, 2, 8]} fov={45} />
    </>
  );
};
