import { NextRequest, NextResponse } from "next/server";
import { getUserPortfolio } from "../../../services/user_data/fetch_portfolio";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const portfolio = await getUserPortfolio(user_id);

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Error in /api/portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}



// example usage:
// const res = await fetch("/api/portfolio", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ user_id: "uuid-abc-123" }),
//   });
  
//   const data = await res.json();
//   console.log(data.portfolio);
  