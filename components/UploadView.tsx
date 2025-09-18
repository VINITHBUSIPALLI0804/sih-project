import React, { useState, useEffect, useRef } from 'react';
import { CheckCircleIcon, UploadIcon, BackIcon, CloseIcon, MicrophoneIcon } from './icons';
import { getUploadHistory, addUploadHistory } from '../services/storageService';
import { UploadHistoryItem } from '../types';

const UploadView: React.FC = () => {
  const [step, setStep] = useState<'details' | 'upload' | 'submitted'>('details');
  
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [history, setHistory] = useState<UploadHistoryItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const [viewingItem, setViewingItem] = useState<UploadHistoryItem | null>(null);

  useEffect(() => {
    setHistory(getUploadHistory());

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setDescription(prev => prev + finalTranscript);
      };
    }
  }, []);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('upload');
  };

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      const newItem: UploadHistoryItem = {
        id: new Date().toISOString(),
        title: placeName,
        description: description,
        fileName: selectedFile.name,
        date: new Date().toLocaleDateString(),
      };
      addUploadHistory(newItem);
      setHistory(getUploadHistory());
      setStep('submitted');
      setPlaceName('');
      setDescription('');
      setSelectedFile(null);
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const renderDetailsForm = () => (
    <form onSubmit={handleDetailsSubmit} className="space-y-6">
      <div>
        <label htmlFor="placeName" className="block text-sm font-medium text-yellow-600 dark:text-yellow-300">Place Name</label>
        <input id="placeName" type="text" value={placeName} onChange={(e) => setPlaceName(e.target.value)} required
          className="mt-1 p-3 block w-full bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
          placeholder="e.g., The Grand Colosseum" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-yellow-600 dark:text-yellow-300">Description</label>
        <div className="relative">
          <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required
            className="mt-1 p-3 block w-full bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="A short description or story..." />
          {recognitionRef.current && (
            <button type="button" onClick={toggleRecording} aria-label={isRecording ? 'Stop recording description' : 'Start recording description'} className={`absolute top-3 right-3 p-2 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'}`}>
              <MicrophoneIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <button type="submit" disabled={!placeName || !description}
        className="w-full mt-4 py-3 px-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400/50 dark:disabled:bg-yellow-800 disabled:cursor-not-allowed text-slate-900 font-bold rounded-lg transition-colors">
        Next: Upload Media
      </button>
    </form>
  );

  const renderUploadForm = () => (
    <form onSubmit={handleFileSubmit} className="space-y-6">
      <button onClick={() => setStep('details')} className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300 font-semibold">
        <BackIcon className="w-4 h-4" /> Back to Details
      </button>
      <div>
        <label className="block text-sm font-medium text-yellow-600 dark:text-yellow-300 mb-2">Upload for "{placeName}"</label>
        <div className="mt-1 p-6 flex justify-center border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-500 dark:text-slate-400" />
            <div className="flex text-sm text-slate-600 dark:text-slate-400">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300 px-1">
                <span>{selectedFile ? 'Change file' : 'Upload a file'}</span>
                <input id="file-upload" type="file" className="sr-only" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} accept="video/*, .glb, .gltf, .obj" required />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500">{selectedFile ? selectedFile.name : 'MP4, GLB, etc. up to 50MB'}</p>
          </div>
        </div>
      </div>
      <button type="submit" disabled={!selectedFile}
        className="w-full mt-4 py-3 px-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400/50 dark:disabled:bg-yellow-800 disabled:cursor-not-allowed text-slate-900 font-bold rounded-lg transition-colors">
        Submit Contribution
      </button>
    </form>
  );

  const renderSubmitted = () => (
    <div className="h-full w-full flex flex-col items-center justify-center text-center">
      <CheckCircleIcon className="w-24 h-24 text-green-500 dark:text-green-400 mb-6" />
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Thank You!</h2>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">Your contribution helps preserve our shared heritage.</p>
      <button onClick={() => setStep('details')} className="py-3 px-6 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg">
        Contribute Another
      </button>
    </div>
  );

  return (
    <>
      <div className="h-full w-full bg-slate-100 dark:bg-slate-900 flex flex-col text-slate-900 dark:text-white">
        <div className="p-4 flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-300 dark:border-slate-700">
          <h1 className="text-2xl font-bold">Contribute Media</h1>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
          {step === 'details' && renderDetailsForm()}
          {step === 'upload' && renderUploadForm()}
          {step === 'submitted' && renderSubmitted()}

          {step !== 'submitted' && history.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 border-b border-slate-300 dark:border-slate-700 pb-2 mb-4">Contribution History</h2>
              <ul className="space-y-4">
                {history.map(item => (
                  <li key={item.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.date}</p>
                    </div>
                    <button onClick={() => setViewingItem(item)} aria-label={`View details for ${item.title}`} className="py-1 px-3 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-semibold hover:bg-yellow-500/30">View</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {viewingItem && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => setViewingItem(null)} aria-label="Close details view" className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
              <CloseIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-300 mb-4">{viewingItem.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Contributed on {viewingItem.date}</p>
            <p className="text-base mb-4 max-h-48 overflow-y-auto">{viewingItem.description}</p>
            <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-md">
                <p className="text-sm font-medium">File:</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{viewingItem.fileName}</p>
                <p className="text-xs text-slate-500 mt-2">(Video playback is not supported in this demo)</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadView;