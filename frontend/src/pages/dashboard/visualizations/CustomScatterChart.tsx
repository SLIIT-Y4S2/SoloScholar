import { useContext } from "react";
import { DashboardContext } from "../../../provider/DashboardContext";
import { previewData } from "../../../utils/data_visualization_preview_data";
import {
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomScatterChart = (props: { dotColor?: string }) => {
  const { dotColor } = props;
  const { data } = useContext(DashboardContext);

  return (
    <ResponsiveContainer
      height={200}
      className="
    pt-[10px] pb-[10px]
    border-[#eee] rounded-[5px] border-[2px]"
    >
      <ScatterChart>
        <CartesianGrid className="stroke-[#909090]" strokeDasharray="3 3" />
        <Tooltip />
        <Scatter
          data={
            data && data.visualizationChoice === "Scatter Chart"
              ? data.formattedData.values
              : previewData
          }
          fill={dotColor ? dotColor : "#8884d8"}
        />
        <XAxis
          dataKey="xValue"
          name={
            data?.formattedData.xLabel ? data?.formattedData.xLabel : "X Label"
          }
        >
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
        <YAxis
          dataKey="yValue"
          name={
            data?.formattedData.YLabel ? data?.formattedData.YLabel : "Y Label"
          }
        >
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
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CustomScatterChart;
