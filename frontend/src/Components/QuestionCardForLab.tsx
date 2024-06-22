import { useRef } from "react";
import { useLabContext } from "../provider/LabContext";

export default function QuestionCardForLab() {
    const { currentQuestionIndex, totalQuestions, questions } = useLabContext();
    const answerRef = useRef<HTMLTextAreaElement>(null);

    // TODO: Implement the handleSubmit function and backend logic
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const answer = answerRef.current?.value;
        if (answer && answer.trim() !== "") {
            alert(answer);
        } else {
            alert("Please provide an answer");
        }
    }
    return (
        <form className="bg-slate-100 flex flex-col mx-auto p-8 w-full max-w-[1000px]  h-max max-h-[800] rounded-2xl overflow-auto" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold my-2">Question {currentQuestionIndex + 1} of {totalQuestions}</h1>
            <p>{questions[currentQuestionIndex].question}</p>
            <div className="my-4">
                <p className="font-semibold my-2">Provide your answer in below text box.</p>
                <textarea className="overflow-visible bg-sky-950 text-white w-full h-48 rounded-xl p-4 resize-none custom-scrollbar" ref={answerRef} />
            </div>
            <div className="flex justify-end">
                <button className="bg-blue-600 text-white py-2 px-4 w-max rounded-xl">Submit</button>
            </div>
        </form>
    );
}