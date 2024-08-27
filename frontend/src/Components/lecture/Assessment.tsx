import React, { useState } from 'react';
import { Spin, Radio, Button, Alert } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useLectureContext } from "../../provider/lecture/useLectureContext";

const Assessment = ({ type }: { type: "pre" | "post" }) => {
  const lectureContext = useLectureContext();
  const { lecture, isLoading, error } = lectureContext;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (isLoading) {
    return <Spin spinning={isLoading} />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!lecture || !lecture.assessment_question) {
    return <div>No assessment data available</div>;
  }

  // Filter questions based on the type (pre or post)
  const questions = lecture.assessment_question.filter(
    (question: any) => question.type === type
  );

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (e: any) => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrev = () => {
    setSubmitted(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const assessmentComplete = currentQuestionIndex === questions.length - 1;

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <h2>{type === "pre" ? "Pre-Assessment" : "Post-Assessment"}</h2>
      <p style={{ fontWeight: 'bold' }}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
      <br />

      <h3>{currentQuestion.question}</h3>
      <br />
      <div style={{ marginBottom: '16px' }}>
        <Radio.Group
          onChange={handleAnswerChange}
          value={selectedAnswer}
          disabled={submitted}
          style={{ width: '100%' }}
        >
          {currentQuestion.options.map((option: any, index: number) => (
            <Radio.Button
              key={index}
              value={option}
              style={{
                display: 'block',
                width: '100%',
                backgroundColor:
                  submitted && option === currentQuestion.answer
                    ? '#d4edda'
                    : submitted && selectedAnswer === option && option !== currentQuestion.answer
                    ? '#f8d7da'
                    : '',
                color: submitted && (option === currentQuestion.answer || selectedAnswer === option) ? '#155724' : '',
                borderColor: submitted && option === currentQuestion.answer ? '#c3e6cb' : '',
                textAlign: 'left',
                padding: '10px 16px',
                marginBottom: '8px',
                borderRadius: '4px',
                lineHeight: '1.5',
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '40px',
              }}
            >
              {option}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      {submitted && selectedAnswer !== null && (
        <Alert
          message={
            currentQuestion.answer === selectedAnswer
              ? 'Correct Answer!'
              : 'Incorrect Answer!'
          }
          type={currentQuestion.answer === selectedAnswer ? 'success' : 'error'}
          icon={<CheckCircleOutlined />}
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          style={{ marginRight: 8 }}
        >
          Previous
        </Button>
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            style={{ marginRight: 8 }}
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={assessmentComplete}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Assessment;
