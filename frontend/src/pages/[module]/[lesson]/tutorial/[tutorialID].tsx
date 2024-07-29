import { DynamicBreadcrumbComponent } from ".";
import { Layout } from "antd";
import {
  TutorialProvider,
  useTutorialContext,
} from "../../../../provider/TutorialContext";
import RequestFeedback from "./RequestFeedback";
import Feedback from "./Feedback";
import TutorialQuestionView from "./TutorialQuestionView";

//TODO: If tutorial complete forward to feedback page

const TutorialView = () => {
  const { isLoading, status, error } = useTutorialContext();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <DynamicBreadcrumbComponent />
      {(status === "generating" ||
        status === "submitting" ||
        status === "feedback-generating") && <div>Generating...</div>}
      {(status === "generated" || status === "in-progress") && (
        <TutorialQuestionView />
      )}
      {status === "submitted" && <RequestFeedback />}
      {status === "feedback-generated" && <Feedback />}
    </Layout>
  );
};

const TutorialViewWithProvider = () => {
  return (
    <TutorialProvider>
      <TutorialView />
    </TutorialProvider>
  );
};

export default TutorialViewWithProvider;
