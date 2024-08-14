import { Button, Form, Layout, Select, Skeleton, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { generateLabExercise } from "../../../../services/lab.service";
import { useLabContext } from "../../../../provider/lab/LabContext";
import { QuestionCardForLabSkeleton } from "../../../../Components/lab/QuestionCardForLabSkeleton";

export default function LabOverview() {
    const { module, lesson } = useParams();
    const navigate = useNavigate();

    const [generatingNewLabSheet, setGeneratingNewLabSheet] = useState(false);

    const { isLoading, previousLabSheetSummary, setIsGenerationError } = useLabContext();

    if (isLoading) {
        console.log(isLoading);
        return <LabSkelton />;
    }

    if (generatingNewLabSheet) {
        return (
            <div className="flex content-center justify-center">
                <QuestionCardForLabSkeleton />
            </div>
        );
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
            navigate(`./session/${labSheetId}`);
        } catch (error) {
            setIsGenerationError(true);
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
                        dataSource={previousLabSheetSummary!}
                        pagination={false}
                        className="max-w-4xl "
                        rowKey="id"
                    >
                        <Table.Column
                            title="Created"
                            dataIndex="createdAt"
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
                        <Table.Column title="Learning Level" dataIndex="learningLevel" />
                        {/* <Table.Column title="Score" dataIndex="score" /> */}
                        <Table.Column title="Status" dataIndex="status" />
                        <Table.Column
                            title="Action"
                            dataIndex="id"
                            render={(id: string) => (
                                <Link to={`./session/${id}`}>
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

function LabSkelton() {
    const active = true;
    const size = 'default';

    const emptyLabSheetSummary = Array.from({ length: 5 }, (_k, id) => ({
        Created: "",
        "Learning Level": "",
        Status: "",
        Action: id,
    }));

    const columns = Object.keys(emptyLabSheetSummary[0]).map((k, i) => {
        return {
            title: k,
            index: k,
            key: i
        };
    });

    console.log(emptyLabSheetSummary);

    return (
        <Content className="bg-white py-6 px-6 rounded-2xl flex flex-col gap-4">
            {/* <Skeleton title={true} /> */}
            <Skeleton paragraph={{ rows: 4 }} active={active} />
            <div className="flex flex-row justify-between gap-2">
                <Skeleton.Input active={active} size={size} />
                <Skeleton.Input active={active} size={size} />
            </div>

            <Table
                dataSource={[]}
                pagination={false}
                className="max-w-4xl "
                rowKey="_id"
                columns={columns}
                locale={{
                    emptyText: emptyLabSheetSummary.map(empty => <Skeleton.Input key={empty.Action} style={{ marginTop: '10px', width: '100%' }} active={true} block={true} />)
                }}
            />
        </Content>

    )
}
