'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useBuilderStore } from '@/store/builder-store';
import type { UploadedFile } from '@/store/builder-store';
import { FileCard } from './FileCard';

const ACCEPT = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'application/pdf': ['.pdf'],
};
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

function createPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 200, height: 200 });
    };
    img.src = url;
  });
}

export function UploadZone() {
  const { addUploadedFile, uploadedFiles, removeUploadedFile, addDesign, getCanvasDimensions } = useBuilderStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const previewUrl = await createPreview(file);
        const { width, height } = await getImageDimensions(file);
        const id = `file-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const uf: UploadedFile = {
          id,
          file,
          previewUrl,
          width,
          height,
          name: file.name,
        };
        addUploadedFile(uf);
      }
    },
    [addUploadedFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    multiple: true,
  });

  const handleAddToSheet = (fileId: string) => {
    const uf = uploadedFiles.find((f) => f.id === fileId);
    if (!uf) return;
    const dim = getCanvasDimensions();
    const maxW = dim.width * 0.4;
    const maxH = dim.height * 0.4;
    const scale = Math.min(maxW / uf.width, maxH / uf.height, 1);
    const designId = `design-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    addDesign({
      id: designId,
      fileId: uf.id,
      fileName: uf.name,
      previewUrl: uf.previewUrl,
      x: 20,
      y: 20,
      width: uf.width * scale,
      height: uf.height * scale,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      copies: 1,
    });
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-accent bg-accent/5' : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'}
        `}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {isDragActive ? 'Drop files here…' : 'Drag & drop PNG, JPG, or PDF (max 50MB)'}
        </p>
        <p className="text-xs text-gray-500 mt-1">or click to browse</p>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {uploadedFiles.map((uf) => (
            <FileCard
              key={uf.id}
              file={uf}
              onAddToSheet={() => handleAddToSheet(uf.id)}
              onRemove={() => removeUploadedFile(uf.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
