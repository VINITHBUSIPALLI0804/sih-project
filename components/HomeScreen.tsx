import React, { useState, useEffect } from 'react';
import { getNearbyPlaces } from '../services/geminiService';
import { getDiscoverHistory } from '../services/storageService';
import { HistoryItem, NearbyPlace } from '../types';
import { LoadingSpinner, MapPinIcon } from './icons';

const HomeScreen: React.FC = () => {
    const [discoverHistory, setDiscoverHistory] = useState<HistoryItem[]>([]);
    const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setDiscoverHistory(getDiscoverHistory().slice(0, 3));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    setError(null);
                    const { latitude, longitude } = position.coords;
                    const result = await getNearbyPlaces(latitude, longitude);
                    if (result && result.places) {
                        setNearbyPlaces(result.places);
                    }
                } catch (error) {
                    console.error("Failed to fetch nearby places:", error);
                    setError("Could not fetch nearby heritage sites.");
                } finally {
                    setIsLoading(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setError("Please enable location permissions to discover nearby places.");
                setIsLoading(false);
            }
        );
    }, []);

  return (
    <div className="h-full w-full bg-transparent text-gray-900 dark:text-white overflow-y-auto">
        <div className="h-60 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1501116521425-c46f1409b922?q=80&w=2104&auto=format&fit=crop')"}}>
            <div className="h-full w-full bg-black/50 flex flex-col justify-end p-6">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">AR Heritage Explorer</h1>
                <p className="text-lg text-gray-200 drop-shadow-md">The past is in your hands.</p>
            </div>
        </div>
        <div className="p-4 md:p-6 space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-yellow-600 dark:text-yellow-300 mb-2">Welcome, Explorer!</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-white/50 dark:bg-black/50 p-4 rounded-lg">
                    Tap the central <span className="font-bold">Scan</span> button to identify landmarks, or visit <span className="font-bold">Discover</span> to learn about your current surroundings.
                </p>
            </div>
            
            <div>
                <h3 className="text-xl font-bold mb-3 text-yellow-600 dark:text-yellow-300 flex items-center gap-2"><MapPinIcon className="w-6 h-6"/> Nearby Heritage</h3>
                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <LoadingSpinner className="w-8 h-8 text-yellow-500 dark:text-yellow-400 animate-spin" />
                    </div>
                ) : error ? (
                    <p className="text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/50 p-4 rounded-lg">{error}</p>
                ) : nearbyPlaces.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {nearbyPlaces.map((place, index) => (
                            <div key={index} className="bg-cover bg-center rounded-lg shadow-lg h-40 flex flex-col justify-end p-4 text-white" style={{backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url('${place.imageUrl}')`}}>
                                <h4 className="font-bold text-lg drop-shadow-md">{place.name}</h4>
                                <p className="text-xs drop-shadow-md">{place.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/50 p-4 rounded-lg">No nearby places found.</p>
                )}
            </div>

            {discoverHistory.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-3 text-yellow-600 dark:text-yellow-300">Discovery History</h3>
                     <div className="space-y-3">
                        {discoverHistory.map(item => (
                             <div key={item.id} className="bg-white/50 dark:bg-black/50 p-4 rounded-lg shadow-sm backdrop-blur-sm">
                                <h4 className="font-bold text-lg">{item.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Discovered on {item.date}</p>
                            </div>
                        ))}
                     </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default HomeScreen;