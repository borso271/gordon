
async function fetchCompanyProfile(tickerSymbol, symbol_id, supabase_client) {
    try {
      // Fetch the symbol_id for the given ticker
    
  
      // Query the company_profiles table
      const { data, error } = await supabase_client
        .from("company_profiles")
        .select("name, description")
        .eq("symbol_id", symbol_id)
        .single(); // Assuming each symbol_id has only one profile
  
      if (error) {
        throw new Error(`Error fetching company profile: ${error.message}`);
      }
  
      if (!data) {
        throw new Error(`No company profile found for ticker: ${tickerSymbol}`);
      }
       
      console.log(JSON.stringify(data, null, 2));
  
      return  { name: data.name, description: data.description } ;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }

  export default fetchCompanyProfile


//  fetchCompanyProfile("AAPL", supabase_client)