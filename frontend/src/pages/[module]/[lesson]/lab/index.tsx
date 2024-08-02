import { Button, Form, Layout, Progress, Select, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosInstance";
import { API_URLS } from "../../../../utils/api_routes";
import { AxiosError, AxiosResponse } from "axios";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { generateLabExercise } from "../../../../services/lab.service";

export default function LabOverview() {
    const { module, lesson } = useParams();
    const navigate = useNavigate();

    const [generatingNewLabSheet, setGeneratingNewLabSheet] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    const [pastLabSheets, setPastLabSheets] = useState<
        {
            id: string;
            create_at: string;
            status: string;
            learning_level: string;
        }[]
    >();

    useEffect(() => {
        if (!module || !lesson) {
            return;
        }
        axiosInstance
            .get(API_URLS.TUTORIAL, {
                params: {
                    moduleName: module.replace(/-/g, " "),
                    lessonTitle: lesson.replace(/-/g, " "),
                },
            })
            .then((response: AxiosResponse) => {
                setPastLabSheets(response.data.data);
                setLoading(false);
            })
            .catch((error: AxiosError) => {
                console.log("Error fetching past labSheets:");
                const data = error.response?.data;
                if (data && typeof data === "object" && "message" in data) {
                    // message.error(data.message);
                    setError(data.message as string);
                }
                setLoading(false);
            });
    }, [lesson, module]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (generatingNewLabSheet) {
        return <LabSheetGenerating />;
    }

    const generateLabSheet = async ({
        learningLevel,
    }: {
        learningLevel: string;
    }) => {
        try {
            if (!module || !lesson) {
                return;
            }
            setGeneratingNewLabSheet(true);

            const response = await generateLabExercise(module.replace(/-/g, " "), lesson.replace(/-/g, " "), learningLevel);

            const labSheetId = response.data.id;
            navigate(`./${labSheetId}`);
        } catch (error) {
            console.log("Error generating labSheet:", error);
        }
    };

    return (
        <Layout style={{ padding: "0 24px 24px" }}>
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: "#ffff",
                    borderRadius: "15px",
                }}
                className="flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold">Introduction</h1>
                <p>
                    Lorem ipsum dolor sit amet consectetur. Vitae neque dui est elit diam
                    risus. Integer nunc risus et elit dictum vitae in lorem sit. Felis
                    enim aliq uam sit et eleifend. Ac consectetur porta congue eros velit
                    lacinia dui. Commodo eu purus arcu consectetur. Cursus leo tempus
                    lacinia nisl vel sus pendisse imperdiet ph. aretra volutpat. Nulla dui
                    dui venenatis pulvinar in mi erat. Semper ac mattis curabitur nullam
                    sit augue eget id ma ecenas. Commodo feugiat facilisi a purus cursus
                    cras amet. Sit tempor vitae adipiscing a purus ac nulla. Bibendum
                    pellentesque eget dic tumst justo etiam in fringilla. Iaculis augue at
                    venenatis nulla eu donec nisl. Habitasse sem arcu rhoncus gravida
                    viverra nibh. Feugiat ut n ibh vitae accumsan id congue viverra.
                </p>
                <Form layout="vertical" onFinish={generateLabSheet}>
                    <div className="flex flex-row items-center gap-2">
                        <div className="mb-6">Select Learning Level</div>
                        <Form.Item
                            name="learningLevel"
                            rules={[
                                { required: true, message: "Please select a learning level" },
                            ]}
                            className="flex flex-col mb-6"
                            style={{ minWidth: "130px" }}
                        >
                            <Select placeholder="Select">
                                <Select.Option value="beginner">Beginner</Select.Option>
                                <Select.Option value="intermediate">Intermediate</Select.Option>
                                <Select.Option value="advanced">Advanced</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="flex justify-end">
                        <Button type="primary" htmlType="submit">
                            Generate LabSheet
                        </Button>
                    </div>
                </Form>

                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Generated LabSheets</h2>
                    <Table
                        dataSource={pastLabSheets}
                        pagination={false}
                        className="max-w-4xl "
                        rowKey="id"
                    >
                        <Table.Column
                            title="Created"
                            dataIndex="create_at"
                            render={(text) => {
                                const date = new Date(text);
                                const formattedDate = `${date.getMonth() + 1
                                    }/${date.getDate()}/${date.getFullYear() % 1000}`;
                                const formattedTime = `${date.getHours()}:${String(
                                    date.getMinutes()
                                ).padStart(2, "0")}`;
                                return `${formattedDate} ${formattedTime}`;
                            }}
                        />
                        <Table.Column title="Learning Level" dataIndex="learning_level" />
                        {/* <Table.Column title="Score" dataIndex="score" /> */}
                        <Table.Column title="Status" dataIndex="status" />
                        <Table.Column
                            title="Action"
                            dataIndex="id"
                            render={(id: string) => (
                                <Link to={`./${id}`}>
                                    <Button type="primary">View</Button>
                                </Link>
                            )}
                        />
                    </Table>
                </div>
            </Content>
        </Layout>
    );
}

const LabSheetGenerating = () => {
    const [percent, setPercent] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setPercent((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* <Spin size="large" /> */}
            <Progress
                percent={percent}
                status="active"
                showInfo={false}
                className="w-1/2"
            />
            <p>Loading... Please wait for about 2 minutes.</p>
        </div>
    );
};
