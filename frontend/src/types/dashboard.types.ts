export interface CustomMessage {
  type: string;
  content: string;
}
export interface PreviousIndicator {
  indicatorName: string;
  analysisGoal: string;
  visualizationChoice: string;
}
export interface IndicatorState extends PreviousIndicator {
  id: string;
  data: any;
}
export interface VisualizationChoice {
  value: string;
  label: JSX.Element;
}
export interface PreviewData {
  xLabel: number | string;
  yLabel: number | string;
  values: {
    xValue: number | string | boolean;
    yValue: number | string | boolean;
  }[];
}

export interface PieChartPreviewData {
  values: {
    name: number | string | boolean;
    value: number | string | boolean;
  }[];
}
export interface TablePreviewData {
  tableColumns: {
    title: number | string | boolean;
    dataIndex: number | string | boolean;
  }[];
  tableData: {
    column1: number | string | boolean;
    column2: number | string | boolean;
  }[];
}
