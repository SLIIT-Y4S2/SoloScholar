import { createContext, ReactNode, useState } from "react";
import { useMemo } from "react";
import getFormattedData from "../utils/data_visualization_formatter";
import { DASHBOARD_API_URLS } from "../utils/api_routes";
import { CustomMessage } from "../types/dashboard.types";

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
  const [contextIndicators, setContextIndicators] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState<CustomMessage | null>(
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
   * Function to generate an indicator.
   * @param goal The goal for which the indicator is to be created.
   * @param visualizationChoice The visualization choice for the indicator.
   */
  const generateIndicator = async (
    goal: string,
    visualizationChoice: string
  ) => {
    try {
      const response = await fetch(DASHBOARD_API_URLS.DASHBOARD, {
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
   * Function to save an indicator.
   * @param indicator
   */
  const saveIndicator = async (
    indicator: any
  ): Promise<CustomMessage | void> => {
    try {
      const response = await fetch(DASHBOARD_API_URLS.DASHBOARD_INDICATORS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(indicator),
      });
      const data = await response.json();
      let message: CustomMessage;
      if (data.error) {
        message = {
          type: "error",
          content:
            "Sorry, an unexpected server error occurred. Indicator saving failed.",
        };
      } else {
        message = {
          type: "success",
          content: "Indicator saved successfully.",
        };
      }
      return message;
    } catch (error: any) {
      // TODO Need to use a logger.
      console.log(error);
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
        `${DASHBOARD_API_URLS.DASHBOARD}/${instructorId}`
      );
      const data = await response.json();
      setContextIndicators(data.result);
    } catch (error: any) {
      // TODO Need to use a logger
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
    visualizationChoice: string,
    fetchedData: any
  ) => {
    let sqlQueryData: any;
    try {
      if (indicatorId) {
        const response = await fetch(
          `${DASHBOARD_API_URLS.DASHBOARD_INDICATORS}/${indicatorId}`
        );
        const data = await response.json();
        sqlQueryData = await data.result;
      } else if (fetchedData) {
        sqlQueryData = fetchedData;
      }
      return {
        sqlQueryData: sqlQueryData,
        formattedData: await getFormattedData(
          sqlQueryData,
          visualizationChoice
        ),
      };
    } catch (error: any) {
      // TODO Need to use a logger
      console.log(error);
    }
  };

  /**
   * Function to edit an indicator.
   * @param indicator
   */
  const editIndicator = async (indicator: any) => {
    try {
      const { id, indicatorName, analysisGoal, visualizationChoice } =
        await indicator;
      const response = await fetch(
        `${DASHBOARD_API_URLS.DASHBOARD_INDICATORS}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            indicatorName,
            analysisGoal,
            visualizationChoice,
          }),
        }
      );
      const data = await response.json();
      let message: CustomMessage;
      if (data.error) {
        message = {
          type: "error",
          content:
            "Sorry, an unexpected error occurred. Indicator update failed.",
        };
      } else {
        const updatedIndicatorIndex: number = contextIndicators.findIndex(
          (indicator: any) => indicator.id === data.result.id
        );
        const updatedIndicators = [...contextIndicators];
        updatedIndicators.splice(updatedIndicatorIndex, 1, data.result);
        setContextIndicators(updatedIndicators);
        message = {
          type: "success",
          content: "Indicator updated successfully.",
        };
      }
      return message;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Function to delete an indicator.
   * @param indicatorId
   */
  const deleteIndicator = async (
    indicatorId: string
  ): Promise<CustomMessage | void> => {
    try {
      const response = await fetch(
        `${DASHBOARD_API_URLS.DASHBOARD_INDICATORS}/${indicatorId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      let message: CustomMessage;
      if (data.error) {
        message = {
          type: "error",
          content:
            "Sorry, an unexpected error occurred. Indicator deletion failed.",
        };
      } else {
        const updatedIndicators = contextIndicators.filter(
          (indicator: any) => indicator.id !== indicatorId
        );
        setContextIndicators(updatedIndicators);
        message = {
          type: "success",
          content: "Indicator deleted successfully.",
        };
      }
      return message;
    } catch (error: any) {
      // Need to use a logger
      console.log(error);
    }
  };

  const contextValue = useMemo(
    () => ({
      contextData,
      contextIndicators,
      customMessage,
      generateIndicator,
      saveIndicator,
      getIndicators,
      getIndicatorData,
      editIndicator,
      deleteIndicator,
      clearData,
    }),
    [
      contextData,
      contextIndicators,
      customMessage,
      generateIndicator,
      saveIndicator,
      getIndicators,
      getIndicatorData,
      editIndicator,
      deleteIndicator,
      clearData,
    ]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}
