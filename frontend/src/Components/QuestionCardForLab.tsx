import { useRef } from "react";
import { useLabContext } from "../provider/LabContext";
import { Layout, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const { Content } = Layout;

export default function QuestionCardForLab() {
    const { currentQuestionIndex, totalQuestions, questions, evaluateAnswer, isLoading } = useLabContext();
    const answerRef = useRef<HTMLTextAreaElement>(null);

    // TODO: Implement the handleSubmit function and backend logic
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const answer = answerRef.current?.value;
        if (answer && answer.trim() !== "") {
            evaluateAnswer(answer);
        } else {
            alert("Please provide an answer");
        }
    }
    return (
        <Content className="bg-white flex flex-col mx-auto p-8 w-full max-w-[1300px] max-h-[800] h-min rounded-2xl">
            <form className="" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold my-2">Question {currentQuestionIndex + 1} of {totalQuestions}</h1>
                <p>{questions[currentQuestionIndex]?.question}</p>
                <div className="my-4">
                    <p className="font-semibold my-2">Provide your answer in below text box.</p>
                    <textarea className="overflow-visible bg-sky-950 text-white w-full h-48 p-4 resize-none custom-scrollbar" ref={answerRef} />
                </div>
                <div className="flex justify-end items-center">
                    {/** TODO:Change the color to white */}
                    {isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" className="border-white" /> : <button className="bg-blue-600 text-white py-2 px-4 w-max rounded-xl">{"Submit"}</button>}
                </div>
            </form>
        </Content>
    );
}