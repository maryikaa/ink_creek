'use client';

import { useBuilderStore } from '@/store/builder-store';
import { cn } from '@/lib/cn';

export function ToolBar() {
  const { zoom, setZoom, selectedDesignId, removeDesign, clearAllDesigns, designs } = useBuilderStore();

  return (
    <div className="flex items-center gap-2 flex-wrap p-2 bg-white border border-gray-200 rounded-lg">
      <span className="text-sm font-medium text-gray-600">Zoom:</span>
      <button
        type="button"
        onClick={() => setZoom(zoom - 0.1)}
        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
      >
        −
      </button>
      <span className="text-sm tabular-nums min-w-[3rem]">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        onClick={() => setZoom(zoom + 0.1)}
        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
      >
        +
      </button>
      <div className="w-px h-6 bg-gray-200" />
      {selectedDesignId && (
        <button
          type="button"
          onClick={() => removeDesign(selectedDesignId)}
          className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium"
        >
          Remove selected
        </button>
      )}
      {designs.length > 0 && (
        <button
          type="button"
          onClick={clearAllDesigns}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
