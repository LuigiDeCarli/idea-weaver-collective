import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  parentId: string | null;
}

export const MindMap = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "root", text: "Central Topic", x: 400, y: 300, parentId: null },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse wheel for zooming
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setScale(prevScale => Math.min(Math.max(0.1, prevScale + delta), 2));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      
      setOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleAddBranch = (parentId: string) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    const angle = Math.random() * Math.PI * 2;
    const distance = 150;
    const newNode = {
      id: `node-${Date.now()}`,
      text: "New Branch",
      x: parentNode.x + Math.cos(angle) * distance,
      y: parentNode.y + Math.sin(angle) * distance,
      parentId: parentId
    };

    setNodes([...nodes, newNode]);
    toast.success("New branch added!");
  };

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      text: "New Topic",
      x: 400 + Math.random() * 200 - 100,
      y: 300 + Math.random() * 200 - 100,
      parentId: null
    };
    setNodes([...nodes, newNode]);
    toast.success("New topic added!");
  };

  const handleNodeClick = (id: string) => {
    setSelectedNode(id);
  };

  const handleNodeTextChange = (id: string, newText: string) => {
    setNodes(
      nodes.map((node) =>
        node.id === id ? { ...node, text: newText } : node
      )
    );
  };

  // Draw connections between nodes
  const renderConnections = () => {
    return nodes.map(node => {
      if (!node.parentId) return null;
      const parent = nodes.find(n => n.id === node.parentId);
      if (!parent) return null;

      const startX = parent.x;
      const startY = parent.y;
      const endX = node.x;
      const endY = node.y;

      // Calculate control point for curved line
      const dx = endX - startX;
      const dy = endY - startY;
      const controlX = startX + dx * 0.5;
      const controlY = startY + dy * 0.5;

      const path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

      return (
        <path
          key={`connection-${node.id}`}
          d={path}
          stroke="#4F46E5"
          strokeWidth="2"
          fill="none"
          className="transition-all duration-300"
        />
      );
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: 'center',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {renderConnections()}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute p-4 bg-white rounded-lg shadow-md cursor-move animate-scale-in
              ${selectedNode === node.id ? "ring-2 ring-blue-500" : ""}
              hover:shadow-lg transition-shadow duration-200
            `}
            style={{
              left: node.x,
              top: node.y,
              transform: "translate(-50%, -50%)",
              pointerEvents: 'auto',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick(node.id);
            }}
          >
            <input
              type="text"
              value={node.text}
              onChange={(e) => handleNodeTextChange(node.id, e.target.value)}
              className="bg-transparent border-none focus:outline-none text-center w-full"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute -right-3 -bottom-3 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleAddBranch(node.id);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-6 flex gap-2">
        <Button
          onClick={handleAddNode}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};