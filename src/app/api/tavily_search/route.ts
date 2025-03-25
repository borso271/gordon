import { NextRequest, NextResponse } from "next/server";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

console.log("TAVILY API KEY IS: ", TAVILY_API_KEY)
const TAVILY_HEADERS = {
  Authorization: `Bearer ${TAVILY_API_KEY}`,
  "Content-Type": "application/json",
};

async function runSearch(query: string, maxResults: number = 3) {
  console.log("[Tavily Search] Running search with query:", query);

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: TAVILY_HEADERS,
    body: JSON.stringify({
      query,
      topic: "news",
      search_depth: "basic",
      max_results: maxResults,
      include_answer: true,
      include_raw_content: false,
      include_images: false,
    }),
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    console.log("[Tavily Search] Search response JSON:", json);
    if (!res.ok) throw new Error(`Tavily search failed: ${res.statusText}`);
    return json;
  } catch (err) {
    console.error("[Tavily Search] Failed to parse response:", text);
    throw err;
  }
}

async function runExtract(urls: string[]) {
  console.log("[Tavily Extract] Running extract on URLs:", urls);

  const res = await fetch("https://api.tavily.com/extract", {
    method: "POST",
    headers: TAVILY_HEADERS,
    body: JSON.stringify({
      urls,
      include_images: false,
      extract_depth: "basic",
    }),
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    console.log("[Tavily Extract] Extract response JSON:", json);
    if (!res.ok) throw new Error(`Tavily extract failed: ${res.statusText}`);
    return json;
  } catch (err) {
    console.error("[Tavily Extract] Failed to parse response:", text);
    throw err;
  }
}

// ✅ Named export ONLY (no default export!)
export async function POST(req: NextRequest) {
  try {
    const { query, maxResults = 3 } = await req.json();
    console.log("[API] Received query:", query, "maxResults:", maxResults);

    if (!query) {
      console.warn("[API] Missing query in request body.");
      return NextResponse.json({ error: "Missing query." }, { status: 400 });
    }

    const searchData = await runSearch(query, maxResults);


  console.log("search data is: ", searchData)



   const finalResults = searchData.answer

    // const cleanedResults = (searchData.results || []).filter(
    //   (r: any) => r.title && r.url && r.content
    // );

    // console.log("[API] Cleaned search results:", cleanedResults.length);

    // const topUrls = cleanedResults.map((r: any) => r.url);
    // const extractData = await runExtract(topUrls);

    // const extractedMap: Record<string, string> = {};
    // for (const item of extractData.results || []) {
    //   extractedMap[item.url] = item.raw_content;
    // }

    // const finalResults = cleanedResults.map((r: any) => ({
    //   title: r.title,
    //   url: r.url,
    //   snippet: r.content,
    //   raw_content: extractedMap[r.url] || null,
    // }));

    // console.log("[API] Returning final result set:", finalResults.length);






    return NextResponse.json({
      answer: searchData.answer || null,
      results: finalResults,
    });
  } catch (err) {
    console.error("[API] Tavily route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";

// const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

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
//       topic: "news",
//       search_depth: "basic",
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

// async function runExtract(urls: string[]) {
//   console.log("[Tavily Extract] Running extract on URLs:", urls);

//   const res = await fetch("https://api.tavily.com/extract", {
//     method: "POST",
//     headers: TAVILY_HEADERS,
//     body: JSON.stringify({
//       urls,
//       include_images: false,
//       extract_depth: "basic",
//     }),
//   });

//   const text = await res.text();
//   try {
//     const json = JSON.parse(text);
//     console.log("[Tavily Extract] Extract response JSON:", json);
//     if (!res.ok) throw new Error(`Tavily extract failed: ${res.statusText}`);
//     return json;
//   } catch (err) {
//     console.error("[Tavily Extract] Failed to parse response:", text);
//     throw err;
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { query, maxResults = 3 } = await req.json();
//     console.log("[API] Received query:", query, "maxResults:", maxResults);

//     if (!query) {
//       console.warn("[API] Missing query in request body.");
//       return NextResponse.json({ error: "Missing query." }, { status: 400 });
//     }

//     const searchData = await runSearch(query, maxResults);

//     const cleanedResults = (searchData.results || []).filter(
//       (r: any) => r.title && r.url && r.content
//     );

//     console.log("[API] Cleaned search results:", cleanedResults.length);

//     const topUrls = cleanedResults.map((r: any) => r.url);
//     const extractData = await runExtract(topUrls);

//     const extractedMap: Record<string, string> = {};
//     for (const item of extractData.results || []) {
//       extractedMap[item.url] = item.raw_content;
//     }

//     const finalResults = cleanedResults.map((r: any) => ({
//       title: r.title,
//       url: r.url,
//       snippet: r.content,
//       raw_content: extractedMap[r.url] || null,
//     }));

//     console.log("[API] Returning final result set:", finalResults.length);

//     return NextResponse.json({
//       answer: searchData.answer || null,
//       results: finalResults,
//     });
//   } catch (err) {
//     console.error("[API] Tavily route error:", err);
//     return NextResponse.json({ error: "Internal server error." }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";

// const TAVILY_API_KEY = process.env.TAVILY_API_KEY; // set this in .env.local

// const TAVILY_HEADERS = {
//   Authorization: `Bearer ${TAVILY_API_KEY}`,
//   "Content-Type": "application/json",
// };

// async function runSearch(query: string, maxResults: number = 3) {
//   const res = await fetch("https://api.tavily.com/search", {
//     method: "POST",
//     headers: TAVILY_HEADERS,
//     body: JSON.stringify({
//       query,
//       topic: "news",
//       search_depth: "basic",
//       max_results: maxResults,
//       include_answer: true,
//       include_raw_content: false,
//       include_images: false,
//     }),
//   });

//   if (!res.ok) throw new Error(`Tavily search failed: ${res.statusText}`);
//   return res.json();
// }

// async function runExtract(urls: string[]) {
//   const res = await fetch("https://api.tavily.com/extract", {
//     method: "POST",
//     headers: TAVILY_HEADERS,
//     body: JSON.stringify({
//       urls,
//       include_images: false,
//       extract_depth: "basic",
//     }),
//   });

//   if (!res.ok) throw new Error(`Tavily extract failed: ${res.statusText}`);
//   return res.json();
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { query, maxResults = 3 } = await req.json();

//     if (!query) {
//       return NextResponse.json({ error: "Missing query." }, { status: 400 });
//     }

//     const searchData = await runSearch(query, maxResults);

//     const cleanedResults = (searchData.results || []).filter(
//       (r: any) => r.title && r.url && r.content
//     );

//     const topUrls = cleanedResults.map((r: any) => r.url);
//     const extractData = await runExtract(topUrls);

//     const extractedMap: Record<string, string> = {};
//     for (const item of extractData.results || []) {
//       extractedMap[item.url] = item.raw_content;
//     }

//     const finalResults = cleanedResults.map((r: any) => ({
//       title: r.title,
//       url: r.url,
//       snippet: r.content,
//       raw_content: extractedMap[r.url] || null,
//     }));

//     return NextResponse.json({
//       answer: searchData.answer || null,
//       results: finalResults,
//     });
//   } catch (err) {
//     console.error("Tavily route error:", err);
//     return NextResponse.json({ error: "Internal server error." }, { status: 500 });
//   }
// }
