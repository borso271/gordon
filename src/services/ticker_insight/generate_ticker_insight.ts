import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generate_ticker_insight(body: { ticker_data: string }) {
    const { ticker_data } = body;
  
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a market expert. Provide a short (around 20 words) reason why the following ticker might be a good investment. Just provide the reason nothing else.",
        },
        {
          role: "user",
          content: ticker_data,
        },
      ],
    });
  
    const insight = response.choices[0].message.content;
    return insight;
  }
  
