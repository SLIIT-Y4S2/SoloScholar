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

// props: {
//     name: string;
//     correct: number;
//     incorrect: number;
//     unanswered: number;
//   }
const CustomStackedBarChart = (props: {
  chartData: {
    correctMcqAvg: number;
    incorrectMcqAvg: number;
    correctShortAnswerQuestionAvg: number;
    incorrectShortAnswerQuestionAvg: number;
    unansweredMcqAvg: number;
    unansweredShortAnswerQuestionAvg: number;
  };
}) => {
  const { chartData } = props;
  const data = [
    {
      name: "MCQs",
      correct: chartData?.correctMcqAvg,
      incorrect: chartData?.incorrectMcqAvg,
      unanswered: chartData?.unansweredMcqAvg,
    },
    {
      name: "Short Answer Questions",
      correct: chartData?.correctShortAnswerQuestionAvg,
      incorrect: chartData?.incorrectShortAnswerQuestionAvg,
      unanswered: chartData?.unansweredShortAnswerQuestionAvg,
    },
  ];

  return (
    <ResponsiveContainer height="80%">
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
            value="Average &nbsp;Percentage (%)"
            position="left"
          />
        </YAxis>
        <Tooltip />
        <Legend />
        <Bar label="correct" dataKey="correct" stackId="a" fill="#08c938" />
        <Bar dataKey="incorrect" stackId="a" fill="#c90808" />
        <Bar dataKey="unanswered" stackId="a" fill="#0694cc" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomStackedBarChart;
