export type ElementBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ElementRegistration = { bounds: ElementBounds; clickable: boolean };
