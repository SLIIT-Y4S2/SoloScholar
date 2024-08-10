import { previewData } from "../../../utils/data_visualization_preview_data";
import { Fragment, useContext, useState } from "react";
import { DashboardContext } from "../../../provider/DashboardContext";
import { Button } from "antd";
import {
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
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

const CustomLineChart = (props: { data?: any; lineColor?: string }) => {
  const { data, lineColor } = props;
  const { contextData } = useContext(DashboardContext);
  const [height, setHeight] = useState<number>(200);

  let chartData: any;
  if (contextData) {
    chartData = contextData.formattedData;
  } else if (data) {
    chartData = data.formattedData;
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
        <LineChart data={chartData ? chartData.values : previewData}>
          <CartesianGrid className="stroke-[#909090]" strokeDasharray="3 3" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="yValue"
            stroke={lineColor ? lineColor : "#8884d8"}
            activeDot={{ r: 6 }}
          />
          <XAxis dataKey="xValue">
            <Label
              value={chartData ? chartData.xLabel : "X Label"}
              position="bottom"
              offset={-5}
            />
          </XAxis>
          <YAxis dataKey="yValue">
            <Label
              value={chartData ? chartData.yLabel : "Y Label"}
              position="left"
              angle={-90}
              offset={-5}
            />
          </YAxis>
        </LineChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

export default CustomLineChart;
