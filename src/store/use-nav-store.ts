import { create } from 'zustand';

type NavState = {
  isNavOpen: boolean;
  setIsNavOpen: (isNavOpen: boolean) => void;
  toggleNavOpen: () => void;
};

export const useNavStore = create<NavState>((set) => ({
  isNavOpen: true,
  setIsNavOpen: (isNavOpen) => set({ isNavOpen }),
  toggleNavOpen: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
}));

export const useNavState = () => useNavStore((state) => state.isNavOpen);
export const useSetNavState = () => useNavStore((state) => state.setIsNavOpen);
