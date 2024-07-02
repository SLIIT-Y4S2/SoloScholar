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

const previewData = [
  {
    xValue: "x1",
    yValue: 70,
  },
  {
    xValue: "x2",
    yValue: 100,
  },
  {
    xValue: "x1",
    yValue: 40,
  },
  {
    xValue: "x2",
    yValue: 100,
  },
  {
    xValue: "x1",
    yValue: 10,
  },
];

const CustomLineChart = (props: CustomLineChartProps) => {
  const { data, lineColor, xLabel, yLabel } = props;
  return (
    <ResponsiveContainer height={100}>
      <LineChart data={data ? data : previewData}>
        <CartesianGrid className="stroke-[#eee]" />
        <Label
          value="X Label"
          offset={0}
          position="insideBottomLeft"
          angle={-90}
        >
          Y Label
        </Label>
        <Line
          type="monotone"
          dataKey="yValue"
          stroke={lineColor ? lineColor : "#8884d8"}
          activeDot={{ r: 6 }}
        />
        <Tooltip />
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
        <CartesianGrid />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
