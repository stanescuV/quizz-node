/**
 * This function converts a FormType that is the structure I use for the Firestore NoSql DB
 * into a form structure that I use for DB.
 *  
 */

function convertFormEntityToFormular(form) {
    const questions = Object.values(form.questions);

    const formular = {};

    questions.forEach((questionData, index) => {
        let optionsForm = {};
        let selectedOption = "";

        questionData.options.forEach((option) => {
            const [key, value] = Object.entries(option).find(([k]) => k !== 'isSelected');

            optionsForm[key] = value;

            if (option.isSelected) {
                selectedOption = key;
            }
        });

        // Build the question object for the frontend structure
        formular[`question${index + 1}`] = {
            question: questionData.question,
            options: optionsForm,
            selectedOption: selectedOption
        };
    });

    return formular;
}

module.exports = {convertFormEntityToFormular}