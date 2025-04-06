Error processing POST request: Error: Timeout: Previous run did not complete in time.
    at waitForRunCompletion (src/app/api/assistants/threads/[threadId]/messages/route.ts:26:8)
    at async POST (src/app/api/assistants/threads/[threadId]/messages/route.ts:39:4)
  24 |   }
  25 |
> 26 |   throw new Error("Timeout: Previous run did not complete in time.");
     |        ^
  27 | }
  28 |
  29 | export async function POST(req: NextRequest, context: any): Promise<Response> {
 POST /api/assistants/threads/thread_9mVDPhWE3Ggn5Hzk2j26sTuk/messages 500 in 15801ms