import { previewData } from "../../../utils/data_visualization_preview_data";
import { useContext } from "react";
import { DashboardContext } from "../../../provider/DashboardContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const CustomLineChart = (props: { lineColor?: string }) => {
  const { lineColor } = props;
  const { data } = useContext(DashboardContext);

  return (
    <ResponsiveContainer
      height={200}
      className="
      pt-[10px] pb-[10px]
      border-[#eee] rounded-[5px] border-[2px]"
    >
      <LineChart
        data={
          data && data.visualizationChoice === "Line Chart"
            ? data.formattedData.values
            : previewData
        }
      >
        <CartesianGrid className="stroke-[#909090]" strokeDasharray="3 3" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="yValue"
          stroke={lineColor ? lineColor : "#8884d8"}
          activeDot={{ r: 6 }}
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
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
