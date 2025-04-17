import { NextResponse } from "next/server";
import { sell } from "../../../../services/make_transaction/sell";

export async function POST(req: Request) {
  const body = await req.json();
  const { user_id, symbol_id, price, quantity } = body;

  if (!user_id || !symbol_id || !price || !quantity) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    await sell({
      user_id,
      symbol_id,
      price: Number(price),
      quantity: Number(quantity),
    });

    return NextResponse.json({ message: "Stock sold successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
