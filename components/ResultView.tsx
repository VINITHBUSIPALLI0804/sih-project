import React from 'react';
import { BackIcon, CheckCircleIcon, LoadingSpinner, VideoIcon } from './icons';

interface ResultViewProps {
  info: string | null;
  videoUrl?: string;
  isLoading: boolean;
  error: string | null;
  onScanAgain: () => void;
  onProvideFeedback: () => void;
  onClose: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ info, videoUrl, isLoading, error, onScanAgain, onProvideFeedback, onClose }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <LoadingSpinner className="w-12 h-12 text-yellow-300 animate-spin" />
          <h2 className="text-xl font-semibold mt-4 text-white drop-shadow-md">Analyzing Landmark...</h2>
          <p className="text-gray-200 drop-shadow-md mt-1">Uncovering history, please wait.</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-300 bg-black/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
          <p className='text-white'>{error}</p>
        </div>
      );
    }
    if (info) {
      const paragraphs = info.split('\n').filter(p => p.trim() !== '');
      return (
        <div className="prose prose-sm md:prose-base prose-invert max-w-none prose-h1:text-yellow-300 prose-h1:font-bold prose-p:text-gray-200 prose-p:leading-relaxed prose-p:drop-shadow-md">
          {paragraphs.map((paragraph, index) => {
            if (index === 0) {
              return <h1 key={index}>{paragraph}</h1>;
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-transparent">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col p-4 pt-20">
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 md:p-6 flex-grow mb-4 overflow-y-auto shadow-2xl border border-white/20">
                {renderContent()}
            </div>
            
            <div className="flex-shrink-0 space-y-3">
            {!isLoading && !error && (
                <>
                {videoUrl && (
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg">
                        <VideoIcon className="w-6 h-6" />
                        Watch Video of this Place
                    </a>
                )}
                 <button
                    onClick={onProvideFeedback}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                >
                    <CheckCircleIcon className="w-6 h-6"/>
                    Provide Feedback
                </button>
                </>
            )}
            <button
                onClick={onScanAgain}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
            >
                <BackIcon className="w-5 h-5" />
                Scan Another Landmark
            </button>
            </div>
      </div>
    </div>
  );
};

export default ResultView;