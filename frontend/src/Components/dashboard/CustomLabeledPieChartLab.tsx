import { Typography } from "antd";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const { Text } = Typography;

const COLORS = ["#4CAF50", "#FF0000"];
const SUB_COLORS = ["#4CAF50", "#9E9E9E"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomLabeledPieChartLab = (props: {
  chartData: {
    totalCorrectAnswerCount: number;
    correctAnswerReflectionPercentage: number;
    totalFeedbackEnabledLabsheetPercentage: number;
  };
}) => {
  const { chartData } = props;
  const data = [
    {
      name: "Reflections Submitted (%)",
      value: chartData?.correctAnswerReflectionPercentage,
    },
    {
      name: "Reflections Not Submitted (%)",
      value: 100 - chartData?.correctAnswerReflectionPercentage,
    },
  ];

  const feedbackEnabledLabData = [
    {
      name: "Feedback Enabled (%)",
      value: chartData?.totalFeedbackEnabledLabsheetPercentage,
    },
    {
      name: "Feedback Disabled (%)",
      value: 100 - chartData?.totalFeedbackEnabledLabsheetPercentage,
    },
  ];

  return (
    <div className="flex justify-center gap-36">
      <center>
        <div className="w-[250px]">
          <Text>Total Student Reflection Distribution</Text>
          <ResponsiveContainer height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index + 1}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </center>
      <center>
        <div className="w-[250px]">
          <Text>Labsheet Types Distribution</Text>
          <ResponsiveContainer height={300}>
            <PieChart>
              <Pie
                data={feedbackEnabledLabData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {feedbackEnabledLabData.map((_, index) => (
                  <Cell
                    key={`cell-${index + 1}`}
                    fill={SUB_COLORS[index % SUB_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </center>
    </div>
  );
};

export default CustomLabeledPieChartLab;
