import supabase_client from "../../lib/supabaseClient";
export async function upsertConversationLabel(thread_id, label) {

    const { data, error } = await supabase_client
      .from('threads')
      .upsert(
        {
          id: thread_id,
          title: label,
          user_id: "abc",
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );
  
    if (error) {
      console.error('Failed to upsert conversation label:', error);
      throw error;
    }
  
    return data;
  }
  