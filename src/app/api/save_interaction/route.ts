
import { NextRequest, NextResponse } from 'next/server';
import supabase_client from '../../../lib/supabaseClient';

/*
one idea is to update the label at this point,
but you need to know which interaction we are...
*/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      thread_id,
      interaction_id,
      language = 'en',
      status,
      userMessage,
      botMessage
    } = body;

    // Validate required fields
    if (!thread_id || !interaction_id || !userMessage || !botMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error: userMessageError } = await supabase_client
      .from('messages')
      .insert([
        {
          id: userMessage.id,
          thread_id,
          interaction_id,
          role: userMessage.role,
          language: userMessage.language || language,
          created_at: userMessage.createdAt,
          status: status,
          show: userMessage.show ?? true,  // ✅ Default to true if not provided

        }
      ]);

    if (userMessageError) {
      console.error('User message insert error:', userMessageError);
      return NextResponse.json({ error: 'Failed to save user message' }, { status: 500 });
    }

    const { error: userPartError } = await supabase_client
      .from('message_parts')
      .insert([
        {
          id: `${userMessage.id}-part`, // or uuidv4()
          message_id: userMessage.id,
          type: 'userText',
          text: userMessage.text,
          data: null,
          order_index: 0,
          created_at: userMessage.createdAt,
        }
      ]);

    if (userPartError) {
      console.error('User part insert error:', userPartError);
      return NextResponse.json({ error: 'Failed to save user message part' }, { status: 500 });
    }

    const { error: botMessageError } = await supabase_client
      .from('messages')
      .insert([
        {
          id: botMessage.id,
          thread_id,
          interaction_id,
          role: botMessage.role,
          language: botMessage.language || language,
          created_at: botMessage.createdAt,
          status: status
        }
      ]);

    if (botMessageError) {
      console.error('Bot message insert error:', botMessageError);
      return NextResponse.json({ error: 'Failed to save assistant message' }, { status: 500 });
    }

    const botParts = (botMessage.parts || []).map((part, index) => ({
        id: `${botMessage.id}-part-${index}`, // or uuidv4() if needed
        message_id: botMessage.id,
        type: part.type,
        text: part.text ?? null,   // explicitly using .text
        data: part.data ?? null,   // explicitly using .data
        order_index: index,
        created_at: botMessage.createdAt,
        sidebar: part.sidebar?? false
      }));
    
  
    const { error: botPartsError } = await supabase_client
      .from('message_parts')
      .insert(botParts);

    if (botPartsError) {
      console.error('Bot parts insert error:', botPartsError);
      return NextResponse.json({ error: 'Failed to save assistant message parts' }, { status: 500 });
    }

    const { error: incrementError } = await supabase_client
      .rpc('increment_thread_interactions', { thread_id_param: thread_id });

    if (incrementError) {
      console.error('Failed to increment interactions:', incrementError);
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (err) {
    console.error('Unhandled error in saveInteraction:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
