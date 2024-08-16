import React, { useState } from 'react';
import { Button, Radio, Alert, notification, RadioChangeEvent } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

interface Option {
  option: string;
  correct: boolean;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface AssessmentProps {
  type: string;
}

const Assessment: React.FC<AssessmentProps> = ({ type }) => {
  // Dummy questions data
  const questions: Question[] = [
    {
      id: 1,
      question: 'What is the capital of France?',
      options: [
        { option: 'Berlin', correct: false },
        { option: 'Madrid', correct: false },
        { option: 'Paris', correct: true },
        { option: 'Rome', correct: false },
      ],
    },
    {
      id: 2,
      question: 'What is 2 + 2?',
      options: [
        { option: '3', correct: false },
        { option: '4', correct: true },
        { option: '5', correct: false },
        { option: '6', correct: false },
      ],
    },
    {
      id: 3,
      question: 'Which planet is known as the Red Planet?',
      options: [
        { option: 'Earth', correct: false },
        { option: 'Mars', correct: true },
        { option: 'Jupiter', correct: false },
        { option: 'Venus', correct: false },
      ],
    },
    // Add more questions as needed
  ];

  // State to keep track of current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // State to store selected answers
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  // State to track if the answer was submitted
  const [submitted, setSubmitted] = useState<boolean>(false);
  // State to track if assessment is complete
  const [assessmentComplete, setAssessmentComplete] = useState<boolean>(false);
  // State to track the score
  const [score, setScore] = useState<number>(0);
  // State to store completion time and date
  const [completionTime, setCompletionTime] = useState<string | null>(null);

  // Handle answer selection
  const handleAnswerChange = (e: RadioChangeEvent): void => {
    setSelectedAnswer(e.target.value);
  };

  // Handle submission
  const handleSubmit = (): void => {
    setSubmitted(true);
    const correctAnswer = questions[currentQuestionIndex].options.find(
      (option) => option.correct
    )?.option;

    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }
  };

  // Handle navigation to next question
  const handleNext = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null); // Reset answer selection
      setSubmitted(false); // Reset submitted state
    } else {
      // When all questions are done
      setAssessmentComplete(true);
      setCompletionTime(new Date().toLocaleString());
      notification.success({
        message: 'Assessment Complete',
        description: 'You have completed all the questions.',
        placement: 'topRight',
      });
    }
  };

  // Handle navigation to previous question
  const handlePrev = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null); // Reset answer selection
      setSubmitted(false); // Reset submitted state
    }
  };

  if (assessmentComplete) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
        <h2>{type} Assessment</h2>
        <h3>Assessment Complete</h3>
        <p>Your Grade: {((score / questions.length) * 100).toFixed(2)}%</p>
        <p>Completed on: {completionTime}</p>
      </div>
    );
  }

  // Current question data
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <h2>{type} Assessment</h2>
      <p style={{ fontWeight: 'bold' }}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
      <br />

      <h3>{currentQuestion.question}</h3>
      <br></br>
      <div style={{ marginBottom: '16px' }}>
        <Radio.Group
          onChange={handleAnswerChange}
          value={selectedAnswer}
          disabled={submitted}
          style={{ width: '100%' }}
        >
          {currentQuestion.options.map((option, index) => (
            <Radio.Button
              key={index}
              value={option.option}
              style={{
                display: 'block',
                width: '100%',
                backgroundColor:
                  submitted && option.correct
                    ? '#d4edda'
                    : submitted && selectedAnswer === option.option && !option.correct
                    ? '#f8d7da'
                    : '',
                color: submitted && (option.correct || selectedAnswer === option.option) ? '#155724' : '',
                borderColor: submitted && option.correct ? '#c3e6cb' : '',
                textAlign: 'left',
                padding: '10px 16px',
                marginBottom: '8px',
                borderRadius: '4px',
                lineHeight: '1.5',
                alignItems: 'center', // Align content vertically
                justifyContent: 'center', // Align content horizontally
                minHeight: '40px', // Ensure a minimum height for better centering
              }}
            >
              {option.option}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      {submitted && selectedAnswer !== null && (
        <Alert
          message={
            currentQuestion.options.find((option) => option.correct)?.option === selectedAnswer
              ? 'Correct Answer!'
              : 'Incorrect Answer!'
          }
          type={currentQuestion.options.find((option) => option.correct)?.option === selectedAnswer ? 'success' : 'error'}
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
