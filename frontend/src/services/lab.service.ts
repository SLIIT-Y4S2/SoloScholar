export async function evaluateStudentsAnswer(studentsAnswer: string, correctAnswer: string): Promise<boolean> {
    //Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
}

export async function getLabExercise(module: string, lesson: string) {

}
