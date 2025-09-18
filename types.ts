export enum AppState {
  LOADING,
  AUTH,
  LOGGED_IN,
}

export enum Page {
  HOME,
  UPLOAD,
  LOCATION,
  PROFILE,
  SETTINGS,
  MY_CONTRIBUTIONS,
}

export enum ScanState {
  CAMERA,
  RESULT,
  FEEDBACK,
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
}

export interface UploadHistoryItem extends HistoryItem {
    fileName: string;
    description: string;
}

export interface NearbyPlace {
    name: string;
    description: string;
    imageUrl?: string;
}

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}

export interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export interface AudioSettings {
    voice: 'male' | 'female';
    language: string; // BCP 47 language tag e.g., 'en-IN', 'hi-IN'
}

export const IndianLanguages: { [key: string]: string } = {
    'en-IN': 'English (India)',
    'hi-IN': 'Hindi',
    'bn-IN': 'Bengali',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu',
    'mr-IN': 'Marathi',
    'gu-IN': 'Gujarati',
    'kn-IN': 'Kannada',
    'ml-IN': 'Malayalam',
    'pa-IN': 'Punjabi',
};