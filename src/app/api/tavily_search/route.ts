// app/api/tavily/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runTavilySearch } from "../../../services/tavily_search";

export async function POST(req: NextRequest) {
  try {
    const { query, maxResults = 3, minScore = 0.85 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query." }, { status: 400 });
    }

    const searchData = await runTavilySearch(query, maxResults, minScore);
    return NextResponse.json(searchData);
  } catch (err) {
    console.error("[API] Tavily route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";

// const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// console.log("TAVILY API KEY IS: ", TAVILY_API_KEY)
// const TAVILY_HEADERS = {
//   Authorization: `Bearer ${TAVILY_API_KEY}`,
//   "Content-Type": "application/json",
// };

// async function runSearch(query: string, maxResults: number = 3) {
//   console.log("[Tavily Search] Running search with query:", query);

//   const res = await fetch("https://api.tavily.com/search", {
//     method: "POST",
//     headers: TAVILY_HEADERS,
//     body: JSON.stringify({
//       query,
//     //   search_depth: "basic",
//       max_results: maxResults,
//       include_answer: true,
//       include_raw_content: false,
//       include_images: false,
//     }),
//   });

//   const text = await res.text();
//   try {
//     const json = JSON.parse(text);
//     console.log("[Tavily Search] Search response JSON:", json);
//     if (!res.ok) throw new Error(`Tavily search failed: ${res.statusText}`);
//     return json;
//   } catch (err) {
//     console.error("[Tavily Search] Failed to parse response:", text);
//     throw err;
//   }
// }
// // ✅ Named export ONLY (no default export!)
// export async function POST(req: NextRequest) {
//     try {
//       const { query, maxResults = 3, minScore = 0.85 } = await req.json();
//       console.log("[API] Received query:", query, "maxResults:", maxResults, "minScore:", minScore);
  
//       if (!query) {
//         console.warn("[API] Missing query in request body.");
//         return NextResponse.json({ error: "Missing query." }, { status: 400 });
//       }
  
//       const searchData = await runSearch(query, maxResults);
  
//       const cleanedResults = (searchData.results || [])
//         .filter((r: any) => r.title && r.url && r.content && r.score >= minScore)
//         .slice(0, maxResults)
//         .map((r: any) => ({
//           content: r.content,
//           url: r.url,
//         }));
  
//       return NextResponse.json({
//         answer: searchData.answer || null,
//         results: cleanedResults,
//       });
//     } catch (err) {
//       console.error("[API] Tavily route error:", err);
//       return NextResponse.json({ error: "Internal server error." }, { status: 500 });
//     }
//   }
  