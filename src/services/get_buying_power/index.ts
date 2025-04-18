import supabase_client from "../../lib/supabaseClient";

export async function fetchBuyingPower(user_id: string) {
  if (!user_id) {
    return { status: "failure", error: "Missing user_id" };
  }

  const { data, error } = await supabase_client
    .from("users")
    .select("cash")
    .eq("id", user_id)
    .single();

  if (error || !data) {
    console.error("❌ Error fetching cash for user:", error);
    return { status: "failure", error: "User not found" };
  }

  return { status: "success", cash: data.cash };
}
