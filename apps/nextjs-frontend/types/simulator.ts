export type SpreadBarItem = {
  label: string;
  value: number;
  widthPercentage: number;
  formattedValue: string;
};

export type SpreadCalculationResult = {
  bars: SpreadBarItem[];
  total: number;
  formattedTotal: string;
  onward: number;
};
