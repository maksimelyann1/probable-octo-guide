import React from 'react';
import HeartFireworks from './components/HeartFireworks';
import FloatingHeartsBackground from './components/FloatingHeartsBackground';

const App: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full animated-dark-gradient overflow-hidden">
      <FloatingHeartsBackground />
      <HeartFireworks />
    </div>
  );
};

export default App;