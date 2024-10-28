import { Card, Col, Result, Row, Select, Statistic, Typography } from "antd";
import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import { DashboardAnalyticsContext } from "../../provider/DashboardAnalyticsContext";
import { ResultStatusType } from "antd/es/result";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EyeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import CustomSimpleBarChartLecture from "../../Components/dashboard/CustomSimpleBarChartLecture";

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

const LecturesOverview = () => {
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
    getLectureAnalytics,
    summaryStatisticsLecture,
    engagementAndPerformanceLecture,
    customMessage,
  } = useContext(DashboardAnalyticsContext);

  useEffect(() => {
    (async () => {
      const lessons = await getLessonsOfModule("1"); // Make this moduleId dynamic
      setLessons(lessons);
      setLesson(lessons?.[0]);
      await getLectureAnalytics({
        moduleId: 1, // Make this moduleId dynamic
        learningLevel: learningLevel,
        lessonId: lessons?.[0]?.id,
        lessonTitle: lessons?.[0]?.title,
      });
    })();
  }, []);

  return (
    <Fragment>
      <BreadCrumb sidebarOption={{ label: "Lectures Overview" }} />
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
                await getLectureAnalytics({
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
                await getLectureAnalytics({
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
                    title="Total Lectures Generated"
                    value={summaryStatisticsLecture?.totalLectureCount}
                    prefix={<VideoCameraOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={true}>
                  <Statistic
                    title="Average Videos Watched (out of 9)"
                    value={
                      summaryStatisticsLecture?.subLectureVideosCompletedAvg
                    }
                    precision={2}
                    valueStyle={
                      summaryStatisticsLecture?.subLectureVideosCompletedAvg <
                      4.5
                        ? { color: "#FF0000" }
                        : { color: "#4CAF50" }
                    }
                    prefix={<EyeOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={true}>
                  <Statistic
                    title="Average Completion Rate"
                    value={summaryStatisticsLecture?.lectureCompletionRateAvg}
                    precision={2}
                    valueStyle={
                      summaryStatisticsLecture?.lectureCompletionRateAvg < 50
                        ? { color: "#FF0000" }
                        : { color: "#4CAF50" }
                    }
                    prefix={
                      summaryStatisticsLecture?.lectureCompletionRateAvg <
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
          <b>Engagement and Performance</b>
        </Text>
        : Learner engagement, participation and performance
        <Card>
          {customMessage ? (
            <Result
              status={customMessage.type as ResultStatusType}
              title={customMessage.content}
            />
          ) : (
            <CustomSimpleBarChartLecture
              chartData={engagementAndPerformanceLecture}
            />
          )}
        </Card>
      </div>
    </Fragment>
  );
};

export default LecturesOverview;
