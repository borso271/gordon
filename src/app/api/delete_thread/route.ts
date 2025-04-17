import { NextResponse } from 'next/server';
import supabase_client from '../../../lib/supabaseClient';

export async function POST(req: Request) {
 
  const { thread_id } = await req.json();

  if (!thread_id) {
    return NextResponse.json({ error: 'Missing thread_id' }, { status: 400 });
  }

  try {
  
    const { error } = await supabase_client.from('threads').delete().eq('id', thread_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
