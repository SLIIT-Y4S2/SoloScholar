import CustomBarChart from "../pages/dashboard/visualizations/CustomBarChart";
import CustomLineChart from "../pages/dashboard/visualizations/CustomLineChart";
import CustomPieChart from "../pages/dashboard/visualizations/CustomPieChart";

export interface VisualizationChoice {
  value: string;
  label: JSX.Element;
  visualization: JSX.Element;
}

export const visualizationChoices: VisualizationChoice[] = [
  {
    value: "Bar Chart",
    label: <span>Bar Chart</span>,
    visualization: <CustomBarChart />,
  },
  {
    value: "Pie Chart",
    label: <span>Pie Chart</span>,
    visualization: <CustomPieChart />,
  },
  {
    value: "Line Chart",
    label: <span>Line Chart</span>,
    visualization: <CustomLineChart />,
  },
  {
    value: "Dougnout Chart",
    label: <span>Dougnout Chart</span>,
    visualization: <p>saaaaaaaaaa</p>,
  },
];
