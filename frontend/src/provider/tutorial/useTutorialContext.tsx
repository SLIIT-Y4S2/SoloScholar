import { useContext } from "react";
import { TutorialProviderContext } from "./TutorialContext";

export function useTutorialContext() {
  const value = useContext(TutorialProviderContext);
  if (!value) {
    throw new Error(
      "useTutorialProvider must be used within a TutorialProvider"
    );
  }
  return value;
}
