import { Fragment } from "react/jsx-runtime";
import { useContext, useState } from "react";
import { DashboardContext } from "../../provider/DashboardContext";
import { Table, Button, TableColumnType } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { tablePreviewData } from "../../utils/data_visualization_preview_data";
import { TablePreviewData } from "../../types/dashboard.types";
import {
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

const CustomTable = (props: { data?: any }) => {
  const { data } = props;
  const { contextData } = useContext(DashboardContext);
  const [size, setSize] = useState<SizeType>("small");

  let tableData: TablePreviewData;
  if (contextData) {
    tableData = contextData.formattedData;
  } else if (data) {
    tableData = data.formattedData;
  } else {
    tableData = tablePreviewData;
  }

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
          columns={tableData.tableColumns as TableColumnType<any>[]}
          dataSource={tableData.tableData}
        />
      </div>
    </Fragment>
  );
};

export default CustomTable;
