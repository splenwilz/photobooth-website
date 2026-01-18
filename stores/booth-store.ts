/**
 * Booth Store
 *
 * Global state management using Zustand.
 * Reserved for future use - booth selection is now handled via URL params.
 *
 * @see photobooth-app/stores/booth-store.ts - Mobile app Zustand store
 */

import { create } from "zustand";

interface BoothStore {
  // Add future global state here
}

export const useBoothStore = create<BoothStore>(() => ({
  // Add future global state here
}));
