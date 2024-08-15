import { Layout, Spin } from "antd";
import {
  TutorialProvider,
  useTutorialContext,
} from "../../../../provider/TutorialContext";
import RequestFeedback from "./RequestFeedback";
import TutorialFeedback from "./Feedback";
import TutorialQuestionView from "./TutorialQuestionView";
import CompletedTutorial from "./CompletedTutorial";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import Error from "../../../../Components/Error";
import GeneratingView from "../../../../Components/tutorial/GeneratingView";

const TutorialView = () => {
  const { isFetching, status, error } = useTutorialContext();

  if (isFetching) {
    return <Spin fullscreen />;
  }

  if (error) {
    return <Error title="Error occurred" subTitle={error} />;
  }

  if (
    status === "generating" ||
    status === "submitting" ||
    status === "feedback-generating"
  ) {
    return <GeneratingView />;
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

  return (
    <Error
      title="Error occurred"
      subTitle="An error occurred while fetching the tutorial."
    />
  );
};

const TutorialViewWithProvider = () => {
  return (
    <TutorialProvider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <CustomBreadcrumb />
        <TutorialView />
      </Layout>
    </TutorialProvider>
  );
};

export default TutorialViewWithProvider;
