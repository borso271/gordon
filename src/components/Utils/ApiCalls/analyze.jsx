async function analyzeApi(inputParams) {
    console.log("analyzeApi called")
    const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputParams),
    });

    const data = await response.json();
   return data
}

export default analyzeApi