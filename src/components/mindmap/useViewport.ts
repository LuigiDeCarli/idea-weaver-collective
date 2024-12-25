import { useState, useRef } from 'react';
import { Position, ViewportState } from './types';
import React from 'react';

export const useViewport = () => {
  const [viewport, setViewport] = useState<ViewportState>({
    offset: { x: 0, y: 0 },
    scale: 1
  });
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });

  const handlePanStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePanMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      
      setViewport(prev => ({
        ...prev,
        offset: {
          x: prev.offset.x + dx,
          y: prev.offset.y + dy
        }
      }));
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const handleZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setViewport(prev => ({
      ...prev,
      scale: Math.min(Math.max(0.1, prev.scale + delta), 2)
    }));
  };

  return {
    viewport,
    isPanning,
    handlers: {
      onMouseDown: handlePanStart,
      onMouseMove: handlePanMove,
      onMouseUp: handlePanEnd,
      onMouseLeave: handlePanEnd,
      onWheel: handleZoom
    }
  };
};