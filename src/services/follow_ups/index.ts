import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generate_follow_ups(body: { query: string; currentLang: string }) {
  const { query, currentLang } = body;

  const isArabic = currentLang === "ar";

  const systemPrompt = isArabic
    ? "بناءً على استفسار المستخدم، اقترح ما يصل إلى 3 متابعات أو أسئلة ذات صلة قد يرغب المستخدم في طرحها لاحقًا. أجب بصيغة JSON منظمة تحتوي على قائمة من الاقتراحات. إذا لم يكن من الواضح ما يمكن أن تكون عليه هذه المتابعات، أو إذا كنت تعتقد أن الاستفسار لا يستدعي أي متابعة، أرجع مصفوفة فارغة. يجب أن تكون جميع الاقتراحات باللغة العربية فقط."
    : "Given a user's query, suggest up to 3 relevant and thoughtful follow-up prompts or questions the user might want to ask next. Respond in a structured JSON format with a list of suggestions. If it is unclear what these suggestions might be, or if you think the query does not call for any follow up, return an empty array.";

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: query,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "follow_up_suggestions",
        schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["suggestions"],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(response.output_text);
  return parsed.suggestions;
}


// export async function generate_follow_ups(body: { query: string, currentLang:string }) {
//   const { query } = body;
//   //console.log("request to generate follow ups with query: ", query)
//   const response = await openai.responses.create({
//     model: "gpt-4o-mini",
//     input: [
//       {
//         role: "system",
//         content:
//           "Given a user's query, suggest up to 3 relevant and thoughtful follow-up prompts or questions the user might want to ask next. Respond in a structured JSON format with a list of suggestions. If it is unclear what these suggestions might be, or if you think the query does not call for any follow up, return an empty array.",
//       },
//       {
//         role: "user",
//         content: query,
//       },
//     ],
//     text: {
//       format: {
//         type: "json_schema",
//         name: "follow_up_suggestions",
//         schema: {
//           type: "object",
//           properties: {
//             suggestions: {
//               type: "array",
//               items: { type: "string" },
//             },
//           },
//           required: ["suggestions"],
//           additionalProperties: false,
//         },
//       },
//     },
//   });

//   const parsed = JSON.parse(response.output_text);
//   return parsed.suggestions;
// }
