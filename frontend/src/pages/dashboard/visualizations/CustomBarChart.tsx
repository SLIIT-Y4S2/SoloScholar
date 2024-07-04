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

interface CustomBarChartProps {
  data?: JSON[];
  barColor?: string;
  xLabel?: string;
  yLabel?: string;
}

interface PreviewData {
  xValue: string;
  yValue: number;
}

const previewData: PreviewData[] = [
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

const CustomBarChart = (props: CustomBarChartProps) => {
  const { data, barColor, xLabel, yLabel } = props;
  return (
    <ResponsiveContainer
      height={200}
      className="
    pt-[10px] pb-[10px]
    border-[#eee] rounded-[5px] border-[2px]"
    >
      <BarChart data={data ? data : previewData}>
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
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
