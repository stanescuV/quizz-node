function startServer() {
  //OPEN AI
  const { OpenAI } = require('openai');
  const { zodResponseFormat } = require('openai/helpers/zod');
  const z = require('zod');

  //NODE EXPRESS
  const express = require('express');
  const dotenv = require('dotenv');
  const PORT = 3003;
  const app = express();
  const cors = require('cors');

  //We start the app
  dotenv.config();
  app.use(express.json());
  app.use(cors());

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const OptionSchema = z.array(z.string(), 4);

  const QuestionSchema = z.object({
    question: z.string(),
    options: OptionSchema,
    selectedOption: z.string()
  });

  const FormSchema = z.object({
    formular: z.array(QuestionSchema)
  });

  let completion;

  //GUARD RAIL
  async function validateForm(prompt) {
    completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
          --Task : Validate if the PROMT of the user respects the rules.
          --Rules: The PROMT must be a request.  
          --Validation: If the promt is valid than you return a boolean as true. If the form is not valid than you return a boolean as false. 
          `
        },
        {
          role: 'user',
          content: `This is the PROMT: ${prompt}.`
        }
      ]
    });

    const answer = completion.choices[0].message.content;
    console.log(answer);
    return answer;
  }

  async function generateForm(promt) {
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Generate a JSON, of 5 objects maximum, based on the user query. Option can not be 0 all the possibilities are 1,2,3 and 4.'
        },
        {
          role: 'user',
          content: `Generate a form based on the PROMT: ${promt}. The correct answer of each question should be noted in selectedOption, exemple: option2. Very important : put the correct answer in a random position each time, try to not repeat. `
        }
      ],
      response_format: zodResponseFormat(FormSchema, 'form')
    });

    const form = completion.choices[0].message.parsed;

    console.log(form);
    return completion;
  }

  app.post('/generate-form', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    //check if promt is valid
    const isPromtValid = await validateForm(prompt);
    if (isPromtValid.toLowerCase().includes('false')) {
      console.log('promt is not valid');
      return res.status(400).json({ error: 'Promt is not valid.' });
    }

    const form = await generateForm(prompt);

    if (!form) {
      return res.status(400).json({ error: 'Failed to generate form' });
    }

    res.json({ form });
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = {
  startServer
};
