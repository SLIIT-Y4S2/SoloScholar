import { Fragment } from "react/jsx-runtime";
import { useContext, useState } from "react";
import { DashboardContext } from "../../../provider/DashboardContext";
import { Table, Button } from "antd";
import {
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import {
  tablePreviewColumns,
  tablePreviewData,
} from "../../../utils/data_visualization_preview_data";

const CustomTable = () => {
  const [size, setSize] = useState<string>("small");
  const { contextData } = useContext(DashboardContext);

  return (
    <Fragment>
      <div className="flex gap-[20px] justify-center">
        <Button
          shape="circle"
          disabled={size === "large"}
          icon={<ZoomInOutlined />}
          onClick={() => {
            if (size === "small") {
              setSize("middle");
            } else {
              setSize("large");
            }
          }}
        />
        <Button
          shape="circle"
          disabled={size === "small"}
          icon={<ZoomOutOutlined />}
          onClick={() => {
            if (size === "large") {
              setSize("middle");
            } else {
              setSize("small");
            }
          }}
        />
        <Button
          shape="circle"
          disabled={size === "small"}
          icon={<UndoOutlined />}
          onClick={() => setSize("small")}
        />
      </div>
      <div>
        <Table
          className="
          mt-[25px]
          pt-[10px] pb-[10px]
          "
          size={size}
          bordered
          rowHoverable
          pagination={false}
          columns={
            contextData?.formattedData.tableColumns
              ? contextData?.formattedData.tableColumns
              : tablePreviewColumns
          }
          dataSource={
            contextData && contextData.visualizationChoice === "Table"
              ? contextData.formattedData.tableData
              : tablePreviewData
          }
        />
      </div>
    </Fragment>
  );
};

export default CustomTable;
