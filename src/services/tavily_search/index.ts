// services/tavilySearch.ts

// const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_API_KEY="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"

if (!TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is not set in environment variables.");
}

const TAVILY_HEADERS = {
  Authorization: `Bearer ${TAVILY_API_KEY}`,
  "Content-Type": "application/json",
};

export async function runTavilySearch(
  query: string,
  maxResults: number = 3,
  minScore: number = 0.85,
  topic?:string,
) {
  console.log("[Tavily Search] Running search with query:", query);

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: TAVILY_HEADERS,
    body: JSON.stringify({
      query,
      max_results: maxResults,
      include_answer: true,
      include_raw_content: false,
      include_images: false,
    }),
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
   // console.log("[Tavily Search] Response:", json);
    if (!res.ok) throw new Error(`Tavily search failed: ${res.statusText}`);

    const cleanedResults = (json.results || [])
      .filter(
        (r: any) => r.title && r.url && r.content && r.score >= minScore
      )
      .slice(0, maxResults)
      .map((r: any) => ({
        content: r.content,
        url: r.url,
      }));

    return {
      answer: json.answer || null,
      results: cleanedResults,
    };

  } catch (err) {
    console.error("[Tavily Search] Failed to parse response:", text);
    throw err;
  }
}

// answer: json.answer || null,
// results: cleanedResults,
