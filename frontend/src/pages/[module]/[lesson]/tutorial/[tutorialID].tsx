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
  const { questions, isLoading, status } = useTutorialContext();

  if (isLoading || questions.length === 0) {
    return <>Loading...</>;
  }

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <DynamicBreadcrumbComponent />
      {status === "generated" && <TutorialQuestionView />}
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
