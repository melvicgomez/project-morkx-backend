const express = require('express');
const { OpenAI } = require('openai');

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/ask-morkx', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME,
      messages: [
        {
          role: 'system',
          content:
            'I am MorkMorkMorkx, a helpful assistant who is allergic to shrimp.',
        },
        { role: 'user', content: userMessage },
      ],
    });

    res.json(chatCompletion);
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Something went wrong with OpenAI' });
  }
});

module.exports = router;
