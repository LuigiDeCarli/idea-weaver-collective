import { useState, useCallback } from 'react';
import { Node } from './types';
import { toast } from 'sonner';

const HORIZONTAL_SPACING = 200;
const VERTICAL_SPACING = 100;

export const useNodes = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'root', text: 'Central Topic', x: 400, y: 300, parentId: null, level: 0 }
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const getChildNodes = (parentId: string) => {
    return nodes.filter(node => node.parentId === parentId);
  };

  const calculateNodePosition = (parentId: string | null, isSibling: boolean) => {
    if (!parentId) {
      return { x: 400, y: 300 };
    }

    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return { x: 400, y: 300 };

    const siblings = getChildNodes(parentId);
    
    if (isSibling && parentNode.parentId !== null) {
      // For sibling nodes (same level as current node)
      const parentSiblings = getChildNodes(parentNode.parentId);
      return {
        x: parentNode.x,
        y: parentNode.y + VERTICAL_SPACING * (parentSiblings.length + 1)
      };
    } else {
      // For child nodes (one level deeper)
      return {
        x: parentNode.x + HORIZONTAL_SPACING,
        y: siblings.length > 0 
          ? siblings[siblings.length - 1].y + VERTICAL_SPACING
          : parentNode.y
      };
    }
  };

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node => {
        if (node.id === id) {
          return { ...node, x, y };
        }
        return node;
      });
      return updatedNodes;
    });
  };

  const addChildNode = (parentId: string) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    const position = calculateNodePosition(parentId, false);
    const newNode = {
      id: `node-${Date.now()}`,
      text: 'New Topic',
      x: position.x,
      y: position.y,
      parentId: parentId,
      level: parentNode.level + 1
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
    toast.success('New child topic added!');
  };

  const addSiblingNode = (currentNodeId: string) => {
    const currentNode = nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return;

    const position = calculateNodePosition(currentNode.parentId, true);
    const newNode = {
      id: `node-${Date.now()}`,
      text: 'New Topic',
      x: position.x,
      y: position.y,
      parentId: currentNode.parentId,
      level: currentNode.level
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
    toast.success('New sibling topic added!');
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
  }, [selectedNode]);

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