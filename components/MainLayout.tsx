import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Page, ScanState } from '../types';
import { getHeritageInfoFromImage } from '../services/geminiService';
import { HomeIcon, UploadIcon, CameraIcon, MapPinIcon, UserIcon, CloseIcon } from './icons';

import IntroVideo from './IntroVideo';
import HomeScreen from './HomeScreen';
import UploadView from './UploadView';
import LocationInfoView from './LocationInfoView';
import ProfileScreen from './ProfileScreen';
import CameraView from './CameraView';
import ResultView from './ResultView';
import FeedbackView from './FeedbackView';
import SettingsScreen from './SettingsScreen';
import MyContributionsScreen from './MyContributionsScreen';

interface MainLayoutProps {
  onLogout: () => void;
}

type View = 'main' | 'scan' | 'settings' | 'contributions';

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<Page>(Page.HOME);
  const [currentView, setCurrentView] = useState<View>('main');
  const [scanState, setScanState] = useState<ScanState | null>(null);
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [heritageInfo, setHeritageInfo] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback(async (imageDataUrl: string) => {
    setScanState(ScanState.RESULT);
    setIsLoading(true);
    setError(null);
    setHeritageInfo(null);
    setVideoUrl(undefined);
    try {
      const base64Data = imageDataUrl.split(',')[1];
      const mimeType = imageDataUrl.split(';')[0].split(':')[1];
      if (!base64Data || !mimeType) throw new Error("Invalid image data format.");
      const { info, videoUrl: newVideoUrl } = await getHeritageInfoFromImage(base64Data, mimeType);
      setHeritageInfo(info);
      setVideoUrl(newVideoUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to analyze image. ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleScanAgain = () => {
    setHeritageInfo(null);
    setError(null);
    setVideoUrl(undefined);
    setScanState(ScanState.CAMERA);
  };
  
  const handleStartScan = () => {
      setCurrentView('scan');
      setScanState(ScanState.CAMERA);
  }
  const handleCloseScan = () => {
      setCurrentView('main');
      setScanState(null);
      setHeritageInfo(null);
      setVideoUrl(undefined);
  }
  const handleProvideFeedback = () => setScanState(ScanState.FEEDBACK);

  const navigateTo = (view: View, page?: Page) => {
    setCurrentView(view);
    if(page !== undefined) setActivePage(page);
  }

  const renderPage = () => {
    switch (activePage) {
      case Page.HOME: return <HomeScreen />;
      case Page.UPLOAD: return <UploadView />;
      case Page.LOCATION: return <LocationInfoView />;
      case Page.PROFILE: return <ProfileScreen onLogout={onLogout} onNavigateToSettings={() => navigateTo('settings')} onNavigateToContributions={() => navigateTo('contributions')} />;
      default: return <HomeScreen />;
    }
  };

  if (!hasSeenIntro) {
    return <IntroVideo onFinish={() => setHasSeenIntro(true)} />;
  }

  if (currentView === 'settings') {
    return <SettingsScreen onBack={() => navigateTo('main', Page.PROFILE)} />;
  }

  if (currentView === 'contributions') {
    return <MyContributionsScreen 
                onBack={() => navigateTo('main', Page.PROFILE)} 
                onNavigateToUpload={() => navigateTo('main', Page.UPLOAD)}
            />;
  }
  
  if (currentView === 'scan' && scanState !== null) {
     return (
        <div className="relative h-full w-full bg-black">
            <CameraView ref={videoRef} onCapture={handleCapture} isPaused={scanState !== ScanState.CAMERA} />
            <div className={`absolute inset-0 transition-opacity duration-500 ${scanState !== ScanState.CAMERA ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {scanState === ScanState.RESULT && (
                    <ResultView info={heritageInfo} videoUrl={videoUrl} isLoading={isLoading} error={error} onScanAgain={handleScanAgain} onProvideFeedback={handleProvideFeedback} onClose={handleCloseScan} />
                )}
                {scanState === ScanState.FEEDBACK && (
                    <FeedbackView onSubmit={handleCloseScan} onBack={() => setScanState(ScanState.RESULT)} />
                )}
            </div>
            {scanState !== ScanState.RESULT && (
                 <div className="absolute top-6 left-4 z-20">
                    <button onClick={handleCloseScan} className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center transition-colors hover:bg-black/75" aria-label="Close scanner">
                        <CloseIcon className="w-7 h-7 text-white" />
                    </button>
                </div>
            )}
        </div>
    );
  }

  const NavItem = ({ page, icon, label }: { page: Page, icon: React.ReactNode, label: string }) => (
    <button onClick={() => setActivePage(page)} className="flex flex-col items-center justify-center w-full h-full text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors duration-200">
      <div className={`${activePage === page ? 'text-yellow-500 dark:text-yellow-400' : ''}`}>
        {icon}
      </div>
      <span className={`text-xs font-medium ${activePage === page ? 'text-yellow-500 dark:text-yellow-400' : ''}`}>{label}</span>
    </button>
  );

  return (
    <div className="h-full w-full flex flex-col bg-transparent">
      <main className="flex-grow overflow-y-auto">{renderPage()}</main>
      <footer className="flex-shrink-0 h-20 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-black/5 dark:border-white/10 grid grid-cols-5 items-center">
        <NavItem page={Page.HOME} icon={<HomeIcon className="w-6 h-6" />} label="Home" />
        <NavItem page={Page.UPLOAD} icon={<UploadIcon className="w-6 h-6" />} label="Upload" />
        <div className="flex items-center justify-center">
          <button
            onClick={handleStartScan}
            className="w-16 h-16 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center -mt-8 border-4 border-white dark:border-black hover:bg-yellow-300 active:scale-90 transition-transform shadow-lg"
            aria-label="Scan new landmark"
          >
            <CameraIcon className="w-8 h-8" />
          </button>
        </div>
        <NavItem page={Page.LOCATION} icon={<MapPinIcon className="w-6 h-6" />} label="Discover" />
        <NavItem page={Page.PROFILE} icon={<UserIcon className="w-6 h-6" />} label="Profile" />
      </footer>
    </div>
  );
};

export default MainLayout;