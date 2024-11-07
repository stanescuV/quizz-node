/**
 * Verifies each answer in the userAnswers array against the correct answers in the adminForms array.
 * Compares answers question-by-question, assuming they are in the same order in both arrays.
 *
 * @param {Array<Object>} userAnswers - An array of user answers, where each answer is an object containing:
 *   - question {string}: The question text.
 *   - options {Object}: An object with options as key-value pairs.
 *   - selectedOption {string}: The option selected by the user.
 * @param {Array<Object>} adminForms - An array of correct answers provided by the admin, where each entry is an object containing:
 *   - question {string}: The question text.
 *   - options {Array<Object>}: An array of option objects, each with:
 *       - isSelected {boolean}: True if the option is the correct answer.
 *       - [key: string]: The option text itself as a key-value pair.
 * @returns {Array<Object>} An array of results, each containing:
 *   - question {string}: The question text.
 *   - isCorrect {boolean}: True if the user's answer is correct; false otherwise.
 */

const { convertFormEntityToFormular } = require("./convertEntities");

function verifyAnswers(userAnswer, adminForm) {
    //Make admin form as userAnswer so that it's easier to iterate over
    const adminFormConverted = convertFormEntityToFormular(adminForm)
    // console.log(userAnswer, adminFormConverted)
    const selectedAnswerUser = userAnswer['question1'].selectedOption; 
    const correctAnswer = adminFormConverted['question1'].selectedOption;
    if(selectedAnswerUser === correctAnswer){
        console.log('Bravo raspuns corect')
    } else { 
        console.log('Raspuns gresit')
    }


}

module.exports = {verifyAnswers}
