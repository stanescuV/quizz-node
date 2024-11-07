/**
 */

const { convertFormEntityToFormular } = require("./convertEntities");
let resultsOfVerification = {};

function verifyAnswers(userAnswer, adminForm) {
    //Make admin form as userAnswer so that it's easier to iterate over
    const adminFormConverted = convertFormEntityToFormular(adminForm)
    
    
    for(let i = 0 ; i < Object.keys(adminFormConverted).length ; i++){
        const selectedAnswerUser = userAnswer[`question` + (1 + i)].selectedOption; 
        const correctAnswer = adminFormConverted[`question` + (1 + i)].selectedOption;
        console.log(selectedAnswerUser, correctAnswer)
        
        if(selectedAnswerUser === correctAnswer){
            console.log('Bravo raspuns corect')
        } else { 
            console.log('Raspuns gresit')
        }
    }
}

module.exports = {verifyAnswers}
