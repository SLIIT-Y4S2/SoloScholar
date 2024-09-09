import { Button, Layout, message, Skeleton, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { generateLabExercise } from "../../../../services/lab.service";
import { useLabContext } from "../../../../provider/lab/LabContext";
import GenerateLabModal from "../../../../Components/lab/GenerateLabModal";
import GeneratingView from "../../../../Components/tutorial/GeneratingView";

export default function LabOverview() {
    const { module, lesson } = useParams();
    const navigate = useNavigate();

    const [generatingNewLabSheet, setGeneratingNewLabSheet] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { isLoading, previousLabSheetSummary, generatedLearningLevel, setIsGenerationError } = useLabContext();

    if (isLoading) {
        console.log(isLoading);
        return <LabSkelton />;
    }

    if (generatingNewLabSheet) {
        return (
            <div className="flex content-center justify-center">
                 <GeneratingView />
            </div>
        );
    }

    const generateLabSheet = async ({
        learningLevel,
    }: {
        learningLevel: string;
    }) => {
        if (!module || !lesson) {
            return;
        }
        setGeneratingNewLabSheet(true);

        await generateLabExercise(module.replace(/-/g, " "), lesson.replace(/-/g, " "), learningLevel)
            .then((response) => {
                const labSheetId = response.data.id;
                navigate(`./session/${labSheetId}`);
            })
            .catch(error => {
                setIsGenerationError(true);
                console.error("Error generating lab sheet: ", error);
                message.error({ content: "Error generating lab sheet", key: error.message, duration: 3});
            })
            .finally(() => {
                setGeneratingNewLabSheet(false);
                setIsModalVisible(false);
            });
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
                <h1 className="text-3xl font-bold">
                    <span className="text-gray-700"> Lab for </span>
                    {(toProperString(lesson ?? ""))}
                </h1>
                <div className="bg-gray-100 rounded-xl p-4">
                    <section className="mb-2">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            How the Lab Works
                        </h2>
                        <ol className="space-y-3 list-decimal list-inside text-gray-600">
                            <li>
                                <strong>Question Presentation:</strong> You'll be presented
                                with questions tailored to your learning level and the
                                lesson's objectives. These may include Multiple Choice
                                Questions (MCQs) and short-answer questions.
                            </li>
                            <li>
                                <strong>Answering Questions:</strong> You can choose which
                                questions to answer. It's not mandatory to answer every
                                question - feel free to skip any that you prefer not to
                                attempt.
                            </li>
                            <li>
                                <strong>Hints:</strong> If you need assistance, hints are
                                available for each question. These are designed to guide your
                                thinking and provide additional support, but using them is
                                entirely optional.
                            </li>
                            <li>
                                <strong>Feedback Options:</strong> After submitting your
                                answer, you can choose from three feedback options:
                                <ul className="pl-5 mt-2 space-y-1 list-disc list-inside">
                                    <li>
                                        Skip feedback (only available if your answer is correct)
                                    </li>
                                    <li>
                                        For more insight, you can request basic feedback, which
                                        provides a quick overview of your response.
                                    </li>
                                    <li>
                                        For in-depth learning, you can opt for detailed feedback,
                                        which offers comprehensive explanations and additional
                                        context.
                                    </li>
                                </ul>
                            </li>
                        </ol>
                    </section>

                    <section className="mb-2">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            Disclaimer
                        </h2>
                        <ul className="space-y-1 list-disc list-inside text-gray-600">
                            <li>
                                This lab uses AI to generate questions, support materials and feedback.
                                While we strive for accuracy, please be aware that
                                AI-generated content may occasionally contain errors.
                            </li>
                            <li>
                                The lab is designed to supplement your learning. Always
                                refer to your official course materials and instructors for
                                authoritative information.
                            </li>
                            <li>
                                Your interactions within this lab are for practice and
                                self-assessment only. They do not constitute formal grading or
                                assessment for your course.
                            </li>
                        </ul>
                    </section>

                    <p className="text-sm text-gray-500 mt-6">
                        By proceeding, you acknowledge that you understand the nature of
                        this AI-assisted lab and agree to use it as a supplementary
                        learning tool.
                    </p>
                </div>

                <div className="flex justify-end">
                    <GenerateLabModal onSubmit={generateLabSheet} onCancel={() => setIsModalVisible(false)} visible={isModalVisible} options={generatedLearningLevel as ["beginner" | "intermediate" | "advanced"]} />
                    <Button type="primary" onClick={() => setIsModalVisible(true)} disabled={generatedLearningLevel?.length === 0}>
                        Generate LabSheet
                    </Button>
                </div>

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


function toProperString(input: string): string {
    const words = input.split("-");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
}

