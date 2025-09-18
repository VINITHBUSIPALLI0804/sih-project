import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { CameraIcon, NoCameraIcon, CloseIcon } from './icons';

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void;
  isPaused?: boolean;
}

const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(({ onCapture, isPaused }, ref) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => internalVideoRef.current as HTMLVideoElement);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (internalVideoRef.current) {
        internalVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check permissions and try again.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (internalVideoRef.current && internalVideoRef.current.srcObject) {
        const stream = internalVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  useEffect(() => {
      if (internalVideoRef.current) {
          if (isPaused) {
              internalVideoRef.current.pause();
          } else {
              internalVideoRef.current.play().catch(e => console.error("Video play failed", e));
          }
      }
  }, [isPaused]);


  const handleCapture = () => {
    if (internalVideoRef.current && canvasRef.current && !isPaused) {
      const video = internalVideoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageDataUrl);
      }
    }
  };

  return (
    <div className={`relative h-full w-full flex flex-col items-center justify-center bg-black ${isPaused ? 'backdrop-blur-md' : ''}`}>
      <video
        ref={internalVideoRef}
        autoPlay
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 ${isPaused ? 'filter blur-md scale-110' : 'filter blur-none scale-100'}`}
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-8 text-center">
            <NoCameraIcon className="w-20 h-20 text-red-400 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Camera Error</h2>
            <p className="text-gray-300">{error}</p>
        </div>
      )}

      {!error && !isPaused && (
        <>
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/60 to-transparent p-6 pt-20 text-center z-10">
                <p className="text-lg text-white drop-shadow-md">Point your camera at a landmark</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center z-10">
                <button
                onClick={handleCapture}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 ring-yellow-400/50"
                aria-label="Scan Landmark"
                >
                <CameraIcon className="w-10 h-10 text-white" />
                </button>
            </div>
        </>
      )}
    </div>
  );
});

export default CameraView;