import { Content } from "antd/es/layout/layout";
import React from "react";
import { useTutorialContext } from "../../../../../provider/TutorialContext";
import QuestionCardForTutorialFeedback from "./QuestionCardForTutorialFeedback";
import { Button, Form, Radio } from "antd";

const RequestFeedback = () => {
  const { questions, isLoading, requestFeedback } = useTutorialContext();

  if (isLoading || questions.length === 0) {
    return <>Loading...</>;
  }
  return (
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
      <h1 className="text-2xl font-bold">Customise Your Feedback</h1>
      <p className=" border rounded-lg p-4 bg-white shadow-md">
        You have completed the questions. Below, you'll find which questions you
        got correct and which ones you got wrong. For each question, you can
        choose the level of explanation you need to enhance your understanding:
        <br />
        1. <strong>Skip</strong>: If you feel confident in your understanding,
        you can skip the explanation. <br />
        2. <strong>Basic Explanation</strong>: Choose this option for a brief
        overview and clarification of the correct answer.
        <br />
        3. <strong>In-depth Explanation</strong>: Select this for a
        comprehensive explanation, including detailed reasoning and additional
        context.
        <br />
        Feel free to review the basic or in-depth explanations for both correct
        and incorrect answers to reinforce your knowledge.
      </p>

      <Form
        onFinish={(values) => {
          console.log(values);
          requestFeedback(
            questions.map((question) => ({
              questionNumber: question.question_number,
              feedbackType: values[question.question_number],
            }))
          );
        }}
        className="flex flex-col gap-4"
      >
        {questions.map((question) => (
          <div
            key={question.question_number}
            className="flex justify-between 
        items-center gap-4 p-4 border rounded-lg bg-white shadow-md
        "
          >
            <QuestionCardForTutorialFeedback question={question} />
            <div className="flex flex-col">
              Explanation
              <Form.Item
                name={`${question.question_number}`}
                initialValue={
                  question.isStudentAnswerCorrect ? "skip" : "basic"
                }
              >
                <Radio.Group
                  // onChange={(e) => console.log(e.target.value)}
                  // value={question.feedbackType}
                  className="flex flex-col gap-2"
                >
                  <Radio
                    value={"skip"}
                    disabled={!question.isStudentAnswerCorrect}
                  >
                    Skip
                  </Radio>
                  <Radio value={"basic"}>Basic</Radio>
                  <Radio value={"detailed"}>Detailed</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        ))}
        <Button type="primary" className="mt-4 ml-auto" htmlType="submit">
          Start Feedback Session
        </Button>
      </Form>
    </Content>
  );
};

export default RequestFeedback;
