import CustomAnalyticalIndicatorPrimary from "./CustomAnalyticalIndicatorPrimary";
import CustomAnalyticalIndicatorSecondary from "./CustomAnalyticalIndicatorSecondary";
import { DashboardContext } from "../../provider/DashboardContext";
import { useContext } from "react";

const CustomAnalyticalIndicator = () => {
  const { data, customMessage } = useContext(DashboardContext);

  if (data) {
    return (
      <CustomAnalyticalIndicatorSecondary
        analysisGoal={data.analysisGoal}
        visualizationChoice={data.visualizationChoice}
      />
    );
  } else if (customMessage) {
    return <CustomAnalyticalIndicatorSecondary customMessage={customMessage} />;
  } else {
    return <CustomAnalyticalIndicatorPrimary />;
  }
};

export default CustomAnalyticalIndicator;
