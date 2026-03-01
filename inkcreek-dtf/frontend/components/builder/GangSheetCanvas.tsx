'use client';

import { useCallback, useEffect, useState } from 'react';
import { Stage, Layer, Rect as KonvaRect } from 'react-konva';
import { useBuilderStore } from '@/store/builder-store';
import { DesignBlock } from './DesignBlock';

const DPI_SCALE = 96 / 2;

export function GangSheetCanvas() {
  const {
    sheetSize,
    designs,
    selectedDesignId,
    updateDesign,
    setSelectedDesignId,
    getCanvasDimensions,
    zoom,
    stagePos,
    setStagePos,
  } = useBuilderStore();

  const [dim, setDim] = useState({ width: 624, height: 912 });
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const d = getCanvasDimensions();
    setDim(d);
  }, [sheetSize, getCanvasDimensions]);

  useEffect(() => {
    const onResize = () => {
      const container = document.getElementById('canvas-container');
      if (container) {
        setStageSize({ width: container.offsetWidth, height: container.offsetHeight });
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleStageClick = useCallback(
    (e: any) => {
      if (e.target === e.target.getStage()) {
        setSelectedDesignId(null);
      }
    },
    [setSelectedDesignId]
  );

  return (
    <div id="canvas-container" className="w-full h-full min-h-[400px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        scaleX={zoom}
        scaleY={zoom}
        x={stagePos.x}
        y={stagePos.y}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onWheel={(e) => {
          e.evt.preventDefault();
          const scaleBy = 1.1;
          const stage = e.target.getStage();
          if (!stage) return;
          const oldScale = stage.scaleX();
          const pointer = stage.getPointerPosition();
          if (!pointer) return;
          const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
          };
          const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
          const clamped = Math.max(0.25, Math.min(2, newScale));
          useBuilderStore.setState({
            zoom: clamped,
            stagePos: {
              x: pointer.x - mousePointTo.x * clamped,
              y: pointer.y - mousePointTo.y * clamped,
            },
          });
        }}
        draggable
        onDragEnd={(e) => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }}
      >
        <Layer>
          <KonvaRect
            x={0}
            y={0}
            width={dim.width}
            height={dim.height}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          {designs.map((design) => (
            <DesignBlock
              key={design.id}
              design={design}
              isSelected={selectedDesignId === design.id}
              onSelect={() => setSelectedDesignId(design.id)}
              onChange={(updates) => updateDesign(design.id, updates)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
