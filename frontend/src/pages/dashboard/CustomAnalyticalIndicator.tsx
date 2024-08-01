import CustomAnalyticalIndicatorPrimary from "./CustomAnalyticalIndicatorPrimary";
import CustomAnalyticalIndicatorSecondary from "./CustomAnalyticalIndicatorSecondary";
import { DashboardContext } from "../../provider/DashboardContext";
import { useContext } from "react";

const CustomAnalyticalIndicator = () => {
  const { contextData, customMessage } = useContext(DashboardContext);

  if (contextData) {
    return (
      <CustomAnalyticalIndicatorSecondary
        analysisGoal={contextData.analysisGoal}
        visualizationChoice={contextData.visualizationChoice}
      />
    );
  } else if (customMessage) {
    return <CustomAnalyticalIndicatorSecondary customMessage={customMessage} />;
  } else {
    return <CustomAnalyticalIndicatorPrimary />;
  }
};

export default CustomAnalyticalIndicator;
