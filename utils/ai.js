const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

async function generateDescription(title, location, price) {
    const prompt = `
    You are a real estate assistant helping to write rental listings.
    Create a short, engaging, and informative rental description using the following details:
    
    Title: ${title}
    Location: ${location}
    Price: ₹${price} per night
    
    Make sure the description clearly reflects the title and location.
    `;
    
  try {
    const response = await cohere.generate({
      model: "command",
      prompt: prompt,
      maxTokens: 100,
      temperature: 0.7,
    });

    return response.generations[0].text.trim();
  } catch (error) {
    console.error("Cohere error:", error);
    return "Description could not be generated.";
  }
}

module.exports = { generateDescription };
