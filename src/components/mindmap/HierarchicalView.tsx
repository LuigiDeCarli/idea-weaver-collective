import React from 'react';
import { HierarchicalNode } from './types';

interface Props {
  nodes: HierarchicalNode[];
}

export const HierarchicalView: React.FC<Props> = ({ nodes }) => {
  const renderNode = (node: HierarchicalNode) => {
    const indent = '    '.repeat(node.level);
    
    return (
      <div key={node.id}>
        <pre className="font-mono text-sm">
          {indent}{node.text}
        </pre>
        {node.children.map(child => renderNode(child))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-[60vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Hierarchical View</h3>
      <div className="font-mono text-sm">
        {nodes.map(node => renderNode(node))}
      </div>
    </div>
  );
};