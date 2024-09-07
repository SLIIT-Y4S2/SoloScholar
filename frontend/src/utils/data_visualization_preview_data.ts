/**
 * This file contains the data for data visualization previews.
 */
import {
  PieChartPreviewData,
  PreviewData,
  TablePreviewData,
} from "../types/dashboard.types";

export const pieChartPreviewData: PieChartPreviewData = {
  values: [
    { name: "A", value: 2400 },
    { name: "B", value: 4567 },
    { name: "C", value: 1398 },
    { name: "D", value: 9800 },
    { name: "E", value: 3908 },
    { name: "F", value: 4800 },
  ],
};

export const tablePreviewData: TablePreviewData = {
  tableColumns: [
    {
      title: "Column 1",
      dataIndex: "column1",
    },
    {
      title: "Column 2",
      dataIndex: "column2",
    },
  ],
  tableData: [
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
  ],
};

export const previewData: PreviewData = {
  xLabel: "X Label",
  yLabel: "Y Label",
  values: [
    {
      xValue: "x1",
      yValue: 70,
    },
    {
      xValue: "x2",
      yValue: 100,
    },
    {
      xValue: "x3",
      yValue: 40,
    },
    {
      xValue: "x4",
      yValue: 100,
    },
    {
      xValue: "x5",
      yValue: 10,
    },
  ],
};
