const { convertFormEntityToFormular } = require("./convertEntities");
let resultOfVerification = {};
/**
 * Verifies the user answer and returns a resultOfVerification object
 *
 * @returns resultOfVerification {
 * - currentQuestion : string = ' 2 + 2 ? ',
 * - currentQuestionKey: string = question1
 * - isCorrect : boolean = true
 * - selectedOption : string = 'option3'
 * }
 */
function verifyAnswers(userAnswer, adminForm) {
    //Make admin form as userAnswer so that it's easier to iterate over
    const adminFormConverted = convertFormEntityToFormular(adminForm);
    let isCorrectCount = 0;

    //TODO:  q1 q2 would be better than question1 and question2
    for (let i = 0; i < Object.keys(adminFormConverted).length; i++) {
        const currentQuestion = `question` + (1 + i);
        const selectedAnswerUser = userAnswer[currentQuestion].selectedOption;
        const correctAnswer = adminFormConverted[currentQuestion].selectedOption;
        // console.log(selectedAnswerUser, correctAnswer);
        let isCorrect = selectedAnswerUser === correctAnswer;

        if(isCorrect){
            isCorrectCount++;
        }

        resultOfVerification[currentQuestion] = {
            question: userAnswer[currentQuestion].question,
            isCorrect: isCorrect,
            selectedOption: selectedAnswerUser,
        };
    }

    let formReadyToSend = { [userAnswer.id]: { ...resultOfVerification } };

    
    console.log({ isCorrectCount });

    return {formReadyToSend: formReadyToSend, correctAnswersNumber: isCorrectCount};
}

module.exports = { verifyAnswers };
