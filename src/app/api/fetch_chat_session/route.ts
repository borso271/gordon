import { NextRequest, NextResponse } from 'next/server';
import supabase_client from '../../../lib/supabaseClient';

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const threadId = body.threadId;
      
      console.log("body of request is: ", body)
      if (!threadId) {
        return NextResponse.json({ error: 'Missing threadId' }, { status: 400 });
      }

  // 1. Get thread
  const { data: thread, error: threadError } = await supabase_client
    .from('threads')
    .select('*')
    .eq('id', threadId)
    .single();

  if (threadError || !thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }

  // 2. Get all messages for this thread
  const { data: messages, error: messagesError } = await supabase_client
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (messagesError || !messages) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }


  const messageIds = messages.map((m) => m.id);

  // 3. Get all message parts
  const { data: messageParts, error: partsError } = await supabase_client
    .from('message_parts')
    .select('*')
    .in('message_id', messageIds)
    .order('order_index', { ascending: true });

  if (partsError || !messageParts) {
    return NextResponse.json({ error: 'Failed to fetch message parts' }, { status: 500 });
  }

  // 4. Group parts by message_id
  const partsByMessage: Record<string, any[]> = {};
  messageParts.forEach((part) => {
    if (!partsByMessage[part.message_id]) partsByMessage[part.message_id] = [];
    partsByMessage[part.message_id].push(part);
  });

  // 5. Group messages into interactions
  const messagesByInteraction: Record<string, any[]> = {};
  messages.forEach((msg) => {
    if (!messagesByInteraction[msg.interaction_id]) messagesByInteraction[msg.interaction_id] = [];
    messagesByInteraction[msg.interaction_id].push(msg);
  });

  const interactions = Object.entries(messagesByInteraction).map(([interactionId, msgs]) => {
    const user = msgs.find((m) => m.role === 'user');
    const assistant = msgs.find((m) => m.role === 'assistant');

    if (!user || !assistant) return null; // skip incomplete interactions

    const userMessage = {
      id: user.id,
      text: partsByMessage[user.id]?.[0]?.text || '',
      role: user.role,
      language: user.language,
      createdAt: user.created_at,
      show:  user.show,  // ✅ Default to true if not provided
      metadata: {},
    };

    const botMessageParts = (partsByMessage[assistant.id] || []).map((p: any) => {
      const common = { type: p.type, text: p.text ?? '', data: p.data ?? null,sidebar: p.sidebar ?? false };
      if (p.type === 'assistantText') return { type: 'assistantText', text: p.text ?? '', data: p.data ?? null , sidebar: p.sidebar ?? false};
      if (p.type === 'tool_output') return {
        type: 'tool_output',
        toolName: p.data?.toolName ?? 'unknown',
        input: p.data?.input ?? '',
        output: p.data?.output ?? '',
        imageUrl: p.data?.imageUrl ?? '',
        metadata: p.data?.metadata ?? {},
        sidebar: p.sidebar ?? false
      };
      return { type: p.type, data: p.data, sidebar: p.sidebar ?? false };
    });

    console.log("BOT MESSAGE PARTS: ", botMessageParts)

    const botMessage = {
      id: assistant.id,
      role: assistant.role,
      language: assistant.language,
      createdAt: assistant.created_at,
      metadata: {},
      parts: botMessageParts,
    };

    return {
      id: interactionId,
      timestamp: user.created_at,
      language: user.language,
      userMessage,
      botMessage,
    };
  }).filter(Boolean); // remove nulls

  const chatSession = {
    id: thread.id,
    title: thread.title || 'Untitled',
    createdAt: thread.created_at,
    updatedAt: thread.updated_at,
    interactions,
  };

  return NextResponse.json({ chatSession }, { status: 200 });}
  catch (err) {
    console.error('Error parsing body:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
