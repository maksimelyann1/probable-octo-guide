import React, { useMemo } from 'react';

const NUM_BG_HEARTS = 40;
const BG_HEART_COLORS = [
  'text-pink-400',
  'text-rose-500',
  'text-red-400',
  'text-fuchsia-500',
  'text-purple-400',
  'text-pink-300',
  'text-red-300',
];

// Мемоізований SVG компонент серця
const HeartIcon = React.memo(({ className }: { className?: string }) => (
  <svg className={`w-full h-full ${className || ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
));

interface FloatingHeartStyle extends React.CSSProperties {
  '--initial-x': string;
  '--drift-x': string;
  '--scale': number;
  '--opacity': number;
  '--rotation-start': string;
  '--rotation-end': string;
  animation?: string;
}

// Винесена функція генерації стилю для серця
function getHeartStyle(size: number, initialX: string, driftX: string, scale: number, opacity: number, rotationStart: number, rotationEnd: number, duration: number, delay: number): FloatingHeartStyle {
  return {
    position: 'absolute',
    left: '0',
    top: '100vh',
    width: `${size}px`,
    height: `${size}px`,
    '--initial-x': initialX,
    '--drift-x': driftX,
    '--scale': scale,
    '--opacity': opacity,
    '--rotation-start': `${rotationStart}deg`,
    '--rotation-end': `${rotationEnd}deg`,
    animation: `float-heart ${duration}s ease-in-out ${delay}s infinite`,
    willChange: 'transform, opacity',
  };
}

const FloatingHeartsBackground: React.FC = () => {
  const hearts = useMemo(() => {
    return Array.from({ length: NUM_BG_HEARTS }).map((_, i) => {
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 20;
      const size = 40 + Math.random() * 110;
      const initialX = `${Math.random() * 100}vw`;
      const driftX = `${(Math.random() - 0.5) * 200}px`;
      const scale = 0.5 + Math.random() * 0.8;
      const opacity = (0.1 + Math.random() * 0.3) * 0.9;
      const color = BG_HEART_COLORS[Math.floor(Math.random() * BG_HEART_COLORS.length)];
      const rotationStart = (Math.random() - 0.5) * 40;
      const rotationEnd = (Math.random() - 0.5) * 90;
      const style = getHeartStyle(size, initialX, driftX, scale, opacity, rotationStart, rotationEnd, duration, delay);
      return (
        <div key={`bg-heart-${i}`} style={style} className={color}>
          <HeartIcon />
        </div>
      );
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {hearts}
    </div>
  );
};

export default FloatingHeartsBackground;