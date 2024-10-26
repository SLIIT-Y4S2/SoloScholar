import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomSimpleBarChartLab = (props: {
  chartData: {
    correctAnswerPercentage: number;
    incorrectAnswerPercentage: number;
    unansweredPercentage: number;
  };
}) => {
  const { chartData } = props;
  const data = [
    {
      name: "Problem-Solving Exercises",
      correct: chartData?.correctAnswerPercentage,
      incorrect: chartData?.incorrectAnswerPercentage,
      unanswered: chartData?.unansweredPercentage,
    },
  ];

  return (
    <ResponsiveContainer height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis>
          <Label
            angle={-90}
            offset={0}
            style={{ textAnchor: "middle" }}
            value="Percentage (%)"
            position="left"
          />
        </YAxis>
        <Tooltip />
        <Bar dataKey="correct" fill="#4CAF50" />
        <Bar dataKey="incorrect" fill="#FF0000" />
        <Bar dataKey="unanswered" fill="#0088FE" />
        <Legend
          payload={[
            { value: "Correct", type: "square", color: "#4CAF50" },
            {
              value: "Incorrect",
              type: "square",
              color: "#FF0000",
            },
            {
              value: "Unanswered",
              type: "square",
              color: "#0088FE",
            },
          ]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomSimpleBarChartLab;
