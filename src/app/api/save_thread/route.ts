import { NextRequest, NextResponse } from 'next/server';
import supabase_client from '../../../lib/supabaseClient';

/* here create a whole service to save a thread to the database that
save the thread first to the database, then name the conversation,
then finally save the name of the conversation.
Or you might have a different api call to also... */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { thread_id, user_id = 'abc' } = body;

    if (!thread_id) {
      return NextResponse.json({ error: 'Missing thread_id' }, { status: 400 });
    }

    const { error } = await supabase_client
      .from('threads')
      .insert([
        {
          id: thread_id,
          user_id,
        }
      ]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, thread_id }, { status: 201 });

  } catch (err) {
    console.error('Unhandled error:', err);
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}
