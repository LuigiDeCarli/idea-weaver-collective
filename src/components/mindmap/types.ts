export interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  parentId: string | null;
  level: number;
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