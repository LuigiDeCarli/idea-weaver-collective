import { useState, useCallback } from 'react';
import { Node } from './types';
import { toast } from 'sonner';

const HORIZONTAL_SPACING = 200; // Space between parent and child
const VERTICAL_SPACING = 100;   // Space between siblings

export const useNodes = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'root', text: 'Central Topic', x: 400, y: 300, parentId: null, level: 0 }
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const getChildNodes = (parentId: string) => {
    return nodes.filter(node => node.parentId === parentId);
  };

  const calculateNewNodePosition = (parentId: string | null, isSibling: boolean) => {
    if (isSibling && parentId) {
      // For sibling nodes, align vertically with existing siblings
      const siblings = getChildNodes(parentId);
      const parentNode = nodes.find(n => n.id === parentId);
      if (!parentNode) return { x: 0, y: 0 };

      const lastSibling = siblings[siblings.length - 1];
      return {
        x: parentNode.x + HORIZONTAL_SPACING,
        y: lastSibling ? lastSibling.y + VERTICAL_SPACING : parentNode.y
      };
    } else if (!isSibling) {
      // For child nodes, position to the right of parent
      const parent = nodes.find(n => n.id === parentId);
      if (!parent) return { x: 0, y: 0 };

      const existingChildren = getChildNodes(parent.id);
      return {
        x: parent.x + HORIZONTAL_SPACING,
        y: existingChildren.length > 0 
          ? existingChildren[existingChildren.length - 1].y + VERTICAL_SPACING 
          : parent.y
      };
    }

    // Default position for root nodes
    return { x: 400, y: 300 };
  };

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes];
      const nodeIndex = updatedNodes.findIndex(n => n.id === id);
      if (nodeIndex === -1) return prevNodes;

      // Update the dragged node position
      updatedNodes[nodeIndex] = { ...updatedNodes[nodeIndex], x, y };

      return updatedNodes;
    });
  };

  const addChildNode = (parentId: string) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    const position = calculateNewNodePosition(parentId, false);
    const newNode = {
      id: `node-${Date.now()}`,
      text: 'New Branch',
      x: position.x,
      y: position.y,
      parentId: parentId,
      level: parentNode.level + 1
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
    toast.success('New branch added!');
  };

  const addSiblingNode = (currentNodeId: string) => {
    const currentNode = nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return;

    const position = calculateNewNodePosition(currentNode.parentId, true);
    const newNode = {
      id: `node-${Date.now()}`,
      text: 'New Branch',
      x: position.x,
      y: position.y,
      parentId: currentNode.parentId,
      level: currentNode.level
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
    toast.success('New sibling added!');
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!selectedNode) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      addChildNode(selectedNode);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      addSiblingNode(selectedNode);
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