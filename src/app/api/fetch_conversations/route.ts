import { NextResponse } from 'next/server';
import supabase_client from '../../../lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user_id = body.user_id || "abc"; // fallback for testing

    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    const { data, error } = await supabase_client
      .from('threads')
      .select('id, title, created_at')
      .eq('user_id', user_id)
      .gt('interactions', 0) // ✅ Only threads with at least one interaction
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching threads:', error);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }

    return NextResponse.json({ conversations: data });
  } catch (err) {
    console.error('Error parsing request:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
