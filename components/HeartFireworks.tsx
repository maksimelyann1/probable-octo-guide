import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';

const NUM_PARTICLES = 60;
const PARTICLE_COLORS = [
  'text-pink-400', 'text-rose-500', 'text-red-400', 'text-pink-300',
  'text-yellow-300', 'text-white/90', 'text-fuchsia-500', 'text-purple-400',
];
const BASE_SIZE_OPTIONS = ['w-3 h-3', 'w-3.5 h-3.5', 'w-4 h-4'];
const MAX_EXPLOSIONS = 2;

const ParticleHeartSvg = React.memo(({ svgClassName, colorClassName }: { svgClassName?: string, colorClassName?: string }) => (
  <svg
    className={`w-full h-full ${svgClassName || ''} ${colorClassName || ''}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
));

interface ParticleStyle extends React.CSSProperties {
  '--tx'?: string;
  '--ty'?: string;
  animation?: string;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
}

function generateParticles(centerX?: number, centerY?: number, keyPrefix = ''): React.ReactElement[] {
  // Якщо координати не задані — центр контейнера
  const useCenter = typeof centerX !== 'number' || typeof centerY !== 'number';
  return Array.from({ length: NUM_PARTICLES }).map((_, index) => {
    const angle = Math.random() * Math.PI * 2;
    const explosionRadius = 350 + Math.random() * 200;
    const translateX = Math.cos(angle) * explosionRadius;
    const translateY = Math.sin(angle) * explosionRadius;
    const duration = 1.8 + Math.random() * 1.0;
    const delay = Math.random() * 0.3;
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    const baseSize = BASE_SIZE_OPTIONS[Math.floor(Math.random() * BASE_SIZE_OPTIONS.length)];
    const style: ParticleStyle = {
      '--tx': `${translateX}px`,
      '--ty': `${translateY}px`,
      animation: `particle-spark-burst ${duration}s cubic-bezier(0.25, 0.8, 0.25, 1) ${delay}s forwards`,
      transformOrigin: 'center center',
      position: 'absolute',
      left: useCenter ? '50%' : `calc(${centerX}px - 0.5em)`,
      top: useCenter ? '50%' : `calc(${centerY}px - 0.5em)`,
      pointerEvents: 'none',
      translate: useCenter ? '-50% -50%' : undefined,
    };
    return (
      <div
        key={`${keyPrefix}particle-${index}`}
        className={`absolute ${baseSize}`}
        style={style}
      >
        <ParticleHeartSvg colorClassName={color} />
      </div>
    );
  });
}

const HeartFireworks: React.FC = () => {
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const explosionId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const particles = useMemo(() => generateParticles(), []);
  const explosionDuration = 3.5;
  const svgFadeInDelay = explosionDuration;
  const svgFadeInDuration = 2.0;
  const svgPulseDelay = svgFadeInDelay + svgFadeInDuration;
  const textRevealDelay = svgFadeInDelay + svgFadeInDuration * 0.6;
  const textRevealDuration = 3.5;
  const textPulseDelay = textRevealDelay + textRevealDuration;

  // Додаємо аудіо для вибуху сердечок
  const playPopSound = useCallback(() => {
    const audio = new Audio('/heart-pop.mp3');
    audio.volume = 0.25;
    audio.play();
  }, []);

  const handleExplosion = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (explosions.length >= MAX_EXPLOSIONS) return; // обмеження кількості одночасних вибухів
    let x = 0, y = 0;
    const rect = containerRef.current?.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      x = e.touches[0].clientX - (rect?.left || 0);
      y = e.touches[0].clientY - (rect?.top || 0);
    } else if ('clientX' in e) {
      x = e.clientX - (rect?.left || 0);
      y = e.clientY - (rect?.top || 0);
    }
    setExplosions((prev: Explosion[]) => [...prev, { id: explosionId.current++, x, y }]);
    playPopSound();
    setTimeout(() => {
      setExplosions((prev: Explosion[]) => prev.filter((ex: Explosion) => ex.id !== explosionId.current - 1));
    }, 3000);
  }, [playPopSound, explosions.length]);

  // Відтворення фонової мелодії один раз при монтуванні (без автозапуску після взаємодії)
  useEffect(() => {
    const audio = new Audio('/background-melody.mp3');
    audio.volume = 0.18;
    audio.loop = true;
    audio.play().catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Не вдалося автоматично відтворити мелодію. Спробуйте дозволити автозапуск у браузері.', err);
    });
    return () => { audio.pause(); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-80 h-80 sm:w-96 sm:h-96 select-none"
      onClick={handleExplosion}
      onTouchStart={handleExplosion}
      style={{ cursor: 'pointer' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {particles}
        {explosions.map((ex: Explosion) => (
          <React.Fragment key={ex.id}>
            {generateParticles(ex.x, ex.y, `expl-${ex.id}-`)}
          </React.Fragment>
        ))}
      </div>
      <div
        className="css-heart absolute"
        style={{
          animation: `heart-explode-pop ${explosionDuration}s ease-out forwards`,
        }}
      />
      <svg
        className="absolute"
        width="340"
        height="340"
        viewBox="0 0 24 24"
        fill="transparent"
        stroke="#FF89C4"
        strokeWidth="1"
        style={{
          opacity: 0,
          animation: `svg-fade-in ${svgFadeInDuration}s ease-out ${svgFadeInDelay}s forwards, svg-heart-pulse 3.0s ease-in-out ${svgPulseDelay}s infinite`,
          filter: "drop-shadow(0 0 5px rgba(255, 137, 196, 0.8)) drop-shadow(0 0 10px rgba(255, 137, 196, 0.6))",
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <div
        className="absolute text-center z-10"
        style={{
          opacity: 0,
          top: '30%',
          animation: `text-reveal-glow ${textRevealDuration}s ease-in-out ${textRevealDelay}s forwards, text-subtle-pulse 5.0s ease-in-out ${textPulseDelay}s infinite`,
          width: '100%',
          left: 0,
        }}
      >
        <h1 className="text-4xl sm:text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-rose-300 drop-shadow-lg">
          я тебе<br />кохасяю
        </h1>
      </div>
    </div>
  );
};

export default HeartFireworks;