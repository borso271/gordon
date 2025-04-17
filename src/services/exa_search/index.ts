/*
set up and test exa search
*/

const EXA_API_KEY = "729a420d-bbfc-4742-9438-985603728e8f";
const EXA_API_URL = "https://api.exa.ai/search";

interface ExaSearchOptions {
    query: string;
    type?: "auto" | "neural" | "keyword";
    category?: string;
    numResults?: number;
    text?: boolean;
    include_summary?: boolean;
    summary_query?: string;
    summary_schema?: Record<string, any>; // Optional JSON schema
    include_images?: boolean;
  }
  
  export async function exaSearch({
    query,
    type = "auto",
    category = "news",
    numResults = 10,
    text = false,
    include_summary = true,
    summary_query = "Main takeaways",
    include_images = true,
  }: ExaSearchOptions) {
    if (!query) {
      throw new Error("❌ 'query' is required for Exa search.");
    }
  
    const headers = {
      Authorization: `Bearer ${EXA_API_KEY}`,
      "Content-Type": "application/json",
    };
  
    const summary: any = include_summary
      ? {
          query: summary_query,
       
         // ...(summary_schema ? { schema: summary_schema } : {}),
        }
      : undefined;
  
    const body = {
      query,
      type,
      ...(category === "news" ? { category } : {}), // <-- include only if type === "news"
      numResults,
      contents: {
        text,
        summary,
        extras: include_images ? { imageLinks: 1 } : undefined,
      },
    };
  
    try {
      const res = await fetch(EXA_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Exa API error response:", errorText);
        throw new Error(`Exa API request failed: ${res.statusText}`);
      }
  
      const json = await res.json();
      return json;


      
    } catch (err) {
      console.error("❌ Exa search failed:", err);
      throw err;
    }
  }
  