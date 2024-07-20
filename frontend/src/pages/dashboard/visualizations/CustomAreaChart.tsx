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

const CustomAreaChart = (props: { areaColor?: string }) => {
  const { areaColor } = props;
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
            ? data.formattedData.values
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
            value={
              data?.formattedData.xLabel
                ? data?.formattedData.xLabel
                : "X Label"
            }
            position="bottom"
            offset={-5}
          />
        </XAxis>
        <YAxis dataKey="yValue">
          <Label
            value={
              data?.formattedData.yLabel
                ? data?.formattedData.yLabel
                : "Y Label"
            }
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
