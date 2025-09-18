import React, { useContext, useState, useEffect } from 'react';
import { Theme, IndianLanguages, AudioSettings } from '../types';
import { ThemeContext } from '../context/ThemeContext';
import { BackIcon } from './icons';
import { getAudioSettings, saveAudioSettings } from '../services/storageService';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(getAudioSettings());

  useEffect(() => {
    // Pre-load voices
    window.speechSynthesis.getVoices();
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleAudioSettingChange = (setting: keyof AudioSettings, value: string) => {
    const newSettings = { ...audioSettings, [setting]: value };
    setAudioSettings(newSettings);
    saveAudioSettings(newSettings);
  };


  return (
    <div className="h-full w-full bg-slate-100 dark:bg-slate-900 flex flex-col">
      <header className="p-4 flex-shrink-0 flex items-center gap-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-300 dark:border-slate-700">
        <button onClick={onBack} aria-label="Go back to profile" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <BackIcon className="w-6 h-6 text-slate-800 dark:text-white" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </header>

      <main className="flex-grow p-4 md:p-6 overflow-y-auto text-slate-900 dark:text-white">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-300 mb-3">Appearance</h2>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex gap-4">
                <button onClick={() => handleThemeChange(Theme.LIGHT)} className={`w-full p-3 rounded-lg font-semibold text-center border-2 transition-all ${theme === Theme.LIGHT ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600' : 'border-slate-300 dark:border-slate-600 hover:border-yellow-400'}`}>
                  Light
                </button>
                <button onClick={() => handleThemeChange(Theme.DARK)} className={`w-full p-3 rounded-lg font-semibold text-center border-2 transition-all ${theme === Theme.DARK ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300' : 'border-slate-300 dark:border-slate-600 hover:border-yellow-400'}`}>
                  Dark
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-300 mb-3">Audio</h2>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-sm space-y-4">
               <div>
                  <label htmlFor="language" className="block text-sm font-medium mb-2">Listen Language</label>
                  <select id="language" value={audioSettings.language} onChange={(e) => handleAudioSettingChange('language', e.target.value)} className="w-full p-3 rounded-lg bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 focus:border-yellow-500 focus:outline-none focus:ring-0">
                      {Object.entries(IndianLanguages).map(([code, name]) => (
                          <option key={code} value={code}>{name}</option>
                      ))}
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium mb-2">Voice Preference</label>
                  <div className="flex gap-4">
                      <button onClick={() => handleAudioSettingChange('voice', 'female')} className={`w-full p-3 rounded-lg font-semibold text-center border-2 transition-all ${audioSettings.voice === 'female' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-300' : 'border-slate-300 dark:border-slate-600 hover:border-yellow-400'}`}>
                          Female
                      </button>
                      <button onClick={() => handleAudioSettingChange('voice', 'male')} className={`w-full p-3 rounded-lg font-semibold text-center border-2 transition-all ${audioSettings.voice === 'male' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-300' : 'border-slate-300 dark:border-slate-600 hover:border-yellow-400'}`}>
                          Male
                      </button>
                  </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;