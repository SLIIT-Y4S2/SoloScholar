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
    formattedData: any;
    visualizationChoice: string;
  } | null>(null);

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
      if (data.result) {
        setData({
          formattedData: await getFormattedData(
            data.result,
            visualizationChoice
          ),
          visualizationChoice: visualizationChoice,
        });
      } else {
        console.log(data.error);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const contextValue = useMemo(
    () => ({ data, createIndicator, clearData }),
    [data, createIndicator, clearData]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}
