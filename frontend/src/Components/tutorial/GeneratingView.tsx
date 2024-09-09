import {
  // Progress,
  Spin,
} from "antd";
// import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const GeneratingView = () => {
  // const [percent, setPercent] = useState(0);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setPercent((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(interval);
  //         return 100;
  //       }
  //       return prev + 1;
  //     });
  //   }, 800);
  //   return () => clearInterval(interval);
  // }, []);
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-screen">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      {/* <Progress
        percent={percent}
        status="active"
        showInfo={false}
        className="w-1/2"
      /> */}
      <p>Generating... Please wait for about 30 seconds.</p>
    </div>
  );
};

export default GeneratingView;
