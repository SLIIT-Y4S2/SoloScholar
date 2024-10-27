import { Content } from "antd/es/layout/layout";
import { useLabSessionContext } from "../../provider/lab/LabSessionContext";
import { SupportMaterialsForLab } from "./SupportMaterialsForLab";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button, Collapse, CollapseProps, Modal } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileMarkdownOutlined, QuestionCircleOutlined, TrophyOutlined } from "@ant-design/icons";
import StatisticCard from "../StatisticCard";

export function CompletedLab() {
    const { questions, areasForImprovement, strengths, recommendations, overallScore, isFeedbackEnabled } = useLabSessionContext();
    const [isSupportMaterialModelOpen, setIsSupportMaterialModelOpen] = useState<boolean>(false);
    const { labSheetId } = useParams();

    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(question => question.is_correct === true).length;
    const incorrectAnswers = questions.filter(question => question.is_correct === false).length;
    const unansweredQuestions = questions.filter(question => question.is_correct === null).length;

    const items: CollapseProps['items'] = [
        isFeedbackEnabled ? {
            key: '1',
            label: <p className="text-base leading-5">Feedback</p>,
            children: (
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="py-4 w-1/3 text-base font-semibold text-left">Category</th>
                            <th className="py-4 w-2/3 text-base font-semibold text-left">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-4 w-1/3">
                                <h2 className="text-base font-semibold">Areas for Improvement</h2>
                            </td>
                            <td className="py-4 w-2/3 text-base">
                                <ul className="list-disc pl-6 space-y-2">
                                    {areasForImprovement && areasForImprovement.length > 0 && areasForImprovement.map((area, index) => (
                                        <li key={index} className="pl-6 ml-2 relative marker:text-gray-600">
                                            {area}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-4 w-1/3">
                                <h2 className="text-base font-semibold">Strengths</h2>
                            </td>
                            <td className="py-4 w-2/3 text-base">
                                <ul className="list-disc pl-6 space-y-2">
                                    {strengths && strengths.length > 0 && strengths.map((strength, index) => (
                                        <li key={index} className="pl-6 ml-2 relative marker:text-gray-600">
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-4 w-1/3">
                                <h2 className="text-base font-semibold">Recommendations</h2>
                            </td>
                            <td className="py-4 w-2/3 text-base">
                                <ul className="list-disc pl-6 space-y-2">
                                    {recommendations && recommendations.length > 0 && recommendations.map((recommendation, index) => (
                                        <li key={index} className="pl-6 ml-2 relative marker:text-gray-600">
                                            {recommendation}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>

            ),
        } : {},
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
                    <div className="flex flex-row gap-4">
                        {isFeedbackEnabled && <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                            <StatisticCard
                                title="Score"
                                value={`${overallScore}%`}
                                icon={<TrophyOutlined />}
                                color="text-yellow-500"
                            />
                        </div>}
                        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
                            <StatisticCard
                                title="Total Questions"
                                value={totalQuestions}
                                icon={<QuestionCircleOutlined />}
                                color="text-blue-500"
                            />
                        </div>
                        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
                            <StatisticCard
                                title="Correct Answers"
                                value={correctAnswers}
                                icon={<CheckCircleOutlined />}
                                color="text-green-500"
                            />
                        </div>
                        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
                            <StatisticCard
                                title="Incorrect Answers"
                                value={incorrectAnswers}
                                icon={<CloseCircleOutlined />}
                                color="text-red-500"
                            />
                        </div>
                        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
                            <StatisticCard
                                title="Unanswered"
                                value={unansweredQuestions}
                                icon={<ClockCircleOutlined />}
                                color="text-gray-500"
                            />
                        </div>
                    </div>
                    {isFeedbackEnabled && <Collapse items={items} />}
                    <div className="flex flex-col gap-4">
                        {questions.map((question) =>
                            <div key={question.id} className="flex flex-col gap-4 bg-gray-200 p-4 rounded-xl">
                                <div className="flex flex-row justify-between px-1 py-2">
                                    <h1 className="text-lg font-semibold">{`Question ${question.question_number}`}</h1>
                                    <h1 className={`${typeof question.is_correct === "boolean" ? (question.is_correct === true ? "text-green-500" : "text-red-500") : "text-gray-500"} text-base font-semibold`}>

                                        {typeof question.is_correct === "boolean" && (`Your answer was ${question.is_correct === true ? "Correct" : "Incorrect"}`)}
                                        {question.is_correct === null && "You skipped this question"}
                                    </h1>
                                    <h1 className="text-base">
                                        Number of attempts: {question.attempts}
                                    </h1>
                                </div>
                                <div className="bg-white px-4 py-2 rounded-xl">
                                    <p className="text-base font-semibold py-4">Question</p>
                                    <p className="text-base">{question.question}</p>
                                </div>
                                <div className="flex flex-col gap-4 justify-between bg-white px-4 py-2 rounded-xl">
                                    {question.is_correct ?
                                        (<>
                                            <p className="text-base font-semibold py-2">Your Answer</p>
                                            <pre className="text-base py-4">{question.answer}</pre>
                                        </>) :
                                        (
                                            <>
                                                <p className="font-semibold rounded-xl py-2">Correct Answer</p>
                                                <pre>{question.answer}</pre>
                                            </>
                                        )
                                    }
                                </div>
                                {isFeedbackEnabled && question.reflection_on_answer && (
                                    <div className="bg-white px-4 py-2 rounded-xl">
                                        <p className="text-base font-semibold py-4">Your Reflection On Provided Answer</p>
                                        <p className="text-base">{question.reflection_on_answer}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Content >
        </>
    )
}