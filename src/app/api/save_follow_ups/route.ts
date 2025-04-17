import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import supabase_client from '../../../lib/supabaseClient';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bot_message_id, suggestions } = body;

    if (!bot_message_id || !Array.isArray(suggestions)) {
      return NextResponse.json({ error: 'Missing or invalid input' }, { status: 400 });
    }

    const payload = {
      id: uuidv4(),
      message_id: bot_message_id,
      type: 'follow_ups',
      text: null,
      data: suggestions, // ✅ Save as pure array (Supabase stores as JSONB)
      sidebar: false,
    };

    const { error } = await supabase_client
      .from('message_parts')
      .insert([payload]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unhandled error saving follow-ups:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
