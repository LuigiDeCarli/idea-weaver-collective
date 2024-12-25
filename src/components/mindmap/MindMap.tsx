import React, { useEffect, useRef, useState } from "react";
import { MindMapNode } from "./MindMapNode";
import { MindMapConnections } from "./MindMapConnections";
import { useViewport } from "./useViewport";
import { useNodes } from "./useNodes";
import { Button } from "@/components/ui/button";
import { HierarchicalView } from "./HierarchicalView";
import { List } from "lucide-react";

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
    handleKeyPress,
    buildHierarchy
  } = useNodes();

  const [showHierarchy, setShowHierarchy] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleNodeDragStart = (id: string) => {
    setDraggedNode(id);
  };

  const handleNodeDragEnd = () => {
    setDraggedNode(null);
  };

  const handleNodeTextChange = (id: string, text: string) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      updateNodePosition(id, node.x, node.y);
    }
  };

  const hierarchicalData = buildHierarchy();

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div 
        ref={containerRef}
        className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden cursor-grab active:cursor-grabbing"
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

      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <Button
          onClick={() => setShowHierarchy(!showHierarchy)}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <List className="h-6 w-6" />
        </Button>
      </div>

      {showHierarchy && (
        <div className="absolute bottom-24 right-6 w-96">
          <HierarchicalView nodes={hierarchicalData} />
        </div>
      )}
    </div>
  );
};