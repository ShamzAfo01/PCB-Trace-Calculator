
import { CalculationInputs, CalculationResults, LayerType } from '../types';

export const calculateTraceWidth = (inputs: CalculationInputs): CalculationResults => {
  const { current, tempRise, thicknessOz, layer } = inputs;

  // IPC-2221 Constants
  const k = layer === LayerType.EXTERNAL ? 0.048 : 0.024;
  const b = 0.44;
  const c = 0.725;

  // 1 oz copper = 1.378 mils
  const thicknessMils = thicknessOz * 1.378;

  // Area (square mils) = (I / (k * (dT^b)))^(1/c)
  const areaSqMils = Math.pow(current / (k * Math.pow(tempRise, b)), 1 / c);

  // Width (mils) = Area / Thickness
  const widthMils = areaSqMils / thicknessMils;

  // Conversion factor: 1 mil = 0.0254 mm
  const widthMm = widthMils * 0.0254;

  return {
    widthMils,
    widthMm,
    areaSqMils,
    thicknessMils
  };
};

export const milsToMm = (mils: number) => mils * 0.0254;
export const mmToMils = (mm: number) => mm / 0.0254;
