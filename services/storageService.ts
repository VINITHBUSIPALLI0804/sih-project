import { UserProfile, UploadHistoryItem, HistoryItem, Theme, AudioSettings } from '../types';

// --- Keys ---
const USER_PROFILE_KEY = 'arHeritage_userProfile';
const UPLOAD_HISTORY_KEY = 'arHeritage_uploadHistory';
const DISCOVER_HISTORY_KEY = 'arHeritage_discoverHistory';
const THEME_KEY = 'arHeritage_theme';
const AUDIO_SETTINGS_KEY = 'arHeritage_audioSettings';
const USER_DB_KEY = 'arHeritage_userDatabase';

// --- User Database (Simulation) ---
interface User {
    name: string;
    email: string;
    password?: string; // Should be hashed in a real app
}

function getUserDB(): User[] {
    try {
        const db = localStorage.getItem(USER_DB_KEY);
        return db ? JSON.parse(db) : [];
    } catch {
        return [];
    }
}

function saveUserDB(db: User[]): void {
    localStorage.setItem(USER_DB_KEY, JSON.stringify(db));
}

export function isEmailTaken(email: string): boolean {
    const db = getUserDB();
    return db.some(user => user.email.toLowerCase() === email.toLowerCase());
}

export function addUser(user: User): void {
    const db = getUserDB();
    db.push(user);
    saveUserDB(db);
}


// --- Theme ---
export function getTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY);
    return (stored === Theme.LIGHT || stored === Theme.DARK) ? stored : Theme.DARK;
}

export function saveTheme(theme: Theme): void {
    localStorage.setItem(THEME_KEY, theme);
}

// --- Audio Settings ---
const defaultAudioSettings: AudioSettings = {
    voice: 'female',
    language: 'en-IN',
};

export function getAudioSettings(): AudioSettings {
    try {
        const stored = localStorage.getItem(AUDIO_SETTINGS_KEY);
        return stored ? { ...defaultAudioSettings, ...JSON.parse(stored) } : defaultAudioSettings;
    } catch {
        return defaultAudioSettings;
    }
}

export function saveAudioSettings(settings: AudioSettings): void {
    localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
}

// --- User Profile ---
const defaultProfile: UserProfile = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  bio: "Enthusiast of ancient history and digital preservation.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
};

export function getUserProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    if (stored) {
        return { ...defaultProfile, ...JSON.parse(stored) };
    }
    return defaultProfile;
  } catch (error) {
    console.error("Failed to parse user profile", error);
    return defaultProfile;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save user profile", error);
  }
}

// --- Upload History ---
export function getUploadHistory(): UploadHistoryItem[] {
  try {
    const stored = localStorage.getItem(UPLOAD_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addUploadHistory(item: UploadHistoryItem): void {
  try {
    const history = getUploadHistory();
    localStorage.setItem(UPLOAD_HISTORY_KEY, JSON.stringify([item, ...history]));
  } catch (error) {
    console.error("Failed to add to upload history", error);
  }
}

// --- Discover History ---
export function getDiscoverHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(DISCOVER_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addDiscoverHistory(item: HistoryItem): void {
  try {
    const history = getDiscoverHistory();
    if (history.some(h => h.title === item.title)) {
        return;
    }
    localStorage.setItem(DISCOVER_HISTORY_KEY, JSON.stringify([item, ...history]));
  } catch (error) {
    console.error("Failed to add to discover history", error);
  }
}