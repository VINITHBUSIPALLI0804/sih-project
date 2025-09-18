import React, { useState } from 'react';
import { BackIcon, CheckCircleIcon } from './icons';

interface FeedbackViewProps {
  onSubmit: () => void;
  onBack: () => void;
}

const ThumbsUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H5.904c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h5.084c.261 0 .517.045.757.128l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294c.959 0 1.793-.605 2.03-1.528a4.5 4.5 0 0 0-.27-3.921c-.24-.423-.628-.802-1.094-1.125a3.371 3.371 0 0 0-1.517-.245z" />
  </svg>
);

const ThumbsDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M10.154 5.25h5.084c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125H10.154c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const FeedbackView: React.FC<FeedbackViewProps> = ({ onSubmit, onBack }) => {
  const [rating, setRating] = useState<'good' | 'bad' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rating, comment }); // In a real app, send this to a server
    setIsSubmitted(true);
    setTimeout(onSubmit, 2000); // Close after 2 seconds
  };
  
  if (isSubmitted) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 p-8">
        <CheckCircleIcon className="w-24 h-24 text-green-500 dark:text-green-400 mb-6" />
        <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Feedback Received</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">Thank you for helping us improve!</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-100 dark:bg-slate-900 flex flex-col text-slate-900 dark:text-white">
      <header className="p-4 flex-shrink-0 flex items-center gap-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Provide Feedback</h1>
      </header>
      
      <main className="flex-grow p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Was this information helpful?</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setRating('good')} aria-pressed={rating === 'good'} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 ${rating === 'good' ? 'border-green-500 bg-green-500/10' : 'border-slate-300 dark:border-slate-600 hover:border-green-500'}`}>
                <ThumbsUpIcon className={`w-6 h-6 ${rating === 'good' ? 'text-green-600' : 'text-slate-500'}`} />
                <span className="font-semibold">Yes</span>
              </button>
              <button type="button" onClick={() => setRating('bad')} aria-pressed={rating === 'bad'} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 ${rating === 'bad' ? 'border-red-500 bg-red-500/10' : 'border-slate-300 dark:border-slate-600 hover:border-red-500'}`}>
                <ThumbsDownIcon className={`w-6 h-6 ${rating === 'bad' ? 'text-red-600' : 'text-slate-500'}`} />
                <span className="font-semibold">No</span>
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">Additional Comments (optional)</label>
            <textarea
              id="comment"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 p-3 block w-full bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Tell us more about what you liked or disliked..."
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={!rating}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400/50 dark:disabled:bg-yellow-800 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default FeedbackView;