import { create } from 'zustand';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
}

interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserStore>((set) => {
  // get from local storage to hydrate profile
  const storedProfile = typeof window !== 'undefined'
    ? localStorage.getItem('userProfile')
    : null;

  return {
    profile: storedProfile ? JSON.parse(storedProfile) : null,
    setProfile: (profile: UserProfile) => {
      set({ profile });
      localStorage.setItem('userProfile', JSON.stringify(profile));
    },
    clearProfile: () => {
      set({ profile: null });
      localStorage.removeItem('userProfile');
    },
  };
});
