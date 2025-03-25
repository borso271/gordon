// getFormattedText.ts
interface SummaryItem {
    label: string;
    description: string;
  }
  
  interface GetFormattedTextOptions {
    positivesHeading: string;
    negativesHeading: string;
    summaryHeading: string;
    positives: string[];
    negatives: string[];
    summary: SummaryItem[];
  }
  
  /**
   * Returns a multiline string that includes headings, bullet points,
   * and labeled summary details.
   */
  export function getFormattedText({
    positivesHeading,
    negativesHeading,
    summaryHeading,
    positives,
    negatives,
    summary,
  }: GetFormattedTextOptions): string {
    const lines: string[] = [];
  
    // Positives
    lines.push(positivesHeading);
    positives.forEach((item, i) => {
      lines.push(`${i + 1}. ${item}`);
    });
    lines.push(""); // blank line
  
    // Negatives
    lines.push(negativesHeading);
    negatives.forEach((item, i) => {
      lines.push(`${i + 1}. ${item}`);
    });
    lines.push(""); // blank line
  
    // Summary
    lines.push(summaryHeading);
    summary.forEach((item, i) => {
      lines.push(`${i + 1}. ${item.label} - ${item.description}`);
    });
  
    return lines.join("\n");
  }
  