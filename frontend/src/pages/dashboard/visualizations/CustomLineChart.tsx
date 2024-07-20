import { previewData } from "../../../utils/data_visualization_preview_data";
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

interface CustomLineChartProps {
  data?: JSON[];
  lineColor?: string;
  xLabel?: string;
  yLabel?: string;
}

const CustomLineChart = (props: CustomLineChartProps) => {
  const { data, lineColor, xLabel, yLabel } = props;
  return (
    <ResponsiveContainer
      height={200}
      className="
      pt-[10px] pb-[10px]
      border-[#eee] rounded-[5px] border-[2px]"
    >
      <LineChart data={data ? data : previewData}>
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
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
