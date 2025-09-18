import React from 'react';
import { VideoIcon } from './icons';

interface IntroVideoProps {
  onFinish: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ onFinish }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black p-8 text-center">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-yellow-400/20 flex items-center justify-center mb-6">
            <VideoIcon className="w-20 h-20 text-yellow-300" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Your Journey Begins</h1>
        <p className="text-lg text-gray-300 max-w-md">
          Uncover the stories hidden in plain sight. Explore historical sites, discover their secrets, and help preserve our collective memory.
        </p>
      </div>
      <div className="flex-shrink-0 w-full">
        <button
          onClick={onFinish}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 px-4 rounded-lg transition-colors duration-200"
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
};

export default IntroVideo;