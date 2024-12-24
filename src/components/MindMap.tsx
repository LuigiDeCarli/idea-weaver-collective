import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
}

export const MindMap = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "root", text: "Central Topic", x: 400, y: 300 },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      text: "New Topic",
      x: Math.random() * 800,
      y: Math.random() * 600,
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

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      <div className="absolute bottom-6 right-6 flex gap-2">
        <Button
          onClick={handleAddNode}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`absolute p-4 bg-white rounded-lg shadow-md cursor-move animate-scale-in
            ${selectedNode === node.id ? "ring-2 ring-blue-500" : ""}
          `}
          style={{
            left: node.x,
            top: node.y,
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => handleNodeClick(node.id)}
        >
          <input
            type="text"
            value={node.text}
            onChange={(e) => handleNodeTextChange(node.id, e.target.value)}
            className="bg-transparent border-none focus:outline-none text-center w-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ))}
    </div>
  );
};