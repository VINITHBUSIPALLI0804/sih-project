import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 text-center p-8">
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Rings */}
          <circle cx="50" cy="50" r="48" stroke="rgba(253, 224, 71, 0.2)" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="38" stroke="rgba(253, 224, 71, 0.3)" strokeWidth="2" fill="none" />
          {/* Animated Dashed Ring */}
          <circle cx="50" cy="50" r="43" stroke="rgba(253, 224, 71, 0.8)" strokeWidth="2" fill="none"
            strokeDasharray="4 8" strokeLinecap="round" className="animate-[spin_20s_linear_infinite]" />
          {/* Compass Needle */}
          <g className="animate-[spin_2s_ease-in-out_infinite]">
            <path d="M50 10 L45 50 L50 90 L55 50 Z" fill="rgba(253, 224, 71, 0.5)" />
            <path d="M50 10 L45 50 L50 20 Z" fill="rgba(250, 204, 21, 1)" />
            <circle cx="50" cy="50" r="4" fill="white" />
          </g>
        </svg>
      </div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-lg">AR Heritage</h1>
        <h2 className="text-2xl font-light text-gray-200">Explorer</h2>
      </div>
      <p className="text-gray-400 mt-4">Discovering the past...</p>
    </div>
  );
};

export default SplashScreen;