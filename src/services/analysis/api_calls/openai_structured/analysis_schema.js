import { z } from "zod";

const AnalysisSchema = z.object({
  positives: z
    .array(z.string())
    .describe(
      "List of positive aspects or potential opportunities for the company based on the financial data."
    ),
  risks_and_concerns: z
    .array(z.string())
    .describe(
      "List of any negative aspects, risks, concerns, or challenges the company may face."
    ),
  summary: z
    .array(
      z.object({
        label: z.string().describe("A category or section label for the summary."),
        description: z.string().describe("The summary content related to the label."),
      })
    )
    .describe(
      "A structured summary where each entry has a label (category) and a corresponding summary text."
    ),
  suggested_prompts: z
    .array(z.string())
    .describe(
      "Five suggested GPT-friendly prompts relative to the company/symbol analyzed or to pertinent financial questions more generally."
    ),
});

export default AnalysisSchema;
