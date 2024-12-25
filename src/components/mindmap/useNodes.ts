import { useState, useCallback } from 'react';
import { Node } from './types';
import { toast } from 'sonner';

export const useNodes = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'root', text: 'Central Topic', x: 400, y: 300, parentId: null, level: 0 }
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, x, y } : node
    ));
  };

  const addChildNode = (parentId: string) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    const childrenCount = nodes.filter(n => n.parentId === parentId).length;
    const angle = (Math.PI / 6) * childrenCount;
    const distance = 150;

    const newNode = {
      id: `node-${Date.now()}`,
      text: 'New Branch',
      x: parentNode.x + Math.cos(angle) * distance,
      y: parentNode.y + Math.sin(angle) * distance,
      parentId: parentId,
      level: parentNode.level + 1
    };

    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
    toast.success('New branch added!');
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!selectedNode) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      addChildNode(selectedNode);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const currentNode = nodes.find(n => n.id === selectedNode);
      if (currentNode?.parentId) {
        addChildNode(currentNode.parentId);
      }
    }
  }, [selectedNode, nodes]);

  return {
    nodes,
    selectedNode,
    draggedNode,
    setSelectedNode,
    setDraggedNode,
    updateNodePosition,
    addChildNode,
    handleKeyPress
  };
};