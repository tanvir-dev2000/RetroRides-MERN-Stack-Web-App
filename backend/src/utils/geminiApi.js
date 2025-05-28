const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiReply(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { getGeminiReply };
