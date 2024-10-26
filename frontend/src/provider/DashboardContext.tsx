import axiosInstance from "../utils/axiosInstance";
import getFormattedData from "../utils/data_visualization_formatter";
import { createContext, ReactNode, useContext, useState, useMemo } from "react";
import { DASHBOARD_API_URLS } from "../utils/api_routes";
import { CustomMessage } from "../types/dashboard.types";
import { AxiosResponse } from "axios";

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardContext = createContext({} as any);

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
}

export function DashboardProvider({
  children,
}: Readonly<DashboardProviderProps>) {
  const [contextIndicators, setContextIndicators] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState<CustomMessage | null>(
    null
  );
  const [customMessageWarningContextData, setCustomMessageWarningContextData] =
    useState<{
      analysisGoal: string;
      visualizationChoice: string;
      sqlQuery: string;
      sqlQueryData: any[];
    } | null>(null);
  const [contextData, setContextData] = useState<{
    analysisGoal: string;
    visualizationChoice: string;
    sqlQuery: string;
    formattedData: any;
  } | null>(null);

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
      const response: AxiosResponse = await axiosInstance.post(
        DASHBOARD_API_URLS.DASHBOARD,
        {
          goal,
        }
      );
      const responseData: {
        goal: string;
        result?: { sqlQuery: string; sqlQueryData: any[] };
        error?: any;
      } = await response.data;
      if (responseData.error) {
        setCustomMessage({
          type: "error",
          content:
            "Sorry, an eror occured during generation due to insufficent context. Please refine your goal and try again.",
        });
      } else {
        const {
          sqlQuery,
          sqlQueryData,
        }: { sqlQuery: string; sqlQueryData: any[] } = await response.data
          .result;
        console.log("sqlQueryData", sqlQueryData[0]);
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
        } else if (
          Object.keys(sqlQueryData[0]).length > 2 &&
          visualizationChoice !== "Table"
        ) {
          setCustomMessage({
            type: "warning",
            content: `Sorry, this data cannot be properly visualized using a ${visualizationChoice.toLowerCase()}. Would you like to visualize using a table instead?`,
          });
          setCustomMessageWarningContextData({
            analysisGoal: goal,
            visualizationChoice: "Table",
            sqlQuery: sqlQuery,
            sqlQueryData: sqlQueryData,
          });
        } else {
          setContextData({
            analysisGoal: responseData.goal,
            visualizationChoice: visualizationChoice,
            sqlQuery: sqlQuery,
            formattedData: getFormattedData(sqlQueryData, visualizationChoice),
          });
        }
      }
    } catch (error: any) {
      setCustomMessage({
        type: "error",
        content:
          "Sorry, an unexpected server eror occured. Please try again later.",
      });
    }
  };

  /**
   * Function to generate an indicator with table as the visualization choice when data has more than two-columned data.
   */
  const generateTabularIndicator = (
    analysisGoal: string,
    sqlQuery: string,
    sqlQueryData: any[]
  ) => {
    setContextData({
      analysisGoal: analysisGoal,
      visualizationChoice: "Table",
      sqlQuery: sqlQuery,
      formattedData: getFormattedData(sqlQueryData, "Table"),
    });
  };

  /**
   * Function to save an indicator.
   * @param indicator
   */
  const saveIndicator = async (
    indicator: any
  ): Promise<CustomMessage | void> => {
    try {
      const response: AxiosResponse = await axiosInstance.post(
        DASHBOARD_API_URLS.DASHBOARD_INDICATORS,
        indicator
      );
      const responseData: { result: Object; error: any } = await response.data;
      let customMessage: CustomMessage;
      if (responseData.error) {
        customMessage = {
          type: "error",
          content:
            "Sorry, an unexpected server error occurred. Indicator saving failed.",
        };
      } else {
        customMessage = {
          type: "success",
          content: "Indicator saved successfully.",
        };
      }
      return customMessage;
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
  const getIndicators = async () => {
    try {
      const response: AxiosResponse = await axiosInstance.get(
        `${DASHBOARD_API_URLS.DASHBOARD_INDICATORS}`
      );
      setContextIndicators(response.data.result);
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
    visualizationChoice: string
  ) => {
    try {
      const response: AxiosResponse = await axiosInstance.get(
        `${DASHBOARD_API_URLS.DASHBOARD_INDICATORS}/${indicatorId}`
      );
      const responseData: { result: any[]; error?: any } = await response.data;
      const sqlQueryData: any[] = responseData.result;
      return {
        sqlQueryData: sqlQueryData,
        formattedData: getFormattedData(sqlQueryData, visualizationChoice),
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
  const editIndicator = async (indicator: {
    id: string;
    indicatorName: string;
    visualizationChoice: string;
  }) => {
    console.log(indicator);
    let customMessage: CustomMessage;
    try {
      const response: AxiosResponse = await axiosInstance.put(
        DASHBOARD_API_URLS.DASHBOARD_INDICATORS,
        indicator
      );
      const responseData: {
        result: {
          id: string;
          indicator_name: string;
          analysis_goal: string;
          visualization_choice: string;
          sql_query: string;
          created_at: string;
          instructor_id: string;
        };
        error: any;
      } = await response.data;
      if (responseData.error) {
        customMessage = {
          type: "error",
          content:
            "Sorry, an unexpected error occurred. Indicator update failed.",
        };
      } else {
        const updatedIndicatorIndex: number = contextIndicators.findIndex(
          (indicator: any) => indicator.id === responseData.result.id
        );
        const updatedIndicators: any[] = [...contextIndicators];
        updatedIndicators.splice(updatedIndicatorIndex, 1, responseData.result);
        setContextIndicators(updatedIndicators);
        customMessage = {
          type: "success",
          content: "Indicator updated successfully",
        };
      }
      return customMessage;
    } catch (error: any) {
      customMessage = {
        type: "error",
        content: error.message,
      };
      return customMessage;
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
      const response = await axiosInstance.delete(
        `${DASHBOARD_API_URLS.DASHBOARD_INDICATORS}/${indicatorId}`
      );
      const responseData: {
        result: {
          id: string;
          indicator_name: string;
          analysis_goal: string;
          visualization_choice: string;
          sql_query: string;
          created_at: string;
          instructor_id: string;
        };
        error: any;
      } = await response.data;
      let customMessage: CustomMessage;
      if (responseData.error) {
        customMessage = {
          type: "error",
          content:
            "Sorry, an unexpected error occurred. Indicator deletion failed.",
        };
      } else {
        const updatedIndicators: any[] = contextIndicators.filter(
          (indicator: any) => indicator.id !== indicatorId
        );
        setContextIndicators(updatedIndicators);
        customMessage = {
          type: "success",
          content: "Indicator deleted successfully",
        };
      }
      return customMessage;
    } catch (error: any) {
      // Need to use a logger
      console.log(error);
    }
  };

  const contextValue = useMemo(
    () => ({
      contextData,
      customMessageWarningContextData,
      contextIndicators,
      customMessage,
      generateIndicator,
      generateTabularIndicator,
      saveIndicator,
      getIndicators,
      getIndicatorData,
      editIndicator,
      deleteIndicator,
      clearData,
    }),
    [
      contextData,
      customMessageWarningContextData,
      contextIndicators,
      customMessage,
      generateIndicator,
      generateTabularIndicator,
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
