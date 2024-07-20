import { createContext, ReactNode, useState } from "react";
import { useMemo } from "react";
import getFormattedData from "../utils/data_visualization_formatter";
import { DASHBOARD_API_URLS } from "../utils/api_routes";
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardContext = createContext({} as any);

export function DashboardProvider({
  children,
}: Readonly<DashboardProviderProps>) {
  const [data, setData] = useState<{
    analysisGoal: string;
    formattedData: any;
    visualizationChoice: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Function to clear out the data stored in the context.
   */
  const clearData = () => {
    setErrorMessage(null);
    setData(null);
  };

  /**
   * Function to create an indicator.
   * @param goal The goal for which the indicator is to be created.
   * @param visualizationChoice The visualization choice for the indicator.
   */
  const createIndicator = async (goal: string, visualizationChoice: string) => {
    try {
      const response = await fetch(DASHBOARD_API_URLS.CREATE_INDICATOR, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });
      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
        console.log("sdsdsdsdsd", data.error);
      } else {
        if (data.result.length === 1 && Object.keys(data.result[0])[0] === "") {
          setErrorMessage(
            "Sorry, there is insufficient data available to visualize this analysis goal. Provide more information or try again with a different analysis goal."
          );
          return;
        }
        setData({
          analysisGoal: data.goal,
          formattedData: await getFormattedData(
            data.result,
            visualizationChoice
          ),
          visualizationChoice: visualizationChoice,
        });
      }
    } catch (error: any) {
      setErrorMessage(error);
      console.log(error.message);
    }
  };

  const contextValue = useMemo(
    () => ({ data, errorMessage, createIndicator, clearData }),
    [data, errorMessage, createIndicator, clearData]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}
