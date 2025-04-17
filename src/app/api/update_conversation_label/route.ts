/*
this route calls openai to label a conversation based on the first interaction,
and then changes the name of the conversation.

Send the id, you initially save it with new chat
Inputs:
THREAD_ID,
QUESTION,
ANSWER
CALL THE LABEL_CONVERSATION
UPSERT THE NAME OF THE CONVERSATION IN THE SUPABASE TABLE FOR CONVERSATIONS

*/

import { NextResponse } from "next/server";
import { labelConversation } from "../../../services/label_conversation";
import { upsertConversationLabel } from "../../../services/label_conversation/upsert_label";
import supabase_client from "../../../lib/supabaseClient";
export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { thread_id, question, answer } = body;

    // Validate input
    if (!thread_id || !question || !answer) {
      return NextResponse.json(
        { error: "Missing thread_id, question, or answer" },
        { status: 400 }
      );
    }

    // 1. Fetch the thread from Supabase
    const { data: thread, error: threadError } = await supabase_client
      .from("threads")
      .select("id, title") // fetch only what you need
      .eq("id", thread_id)
      .single();

    // 2. Handle possible errors or missing data
    if (threadError) {
      console.error("Error fetching thread:", threadError);
      return NextResponse.json(
        { error: "Could not fetch thread" },
        { status: 500 }
      );
    }

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // 3. Check if title is "New Chat"
    if (thread.title !== "New Chat") {
      // If it's not the default title, don’t proceed
      return NextResponse.json(
        { message: "Thread already titled. No relabeling done." },
        { status: 200 }
      );
    }

    // 4. Generate the conversation label
    const label = await labelConversation(question, answer);

    // 5. Upsert the conversation label
    await upsertConversationLabel(thread_id, label);

    return NextResponse.json({ thread_id, label }, { status: 200 });

  } catch (error) {
    console.error("Error in generate-title API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import { labelConversation } from "../../../services/label_conversation";
// import { upsertConversationLabel } from "../../../services/label_conversation/upsert_label";

// export async function POST(req: Request) {
//   try {
//     // Parse request body
//     const body = await req.json();
//     const { thread_id, question, answer } = body;

//     // Validate input
//     if (!thread_id || !question || !answer) {
//       return NextResponse.json({ error: "Missing thread_id, question, or answer" }, { status: 400 });
//     }

//     // Generate the conversation label
//     const label = await labelConversation(question, answer);
//     upsertConversationLabel(thread_id, label)

//     return NextResponse.json({ thread_id, label }, { status: 200 });

//   } catch (error) {
//     console.error("Error in generate-title API:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
