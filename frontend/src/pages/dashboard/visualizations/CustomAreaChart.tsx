import { useContext } from "react";
import { DashboardContext } from "../../../provider/DashboardContext";
import { previewData } from "../../../utils/data_visualization_preview_data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

interface CustomAreaChartProps {
  areaColor?: string;
  xLabel?: string;
  yLabel?: string;
}

const CustomAreaChart = (props: CustomAreaChartProps) => {
  const { areaColor, xLabel, yLabel } = props;
  const { data } = useContext(DashboardContext);

  return (
    <ResponsiveContainer
      height={200}
      className="
    pt-[10px] pb-[10px]
    border-[#eee] rounded-[5px] border-[2px]"
    >
      <AreaChart
        data={
          data && data.visualizationChoice === "Area Chart"
            ? data.formattedData
            : previewData
        }
      >
        <CartesianGrid className="stroke-[#909090]" strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="yValue"
          stroke={areaColor ? areaColor : "#8884d8"}
          fill={areaColor ? areaColor : "#8884d8"}
        />
        <XAxis dataKey="xValue">
          <Label
            value={xLabel ? xLabel : "X Label"}
            position="bottom"
            offset={-5}
          />
        </XAxis>
        <YAxis dataKey="yValue">
          <Label
            value={yLabel ? yLabel : "Y Label"}
            position="left"
            angle={-90}
            offset={-5}
          />
        </YAxis>
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;
