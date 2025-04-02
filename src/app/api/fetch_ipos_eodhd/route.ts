import { NextResponse } from "next/server";
import fs from "fs/promises";

const EODHD_API_KEY = process.env.EODHD_API_KEY;


// Known Arabic stock exchanges (simplified by name)
const ARABIC_EXCHANGES = [
  "TADAWUL", // Saudi
  "DFM",     // Dubai Financial Market
  "ADX",     // Abu Dhabi
  "KUWAIT",  // Boursa Kuwait
  "QSE",     // Qatar Stock Exchange
  "MSM",     // Muscat Securities Market
  "EGX",     // Egypt
  "BAHRAIN", // Bahrain
  "TUNINDEX" // Tunisia
];

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const url = `https://eodhd.com/api/calendar/ipos?from=${today}&to=${nextWeek}&api_token=${EODHD_API_KEY}&fmt=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();
   // console.log("data is : ", data)
    const ipos = Array.isArray(data) ? data : Object.values(data);

    const filteredIPOs = ipos.filter((ipo: any) => {
      const exchange = ipo.exchange?.toUpperCase();
      return ARABIC_EXCHANGES.includes(exchange);
    });

    await fs.writeFile(
      "./public/upcoming_ipos.json",
      JSON.stringify(filteredIPOs, null, 2),
      "utf-8"
    );

    return NextResponse.json({ ipos: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
