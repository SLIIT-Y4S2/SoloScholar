import { createContext, ReactNode, useState } from "react";
import { useMemo } from "react";
import getFormattedData from "../utils/data_visualization_formatter";
import { DASHBOARD_API_URLS } from "../utils/api_routes";
import { customMessage } from "../types/dashboard.types";

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardContext = createContext({} as any);

export function DashboardProvider({
  children,
}: Readonly<DashboardProviderProps>) {
  const [contextData, setContextData] = useState<{
    analysisGoal: string;
    visualizationChoice: string;
    sqlQuery: string;
    formattedData: any;
  } | null>(null);
  const [customMessage, setCustomMessage] = useState<customMessage | null>(
    null
  );

  /**
   * Function to clear out the data stored in the context.
   */
  const clearData = () => {
    setCustomMessage(null);
    setContextData(null);
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
        setCustomMessage({
          type: "error",
          content:
            "Sorry, an unexpected error occurred. Please re-check your analysis goal or try again later.",
        });
      } else {
        const sqlQuery = await data.result.sqlQuery;
        const sqlQueryData = await data.result.sqlQueryData;
        if (
          sqlQueryData.length === 1 &&
          Object.keys(sqlQueryData[0])[0] === "" &&
          sqlQueryData[0][Object.keys(sqlQueryData[0])[0]] === null
        ) {
          setCustomMessage({
            type: "info",
            content:
              "Sorry, there is insufficient data available for visualization. Retry by providing more information or try a different analysis goal.",
          });
          return;
        }
        setContextData({
          analysisGoal: data.goal,
          visualizationChoice: visualizationChoice,
          sqlQuery: sqlQuery,
          formattedData: await getFormattedData(
            sqlQueryData,
            visualizationChoice
          ),
        });
      }
    } catch (error: any) {
      setCustomMessage({ type: "error", content: error.message });
    }
  };

  /**
   * Function to get the indicators for a particular instructor.
   * @param instructorId
   * @returns
   */
  const getIndicators = async (instructorId: string) => {
    try {
      const response = await fetch(
        `${DASHBOARD_API_URLS.GET_INDICATORS}/${instructorId}`
      );
      const data = await response.json();
      return await data.result;
    } catch (error: any) {
      // TODO Need to set proper error message
      console.log(error);
    }
  };

  /**
   * Function to get the data for a particular indicator.
   * @param indicatorId
   * @param visualizationChoice
   * @returns
   */
  const getIndicatorData = async (
    indicatorId: string,
    visualizationChoice: string
  ) => {
    try {
      const response = await fetch(
        `${DASHBOARD_API_URLS.GET_INDICATOR_DATA}/${indicatorId}`
      );
      const data = await response.json();
      const sqlQueryData = await data.result;
      const formattedData = await getFormattedData(
        sqlQueryData,
        visualizationChoice
      );
      return formattedData;
    } catch (error: any) {
      // TODO Need to set proper error message
      console.log(error);
    }
  };

  /**
   *
   * @param indicatorId
   */
  const editIndicatorData = async (indicatorId: string) => {};

  /**
   *
   * @param indicatorId
   */
  const deleteIndicator = async (indicatorId: string) => {};

  const contextValue = useMemo(
    () => ({
      contextData,
      customMessage,
      createIndicator,
      getIndicators,
      getIndicatorData,
      clearData,
    }),
    [
      contextData,
      customMessage,
      createIndicator,
      getIndicators,
      getIndicatorData,
      clearData,
    ]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}
