import { Fragment, useContext, useState } from "react";
import { DashboardContext } from "../../provider/DashboardContext";
import { previewData } from "../../utils/data_visualization_preview_data";
import { Button } from "antd";
import {
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
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
import { PreviewData } from "../../types/dashboard.types";

const CustomBarChart = (props: { data?: any; barColor?: string }) => {
  const { data, barColor } = props;
  const { contextData } = useContext(DashboardContext);
  const [height, setHeight] = useState<number>(200);

  let chartData: PreviewData;
  if (contextData) {
    chartData = contextData.formattedData;
  } else if (data) {
    chartData = data.formattedData;
  } else {
    chartData = previewData;
  }

  return (
    <Fragment>
      <div className="flex gap-[20px] justify-center">
        <Button
          shape="circle"
          icon={<ZoomInOutlined />}
          onClick={() => setHeight(height + 50)}
        />
        <Button
          shape="circle"
          disabled={height === 200}
          icon={<ZoomOutOutlined />}
          onClick={() => {
            height > 200 ? setHeight(height - 50) : setHeight(200);
          }}
        />
        <Button
          shape="circle"
          disabled={height === 200}
          icon={<UndoOutlined />}
          onClick={() => setHeight(200)}
        />
      </div>
      <ResponsiveContainer
        height={height}
        className="
        mt-[25px]
        pt-[10px] pb-[10px]
        border-[#eee] rounded-[5px] border-[2px]
        "
      >
        <BarChart data={chartData.values}>
          <CartesianGrid className="stroke-[#909090]" strokeDasharray="3 3" />
          <Tooltip />
          <Bar
            type="monotone"
            dataKey="yValue"
            fill={barColor ? barColor : "#8884d8"}
            activeBar={<Rectangle />}
          />
          {/* <XAxis dataKey="xValue" angle={-45}> */}
          <XAxis
            dataKey="xValue"
            interval={0}
            tick={(props) => {
              const { x, y, payload } = props;
              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="end"
                    fill="#666"
                    transform="rotate(-45)"
                  >
                    {payload.value}
                  </text>
                </g>
              );
            }}
          >
            <Label value={chartData.xLabel} position="bottom" offset={-5} />
            {/* <Label
              content={({ viewBox }) => {
                const { x, y, width, height } = viewBox;
                const label = chartData ? chartData.xLabel : "X Label";
                const words = label.split(" ");

                if (words.length > 1) {
                  const firstLine = words
                    .slice(0, Math.ceil(words.length / 2))
                    .join(" ");
                  const secondLine = words
                    .slice(Math.ceil(words.length / 2))
                    .join(" ");

                  return (
                    <text
                      x={x + width / 2}
                      y={y + height + 10}
                      textAnchor="middle"
                    >
                      <tspan x={x + width / 2} dy="1em">
                        {firstLine}
                      </tspan>
                      <tspan x={x + width / 2} dy="1.2em">
                        {secondLine}
                      </tspan>
                    </text>
                  );
                } else {
                  return (
                    <text
                      x={x + width / 2}
                      y={y + height + 20}
                      textAnchor="middle"
                    >
                      {label}
                    </text>
                  );
                }
              }}
              position="bottom"
            /> */}
          </XAxis>
          <YAxis dataKey="yValue">
            <Label
              value={chartData.yLabel}
              position="left"
              angle={-90}
              offset={-5}
            />
          </YAxis>
        </BarChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

export default CustomBarChart;
