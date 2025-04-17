import { NextResponse } from "next/server";
import { buy } from "../../../../services/make_transaction/buy";

export async function POST(req: Request) {
  const body = await req.json();
  const { user_id, symbol_id, price, quantity } = body;

  if (!user_id || !symbol_id || !price || !quantity) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    await buy({
      user_id,
      symbol_id,
      price: Number(price),
      quantity: Number(quantity),
    });

    return NextResponse.json({ message: "Stock purchased successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
