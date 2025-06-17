import React, { useEffect, useRef } from 'react';
import HeartFireworks from './components/HeartFireworks';
import FloatingHeartsBackground from './components/FloatingHeartsBackground';

const App: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const enableAudio = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play();
      }
      window.removeEventListener('pointerdown', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
    window.addEventListener('pointerdown', enableAudio);
    window.addEventListener('keydown', enableAudio);
    return () => {
      window.removeEventListener('pointerdown', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full animated-dark-gradient overflow-hidden">
      <audio
        ref={audioRef}
        src="/background-melody.mp3"
        autoPlay
        loop
        muted
        preload="auto"
        style={{ display: 'none' }}
      />
      <FloatingHeartsBackground />
      <HeartFireworks />
    </div>
  );
};

export default App;