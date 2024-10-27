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

const CustomScatterChartLab = (props: {
  chartData: {
    questionAttemptCount: number;
    averageHintViews: number;
  }[];
}) => {
  const { chartData } = props;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="questionAttemptCount">
          <Label
            angle={0}
            offset={0}
            style={{ textAnchor: "middle" }}
            value="No.of Attempts per Question"
            position="insideBottom"
          />
        </XAxis>

        <YAxis type="number" dataKey="averageHintViews">
          <Label
            angle={-90}
            offset={0}
            style={{ textAnchor: "middle" }}
            value="Average Hint Views"
            position="insideLeft"
          />
        </YAxis>
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const { questionAttemptCount, averageHintViews } =
                payload[0].payload;
              return (
                <ul className="bg-white border-black border-[1px] shadow-sm p-4">
                  <p>No.of Attempts: {questionAttemptCount}</p>
                  <p>Average Hint Views: {averageHintViews}</p>
                  <p>
                    No.of Questions:{" "}
                    {
                      chartData.filter(
                        (d) =>
                          d.questionAttemptCount === questionAttemptCount &&
                          d.averageHintViews === averageHintViews
                      ).length
                    }
                  </p>
                </ul>
              );
            }
            return null;
          }}
        />
        <Scatter data={chartData} fill="#DAA520" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CustomScatterChartLab;
