import { create } from "zustand";

export type AppType = "terminal";

export type DesktopWindow = {
  id: string;
  app: AppType;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
};

type DesktopState = {
  windows: DesktopWindow[];
  activeId: string | null;

  openWindow: (app: AppType) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  updateBounds: (id: string, bounds: Partial<Pick<DesktopWindow, "x" | "y" | "w" | "h">>) => void;
};

const newId = () => Math.random().toString(36).slice(2, 10);

export const useDesktopStore = create<DesktopState>((set, get) => ({
  windows: [],
  activeId: null,

  openWindow: (app) => {
    const { windows } = get();
    const topZ = windows.length ? Math.max(...windows.map((w) => w.z)) : 0;

    const win: DesktopWindow = {
      id: newId(),
      app,
      title: app === "terminal" ? "Terminal" : "App",
      x: 80 + windows.length * 25,
      y: 80 + windows.length * 25,
      w: 620,
      h: 380,
      z: topZ + 1,
      minimized: false,
    };

    set({ windows: [...windows, win], activeId: win.id });
  },

  closeWindow: (id) => {
    const next = get().windows.filter((w) => w.id !== id);
    set({ windows: next, activeId: next.length ? next[next.length - 1].id : null });
  },

  focusWindow: (id) => {
    const { windows } = get();
    const topZ = windows.length ? Math.max(...windows.map((w) => w.z)) : 0;

    set({
      windows: windows.map((w) => (w.id === id ? { ...w, z: topZ + 1, minimized: false } : w)),
      activeId: id,
    });
  },

  toggleMinimize: (id) => {
    const { windows, activeId } = get();
    const next = windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w));
    set({ windows: next, activeId: activeId === id ? null : activeId });
  },

  updateBounds: (id, bounds) => {
    set({
      windows: get().windows.map((w) => (w.id === id ? { ...w, ...bounds } : w)),
    });
  },
}));
