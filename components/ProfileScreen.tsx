import React, { useState, useEffect, useRef } from 'react';
import { getUserProfile, saveUserProfile } from '../services/storageService';
import { UserProfile } from '../types';
import { EditIcon, CameraIcon, CogIcon, UploadIcon } from './icons';

const ProfileScreen: React.FC<{ onLogout: () => void, onNavigateToSettings: () => void, onNavigateToContributions: () => void }> = ({ onLogout, onNavigateToSettings, onNavigateToContributions }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
    setOriginalProfile(userProfile);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
        saveUserProfile(profile);
        setOriginalProfile(profile);
        setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };
  
  const handleAvatarClick = () => {
      if(isEditing) {
          fileInputRef.current?.click();
      }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) return <div className="h-full w-full flex items-center justify-center"><p>Loading profile...</p></div>;

  return (
    <div className="h-full w-full bg-cover bg-center text-white" style={{backgroundImage: "url('https://images.unsplash.com/photo-1542852868-a0216e2d6b5e?q=80&w=1974&auto=format&fit=crop')"}}>
        <div className="h-full w-full bg-black/60 backdrop-blur-sm flex flex-col p-4 sm:p-6 overflow-y-auto">
            <div className="w-full max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold drop-shadow-lg">My Profile</h1>
                <div>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-yellow-300 hover:text-yellow-200 font-semibold transition-colors">
                        <EditIcon className="w-5 h-5" /> Edit
                        </button>
                    )}
                </div>
                </div>
                    
                <form onSubmit={handleSave} className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <div className="flex flex-col items-center pb-6">
                        <div className="relative">
                            <img className="h-28 w-28 rounded-full object-cover border-4 border-yellow-400 shadow-lg" src={profile.avatarUrl} alt="User profile" />
                            {isEditing && (
                                <button type="button" onClick={handleAvatarClick} aria-label="Change profile picture" className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                    <CameraIcon className="w-8 h-8"/>
                                </button>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                        {isEditing ? (
                        <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="mt-4 text-2xl font-semibold bg-white/10 text-center rounded-md p-2 w-full text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none" aria-required="true" />
                        ) : ( <h2 className="mt-4 text-2xl font-semibold drop-shadow-md">{profile.name}</h2> )}
                        
                        {isEditing ? (
                        <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="mt-1 text-gray-300 bg-white/10 text-center rounded-md p-2 w-full text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none" aria-required="true" />
                        ) : ( <p className="mt-1 text-gray-300">{profile.email}</p> )}

                        {isEditing ? (
                        <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="mt-4 text-sm bg-white/10 text-center rounded-md p-2 w-full h-24 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none" placeholder="Your bio..." />
                        ) : ( <p className="mt-4 text-sm text-center text-gray-300 max-w-xs">{profile.bio}</p> )}
                    </div>

                    {isEditing && (
                        <div className="flex gap-4 mb-6">
                        <button type="button" onClick={handleCancel} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors">Save</button>
                        </div>
                    )}
                </form>

                <div className="space-y-3 mt-6">
                  <button onClick={onNavigateToContributions} aria-label="View my contributions" className="w-full text-left bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-sm hover:bg-white/20 transition-colors flex items-center gap-4">
                    <UploadIcon className="w-6 h-6 text-yellow-300"/>
                    <span className='font-semibold'>My Contributions</span>
                  </button>
                  <button onClick={onNavigateToSettings} aria-label="Open settings" className="w-full text-left bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-sm hover:bg-white/20 transition-colors flex items-center gap-4">
                    <CogIcon className="w-6 h-6 text-yellow-300"/>
                    <span className='font-semibold'>Settings</span>
                  </button>
                </div>

                <div className="mt-6">
                <button onClick={onLogout} className="w-full bg-red-600/80 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors backdrop-blur-md">
                    Logout
                </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfileScreen;