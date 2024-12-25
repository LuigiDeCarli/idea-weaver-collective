import React, { useEffect, useRef } from "react";
import { MindMapNode } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";
import { useViewport } from "./useViewport";
import { useNodes } from "./useNodes";

export const MindMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { viewport, isPanning, handlers } = useViewport();
  const {
    nodes,
    selectedNode,
    draggedNode,
    setSelectedNode,
    setDraggedNode,
    updateNodePosition,
    addChildNode,
    handleKeyPress
  } = useNodes();

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleNodeDragStart = (id: string, e: React.MouseEvent) => {
    setDraggedNode(id);
  };

  const handleNodeDragEnd = () => {
    setDraggedNode(null);
  };

  const handleNodeTextChange = (id: string, text: string) => {
    updateNodePosition(id, nodes.find(node => node.id === id)?.x || 0, nodes.find(node => node.id === id)?.y || 0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden cursor-grab active:cursor-grabbing"
      {...handlers}
    >
      <div 
        style={{
          transform: `translate(${viewport.offset.x}px, ${viewport.offset.y}px) scale(${viewport.scale})`,
          transformOrigin: 'center',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <MindMapConnections nodes={nodes} />

        {nodes.map((node) => (
          <MindMapNode
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isDragged={draggedNode === node.id}
            onSelect={setSelectedNode}
            onTextChange={handleNodeTextChange}
            onAddChild={addChildNode}
            onDragStart={handleNodeDragStart}
            onDragEnd={handleNodeDragEnd}
          />
        ))}
      </div>
    </div>
  );
};
