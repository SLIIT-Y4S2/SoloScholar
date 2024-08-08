/**
 * This file contains the data for data visualization previews.
 */

import type { TableColumnsType } from "antd";

interface PreviewData {
  xValue: number | string | boolean;
  yValue: number | string | boolean;
}

interface PieChartPreviewData {
  name: number | string | boolean;
  value: number | string | boolean;
}

export const pieChartPreviewData: PieChartPreviewData[] = [
  { name: "A", value: 2400 },
  { name: "B", value: 4567 },
  { name: "C", value: 1398 },
  { name: "D", value: 9800 },
  { name: "E", value: 3908 },
  { name: "F", value: 4800 },
];

export const tablePreviewColumns: TableColumnsType<any> = [
  {
    title: "Column 1",
    dataIndex: "column1",
  },
  {
    title: "Column 2",
    dataIndex: "column2",
  },
];

export const tablePreviewData: any[] = [
  {
    column1: "John Brown",
    column2: 32,
  },
  {
    column1: "Jim Green",
    column2: 42,
  },
  {
    column1: "Joe Black",
    column2: 32,
  },
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
