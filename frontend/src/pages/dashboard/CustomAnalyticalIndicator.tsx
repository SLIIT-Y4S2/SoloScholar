import CustomAnalyticalIndicatorPrimary from "./CustomAnalyticalIndicatorPrimary";
import CustomAnalyticalIndicatorSecondary from "./CustomAnalyticalIndicatorSecondary";
import { DashboardContext } from "../../provider/DashboardContext";
import { useContext } from "react";

const CustomAnalyticalIndicator = () => {
  const { data } = useContext(DashboardContext);

  return data ? (
    <CustomAnalyticalIndicatorSecondary
      visualizationChoice={data.visualizationChoice}
    />
  ) : (
    <CustomAnalyticalIndicatorPrimary />
  );
};

export default CustomAnalyticalIndicator;
