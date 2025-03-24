import { z } from "zod";

const AnalysisSchemaAr = z.object({
  positives: z
    .array(z.string())
    .describe("قائمة بالنقاط الإيجابية أو الفرص المحتملة للشركة بناءً على البيانات المالية."),
  
  risks_and_concerns: z
    .array(z.string())
    .describe("قائمة بالجوانب السلبية أو المخاطر أو التحديات التي قد تواجهها الشركة."),
  
  summary: z
    .array(
      z.object({
        label: z.string().describe("فئة أو عنوان لقسم من الملخص."),
        description: z.string().describe("محتوى الملخص المرتبط بالفئة أو العنوان."),
      })
    )
    .describe("ملخص منظم يحتوي على عناوين (فئات) ونصوص ملخصة مرتبطة بكل فئة."),
  
  suggested_prompts: z
    .array(z.string())
    .describe("خمس اقتراحات لأسئلة مناسبة لـ GPT تتعلق بالشركة أو الرمز المالي أو بمواضيع مالية عامة."),
});

export default AnalysisSchemaAr;
