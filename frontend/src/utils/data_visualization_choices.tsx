import CustomAreaChart from "../Components/dashboard/CustomAreaChart";
import CustomBarChart from "../Components/dashboard/CustomBarChart";
import CustomLineChart from "../Components/dashboard/CustomLineChart";
import CustomPieChart from "../Components/dashboard/CustomPieChart";
import CustomScatterChart from "../Components/dashboard/CustomScatterChart";
import CustomTable from "../Components/dashboard/CustomTable";
import { VisualizationChoice } from "../types/dashboard.types";

export const visualizationChoices: VisualizationChoice[] = [
  {
    value: "Bar Chart",
    label: <span>Bar Chart</span>,
  },
  {
    value: "Pie Chart",
    label: <span>Pie Chart</span>,
  },
  {
    value: "Line Chart",
    label: <span>Line Chart</span>,
  },
  {
    value: "Area Chart",
    label: <span>Area Chart</span>,
  },
  {
    value: "Scatter Chart",
    label: <span>Scatter Chart</span>,
  },
  {
    value: "Table",
    label: <span>Table</span>,
  },
];

/**
 *Function to get the visualization based on the visualization choice. This is used in "MyIndicators" component.
 * @param visualizationChoice
 * @param data
 * @returns
 */
export const getVisualization = (
  visualizationChoice: string,
  data: any = null
) => {
  switch (visualizationChoice) {
    case "Bar Chart":
      return <CustomBarChart data={data} />;
    case "Pie Chart":
      return <CustomPieChart data={data} />;
    case "Line Chart":
      return <CustomLineChart data={data} />;
    case "Area Chart":
      return <CustomAreaChart data={data} />;
    case "Scatter Chart":
      return <CustomScatterChart data={data} />;
    case "Table":
      return <CustomTable data={data} />;
    default:
      return null;
  }
};
