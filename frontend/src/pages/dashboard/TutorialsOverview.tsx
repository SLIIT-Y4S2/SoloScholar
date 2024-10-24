import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Card, Col, Result, Row, Select, Statistic, Typography } from "antd";
import { ResultStatusType } from "antd/es/result";
import { useContext, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import BreadCrumb from "../../Components/BreadCrumb";
import CustomLabeledPieChart from "../../Components/dashboard/CustomLabeledPieChart";
import CustomStackedBarChart from "../../Components/dashboard/CustomStackedBarChart";
import CustomTwoLevelPieChart from "../../Components/dashboard/CustomTwoLevelPieChart";
import { DashboardAnalyticsContext } from "../../provider/DashboardAnalyticsContext";

const { Text } = Typography;

const learningLevels: { value: string; label: JSX.Element }[] = [
  {
    value: "beginner",
    label: <span>Beginner</span>,
  },
  {
    value: "intermediate",
    label: <span>Intermediate</span>,
  },
  {
    value: "advanced",
    label: <span>Advanced</span>,
  },
];

const TutorialsOverview = () => {
  const [learningLevel, setLearningLevel] = useState<string>(
    learningLevels[0].value
  );
  const [lessons, setLessons] = useState<any[] | null>(null);
  const [lesson, setLesson] = useState<{
    id: number;
    title: string;
    description: string;
    module_id: number;
  } | null>(null);
  const {
    getLessonsOfModule,
    getTutorialAnalytics,
    academicPerformanceAndLearningStrategiesTutorial,
    affectiveStateTutorial,
    summaryStatisticsTutorial,
    learnerPerformanceTutorial,
    customMessage,
  } = useContext(DashboardAnalyticsContext);

  useEffect(() => {
    (async () => {
      const lessons = await getLessonsOfModule("1"); // Make this moduleId dynamic
      setLessons(lessons);
      setLesson(lessons?.[0]);
      await getTutorialAnalytics({
        moduleId: 1, // Make this moduleId dynamic
        learningLevel: learningLevel,
        lessonId: lessons?.[0]?.id,
        lessonTitle: lessons?.[0]?.title,
      });
    })();
  }, []);

  return (
    <Fragment>
      <BreadCrumb sidebarOption={{ label: "Tutorials Overview" }} />
      <div
        className="
      pt-[43px] pr-[46px] pb-[39px] pl-[46px]
      mt-[35px] mb-[98px] ml-[45px]
      bg-[#ffff] rounded-[15px]
      "
      >
        <div className="flex justify-center gap-52">
          <div className="inline w-full">
            <Text>
              <b>Learning Level</b>
            </Text>
            <Select
              value={learningLevel}
              options={learningLevels}
              onChange={async (e: string) => {
                setLearningLevel(e);
                await getTutorialAnalytics({
                  moduleId: 1, // Make this moduleId dynamic
                  learningLevel: e,
                  lessonId: lesson?.id,
                  lessonTitle: lesson?.title,
                });
              }}
              className="w-full"
              showSearch
            />
          </div>
          <div className="inline w-full">
            <Text>
              <b>Lesson Title</b>
            </Text>
            <Select
              value={lesson?.title}
              options={lessons?.map((lesson) => ({
                value: lesson.id,
                label: lesson.title,
              }))}
              onChange={async (e) => {
                const lesson = lessons?.find((lesson) => lesson.id === e);
                setLesson(lesson);
                await getTutorialAnalytics({
                  moduleId: 1, // Make this moduleId dynamic
                  learningLevel: learningLevel,
                  lessonId: lesson?.id,
                  lessonTitle: lesson?.title,
                });
              }}
              className="w-full"
              showSearch
            />
          </div>
        </div>
        <br />
        <Text>
          <b>Summary Statistics</b>
        </Text>
        <Card>
          {customMessage ? (
            <Result
              status={customMessage.type as ResultStatusType}
              title={customMessage.content}
            />
          ) : (
            <Row gutter={16} className="flex justify-center">
              <Col span={8}>
                <Card bordered={true}>
                  <Statistic
                    title="Total Tutorials Generated"
                    value={summaryStatisticsTutorial?.totalTutorialCount}
                    prefix={<BookOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={true}>
                  <Statistic
                    title="Average Tutorial Completion Rate"
                    value={summaryStatisticsTutorial?.tutorialCompletionRateAvg}
                    precision={2}
                    valueStyle={
                      summaryStatisticsTutorial?.tutorialCompletionRateAvg < 50
                        ? { color: "#FF0000" }
                        : { color: "#4CAF50 " }
                    }
                    prefix={
                      summaryStatisticsTutorial?.tutorialCompletionRateAvg <
                      50 ? (
                        <ArrowDownOutlined />
                      ) : (
                        <ArrowUpOutlined />
                      )
                    }
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={true}>
                  <Statistic
                    title="Average Tutorial Score"
                    value={
                      summaryStatisticsTutorial?.tutorialScorePercentageAvg
                    }
                    precision={2}
                    valueStyle={
                      summaryStatisticsTutorial?.tutorialScorePercentageAvg < 50
                        ? { color: "#FF0000" }
                        : { color: "#4CAF50" }
                    }
                    prefix={
                      summaryStatisticsTutorial?.tutorialScorePercentageAvg <
                      50 ? (
                        <ArrowDownOutlined />
                      ) : (
                        <ArrowUpOutlined />
                      )
                    }
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>
          )}
        </Card>
        <Text>
          <br />
          <b>Learner Performance</b>
        </Text>
        : Learner attempts and engagement with tutorial questions
        <Card>
          {customMessage ? (
            <Result
              status={customMessage.type as ResultStatusType}
              title={customMessage.content}
            />
          ) : (
            <Fragment>
              <CustomTwoLevelPieChart chartData={learnerPerformanceTutorial} />
            </Fragment>
          )}
        </Card>
        <Text>
          <br />
          <b>Academic Performance & Learning Strategies</b>
        </Text>
        : Learner attempts and performance with tutorial questions
        <Card>
          {customMessage ? (
            <Result
              status={customMessage.type as ResultStatusType}
              title={customMessage.content}
            />
          ) : (
            <CustomStackedBarChart
              chartData={academicPerformanceAndLearningStrategiesTutorial}
            />
          )}
        </Card>
        <br />
        <Text>
          <b>Affective State</b>:{" "}
        </Text>
        Feedback distribution for tutorial questions
        <Card>
          {customMessage ? (
            <Result
              status={customMessage.type as ResultStatusType}
              title={customMessage.content}
            />
          ) : affectiveStateTutorial?.totalFeedbackCount === 0 ? (
            <Result status="info" title="No data to display." />
          ) : (
            // <Fragment>
            <div className="flex justify-between">
              <div>
                <Text>Total Feedback Distribution</Text>
                <CustomLabeledPieChart
                  chartData={{
                    skippedFeedbackPercentage:
                      affectiveStateTutorial?.skippedFeedbackPercentage?.mcq +
                      affectiveStateTutorial?.skippedFeedbackPercentage
                        ?.shortAnswer,
                    basicFeedbackPercentage:
                      affectiveStateTutorial?.basicFeedbackPercentage.mcq +
                      affectiveStateTutorial?.basicFeedbackPercentage
                        ?.shortAnswer,
                    inDetailFeedbackPercentage:
                      affectiveStateTutorial?.inDetailFeedbackPercentage?.mcq +
                      affectiveStateTutorial?.inDetailFeedbackPercentage
                        ?.shortAnswer,
                  }}
                />
              </div>
              <div>
                <Text>Total MCQ Feedback Distribution</Text>
                <CustomLabeledPieChart
                  chartData={{
                    skippedFeedbackPercentage:
                      affectiveStateTutorial?.skippedFeedbackPercentage?.mcq,
                    basicFeedbackPercentage:
                      affectiveStateTutorial?.basicFeedbackPercentage.mcq,
                    inDetailFeedbackPercentage:
                      affectiveStateTutorial?.inDetailFeedbackPercentage?.mcq,
                  }}
                />
              </div>
              <div>
                <Text>Total Short-Answer Question Feedback Distribution</Text>
                <CustomLabeledPieChart
                  chartData={{
                    skippedFeedbackPercentage:
                      affectiveStateTutorial?.skippedFeedbackPercentage
                        ?.shortAnswer,
                    basicFeedbackPercentage:
                      affectiveStateTutorial?.basicFeedbackPercentage
                        .shortAnswer,
                    inDetailFeedbackPercentage:
                      affectiveStateTutorial?.inDetailFeedbackPercentage
                        ?.shortAnswer,
                  }}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </Fragment>
  );
};

export default TutorialsOverview;
