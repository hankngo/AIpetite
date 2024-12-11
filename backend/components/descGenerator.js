const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI();

const generateDescription = async (reviews) => {
  const prompt = `Generate a very concise and engaging description using a simple tone for a restaurant based on the following reviews:\n\n${reviews.join('\n\n')}\n\nDescription:`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: "system", content: `${prompt}` },
    ],
      max_tokens: 100,
    });
    return response.choices[0].message;
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
};

module.exports = generateDescription;   