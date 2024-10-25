import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const CustomStackedBarChart = (props: {
  chartData: {
    correctMcqPercentage: number;
    incorrectMcqPercentage: number;
    correctShortAnswerQuestionPercentage: number;
    incorrectShortAnswerQuestionPercentage: number;
    unansweredMcqPercentage: number;
    unansweredShortAnswerQuestionPercentage: number;
  };
}) => {
  const { chartData } = props;
  const data = [
    {
      name: "MCQs",
      correct: chartData?.correctMcqPercentage,
      incorrect: chartData?.incorrectMcqPercentage,
      unanswered: chartData?.unansweredMcqPercentage,
    },
    {
      name: "Short Answer Questions",
      correct: chartData?.correctShortAnswerQuestionPercentage,
      incorrect: chartData?.incorrectShortAnswerQuestionPercentage,
      unanswered: chartData?.unansweredShortAnswerQuestionPercentage,
    },
  ];

  return (
    <ResponsiveContainer height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
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
        <Legend
          payload={[
            { value: "Correct", type: "square", color: "#4CAF50 " },
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
        <Bar label="Correct" dataKey="correct" stackId="a" fill="#4CAF50" />
        <Bar dataKey="incorrect" stackId="a" fill="#FF0000" />
        <Bar dataKey="unanswered" stackId="a" fill="#0088FE" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomStackedBarChart;
