import { analyze_ticker } from "../../../services/analyze_ticker/index.js";

export async function POST(req) {
    
    let body;
    try {
        // console.log("Attempting to read JSON body...");
        body = await req.json(); // Read JSON body
        // console.log("JSON body read:", body);

    } catch (error) {
        console.error("Invalid JSON format:", error);
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    if (!body || Object.keys(body).length === 0) {
        console.warn("Missing or empty request body");
        return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }


    try {
        //console.log("Calling process_analysis with body:", body);
        const result = await analyze_ticker(body); // Call your function
        
        //console.log("process_analysis completed with result:", result);
        return new Response(JSON.stringify({ success: true, data: result }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error processing analysis:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    } finally {
        console.log("POST function completed.");
    }
}
