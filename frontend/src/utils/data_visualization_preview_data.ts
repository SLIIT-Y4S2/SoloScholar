/**
 * This file contains the data for data visualization previews.
 */

interface PreviewData {
  xValue: number | string;
  yValue: number | string;
}

interface PieChartPreviewData {
  name: number | string;
  value: number | string;
}

export const pieChartPreviewData: PieChartPreviewData[] = [
  { name: "A", value: 2400 },
  { name: "B", value: 4567 },
  { name: "C", value: 1398 },
  { name: "D", value: 9800 },
  { name: "E", value: 3908 },
  { name: "F", value: 4800 },
];

export const previewData: PreviewData[] = [
  {
    xValue: "x1",
    yValue: 70,
  },
  {
    xValue: "x2",
    yValue: 100,
  },
  {
    xValue: "x1",
    yValue: 40,
  },
  {
    xValue: "x2",
    yValue: 100,
  },
  {
    xValue: "x1",
    yValue: 10,
  },
];
