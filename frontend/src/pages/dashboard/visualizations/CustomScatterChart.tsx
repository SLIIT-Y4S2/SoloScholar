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

interface CustomScatterChartProps {
  dotColor?: string;
  xLabel?: string;
  yLabel?: string;
}

const CustomScatterChart = (props: CustomScatterChartProps) => {
  const { dotColor, xLabel, yLabel } = props;
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
          name="A school"
          data={
            data && data.visualizationChoice === "Bar Chart"
              ? data.formattedData
              : previewData
          }
          fill={dotColor ? dotColor : "#8884d8"}
        />
        <XAxis dataKey="xValue" name={xLabel ? xLabel : "X Label"}>
          <Label
            value={xLabel ? xLabel : "X Label"}
            position="bottom"
            offset={-5}
          />
        </XAxis>
        <YAxis dataKey="yValue" name={yLabel ? yLabel : "Y Label"}>
          <Label
            value={yLabel ? yLabel : "Y Label"}
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
