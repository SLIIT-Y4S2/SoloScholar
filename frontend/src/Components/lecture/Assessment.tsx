import { useState, useEffect } from 'react';
import { Spin, Radio, Button, Alert, message, Progress, Card, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useLectureContext } from "../../provider/lecture/useLectureContext";
import { submitAnswerByQuestionId } from "../../services/lecture.service"; // Assuming this service exists

const { Title, Paragraph } = Typography;

const Assessment = ({ type }: { type: "pre" | "post" }) => {
  const lectureContext = useLectureContext();
  const { lecture, isLoading, error } = lectureContext;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isQuizAlreadyCompleted, setIsQuizAlreadyCompleted] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: number; studentAnswer: string | null }[]>([]);

  useEffect(() => {
    if (lecture && lecture.assessment_question) {
      // Check if all questions for this type are already answered
      const questionsOfType = lecture.assessment_question.filter((q) => q.type === type);
      const isCompleted = questionsOfType.every((q) => q.student_answer !== null);
      setIsQuizAlreadyCompleted(isCompleted);
      setQuizCompleted(isCompleted);

      // Preload the answers if the quiz is completed
      if (isCompleted) {
        const correctCount = questionsOfType.reduce((count, q) => {
          return q.student_answer === q.answer ? count + 1 : count;
        }, 0);
        setCorrectAnswers(correctCount);
      }
    }
  }, [lecture, type]);

  if (isLoading) {
    return <Spin spinning={isLoading} />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!lecture || !lecture.assessment_question) {
    return <Alert message="No assessment data available" type="warning" />;
  }

  const questions = lecture.assessment_question.filter((question) => question.type === type);
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (e: any) => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmit = () => {
    setSubmitted(true);

    // Add selected answer to answers state
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        questionId: currentQuestion.id,
        studentAnswer: selectedAnswer,
      },
    ]);

    if (selectedAnswer === currentQuestion.answer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setQuizCompleted(true);
    } else {
      setSubmitted(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleFinish = async () => {
    try {
      for (const answer of answers) {
        // Submit each answer to the backend
        await submitAnswerByQuestionId(lecture.id, answer.questionId, answer.studentAnswer);
      }
      message.success('All answers saved successfully!');
      setQuizCompleted(true);
      window.location.reload();
    } catch (error) {
      message.error('An error occurred while saving the answers.');
      console.error('Error saving answers:', error);
    }
  };

  // Progress bar for quiz
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  // Show the completed quiz results
  if (isQuizAlreadyCompleted) {
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div style={{ padding: '20px', backgroundColor: '#fff' }}>
        <Title level={3}>{type === "pre" ? "Pre-Assessment Results" : "Post-Assessment Results"}</Title>
        <p>Your score: {scorePercentage}%</p>
        <br></br>
        <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
        {questions.map((question, index) => (
          <Card key={index} style={{ marginTop: '20px' }} bordered>
            <Title level={4}>Question {index + 1}: {question.question}</Title>
            <Paragraph><strong>Correct Answer:</strong> {question.answer}</Paragraph>
            <Paragraph><strong>Your Answer:</strong> {question.student_answer}</Paragraph>
            <Alert
              message={
                question.student_answer === question.answer
                  ? 'You answered correctly!'
                  : 'Incorrect answer'
              }
              type={question.student_answer === question.answer ? 'success' : 'error'}
              icon={question.student_answer === question.answer ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              showIcon
            />
          </Card>
          
        ))}
        </div>
      </div>
    );
  }

  // Show the quiz if not completed
  if (quizCompleted) {
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100); // Calculate the score percentage

    return (
      <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
        <Title level={3}>Assessment Completed</Title>
        <p>Your score: {scorePercentage}%</p>
        <Alert
          message={`Assignment completed. Your score is ${scorePercentage}%`}
          type="success"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <Title level={3}>{type === "pre" ? "Pre-Assessment" : "Post-Assessment"}</Title>
      {type === "pre" && (
        <p style={{marginTop:"20px", fontSize:"18px", marginBottom:"20px"}}>We're here to test your knowledge before the lecture begins to see how well you know the facts related to this topic.</p>
      )}
      <Progress percent={progressPercentage} status="active" style={{ marginBottom: '16px' }} />
      <p style={{ fontWeight: 'bold' }}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
      <br />

      <Title level={4}>{currentQuestion.question}</Title>
      <Radio.Group
        onChange={handleAnswerChange}
        value={selectedAnswer}
        disabled={submitted}
        style={{ width: '100%' }}
      >
        {currentQuestion.options.map((option: string, index: number) => (
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
            }}
          >
            {option}
          </Radio.Button>
        ))}
      </Radio.Group>

      {submitted && selectedAnswer !== null && (
        <Alert
          message={
            currentQuestion.answer === selectedAnswer
              ? 'Correct Answer!'
              : 'Incorrect Answer!'
          }
          type={currentQuestion.answer === selectedAnswer ? 'success' : 'error'}
          icon={currentQuestion.answer === selectedAnswer ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          showIcon
          style={{ marginTop: '16px' }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        {!submitted ? (
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            style={{ marginRight: 8 }}
          >
            Submit
          </Button>
        ) : currentQuestionIndex === questions.length - 1 ? (
          <Button type="primary" onClick={handleFinish}>
            Finish
          </Button>
        ) : (
          <Button type="primary" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default Assessment;
