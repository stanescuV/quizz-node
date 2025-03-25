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

  const OptionSchema = z.array(z.string());

  const QuestionSchema = z.object({
    question: z.string(),
    options: OptionSchema,
    selectedOption: z.string()
  });

  const FormSchema = z.object({
    formular: z.array(QuestionSchema)
  });

  let completion;
  async function generateForm(promt) {
    completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Generate a JSON, of 5 objects maximum, based on the user query.' },
        {
          role: 'user',
          content: `Generate a form based on the schema provided for this query: ${promt}`
        }
      ],
      response_format: zodResponseFormat(FormSchema, 'form')
    });

    const form = completion.choices[0].message.parsed;

    console.log(form)
    return completion
  }
  

  app.post('/generate-form', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const form = await generateForm(prompt);

    if (!form) {
      return res.status(500).json({ error: 'Failed to generate form' });
    }

    res.json({ form });
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = {
  startServer
};
