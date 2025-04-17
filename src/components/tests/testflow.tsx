"use client";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown"; // For rendering AI responses nicely
import remarkGfm from 'remark-gfm'; // Optional: For GitHub Flavored Markdown

// Define a more specific type for messages, including optional tool_call_id
interface StreamMessage {
  type: "ai" | "tool" | "human" | string; // Allow other types, but specify common ones
  content: string;
  tool_call_id?: string; // Add optional tool_call_id
}

export default function TestFlow() {
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null); // Ref to manage EventSource

  const startFlow = () => {
    setIsRunning(true);
    setMessages([]); // Clear previous messages

    // Close existing connection if any
    if (eventSourceRef.current) {
        eventSourceRef.current.close();
    }

    // SSE => GET /api/langgraph
    const es = new EventSource("/api/langgraph");
    eventSourceRef.current = es; // Store ref

    es.onopen = () => {
      console.log("✅ SSE connection opened");
    };

    es.onmessage = (event) => {
      try {
        const receivedData: StreamMessage = JSON.parse(event.data);
        console.log("💡 SSE chunk from server:", receivedData);

        setMessages((prevMessages) => {
          // --- Logic for Handling Streamed AI Chunks ---
          // Check if the last message is an AI message and the new one is also AI
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (
            receivedData.type === "ai" &&
            lastMessage?.type === "ai"
          ) {
            // Append the new content chunk to the last AI message
            return [
              ...prevMessages.slice(0, -1), // All messages except the last one
              {
                ...lastMessage, // Keep type and any other properties
                content: lastMessage.content + receivedData.content, // Append content
              },
            ];
          }

          // --- Logic for Handling New Messages (Tool, Human, or first AI chunk) ---
          // Otherwise, add the new message object as a whole
          return [...prevMessages, receivedData];
        });
      } catch (err) {
        console.error("SSE JSON parse error:", err);
        // Optionally display an error message to the user
      }
    };

    es.onerror = (err) => {
      console.error("❌ SSE stream error:", err);
      // This might be triggered if the server closes the connection *or* if there's a network error.
      // It's often triggered when the stream naturally ends from the server side.
      es.close(); // Ensure it's closed from the client side too
      eventSourceRef.current = null;
      setIsRunning(false); // Stop the running indicator
    };
  };

  // Effect to close EventSource on component unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);


  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', lineHeight: 1.6 }}>
      <button onClick={startFlow} disabled={isRunning} style={buttonStyle}>
        {isRunning ? "Running Flow..." : "Start Financial Data Flow"}
      </button>
      <div style={{ marginTop: 20, border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
        {messages.length === 0 && !isRunning && (
          <p style={{ color: '#666' }}>Click the button to start the data analysis flow.</p>
        )}
        {isRunning && messages.length === 0 && (
            <p style={{ color: '#666' }}>Waiting for stream...</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i === messages.length - 1 ? 'none' : '1px solid #eee' }}>
            {msg.type === "tool" ? (
              <div style={toolMessageStyle}>
                <strong>🛠️ Tool Output:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0 0 0', background: '#f0f0f0', padding: '5px 8px', borderRadius: '4px' }}>
                    {msg.content}
                </pre>
                {/* Optionally display tool_call_id for debugging */}
                {/* {msg.tool_call_id && <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>ID: {msg.tool_call_id}</small>} */}
              </div>
            ) : msg.type === "ai" ? (
               <div style={aiMessageStyle}>
                 <strong>🤖 AI:</strong>
                 {/* Use Markdown to render AI content */}
                 <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
               </div>
            ) : (
               // Generic display for other types (e.g., initial Human message if you add it)
               <div>
                 <strong>{msg.type.charAt(0).toUpperCase() + msg.type.slice(1)}:</strong>
                 <p style={{ margin: '5px 0 0 0' }}>{msg.content}</p>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Basic styles (optional)
const buttonStyle = {
    padding: '10px 15px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginBottom: '20px',
};

const toolMessageStyle = {
    background: '#fffbe6', // Light yellow background for tools
    border: '1px solid #ffe58f',
    padding: '10px',
    borderRadius: '4px',
    color: '#333',
};

const aiMessageStyle = {
    color: '#333', // Standard text color for AI
};





// import React, { useState } from "react";

// type Message = {
//   role: string;
//   content: string;
// };

// export default function StockAnalysisFlow() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isRunning, setIsRunning] = useState(false);

//   const startFlow = () => {
//     setMessages([]);
//     setIsRunning(true);
  
//     const eventSource = new EventSource("/api/langgraph");
  
//     eventSource.onmessage = (event) => {
//       const step = JSON.parse(event.data);
//       const newMessages = step?.messages || [];
  
//       const formatted = newMessages.map((msg: any) => ({
//         role: msg.type,
//         content: msg.data.content || "[no content]",
//       }));
  
//       setMessages((prev) => [...prev, ...formatted]);
//     };
  
//     eventSource.onerror = (err) => {
//       console.error("Stream error:", err);
//       eventSource.close();
//       setIsRunning(false);
//     };
  
//     eventSource.onopen = () => {
//       console.log("📡 Connection opened");
//     };
//   };
  

//   return (
//     <div style={{ padding: 20, fontFamily: "Arial" }}>
//       <h2>📊 Stock Analysis Flow</h2>
//       <button onClick={startFlow} disabled={isRunning}>
//         {isRunning ? "Running..." : "Start Flow"}
//       </button>

//       <div style={{ marginTop: 20 }}>
//       {messages.map((msg, i) => (
//   <div key={i} style={{ marginBottom: 12 }}>
//     <strong>
//       {msg.role === "human"
//         ? "🧑 You"
//         : msg.role === "ai"
//         ? "🤖 GPT"
//         : msg.role === "tool"
//         ? "🛠️ Tool"
//         : "🧩 Other"}
//     </strong>: {msg.content}
//   </div>
// ))}

//       </div>
//     </div>
//   );
// }
