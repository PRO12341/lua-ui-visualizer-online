
export interface UDim2 {
  X: { Scale: number; Offset: number };
  Y: { Scale: number; Offset: number };
}

export interface Color3 {
  R: number;
  G: number;
  B: number;
}

export interface GuiElement {
  Type: 'Frame' | 'TextLabel' | 'TextButton' | 'ImageLabel' | 'ImageButton' | 'ScrollingFrame';
  Name?: string;
  Size?: UDim2;
  Position?: UDim2;
  BackgroundColor3?: Color3;
  BorderSizePixel?: number;
  Text?: string;
  TextColor3?: Color3;
  TextSize?: number;
  Image?: string;
  CornerRadius?: number;
  children?: GuiElement[];
}
