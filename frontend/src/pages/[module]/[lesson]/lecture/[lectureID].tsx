import { useEffect, useState } from "react";
import { Layout, Spin, Menu, Button, Typography, Row, Col, message } from "antd";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { ModuleProvider } from "../../../../provider/ModuleContext";
import { CheckOutlined } from "@ant-design/icons";
import Assessment from "../../../../Components/lecture/Assessment";
import { LectureProvider } from "../../../../provider/lecture/LectureContext";
import { useLectureContext } from "../../../../provider/lecture/useLectureContext";
import { SubLecture } from "../../../../provider/lecture/LectureContext"; // Import the SubLecture type

const { Title, Text } = Typography;
const { Content, Sider } = Layout;

// @ts-ignore
import { Experience } from "../../../../Components/lecture/Experience.jsx";
// @ts-ignore
import { useAITeacher } from "../../../../hooks/useAITeacher.js";

function Lecture() {
    const lectureContext = useLectureContext();
    const { 
        lecture, 
        isLoading, 
        error, 
        setSelectedKey, 
        setCurrentSubLectureContent, 
        setCurrentSubLectureTopic,
        selectedKey,
        markSubLectureAsCompleted
    } = lectureContext;

    const [showEx1, setShowEx1] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const stopLecture = useAITeacher((state: { stopLecture: any; }) => state.stopLecture);

    const handleMenuClick = (e: { key: string }): void => {
        stopLecture();
        setShowEx1(false);
        setSelectedKey(e.key);
    };

    const handleCompleteLecture = () => {
        setShowEx1(true);
    };

    const handleMarkAsCompleted = async () => {
        if (!lecture) {
            message.error("Lecture data not available");
            return;
        }

        const selectedSubLecture = lecture.sub_lecture.find(
            (_, index) => `sub${index + 1}` === selectedKey
        );

        if (!selectedSubLecture?.id) {
            message.error("Unable to find selected sub-lecture");
            return;
        }

        setIsUpdating(true);
        try {
            await markSubLectureAsCompleted(selectedSubLecture.id);
        } catch (error) {
            console.error("Error marking lecture as completed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        if (!lecture?.sub_lecture) return;

        const selectedSubLecture = lecture.sub_lecture.find(
            (_, index) => `sub${index + 1}` === selectedKey
        );

        if (selectedSubLecture) {
            setCurrentSubLectureContent(selectedSubLecture.content);
            setCurrentSubLectureTopic(selectedSubLecture.topic);
        }
    }, [selectedKey, lecture]);

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

    const calculateReadingTime = (text: string): number => {
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    const renderContent = (): JSX.Element => {
        if (showEx1) {
            return <Experience />;
        }

        if (!lecture || !lecture.sub_lecture) {
            return <div>No content available</div>;
        }

        if (selectedKey === "pre-assessment") {
            return <Assessment type="pre" />;
        } else if (selectedKey === "post-assessment") {
            return <Assessment type="post" />;
        }

        const selectedSubLecture = lecture.sub_lecture.find(
            (_, index) => `sub${index + 1}` === selectedKey
        );

        if (!selectedSubLecture) {
            return <div>No content available</div>;
        }

        return (
            <div style={{ padding: '24px', borderRadius: '8px' }}>
                <Row>
                    <Col flex={5}><Title level={3}>{selectedSubLecture.topic}</Title></Col>
                    <Col flex={0}>
                        <Text style={{ color: getLearningLevelColor(lecture.learning_material.learning_level) }}>
                            {lecture.learning_material.learning_level}
                        </Text>
                    </Col>
                </Row>
                
                <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
                    Estimated reading time: {calculateReadingTime(selectedSubLecture.content)} min
                </Text>

                <br />
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <p style={{ width: '100%', justifyContent: 'center', fontSize: "16px"}}>
                        {selectedSubLecture.content}
                    </p>
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

    const renderMenuItem = (sub_lecture: SubLecture, index: number) => ({
        key: `sub${index + 1}`,
        label: (
            <span style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '230px' 
                }}>
                    {sub_lecture.topic}
                </span>
                {sub_lecture.is_completed && (
                    <CheckOutlined style={{ color: "blue", flexShrink: 0 }} />
                )}
            </span>
        ),
    });

    const menuItems = lecture.sub_lecture.flatMap((sub_lecture, index) => {
        const items = [renderMenuItem(sub_lecture, index)];

        if (index === 0) {
            items.push({
                key: "pre-assessment",
                label: (
                    <span style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <span>Pre-Assessment</span>
                    </span>
                ),
            });
        }

        if (index === lecture.sub_lecture.length - 1) {
            items.push({
                key: "post-assessment",
                label: (
                    <span style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <span>Post-Assessment</span>
                    </span>
                ),
            });
        }

        return items;
    });

    return (
        <ModuleProvider>
            <Layout className="flex flex-col gap-8 my-6 mx-4 h-max container mx-auto mt-3">
                <CustomBreadcrumb />
                <Layout style={{ padding: "24px 0", background: "#fff" }}>
                    <Sider style={{ background: "#fff" }} width={250}>
                        <Menu
                            mode="inline"
                            selectedKeys={[selectedKey]}
                            defaultOpenKeys={["sub1"]}
                            style={{ height: "100%" }}
                            onClick={handleMenuClick}
                            items={menuItems}
                        />
                    </Sider>

                    <Content style={{ padding: "24px", minHeight: 530}}>
                        {renderContent()}
                        {selectedKey !== "pre-assessment" &&
                            selectedKey !== "post-assessment" &&
                            !showEx1 && (
                                <div style={{ padding: '24px' }}>
                                    <Button type="primary" onClick={handleCompleteLecture}>
                                        View Lecture
                                    </Button>

                                    <Button 
                                        onClick={handleMarkAsCompleted} 
                                        style={{marginLeft: "10px"}}
                                        loading={isUpdating}
                                        disabled={isUpdating}
                                    >
                                        Mark as completed
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