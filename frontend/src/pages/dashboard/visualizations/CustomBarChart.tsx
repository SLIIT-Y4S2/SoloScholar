import { useContext } from "react";
import { DashboardContext } from "../../../provider/DashboardContext";
import { previewData } from "../../../utils/data_visualization_preview_data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Rectangle,
} from "recharts";

const CustomBarChart = (props: { barColor?: string }) => {
  const { barColor } = props;
  const { data } = useContext(DashboardContext);

  return (
    <ResponsiveContainer
      height={200}
      className="
    pt-[10px] pb-[10px]
    border-[#eee] rounded-[5px] border-[2px]"
    >
      <BarChart
        data={
          data && data.visualizationChoice === "Bar Chart"
            ? data.formattedData.values
            : previewData
        }
      >
        <CartesianGrid className="stroke-[#909090]" strokeDasharray="3 3" />
        <Tooltip />
        <Bar
          type="monotone"
          dataKey="yValue"
          fill={barColor ? barColor : "#8884d8"}
          activeBar={<Rectangle />}
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
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;