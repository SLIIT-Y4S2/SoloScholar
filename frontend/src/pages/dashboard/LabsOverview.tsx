import { useContext, useEffect, useState } from "react";
import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";
import { DashboardAnalyticsContext } from "../../provider/DashboardAnalyticsContext";
import { Card, Col, Result, Row, Select, Statistic, Typography } from "antd";
import { ResultStatusType } from "antd/es/result";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BookOutlined,
} from "@ant-design/icons";
import CustomSimpleBarChartLab from "../../Components/dashboard/CustomSimpleBarChartLab";

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

const LabsOverview = () => {
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
    getLabAnalytics,
    academicPerformanceAndLearningStrategiesLab,
    summaryStatisticsLab,
    customMessage,
  } = useContext(DashboardAnalyticsContext);

  useEffect(() => {
    (async () => {
      const lessons = await getLessonsOfModule("1"); // Make this moduleId dynamic
      setLessons(lessons);
      setLesson(lessons?.[0]);
      await getLabAnalytics({
        moduleId: 1, // Make this moduleId dynamic
        learningLevel: learningLevel,
        lessonId: lessons?.[0]?.id,
        lessonTitle: lessons?.[0]?.title,
      });
    })();
  }, []);

  console.log(
    "academicPerformanceAndLearningStrategiesLab",
    academicPerformanceAndLearningStrategiesLab
  );
  return (
    <Fragment>
      <BreadCrumb sidebarOption={{ label: "Labs Overview" }} />
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
                await getLabAnalytics({
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
                await getLabAnalytics({
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
                    title="Total Labsheets Generated"
                    value={summaryStatisticsLab?.totalLabsheetCount}
                    prefix={<BookOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={true}>
                  <Statistic
                    title="Average Labsheet Completion Rate"
                    value={summaryStatisticsLab?.labsheetCompletionRateAvg}
                    precision={2}
                    valueStyle={
                      summaryStatisticsLab?.labsheetCompletionRateAvg < 50
                        ? { color: "#FF0000" }
                        : { color: "#4CAF50 " }
                    }
                    prefix={
                      summaryStatisticsLab?.labsheetCompletionRateAvg < 50 ? (
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
                    title="Average Labsheet Score"
                    value={summaryStatisticsLab?.labsheetScorePercentageAvg}
                    precision={2}
                    valueStyle={
                      summaryStatisticsLab?.labsheetScorePercentageAvg < 50
                        ? { color: "#FF0000" }
                        : { color: "#4CAF50" }
                    }
                    prefix={
                      summaryStatisticsLab?.labsheetScorePercentageAvg < 50 ? (
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
          <b>Academic Performance & Learning Strategies</b>
        </Text>
        : Learner attempts and performance with labsheet questions
        <Card>
          {customMessage ? (
            <Result
              status={customMessage.type as ResultStatusType}
              title={customMessage.content}
            />
          ) : (
            <CustomSimpleBarChartLab
              chartData={academicPerformanceAndLearningStrategiesLab}
            />
          )}
        </Card>
        <br />
      </div>
    </Fragment>
  );
};

export default LabsOverview;
