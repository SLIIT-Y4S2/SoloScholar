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

const CustomSimpleBarChartLecture = (props: {
  chartData: {
    preAssessmentParticipationRate: number;
    preAssessmentScorePercentageAvg: number;
    postAssessmentParticipationRate: number;
    postAssessmentScorePercentageAvg: number;
  };
}) => {
  const { chartData } = props;
  const data = [
    {
      name: "Pre-Assessment",
      avgParticipation: chartData?.preAssessmentParticipationRate,
      avgScore: chartData?.preAssessmentScorePercentageAvg,
    },
    {
      name: "Post Assessment",
      avgParticipation: chartData?.postAssessmentParticipationRate,
      avgScore: chartData?.postAssessmentScorePercentageAvg,
    },
  ];

  return (
    <ResponsiveContainer height={300}>
      <BarChart
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
          >
            Percentage (%)
          </Label>
        </YAxis>
        <Tooltip />
        <Bar dataKey="avgParticipation" fill="#0088FE" />
        <Bar dataKey="avgScore" fill="#4CAF50" />
        <Legend
          payload={[
            { value: "Participation (%)", type: "square", color: "#0088FE" },
            {
              value: "Score (%)",
              type: "square",
              color: "#4CAF50",
            },
          ]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomSimpleBarChartLecture;
