

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
    const adminFormConverted = convertFormEntityToFormular(adminForm)
    
    for(let i = 0 ; i < Object.keys(adminFormConverted).length ; i++){
        const currentQuestion = `question` + (1 + i)
        const selectedAnswerUser = userAnswer[currentQuestion].selectedOption; 
        const correctAnswer = adminFormConverted[currentQuestion].selectedOption;
        console.log(selectedAnswerUser, correctAnswer);

        resultOfVerification[currentQuestion] = {
            isCorrect: selectedAnswerUser === correctAnswer,
            selectedOption: selectedAnswerUser
        }
    }

    console.log(resultOfVerification);
    return resultOfVerification;
}

module.exports = {verifyAnswers}
