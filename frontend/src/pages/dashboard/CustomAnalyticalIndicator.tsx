import CustomAnalyticalIndicatorPrimary from "./CustomAnalyticalIndicatorPrimary";
import CustomAnalyticalIndicatorSecondary from "./CustomAnalyticalIndicatorSecondary";
import { DashboardContext } from "../../provider/DashboardContext";
import { useContext } from "react";

const CustomAnalyticalIndicator = () => {
  const { data, errorMessage } = useContext(DashboardContext);

  if (data) {
    return (
      <CustomAnalyticalIndicatorSecondary
        analysisGoal={data.analysisGoal}
        visualizationChoice={data.visualizationChoice}
      />
    );
  } else if (errorMessage) {
    return <CustomAnalyticalIndicatorSecondary errorMessage={errorMessage} />;
  } else {
    return <CustomAnalyticalIndicatorPrimary />;
  }
};

export default CustomAnalyticalIndicator;
