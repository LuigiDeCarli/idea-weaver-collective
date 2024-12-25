import React, { useState, useEffect, useRef } from 'react';
import { Node } from './types';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  node: Node;
  isSelected: boolean;
  isDragged: boolean;
  onSelect: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onAddChild: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export const MindMapNode: React.FC<Props> = ({
  node,
  isSelected,
  isDragged,
  onSelect,
  onTextChange,
  onAddChild,
  onDragStart,
  onDragEnd
}) => {
  const [position, setPosition] = useState({ x: node.x, y: node.y });
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({ x: node.x, y: node.y });
  }, [node.x, node.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      onDragStart(node.id);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPosition({ x: newX, y: newY });
      onTextChange(node.id, node.text);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, node.id, node.text, onTextChange, onDragEnd]);

  return (
    <div
      ref={nodeRef}
      className={`absolute p-4 bg-white rounded-lg shadow-md cursor-move
        ${isSelected ? "ring-2 ring-blue-500" : ""}
        ${isDragged ? "opacity-50" : ""}
        hover:shadow-lg transition-shadow duration-200
        animate-scale-in
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        pointerEvents: 'auto',
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      <input
        type="text"
        value={node.text}
        onChange={(e) => onTextChange(node.id, e.target.value)}
        className="bg-transparent border-none focus:outline-none text-center w-full"
        onClick={(e) => e.stopPropagation()}
      />
      <Button
        size="sm"
        variant="ghost"
        className="absolute -right-3 -bottom-3 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onAddChild(node.id);
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};