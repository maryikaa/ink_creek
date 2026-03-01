'use client';

import { useEffect, useState } from 'react';
import { Group, Image, Rect } from 'react-konva';
import type { DesignBlock as DesignBlockType } from '@/store/builder-store';

interface DesignBlockProps {
  design: DesignBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<DesignBlockType>) => void;
}

export function DesignBlock({ design, isSelected, onSelect, onChange }: DesignBlockProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = design.previewUrl;
    image.onload = () => setImg(image);
    return () => { image.src = ''; };
  }, [design.previewUrl]);

  return (
    <Group
      x={design.x}
      y={design.y}
      rotation={design.rotation}
      scaleX={design.scaleX}
      scaleY={design.scaleY}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        onChange({
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          scaleX: 1,
          scaleY: 1,
          rotation: node.rotation(),
        });
        node.scaleX(1);
        node.scaleY(1);
      }}
    >
      {isSelected && (
        <Rect
          x={-4}
          y={-4}
          width={design.width + 8}
          height={design.height + 8}
          stroke="#9174a4"
          strokeWidth={2}
          dash={[4, 4]}
          listening={false}
        />
      )}
      <Image
        image={img}
        width={design.width}
        height={design.height}
        listening={true}
      />
    </Group>
  );
}
