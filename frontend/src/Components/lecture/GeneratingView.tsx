import { Progress } from "antd";
import { useEffect, useState } from "react";

const GeneratingView = () => {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100/225);
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* <Spin size="large" /> */}
      <Progress
        percent={percent}
        status="active"
        showInfo={false}
        className="w-1/2"
      />
      <p>Loading... Please wait for about 2 minutes.</p>
    </div>
  );
};

export default GeneratingView;
