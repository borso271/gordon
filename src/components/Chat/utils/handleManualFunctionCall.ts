export async function handleManualFunctionCall(
    functionName: string,
    args: any,
    setConversationPairs: React.Dispatch<React.SetStateAction<ConversationPair[]>>,
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
    functionCallHandler: (toolCall: any) => Promise<string>
  ) {
  
  
    // 2️⃣ Simulate user input (so it appears in conversation history)
   
    const userQuery =
      functionName === "suggest_securities"
        ? "Suggest some stocks or cryptos"
        : `Give me your analysis of ${args.symbol}`;
  
    setConversationPairs((prev) => [
      ...prev,
      { user: userQuery, assistant: "" } // New empty assistant response
    ]);
  
    setCurrentIndex((prev) => prev + 1); // Move to the new conversation pair
  
    
    // 3️⃣ Call the function handler manually
    const toolCall = {
      function: { name: functionName, arguments: JSON.stringify(args) }
    };
  
    const result = await functionCallHandler(toolCall);
    const parsedResult = JSON.parse(result);
  
    // 4️⃣ Store the result just like `onRequiresAction`
    setConversationPairs((prev) => {
      const last = { ...prev[prev.length - 1] };
  
      if (functionName === "analyze_security") {
        last.analysisData = parsedResult;
      } else if (functionName === "suggest_securities") {
        last.suggestionData = parsedResult;
      }
  
      return [...prev.slice(0, -1), last]; // ✅ Update state properly
    });
  }
  