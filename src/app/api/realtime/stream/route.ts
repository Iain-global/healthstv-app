import { subscribeToRealtimeEvents, RealtimeEventPayload } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const encoder = new TextEncoder();

  let unsubscribe: (() => void) | null = null;
  let heartbeatTimer: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(encoder.encode(`event: connected\ndata: {"status":"connected","time":${Date.now()}}\n\n`));

      // Periodic heartbeat ping (every 15 seconds) to keep HTTP connection alive
      heartbeatTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive\n\n`));
        } catch (err) {
          if (heartbeatTimer) clearInterval(heartbeatTimer);
        }
      }, 15000);

      // Subscribe to real-time events from the bus
      unsubscribe = subscribeToRealtimeEvents((payload: RealtimeEventPayload) => {
        try {
          const dataStr = JSON.stringify(payload);
          controller.enqueue(encoder.encode(`event: ${payload.type}\ndata: ${dataStr}\n\n`));
        } catch (err) {
          console.error('Error streaming realtime event to client:', err);
        }
      });
    },
    cancel() {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (unsubscribe) unsubscribe();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  });
}