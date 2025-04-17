import { NextRequest, NextResponse } from "next/server";
import { getUserTransactionHistory } from "../../../services/user_data/fetch_transaction_history";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, startDate, endDate } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const now = new Date();
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(now.getFullYear() - 10);

    const effectiveStartDate = startDate ?? tenYearsAgo.toISOString().split("T")[0]; // e.g., "2014-04-04"
    const effectiveEndDate = endDate ?? now.toISOString().split("T")[0];

    const transactions = await getUserTransactionHistory(
      user_id,
      effectiveStartDate,
      effectiveEndDate
    );

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error in /api/transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction history" },
      { status: 500 }
    );
  }
}
