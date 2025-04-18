import { analyze_ticker } from "../../../services/analyze_ticker/index.js";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return new Response(JSON.stringify({ status: "failure", error: "Missing parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await analyze_ticker(body);

    console.log("RESULT IS: ", result)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error processing analysis:", error);
    return new Response(
      JSON.stringify({
        status: "failure",
        error: "Internal Server Error",
        message: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    console.log("✅ POST /analyze-ticker completed.");
  }
}
