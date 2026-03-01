'use client';

import type { UploadedFile } from '@/store/builder-store';
import { cn } from '@/lib/cn';

interface FileCardProps {
  file: UploadedFile;
  onAddToSheet: () => void;
  onRemove: () => void;
}

export function FileCard({ file, onAddToSheet, onRemove }: FileCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden group">
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={file.previewUrl}
          alt={file.name}
          className="w-full h-full object-contain"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
      <div className="p-2">
        <p className="text-xs text-gray-600 truncate" title={file.name}>
          {file.name}
        </p>
        <button
          type="button"
          onClick={onAddToSheet}
          className="mt-1 w-full py-1.5 rounded bg-primary text-white text-xs font-medium hover:bg-primary-light"
        >
          Add to sheet
        </button>
      </div>
    </div>
  );
}
