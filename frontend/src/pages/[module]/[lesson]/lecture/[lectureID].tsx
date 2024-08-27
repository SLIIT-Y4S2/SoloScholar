import React, { useState } from "react";
import { Layout, Spin, Menu, Button } from "antd";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { ModuleProvider } from "../../../../provider/ModuleContext";
import { CheckOutlined } from "@ant-design/icons";
import Assessment from "../../../../Components/lecture/Assessment";
import { LectureProvider } from "../../../../provider/lecture/LectureContext";
import { useLectureContext } from "../../../../provider/lecture/useLectureContext";

// @ts-ignore
import { Experience } from "../../../../Components/lecture/Experience.jsx"; // Import the Ex1 component

const { Content, Sider } = Layout;

function Lecture() {
    const [selectedKey, setSelectedKey] = useState<string>("sub1");
    const [showEx1, setShowEx1] = useState(false);

    const lectureContext = useLectureContext();
    const { lecture, isLoading, error } = lectureContext;

    const handleMenuClick = (e: { key: string }): void => {
        setShowEx1(false); // Reset the showEx1 state to false when a new menu item is clicked
        setSelectedKey(e.key);
    };

    const handleCompleteLecture = () => {
        setShowEx1(true); // Set the state to show the Ex1 component
    };

    const renderContent = (): JSX.Element => {
        if (showEx1) {
            return <Experience />; // Render the Ex1 component when showEx1 is true
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
            (_, index: number) => `sub${index + 1}` === selectedKey
        );

        return (
            <div>
                <h2>{selectedSubLecture?.topic}</h2>
                <p>{selectedSubLecture?.content}</p>
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
            <Layout className="flex flex-col gap-8 my-6 mx-4 h-max">
                <CustomBreadcrumb />
                <Layout style={{ padding: "24px 0", background: "#fff" }}>
                    <Sider style={{ background: "#fff" }} width={200}>
                        <Menu
                            mode="inline"
                            selectedKeys={[selectedKey]}
                            defaultOpenKeys={["sub1"]}
                            style={{ height: "100%" }}
                            onClick={handleMenuClick}
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
                    <Content style={{ padding: "0 24px", minHeight: 550 }}>
                        {renderContent()}
                        {selectedKey !== "pre-assessment" && selectedKey !== "post-assessment" && !showEx1 && (
                            <Button type="primary" onClick={handleCompleteLecture}>
                                View Lecture
                            </Button>
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
