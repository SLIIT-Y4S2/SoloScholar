import { Content } from "antd/es/layout/layout";
import { useLabSessionContext } from "../../provider/lab/LabSessionContext";
import { SupportMaterialsForLab } from "./SupportMaterialsForLab";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button, Collapse, CollapseProps, Modal } from "antd";
import { FileMarkdownOutlined } from "@ant-design/icons";

export function CompletedLab() {
    const { questions, } = useLabSessionContext();
    const [isSupportMaterialModelOpen, setIsSupportMaterialModelOpen] = useState<boolean>(false);
    const { labSheetId } = useParams();

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <p className="text-base leading-5">Summary</p>,
            children: (<div className="flex">
                <table className="table-auto w-full">
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Total Questions</td>
                            <td className="border px-4 py-2 text-right">{questions.length}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Correct Answers</td>
                            <td className="border px-4 py-2 text-right">{questions.filter(question => question.is_correct).length}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Incorrect Answers</td>
                            <td className="border px-4 py-2 text-right">{questions.filter(question => !question.is_correct).length}</td>
                        </tr>
                    </tbody>
                </table>
            </div>),
        },
    ];

    return (
        <>
            <Modal open={isSupportMaterialModelOpen} onCancel={() => setIsSupportMaterialModelOpen(false)} width={1000} footer={[]}>
                <SupportMaterialsForLab isNewTab={false} labSheetId={labSheetId} />
            </Modal>
            <Content className="flex justify-center">
                <div className="flex flex-col gap-4 bg-white px-10 py-8 rounded-2xl container">
                    <div className="flex flex-row justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold">Lab Completed</h1>
                            <p className="text-lg">You have successfully completed the lab.</p>
                        </div>
                        <Button className="w-max" onClick={() => setIsSupportMaterialModelOpen(true)}><FileMarkdownOutlined />Support Material</Button>
                    </div>
                    <Collapse items={items} />
                    <div className="flex flex-col gap-4">
                        {questions.map((question) =>
                            <div key={question.id} className="flex flex-col gap-4 bg-gray-200 p-4 rounded-xl">
                                <div className="flex flex-row justify-between px-1 py-2">
                                    <h1 className="text-lg font-semibold">{`Question ${question.question_number}`}</h1>
                                    <h1 className={`${question.is_correct ? "text-emerald-500" : "text-red-500"} text-lg font-semibold`}>
                                        {`Your answer was ${question.is_correct ? "Correct" : "Incorrect"}`}
                                    </h1>
                                    <h1 className="text-base">
                                        Number of attempts: {question.attempts}
                                    </h1>
                                </div>
                                <div className="bg-white px-4 py-2 rounded-xl">
                                    <p className="font-semibold">Question</p>
                                    <p className="  ">{question.question}</p>
                                </div>
                                <div className="flex flex-col gap-4 justify-between bg-white px-4 py-2 rounded-xl">
                                    {question.is_correct ?
                                        (<>
                                            <p className="font-semibold">Your Answer</p>
                                            <pre>{question.answer}</pre>
                                        </>) :
                                        (
                                            <>
                                                <p className="font-semibold rounded-xl">Correct Answer</p>
                                                <pre>{question.answer}</pre>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Content>
        </>
    )
}