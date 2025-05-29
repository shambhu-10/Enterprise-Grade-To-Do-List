import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/api/parse-task', async (req, res) => {
    try {
        const { input } = req.body;

        if (!input) {
            return res.status(400).json({ error: 'Input is required' });
        }

        const prompt = `Extract the task details from the following input:

"${input}"

Return the result in this JSON format:
{
  "task": "",
  "assignee": "",
  "due": "",
  "priority": ""
}

Default priority is "P3" unless specified as "P1", "P2", or "P4".
Also map these synonyms:
"urgent", "asap", "critical" → P1
"important", "medium" → P2
"low", "eventually" → P4`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a task parsing assistant that extracts structured information from natural language task descriptions."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
        });

        const response = completion.choices[0].message.content;
        const parsedTask = JSON.parse(response);

        res.json(parsedTask);
    } catch (error) {
        console.error('Error parsing task:', error);
        res.status(500).json({ error: 'Failed to parse task' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 