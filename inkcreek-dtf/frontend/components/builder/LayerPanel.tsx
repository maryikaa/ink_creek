'use client';

import { useBuilderStore } from '@/store/builder-store';
import { cn } from '@/lib/cn';

export function LayerPanel() {
  const { designs, selectedDesignId, setSelectedDesignId, removeDesign } = useBuilderStore();

  if (designs.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg">
        No designs on sheet. Add files from the upload area.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
        Layers ({designs.length})
      </div>
      <ul className="divide-y divide-gray-100 max-h-48 overflow-y-auto scrollbar-thin">
        {designs.map((d) => (
          <li
            key={d.id}
            className={cn(
              'flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50',
              selectedDesignId === d.id && 'bg-accent/10'
            )}
            onClick={() => setSelectedDesignId(d.id)}
          >
            <div
              className="w-8 h-8 rounded border border-gray-200 bg-gray-100 bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url(${d.previewUrl})` }}
            />
            <span className="flex-1 truncate text-sm">{d.fileName}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeDesign(d.id);
              }}
              className="text-gray-400 hover:text-red-600 text-sm"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
