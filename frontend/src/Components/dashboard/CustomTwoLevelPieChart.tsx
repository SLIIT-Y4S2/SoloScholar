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

const MAIN_COLORS: string[] = ["#4CAF50", "#FF0000", "#0088FE"];
const SUB_COLORS: string[] = ["#9C27B0", "#FF7F50"];

const CustomTwoLevelPieChart = (props: {
  chartData: {
    totalQuestionAttemptPercentage: number;
    mcqQuestionAttemptPercentage: number;
    mcqUnAttemptedPercentage: number;
    shortAnswerQuestionAttemptPercentage: number;
    shortAnswerQuestionUnattemptedPercentage: number;
    totalCorrectShortAnswerQuestionPercentage: number;
    totalIncorrectShortAnswerQuestionPercentage: number;
    totalUnansweredShortAnswerQuestionPercentage: number;
    shortAnswerHintViewedPercentage: {
      correct: number;
      incorrect: number;
      unanswered: number;
    };
  };
}) => {
  const { chartData } = props;

  // Total attempted and non-attempted questions (both mcq and short-answer)
  const allQuestions = [
    {
      name: "Attempted (%)",
      value: chartData?.totalQuestionAttemptPercentage,
    },
    {
      name: "Unattempted (%)",
      value: 100 - chartData?.totalQuestionAttemptPercentage,
    },
  ];

  const questionTypesAttempted = [
    {
      name: "MCQ (%)",
      value: chartData?.mcqQuestionAttemptPercentage, // Attempted
    },
    {
      name: "Short-Answer (%)",
      value: chartData?.shortAnswerQuestionAttemptPercentage, // Attempted
    },
  ];

  const questionTypesUnattempted = [
    {
      name: "MCQ (%)",
      value: chartData?.mcqUnAttemptedPercentage, // Unattempted
    },
    {
      name: "Short-Answer (%)",
      value: chartData?.shortAnswerQuestionUnattemptedPercentage, // Unattempted
    },
  ];

  const shortAnswerQuestions = [
    {
      name: "Correct (%)",
      value: chartData?.totalCorrectShortAnswerQuestionPercentage,
    },
    {
      name: "Incorrect (%)",
      value: chartData?.totalIncorrectShortAnswerQuestionPercentage,
    },
    {
      name: "Unanswered (%)",
      value: chartData?.totalUnansweredShortAnswerQuestionPercentage,
    },
  ];

  const correctShortAnswerQuestionHints = [
    {
      name: "Viewed (%)",
      value: chartData?.shortAnswerHintViewedPercentage.correct,
    },
    {
      name: "Not viewed (%)",
      value: 100 - chartData?.shortAnswerHintViewedPercentage.correct,
    },
  ];

  const incorrectShortAnswerQuestionHints = [
    {
      name: "Viewed (%)",
      value: chartData?.shortAnswerHintViewedPercentage.incorrect,
    },
    {
      name: "Not viewed (%)",
      value: 100 - chartData?.shortAnswerHintViewedPercentage.incorrect,
    },
  ];

  const unansweredShortAnswerQuestionHints = [
    {
      name: "Viewed (%)",
      value: chartData?.shortAnswerHintViewedPercentage.unanswered,
    },
    {
      name: "Not viewed (%)",
      value: 100 - chartData?.shortAnswerHintViewedPercentage.unanswered,
    },
  ];

  return (
    <div className="flex justify-between">
      <div>
        <Text>Total Question Attempt Distribution</Text>
        <ResponsiveContainer height={400} width={400}>
          <PieChart width={400} height={400}>
            <Pie
              data={allQuestions}
              dataKey="value"
              cx={200}
              cy={200}
              outerRadius={60}
            >
              {allQuestions.map((_, index) => (
                <Cell fill={MAIN_COLORS[index % MAIN_COLORS.length]} />
              ))}
            </Pie>

            <Pie
              data={questionTypesAttempted}
              dataKey="value"
              cx={200}
              cy={200}
              innerRadius={70}
              outerRadius={90}
              startAngle={0}
              endAngle={360 * (chartData?.totalQuestionAttemptPercentage / 100)}
            >
              {questionTypesAttempted.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SUB_COLORS[index % SUB_COLORS.length]}
                />
              ))}
            </Pie>

            <Pie
              data={questionTypesUnattempted}
              dataKey="value"
              cx={200}
              cy={200}
              innerRadius={70}
              outerRadius={90}
              startAngle={
                360 * (chartData?.totalQuestionAttemptPercentage / 100)
              }
            >
              {questionTypesUnattempted.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SUB_COLORS[index % SUB_COLORS.length]}
                />
              ))}
            </Pie>
            <Legend
              payload={[
                {
                  value: "Attempted (%)",
                  type: "square",
                  color: MAIN_COLORS[0],
                },
                {
                  value: "Unattempted (%)",
                  type: "square",
                  color: MAIN_COLORS[1],
                },
                { value: "MCQ (%)", type: "square", color: SUB_COLORS[0] },
                {
                  value: "Short-Answer (%)",
                  type: "square",
                  color: SUB_COLORS[1],
                },
              ]}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Hint View Distribution */}
      <div>
        <Text>Total Hint Distribution in Short-Answer Questions</Text>
        <ResponsiveContainer height={400} width={400}>
          <PieChart width={400} height={400}>
            <Pie
              data={shortAnswerQuestions}
              dataKey="value"
              cx={200}
              cy={200}
              outerRadius={60}
            >
              {shortAnswerQuestions.map((_, index) => (
                <Cell fill={MAIN_COLORS[index % MAIN_COLORS.length]} />
              ))}
            </Pie>

            <Pie
              data={correctShortAnswerQuestionHints}
              dataKey="value"
              cx={200}
              cy={200}
              innerRadius={70}
              outerRadius={90}
              startAngle={0}
              endAngle={
                360 *
                (chartData?.totalCorrectShortAnswerQuestionPercentage / 100)
              }
            >
              {correctShortAnswerQuestionHints.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SUB_COLORS[index % SUB_COLORS.length]}
                />
              ))}
            </Pie>

            <Pie
              data={incorrectShortAnswerQuestionHints}
              dataKey="value"
              cx={200}
              cy={200}
              innerRadius={70}
              outerRadius={90}
              startAngle={
                360 *
                (chartData?.totalCorrectShortAnswerQuestionPercentage / 100)
              }
              endAngle={
                360 *
                  (chartData?.totalCorrectShortAnswerQuestionPercentage / 100) +
                360 *
                  (chartData?.totalIncorrectShortAnswerQuestionPercentage / 100)
              }
            >
              {incorrectShortAnswerQuestionHints.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SUB_COLORS[index % SUB_COLORS.length]}
                />
              ))}
            </Pie>

            <Pie
              data={unansweredShortAnswerQuestionHints}
              dataKey="value"
              cx={200}
              cy={200}
              innerRadius={70}
              outerRadius={90}
              startAngle={
                360 *
                  (chartData?.totalCorrectShortAnswerQuestionPercentage / 100) +
                360 *
                  (chartData?.totalIncorrectShortAnswerQuestionPercentage / 100)
              }
            >
              {unansweredShortAnswerQuestionHints.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SUB_COLORS[index % SUB_COLORS.length]}
                />
              ))}
            </Pie>
            <Legend
              payload={[
                { value: "Correct (%)", type: "square", color: MAIN_COLORS[0] },
                {
                  value: "Incorrect (%)",
                  type: "square",
                  color: MAIN_COLORS[1],
                },
                {
                  value: "Unanswered (%)",
                  type: "square",
                  color: MAIN_COLORS[2],
                },
                {
                  value: "Hint Viewed (%)",
                  type: "square",
                  color: SUB_COLORS[0],
                },
                {
                  value: "Hint Not Viewed (%)",
                  type: "square",
                  color: SUB_COLORS[1],
                },
              ]}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomTwoLevelPieChart;
