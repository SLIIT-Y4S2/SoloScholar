// import React, { useState, useContext } from 'react';
// import { Button, Radio, Alert, notification } from 'antd';
// import { CheckCircleOutlined } from '@ant-design/icons';
// import { useLectureContext } from "../../provider/lecture/useLectureContext";


// const Assessment: React.FC = () => {

//   const lectureContext = useLectureContext(); 
// const { lecture,isLoading,error } = lectureContext;
  
//   const {
//     questions,
//     current_question,
//     setStudentsAnswerForTheCurrentQuestion,
//     submitAnswer,
//     status,
//   } = lectureContext || {}; // Check if lectureContext is null and provide default values
  
//   // Rest of the code remains the same

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
//   const [submitted, setSubmitted] = useState<boolean>(false);
//   const [assessmentComplete, setAssessmentComplete] = useState<boolean>(false);
//   const [score, setScore] = useState<number>(0);
//   const [completionTime, setCompletionTime] = useState<string | null>(null);

//   // Check if questions are loaded before rendering
//   if (!questions || questions.length === 0) {
//     return <div>No questions available for this assessment.</div>;
//   }

//   const handleAnswerChange = (e: any): void => {
//     setSelectedAnswer(e.target.value);
//     if (lectureContext && setStudentsAnswerForTheCurrentQuestion) {
//       setStudentsAnswerForTheCurrentQuestion(e.target.value); // Update the context with the selected answer
//     }
//   };

//   const handleSubmit = (): void => {
//     setSubmitted(true);
//     const correctAnswer = questions[currentQuestionIndex].options.find(
//       (option) => option === questions[currentQuestionIndex].answer
//     );

//     if (selectedAnswer === correctAnswer) {
//       setScore(score + 1);
//     }

//     // Submit the current answer using the context function
//     if (lectureContext && submitAnswer) {
//       submitAnswer(currentQuestionIndex + 1, currentQuestionIndex + 2);
//     }
//   };

//   const handleNext = (): void => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setSelectedAnswer(null);
//       setSubmitted(false);
//     } else {
//       setAssessmentComplete(true);
//       setCompletionTime(new Date().toLocaleString());
//       notification.success({
//         message: 'Assessment Complete',
//         description: 'You have completed all the questions.',
//         placement: 'topRight',
//       });
//     }
//   };

//   const handlePrev = (): void => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//       setSelectedAnswer(null);
//       setSubmitted(false);
//     }
//   };

//   if (assessmentComplete) {
//     return (
//       <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
//         <h2>Assessment</h2>
//         <h3>Assessment Complete</h3>
//         <p>Your Grade: {((score / questions.length) * 100).toFixed(2)}%</p>
//         <p>Completed on: {completionTime}</p>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
//       <h2>Assessment</h2>
//       <p style={{ fontWeight: 'bold' }}>
//         Question {currentQuestionIndex + 1} of {questions.length}
//       </p>
//       <br />

//       <h3>{currentQuestion.question}</h3>
//       <br></br>
//       <div style={{ marginBottom: '16px' }}>
//         <Radio.Group
//           onChange={handleAnswerChange}
//           value={selectedAnswer}
//           disabled={submitted}
//           style={{ width: '100%' }}
//         >
//           {currentQuestion.options.map((option, index) => (
//             <Radio.Button
//               key={index}
//               value={option}
//               style={{
//                 display: 'block',
//                 width: '100%',
//                 backgroundColor:
//                   submitted && option === currentQuestion.answer
//                     ? '#d4edda'
//                     : submitted && selectedAnswer === option && option !== currentQuestion.answer
//                     ? '#f8d7da'
//                     : '',
//                 color: submitted && (option === currentQuestion.answer || selectedAnswer === option) ? '#155724' : '',
//                 borderColor: submitted && option === currentQuestion.answer ? '#c3e6cb' : '',
//                 textAlign: 'left',
//                 padding: '10px 16px',
//                 marginBottom: '8px',
//                 borderRadius: '4px',
//                 lineHeight: '1.5',
//                 alignItems: 'center', // Align content vertically
//                 justifyContent: 'center', // Align content horizontally
//                 minHeight: '40px', // Ensure a minimum height for better centering
//               }}
//             >
//               {option}
//             </Radio.Button>
//           ))}
//         </Radio.Group>
//       </div>

//       {submitted && selectedAnswer !== null && (
//         <Alert
//           message={
//             currentQuestion.answer === selectedAnswer
//               ? 'Correct Answer!'
//               : 'Incorrect Answer!'
//           }
//           type={currentQuestion.answer === selectedAnswer ? 'success' : 'error'}
//           icon={<CheckCircleOutlined />}
//           showIcon
//           style={{ marginBottom: '16px' }}
//         />
//       )}

//       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Button
//           onClick={handlePrev}
//           disabled={currentQuestionIndex === 0}
//           style={{ marginRight: 8 }}
//         >
//           Previous
//         </Button>
//         {!submitted ? (
//           <Button
//             onClick={handleSubmit}
//             disabled={selectedAnswer === null}
//             style={{ marginRight: 8 }}
//           >
//             Submit
//           </Button>
//         ) : (
//           <Button
//             onClick={handleNext}
//             disabled={assessmentComplete}
//           >
//             {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Assessment;