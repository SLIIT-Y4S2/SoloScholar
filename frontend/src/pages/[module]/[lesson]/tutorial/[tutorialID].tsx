import { Layout, Spin } from "antd";
import { TutorialProvider } from "../../../../provider/tutorial/TutorialContext";
import RequestFeedback from "./RequestFeedback";
import TutorialFeedback from "./Feedback";
import TutorialQuestionView from "./TutorialAnsweringView";
import CompletedTutorial from "./CompletedTutorial";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import Error from "../../../../Components/Error";
import GeneratingView from "../../../../Components/tutorial/GeneratingView";
import { useTutorialContext } from "../../../../provider/tutorial/useTutorialContext";

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
      <Layout style={{ padding: "0 0 24px" }}>
        <Layout className="container mx-auto">
          <CustomBreadcrumb />
          <TutorialView />
        </Layout>
      </Layout>
    </TutorialProvider>
  );
};

export default TutorialViewWithProvider;
