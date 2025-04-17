import { NextRequest, NextResponse } from "next/server";
import { exaSearch } from "../../../services/exa_search";

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { query, category } = body;
  
      if (!query) {
        return NextResponse.json({ error: "Missing query" }, { status: 400 });
      }
  
      // Pass only selected fields to exaSearch
      const result = await exaSearch({ query, category, numResults: 5 });
  
      // Build data_for_ai by extracting only title, url, and summary if present
      const data_for_ai = result.results?.map((item: any) => {
        return {
          ...(item.title && { title: item.title }),
          ...(item.url && { url: item.url }),
          ...(item.summary && { summary: item.summary }),
        };
      }) || [];
  
      return NextResponse.json(
        {
          data_for_ai,
          data_for_component: result.results,
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("❌ Error in /api/exa_search:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  