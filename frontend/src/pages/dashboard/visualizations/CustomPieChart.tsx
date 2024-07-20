import { Tooltip, ResponsiveContainer, Pie, PieChart } from "recharts";
import { DashboardContext } from "../../../provider/DashboardContext";
import { pieChartPreviewData } from "../../../utils/data_visualization_preview_data";
import { useContext } from "react";

interface CustomPieChartProps {
  pieColor?: string;
}

const CustomPieChart = (props: CustomPieChartProps) => {
  const { pieColor } = props;
  const { data } = useContext(DashboardContext);

  return (
    <ResponsiveContainer
      height={250}
      className="
    pt-[10px] pb-[10px]
    border-[#eee] rounded-[5px] border-[2px]"
    >
      <PieChart>
        <Tooltip />
        <Pie
          className="rounded-[5px] border-[#eee]"
          dataKey="value"
          isAnimationActive={true}
          data={
            data && data.visualizationChoice === "Pie Chart"
              ? data.formattedData
              : pieChartPreviewData
          }
          outerRadius={100}
          fill={pieColor ? pieColor : "#8884d8"}
          label
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
