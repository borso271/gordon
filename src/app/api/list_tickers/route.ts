import { NextRequest } from "next/server";
import { list_tickers } from "../../../services/list_tickers";

export async function POST(req: NextRequest) {
  try {
    const args = await req.json();
    const data = await list_tickers(args); // Call your local function
    return Response.json(data);
  } catch (error) {
    console.error("Error in list_tickers handler:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch ticker list" }),
      { status: 500 }
    );
  }
}

