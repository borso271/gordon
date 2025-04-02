// app/api/fetch-ipos/route.ts (App Router)
import { NextResponse } from 'next/server';
import fs from 'fs/promises';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

export async function GET() {
  const url = `https://api.polygon.io/vX/reference/ipos?order=desc&limit=100&sort=listing_date&apiKey=${POLYGON_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) {
      return NextResponse.json({ error: "No results found from Polygon" }, { status: 500 });
    }

    // Example MIC codes (ISO 10383) for Arabic exchanges:
    const arabicMICs = [
     
      "XSAU", // Saudi Stock Exchange (Tadawul)
     
    ];

    const filteredIPOs = data.results.filter(
      (ipo: any) => arabicMICs.includes(ipo.primary_exchange)
    );

    // Save to file
    await fs.writeFile(
      './public/arabic_ipos.json',
      JSON.stringify(filteredIPOs, null, 2),
      'utf-8'
    );

    return NextResponse.json({ ipos: filteredIPOs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
