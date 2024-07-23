export async function evaluateStudentAnswer(
    studentAnswer: string,
    correctAnswer: string
) {

    console.log("Evaluating answer ________", studentAnswer);

    // setTimeout(() => {
        return studentAnswer === correctAnswer;
    // }, 15000);
}