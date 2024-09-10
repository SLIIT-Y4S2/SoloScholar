import { useEffect, useState } from "react";
import { Layout, Spin, Menu, Button, Typography, Row, Col } from "antd";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { ModuleProvider } from "../../../../provider/ModuleContext";
import { CheckOutlined } from "@ant-design/icons";
import Assessment from "../../../../Components/lecture/Assessment";
import { LectureProvider } from "../../../../provider/lecture/LectureContext";
import { useLectureContext } from "../../../../provider/lecture/useLectureContext";

const { Title, Text } = Typography;

// @ts-ignore
import { Experience } from "../../../../Components/lecture/Experience.jsx";

// @ts-ignore
import { useAITeacher } from "../../../../hooks/useAITeacher.js";
import { useLocation, useParams } from "react-router-dom";

const { Content, Sider } = Layout;

function Lecture() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { learningLevel } = location.state as { learningLevel: string };
    const lectureContext = useLectureContext();
    const { lecture, isLoading, error, setSelectedKey, setCurrentSubLectureContent, setCurrentSubLectureTopic } = lectureContext;

    const [showEx1, setShowEx1] = useState(false);

    const stopLecture = useAITeacher((state: { stopLecture: any; }) => state.stopLecture); // Get stopLecture from useAITeacher

    const handleMenuClick = (e: { key: string }): void => {
        stopLecture(); // Stop the current lecture when the user clicks a new sub-lecture

        setShowEx1(false);
        setSelectedKey(e.key); // Switch the selected key
    };

    const handleCompleteLecture = () => {
        setShowEx1(true);
    };

    useEffect(() => {
        const selectedSubLecture = lecture?.sub_lecture?.find(
            (_, index: number) => `sub${index + 1}` === lectureContext.selectedKey
        );

        if (selectedSubLecture) {
            setCurrentSubLectureContent(selectedSubLecture.content);
            setCurrentSubLectureTopic(selectedSubLecture.topic);
        }
    }, [lectureContext.selectedKey]); // Update based on the selected key

    // Function to return the appropriate color based on learning level
    const getLearningLevelColor = (level: string): string => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return 'green';
            case 'intermediate':
                return 'orange';
            case 'advanced':
                return 'red';
            default:
                return 'black';
        }
    };

    const renderContent = (): JSX.Element => {
        if (showEx1) {
            return <Experience />;
        }

        if (!lecture || !lecture.sub_lecture) {
            return <div>No content available</div>;
        }

        if (lectureContext.selectedKey === "pre-assessment") {
            return <Assessment type="pre" />;
        } else if (lectureContext.selectedKey === "post-assessment") {
            return <Assessment type="post" />;
        }

        const selectedSubLecture = lecture.sub_lecture.find(
            (_, index: number) => `sub${index + 1}` === lectureContext.selectedKey
        );

        const currentSubContent = selectedSubLecture?.content ?? null;
        const currentSubTopic = selectedSubLecture?.topic ?? null;
        setCurrentSubLectureContent(currentSubContent);
        setCurrentSubLectureTopic(currentSubTopic);

        return (
            <div style={{ padding: '24px', borderRadius: '8px' }}>
                <Row>
                    <Col flex={5}><Title level={3}>{selectedSubLecture?.topic}</Title></Col>
                    <Col flex={0}>
                        <Text style={{ color: getLearningLevelColor(learningLevel) }}>
                            {learningLevel}
                        </Text>
                    </Col>
                </Row>

                <br />
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <p style={{ width: '100%', justifyContent: 'center' }}>{selectedSubLecture?.content}</p>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", marginTop: "20%" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!lecture) {
        return <div>No lecture data available</div>;
    }

    return (
        <ModuleProvider>
            <Layout className="flex flex-col gap-8 my-6 mx-4 h-max container mx-auto mt-3">
                <CustomBreadcrumb />
                <Layout style={{ padding: "24px 0", background: "#fff" }}>
                    <Sider style={{ background: "#fff" }} width={200}>
                        <Menu
                            mode="inline"
                            selectedKeys={[lectureContext.selectedKey]}
                            defaultOpenKeys={["sub1"]}
                            style={{ height: "100%" }}
                            onClick={handleMenuClick} // Updated to stop the lecture
                            items={[
                                ...lecture.sub_lecture.flatMap((sub_lecture: any, index: number) => {
                                    const items = [
                                        {
                                            key: `sub${index + 1}`,
                                            label: (
                                                <span>
                                                    {sub_lecture.topic}
                                                    {sub_lecture.is_completed && (
                                                        <CheckOutlined style={{ color: "blue", marginLeft: 8 }} />
                                                    )}
                                                </span>
                                            ),
                                        },
                                    ];

                                    if (index === 0) {
                                        items.push({
                                            key: "pre-assessment",
                                            label: <span>Pre-Assessment</span>,
                                        });
                                    }

                                    if (index === lecture.sub_lecture.length - 1) {
                                        items.push({
                                            key: "post-assessment",
                                            label: <span>Post-Assessment</span>,
                                        });
                                    }

                                    return items;
                                }),
                            ]}
                        />
                    </Sider>

                    <Content style={{ padding: "24px", minHeight: 530 }}>
                        {renderContent()}
                        {lectureContext.selectedKey !== "pre-assessment" &&
                            lectureContext.selectedKey !== "post-assessment" &&
                            !showEx1 && (
                                <div style={{ padding: '24px' }}>
                                    <Button type="primary" onClick={handleCompleteLecture}>
                                        View Lecture
                                    </Button>
                                </div>
                            )}
                    </Content>
                </Layout>
            </Layout>
        </ModuleProvider>
    );
}

export default function LectureView() {
    return (
        <LectureProvider>
            <Lecture />
        </LectureProvider>
    );
}
