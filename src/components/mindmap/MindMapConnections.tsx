import React from 'react';
import { Node } from './types';

interface Props {
  nodes: Node[];
}

export const MindMapConnections: React.FC<Props> = ({ nodes }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {nodes.map(node => {
        if (!node.parentId) return null;
        const parent = nodes.find(n => n.id === node.parentId);
        if (!parent) return null;

        const startX = parent.x;
        const startY = parent.y;
        const endX = node.x;
        const endY = node.y;

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
      })}
    </svg>
  );
};