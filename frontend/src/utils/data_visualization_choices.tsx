import CustomAreaChart from "../pages/dashboard/visualizations/CustomAreaChart";
import CustomBarChart from "../pages/dashboard/visualizations/CustomBarChart";
import CustomLineChart from "../pages/dashboard/visualizations/CustomLineChart";
import CustomPieChart from "../pages/dashboard/visualizations/CustomPieChart";
import CustomScatterChart from "../pages/dashboard/visualizations/CustomScatterChart";
import CustomTable from "../pages/dashboard/visualizations/CustomTable";

export interface VisualizationChoice {
  value: string;
  label: JSX.Element;
}

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
