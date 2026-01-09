
export enum LayerType {
  EXTERNAL = 'external',
  INTERNAL = 'internal'
}

export interface CalculationInputs {
  current: number;
  tempRise: number;
  thicknessOz: number;
  layer: LayerType;
}

export interface CalculationResults {
  widthMils: number;
  widthMm: number;
  areaSqMils: number;
  thicknessMils: number;
}
