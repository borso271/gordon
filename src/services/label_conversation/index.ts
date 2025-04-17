import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function labelConversation(
  question: string,
  answer: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI that generates short, and natural conversation titles for an AI chat history.' +
            'The title should summarize the conversation topic concisely in under 100 characters.',
        },
        {
          role: 'user',
          content: `Generate a concise title for this conversation:\n\nQ: ${question}\nA: ${answer}`,
        },
      ],
      max_tokens: 50,
    });

    // ✅ Ensure `content` is a string before calling `trim()`
    const label = response.choices[0]?.message?.content
      ? response.choices[0].message.content.trim().replace(/^"(.*)"$/, '$1') // ✅ Remove surrounding quotes
      : 'Untitled Conversation'; // ✅ Fallback title

    return label;
  } catch (error) {
    console.error('Error generating conversation label:', error);
    return 'Untitled Conversation';
  }
}
