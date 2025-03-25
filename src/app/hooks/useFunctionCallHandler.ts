import { useLanguage } from "../hooks/useLanguage";

export function useFunctionCallHandler() {
  const { currentLang } = useLanguage();

  const functionCallHandler = async (toolCall) => {
    const { name, arguments: functionArgs } = toolCall.function;

    let args;
    try {
      args = JSON.parse(functionArgs);
    } catch (error) {
      console.error("Failed to parse toolCall arguments:", functionArgs);
      return JSON.stringify({ error: "Invalid arguments format" });
    }

    // ✅ Add language from context
    args.language = currentLang;

    // console.log("FUNCTION CALL HANDLER: ", { name, args });

    const endpointMap = {
      analyze_security: "api/analysis",
      suggest_securities: "api/suggest",
      search_web: "api/tavily_search",
    };

    if (!endpointMap[name]) {
      return JSON.stringify({ error: "Unknown tool function" });
    }

    try {
      const response = await fetch(endpointMap[name], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });

      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error(`Error calling ${endpointMap[name]}:`, error);
      return JSON.stringify({ error: `Failed to call ${name}` });
    }
  };

  return { functionCallHandler };
}
