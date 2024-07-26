import { Tooltip, ResponsiveContainer, Pie, PieChart } from "recharts";
import { DashboardContext } from "../../../provider/DashboardContext";
import { pieChartPreviewData } from "../../../utils/data_visualization_preview_data";
import { Fragment, useContext, useState } from "react";
import { Button } from "antd";
import {
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

const CustomPieChart = (props: { pieColor?: string }) => {
  const { pieColor } = props;
  const { data } = useContext(DashboardContext);
  const [height, setHeight] = useState<number>(255);

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
          disabled={height === 255}
          icon={<ZoomOutOutlined />}
          onClick={() => {
            height > 255 ? setHeight(height - 50) : setHeight(255);
          }}
        />
        <Button
          shape="circle"
          disabled={height === 255}
          icon={<UndoOutlined />}
          onClick={() => setHeight(255)}
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
        <PieChart>
          <Tooltip />
          <Pie
            className="rounded-[5px] border-[#eee]"
            dataKey="value"
            isAnimationActive={true}
            data={
              data && data.visualizationChoice === "Pie Chart"
                ? data.formattedData.values
                : pieChartPreviewData
            }
            outerRadius={100}
            fill={pieColor ? pieColor : "#8884d8"}
            label
          />
        </PieChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

export default CustomPieChart;
