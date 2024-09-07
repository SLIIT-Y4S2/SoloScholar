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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { PreviewData } from "../../types/dashboard.types";

const CustomAreaChart = (props: { data?: any; areaColor?: string }) => {
  const { data, areaColor } = props;
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
        <AreaChart data={chartData.values}>
          <CartesianGrid className="stroke-[#909090]" strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="yValue"
            stroke={areaColor ? areaColor : "#8884d8"}
            fill={areaColor ? areaColor : "#8884d8"}
          />
          <XAxis dataKey="xValue">
            <Label value={chartData.xLabel} position="bottom" offset={-5} />
          </XAxis>
          <YAxis dataKey="yValue">
            <Label
              value={chartData.yLabel}
              position="left"
              angle={-90}
              offset={-5}
            />
          </YAxis>
        </AreaChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

export default CustomAreaChart;
