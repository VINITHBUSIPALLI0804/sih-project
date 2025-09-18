import React, { useState, useEffect, useCallback } from 'react';
import { getHeritageInfoFromCoords } from '../services/geminiService';
import { addDiscoverHistory, getAudioSettings } from '../services/storageService';
import { LoadingSpinner, MapPinIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './icons';
import { IndianLanguages } from '../types';

const LocationInfoView: React.FC = () => {
  const [info, setInfo] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1524231757912-21f4fe3a7207?q=80&w=2070&auto=format&fit=crop');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Correctly load voices when they become available
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial attempt
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    }
  }, []);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const audioSettings = getAudioSettings();
          const languageName = IndianLanguages[audioSettings.language] || 'English (India)';
          const result = await getHeritageInfoFromCoords(latitude, longitude, audioSettings.language, languageName);
          
          const contentParts = result.split("IMAGE_QUERY:");
          const textContent = contentParts[0].trim();
          
          setInfo(textContent);
          
          if (contentParts.length > 1) {
            const query = contentParts[1].trim();
            setImageUrl(`https://source.unsplash.com/600x800/?${encodeURIComponent(query)}`);
          }

          const title = textContent.split('\n')[0] || "Unknown Location";
          addDiscoverHistory({
            id: new Date().toISOString(),
            title: title,
            date: new Date().toLocaleDateString(),
          });
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to fetch location details.");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError("Could not get location. Please enable location permissions for this app.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );

    return () => {
        stopSpeech();
    };
  }, [stopSpeech]);
  
  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeech();
      return;
    }
    if (info && 'speechSynthesis' in window) {
      stopSpeech();
      const speechText = info.split('\n').slice(1).join(' ');
      const utterance = new SpeechSynthesisUtterance(speechText);
      const audioSettings = getAudioSettings();
      
      utterance.lang = audioSettings.language;

      const selectedVoice = voices.find(v => v.lang === audioSettings.language && v.name.toLowerCase().includes(audioSettings.voice));
      if(selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 flex flex-col bg-cover bg-center" style={{backgroundImage: `url('${imageUrl}')`}}>
      <div className="h-full w-full bg-black/60 backdrop-blur-sm flex flex-col">
        <div className="p-4 flex-shrink-0 flex items-center justify-between bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <MapPinIcon className="w-7 h-7 text-yellow-300" />
            <h1 className="text-2xl font-bold text-white">Discover</h1>
          </div>
          {!isLoading && info && (
            <button 
              onClick={handleSpeak} 
              aria-label={isSpeaking ? 'Stop reading description' : 'Read description aloud'}
              className="flex items-center gap-2 bg-yellow-400/20 text-yellow-200 px-3 py-2 rounded-lg hover:bg-yellow-400/30 transition-colors">
              {isSpeaking ? <SpeakerXMarkIcon className="w-6 h-6" /> : <SpeakerWaveIcon className="w-6 h-6" />}
              <span className="font-semibold text-sm">{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>
          )}
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <LoadingSpinner className="w-12 h-12 text-yellow-400 animate-spin" />
                <h2 className="text-xl font-semibold mt-4 text-white">Discovering Your Area...</h2>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-red-300 bg-black/50 rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Discovery Failed</h2>
                <p className='text-white'>{error}</p>
            </div>
          ) : info ? (
            <div className="bg-black/50 backdrop-blur-md p-4 md:p-6 rounded-lg border border-white/10">
              <div className="prose prose-sm md:prose-base prose-invert max-w-none prose-h1:text-yellow-300 prose-h1:font-bold prose-p:text-gray-200 prose-p:leading-relaxed">
                  {info.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => 
                      index === 0 ? <h1 key={index}>{paragraph}</h1> : <p key={index}>{paragraph}</p>
                  )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LocationInfoView;