export interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  parentId: string | null;
  children?: string[];
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