import {openai} from '../../../../lib/openaiClient.js'
import supabase_client from '../../../../lib/supabaseClient';

export const runtime = "nodejs";

export async function POST() {
  try {
    // 1. Create the thread via OpenAI
    const thread = await openai.beta.threads.create();

    // 2. Save the thread to Supabase
    const { error: dbError } = await supabase_client

      .from('threads')
      .insert([
        { id: thread.id,
          user_id: 'abc', // TODO: replace with actual user_id when available
          title: "New Chat",
          metadata: {}, // You could store OpenAI metadata here if desired
        },
      ]);

    if (dbError) {
      console.error("❌ Failed to save thread to Supabase:", dbError);
      return Response.json({ error: 'Failed to save thread to database' }, { status: 500 });
    }

    // 3. Return the OpenAI thread ID
    return Response.json({ threadId: thread.id }, { status: 201 });

  } catch (err) {
    console.error("❌ Error creating thread:", err);
    return Response.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}
