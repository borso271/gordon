import { NextRequest, NextResponse } from 'next/server';
import { return_portfolio_overview_data } from '../../../services/portfolio_overview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user_id = body.user_id || "abc";

    const language = body.language || "en";
       // Safely convert overview_period to a number
       const periodRaw = body.overview_period ?? 365;
       const period = Number(periodRaw);
   
       if (isNaN(period) || period < 0) {
         return NextResponse.json({ error: "Invalid overview_period" }, { status: 400 });
       }
   
       const today = new Date();
       const start = new Date(today.getTime() - period * 24 * 60 * 60 * 1000);
       const start_date = start.toISOString().split("T")[0]; // YYYY-MM-DD

       
   
       const data = await return_portfolio_overview_data(user_id, start_date, language);
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error in /api/portfolio_overview:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
