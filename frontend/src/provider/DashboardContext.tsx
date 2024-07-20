import { createContext, ReactNode, useState } from "react";
import { useMemo } from "react";
import getFormattedData from "../utils/data_visualization_formatter";
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
    setData(null);
  };

  /**
   * Function to create an indicator.
   * @param goal The goal for which the indicator is to be created.
   * @param visualizationChoice The visualization choice for the indicator.
   */
  const createIndicator = async (goal: string, visualizationChoice: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });
      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
        console.log(data.error);
      } else {
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
