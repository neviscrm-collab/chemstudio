import { create } from 'zustand';
import type { ViewType, Experiment } from '../types';

interface AppState {
  view: ViewType;
  selectedProjectId: string | null;
  selectedExperimentId: string | null;
  localExperiments: Experiment[];
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;
  rightPanelTab: 'properties' | 'comments' | 'versions' | 'ai' | 'references';
  darkMode: boolean;
  searchOpen: boolean;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;

  setView: (view: ViewType) => void;
  selectProject: (id: string | null) => void;
  selectExperiment: (id: string | null) => void;
  addExperiment: (exp: Experiment) => void;
  toggleSidebar: () => void;
  setRightPanel: (open: boolean, tab?: AppState['rightPanelTab']) => void;
  toggleDarkMode: () => void;
  setSearchOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  view: 'dashboard',
  selectedProjectId: null,
  selectedExperimentId: null,
  localExperiments: [],
  sidebarCollapsed: false,
  rightPanelOpen: false,
  rightPanelTab: 'properties',
  darkMode: false,
  searchOpen: false,
  commandPaletteOpen: false,
  notificationsOpen: false,

  setView: (view) => set({ view }),
  selectProject: (id) => set({ selectedProjectId: id, view: id ? 'project_detail' : 'projects' }),
  selectExperiment: (id) => set({ selectedExperimentId: id, view: id ? 'experiment_detail' : 'experiments' }),
  addExperiment: (exp) => set((s) => ({
    localExperiments: [exp, ...s.localExperiments],
    selectedExperimentId: exp.id,
    view: 'experiment_detail',
  })),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setRightPanel: (open, tab) => set((s) => ({ rightPanelOpen: open, rightPanelTab: tab ?? s.rightPanelTab })),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
}));
