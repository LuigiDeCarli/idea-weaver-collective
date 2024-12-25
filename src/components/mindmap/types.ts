export interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  parentId: string | null;
  level: number;
  index?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface ViewportState {
  offset: Position;
  scale: number;
}

export interface DragState {
  isDragging: boolean;
  offset: Position;
}

export interface HierarchicalNode {
  id: string;
  text: string;
  level: number;
  children: HierarchicalNode[];
}