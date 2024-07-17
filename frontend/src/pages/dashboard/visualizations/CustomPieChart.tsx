import { Tooltip, ResponsiveContainer, Pie, PieChart } from "recharts";
import { DashboardContext } from "../../../provider/DashboardContext";
import { useContext } from "react";

interface CustomPieChartProps {
  pieColor?: string;
}

interface PreviewData {
  name: string;
  value: number;
}

const previewData: PreviewData[] = [
  { name: "A", value: 2400 },
  { name: "B", value: 4567 },
  { name: "C", value: 1398 },
  { name: "D", value: 9800 },
  { name: "E", value: 3908 },
  { name: "F", value: 4800 },
];

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
              : previewData
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
