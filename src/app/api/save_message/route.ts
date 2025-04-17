import { NextRequest, NextResponse } from 'next/server';
import supabase_client from '../../../lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      thread_id,
      interaction_id,
      role,
      language = 'en',
      type,
      text = null,
      data = {}
    } = body;

    // Basic validation
    if (!id || !thread_id || !interaction_id || !role || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: id, thread_id, interaction_id, role, or type' },
        { status: 400 }
      );
    }

    const { error } = await supabase_client
      .from('messages')
      .insert([
        {
          id,
          thread_id,
          interaction_id,
          role,
          language,
          type,
          text,
          data,
        }
      ]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message_id: id }, { status: 201 });

  } catch (err) {
    console.error('Unhandled error:', err);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
