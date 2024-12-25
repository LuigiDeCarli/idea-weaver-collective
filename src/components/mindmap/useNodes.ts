import { useState, useCallback } from 'react';
import { Node, HierarchicalNode } from './types';
import { toast } from 'sonner';

const HORIZONTAL_SPACING = 200;
const VERTICAL_SPACING = 80;

export const useNodes = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'root', text: 'Central Topic', x: 400, y: 300, parentId: null, level: 0, index: 0 }
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const getChildNodes = (parentId: string | null) => {
    return nodes.filter(node => node.parentId === parentId);
  };

  const calculateNodePosition = (parentId: string | null, isChild: boolean) => {
    if (!parentId) {
      return { x: 400, y: 300 };
    }

    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return { x: 400, y: 300 };

    const siblings = getChildNodes(parentId);
    const siblingCount = siblings.length;

    if (isChild) {
      return {
        x: parentNode.x + HORIZONTAL_SPACING,
        y: parentNode.y + (siblingCount * VERTICAL_SPACING)
      };
    } else {
      const lastSibling = siblings[siblingCount - 1];
      return {
        x: parentNode.x,
        y: lastSibling ? lastSibling.y + VERTICAL_SPACING : parentNode.y + VERTICAL_SPACING
      };
    }
  };

  const addChildNode = (parentId: string) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    const position = calculateNodePosition(parentId, true);
    const siblings = getChildNodes(parentId);
    
    const newNode = {
      id: `node-${Date.now()}`,
      text: 'New Topic',
      x: position.x,
      y: position.y,
      parentId: parentId,
      level: parentNode.level + 1,
      index: siblings.length
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
    toast.success('New child topic added!');
  };

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    setDraggedNode(id);
  };

  const handleDrag = (id: string, x: number, y: number) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === id ? { ...node, x, y } : node
      )
    );
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
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
        const position = calculateNodePosition(currentNode.parentId, false);
        const siblings = getChildNodes(currentNode.parentId);
        
        const newNode = {
          id: `node-${Date.now()}`,
          text: 'New Topic',
          x: position.x,
          y: position.y,
          parentId: currentNode.parentId,
          level: currentNode.level,
          index: siblings.length
        };

        setNodes(prev => [...prev, newNode]);
        setSelectedNode(newNode.id);
        toast.success('New sibling topic added!');
      }
    }
  }, [selectedNode, nodes]);

  const buildHierarchy = (parentId: string | null = null, level: number = 0): HierarchicalNode[] => {
    return nodes
      .filter(node => node.parentId === parentId)
      .sort((a, b) => (a.index || 0) - (b.index || 0))
      .map(node => ({
        id: node.id,
        text: node.text,
        level,
        children: buildHierarchy(node.id, level + 1)
      }));
  };

  return {
    nodes,
    selectedNode,
    draggedNode,
    setSelectedNode,
    setDraggedNode,
    updateNodePosition: handleDrag,
    addChildNode,
    handleKeyPress,
    buildHierarchy,
    handleDragStart,
    handleDrag,
    handleDragEnd
  };
};