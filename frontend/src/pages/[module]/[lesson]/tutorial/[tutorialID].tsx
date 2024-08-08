import { DynamicBreadcrumbComponent } from ".";
import { Layout } from "antd";
import {
  TutorialProvider,
  useTutorialContext,
} from "../../../../provider/TutorialContext";
import RequestFeedback from "./RequestFeedback";
import TutorialFeedback from "./Feedback";
import TutorialQuestionView from "./TutorialQuestionView";
import CompletedTutorial from "./CompletedTutorial";

//TODO: If tutorial complete forward to feedback page

const TutorialView = () => {
  const { isLoading, status, error } = useTutorialContext();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (
    status === "generating" ||
    status === "submitting" ||
    status === "feedback-generating"
  ) {
    return <>Loading</>;
  }

  if (status === "generated" || status === "in-progress") {
    return <TutorialQuestionView />;
  }

  if (status === "submitted") {
    return <RequestFeedback />;
  }

  if (status === "feedback-generated") {
    return <TutorialFeedback />;
  }

  if (status === "completed") {
    return <CompletedTutorial />;
  }

  return <>ERROR.</>;
};

const TutorialViewWithProvider = () => {
  return (
    <TutorialProvider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <DynamicBreadcrumbComponent />
        <TutorialView />
      </Layout>
    </TutorialProvider>
  );
};

export default TutorialViewWithProvider;
