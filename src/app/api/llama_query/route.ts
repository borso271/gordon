export async function POST(req: Request) {
    const body = await req.json();
    const response = await fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: body.query }),
    });
  
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  }
  