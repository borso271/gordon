
import { NextRequest, NextResponse } from "next/server";
import { generate_follow_ups } from '../../../services/follow_ups'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await generate_follow_ups(body);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in /api/follow_ups:", error);
    return NextResponse.json({ error: "Failed to generate follow-ups" }, { status: 500 });
  }
}

// 🧪 Example Fetch from Frontend
// ts
// Copy
// Edit
// const response = await fetch("/api/follow_ups", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ message: "What's your goal?" }),
// });

// const data = await response.json();
// console.log(data.result);