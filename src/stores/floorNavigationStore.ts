import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FloorNavigationState {
  selectedFloorId: string | null;
  setSelectedFloor: (floorId: string | null) => void;
}

export const useFloorNavigationStore = create<FloorNavigationState>()(
  persist(
    (set) => ({
      selectedFloorId: null,
      setSelectedFloor: (floorId) => {
        set({ selectedFloorId: floorId });
      },
    }),
    {
      name: "floor-navigation-storage",
    },
  ),
);
