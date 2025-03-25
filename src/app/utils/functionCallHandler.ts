
import { useLanguage } from "../hooks/useLanguage";

export async function functionCallHandler(toolCall) {
  const { name, arguments: functionArgs } = toolCall.function;
  const args = JSON.parse(functionArgs);
  const { currentLang } = useLanguage()
  console.log("FUNCTION CALLL HANDLER HAS BEEN CALLED AND TOOLCALL IS: ", toolCall)
  
  if (name === "analyze_security") {
    try {
      const response = await fetch("api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error("Error calling /api/analysis:", error);
      return JSON.stringify({ error: "Failed to analyze security" });
    }

  } else if (name === "suggest_securities") {
    try {
      const response = await fetch("api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error("Error calling /api/suggest:", error);
      return JSON.stringify({ error: "Failed to suggest securities" });
    }

  } else if (name === "search_web") {
    try {
      const response = await fetch("api/tavily_search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args), // args = { query: "..." }
      });
      const data = await response.json();
      console.log("data return by tavily is: ", data)
      return JSON.stringify(data);


    } catch (error) {
      console.error("Error calling /api/tavily_search", error);
      return JSON.stringify({ error: "Failed to search the web" });
    }
  }

  return JSON.stringify({ error: "Unknown tool function" });
}




// export async function functionCallHandler(toolCall) {

//     // Parse the arguments for any function call
//     const { name, arguments: functionArgs } = toolCall.function;
//     const args = JSON.parse(functionArgs);
//     // args.language = "en";
  
//     // Decide which endpoint to call based on the function name
//     if (name === "analyze_security") {
//       // Example: args = { symbol: "AAPL", asset_type: "stock" }
      
//       try {
//         const response = await fetch("api/analysis", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(args)
//         });
//         // The server should respond with JSON
//         const data = await response.json();
//         return JSON.stringify(data);
//       } catch (error) {
//         console.error("Error calling /api/analysis:", error);
//         return JSON.stringify({ error: "Failed to analyze security" });
//       }
  
//     } else if (name === "suggest_securities") {
     
//       try {
//         const response = await fetch("api/suggest", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(args) // ✅ Send asset_type in the body
//         });
    
//         const data = await response.json();
     
//         return JSON.stringify(data);
//       } catch (error) {
//         console.error("Error calling /api/suggest:", error);
//         return JSON.stringify({ error: "Failed to suggest securities" });
//       }
//     }
  
//     return "";
//   }
  