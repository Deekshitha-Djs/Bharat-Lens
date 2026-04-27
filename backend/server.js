// server.js — BharatLens Secure Backend
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌  GEMINI_API_KEY is missing! Add it to backend/.env');
  process.exit(1);
}

app.post('/api/analyze', async (req, res) => {
  const { query, language = 'English' } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'query is required' });
  }

  // Map language setting to its native name for stronger model enforcement
  const languageMap = {
    'English': 'English',
    'Hindi': 'Hindi (हिंदी)',
    'Kannada': 'Kannada (ಕನ್ನಡ)',
  };
  const targetLanguage = languageMap[language] || 'English';

  const systemInstruction = `You are BharatLens, an AI assistant that explains Indian laws in very simple language.

LANGUAGE RULE — THIS IS MANDATORY:
You MUST write your ENTIRE response ONLY in ${targetLanguage}. Every single word must be in ${targetLanguage}. Do NOT use English unless ${targetLanguage} is English. Do NOT mix languages.

When a user describes a situation:
1. Identify the relevant Indian law
2. Explain it simply
3. Tell the user their rights
4. Provide 3 practical steps they can take
5. Avoid complex legal jargon

Format the response like this (all text must be in ${targetLanguage}):

**Relevant Law**
(simple explanation)

**Your Rights**
• point 1
• point 2

**What You Can Do**
1. step 1
2. step 2
3. step 3`;

  const promptText = `${systemInstruction}\n\nUser Situation:\n${query}`;


  // Try models in order until one succeeds
  const models = ['gemini-2.5-flash-lite', 'gemini-2.0-flash-lite', 'gemini-2.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        }
      );

      if (!geminiRes.ok) {
        const errBody = await geminiRes.text();
        console.error(`[${model}] API error:`, errBody);
        lastError = errBody;
        continue; // try next model
      }

      const data = await geminiRes.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) { lastError = 'No text in response'; continue; }

      console.log(`✅ Responded using model: ${model}`);
      return res.json({ text, model });

    } catch (err) {
      console.error(`[${model}] threw:`, err.message);
      lastError = err.message;
    }
  }

  return res.status(502).json({ error: 'All Gemini models failed. Check API quota.', details: lastError });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅  BharatLens backend running on http://localhost:${PORT}`);
});
