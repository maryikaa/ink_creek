import { create } from 'zustand';

export type SheetSizeId = '13x19' | '11x17' | '8.5x11';

export interface SheetSizeOption {
  id: SheetSizeId;
  label: string;
  widthInches: number;
  heightInches: number;
  pricePerSheet: number;
}

export interface DesignBlock {
  id: string;
  fileId: string;
  fileName: string;
  previewUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  copies: number;
}

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  name: string;
}

export const SHEET_SIZES: SheetSizeOption[] = [
  { id: '13x19', label: '13" × 19"', widthInches: 13, heightInches: 19, pricePerSheet: 8.5 },
  { id: '11x17', label: '11" × 17"', widthInches: 11, heightInches: 17, pricePerSheet: 6.5 },
  { id: '8.5x11', label: '8.5" × 11"', widthInches: 8.5, heightInches: 11, pricePerSheet: 4.5 },
];

const DPI = 96;

interface BuilderState {
  sheetSize: SheetSizeOption;
  designs: DesignBlock[];
  uploadedFiles: UploadedFile[];
  selectedDesignId: string | null;
  quantity: number;
  transferType: 'standard' | 'glow' | 'reflective';
  rushOrder: boolean;
  zoom: number;
  stagePos: { x: number; y: number };

  setSheetSize: (size: SheetSizeOption) => void;
  setQuantity: (qty: number) => void;
  setTransferType: (t: 'standard' | 'glow' | 'reflective') => void;
  setRushOrder: (rush: boolean) => void;
  setZoom: (z: number) => void;
  setStagePos: (pos: { x: number; y: number }) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (id: string) => void;
  addDesign: (design: DesignBlock) => void;
  updateDesign: (id: string, updates: Partial<DesignBlock>) => void;
  removeDesign: (id: string) => void;
  setSelectedDesignId: (id: string | null) => void;
  clearAllDesigns: () => void;
  getCanvasDimensions: () => { width: number; height: number };
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  sheetSize: SHEET_SIZES[0],
  designs: [],
  uploadedFiles: [],
  selectedDesignId: null,
  quantity: 1,
  transferType: 'standard',
  rushOrder: false,
  zoom: 1,
  stagePos: { x: 0, y: 0 },

  setSheetSize: (sheetSize) => set({ sheetSize }),
  setQuantity: (quantity) => set({ quantity: Math.max(1, quantity) }),
  setTransferType: (transferType) => set({ transferType }),
  setRushOrder: (rushOrder) => set({ rushOrder }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),
  setStagePos: (stagePos) => set({ stagePos }),

  addUploadedFile: (file) =>
    set((s) => ({ uploadedFiles: [...s.uploadedFiles, file] })),
  removeUploadedFile: (id) =>
    set((s) => ({
      uploadedFiles: s.uploadedFiles.filter((f) => f.id !== id),
      designs: s.designs.filter((d) => d.fileId !== id),
      selectedDesignId: s.selectedDesignId && s.designs.some((d) => d.fileId === id) ? null : s.selectedDesignId,
    })),

  addDesign: (design) =>
    set((s) => ({ designs: [...s.designs, design], selectedDesignId: design.id })),
  updateDesign: (id, updates) =>
    set((s) => ({
      designs: s.designs.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  removeDesign: (id) =>
    set((s) => ({
      designs: s.designs.filter((d) => d.id !== id),
      selectedDesignId: s.selectedDesignId === id ? null : s.selectedDesignId,
    })),
  setSelectedDesignId: (selectedDesignId) => set({ selectedDesignId: selectedDesignId }),
  clearAllDesigns: () => set({ designs: [], selectedDesignId: null }),

  getCanvasDimensions: () => {
    const { sheetSize } = get();
    return {
      width: (sheetSize.widthInches * DPI) / 2,
      height: (sheetSize.heightInches * DPI) / 2,
    };
  },
}));
