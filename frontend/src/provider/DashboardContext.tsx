import { createContext, ReactNode, useState } from "react";
import axios from "axios";

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardContext = createContext({} as any);

export function DashboardProvider({ children }: DashboardProviderProps) {
  //const [data, setData] = useState<[]>([]);

  const createIndicator = async (goal: string, visualizationChoice: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });
      // TODO Format data according to visualizationChoice
      const data = await response.json();
      if (data.result) {
        console.log("SUCCESS: ", data.result);
      } else {
        console.log("ERROR: ", data.error);
      }
    } catch (error: any) {
      console.log("Sorry, an unexpected error occured. Please try again later");
    }
  };

  return (
    <DashboardContext.Provider value={{ createIndicator }}>
      {children}
    </DashboardContext.Provider>
  );
}
