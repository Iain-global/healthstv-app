import { EventEmitter } from 'events';

export type RealtimeEventType = 
  | 'video:submitted'
  | 'video:approved'
  | 'video:rejected'
  | 'event:submitted'
  | 'event:approved'
  | 'event:rejected';

export interface RealtimeEventPayload {
  type: RealtimeEventType;
  videoId?: number;
  eventId?: number;
  title?: string;
  organiserName?: string;
  isEdit?: boolean;
  video?: any;
  event?: any;
  timestamp?: number;
}

// Global EventEmitter singleton to persist across Next.js dev reloads
declare global {
  // eslint-disable-next-line no-var
  var __realtimeBus: EventEmitter | undefined;
}

const realtimeBus: EventEmitter = global.__realtimeBus || new EventEmitter();
realtimeBus.setMaxListeners(200);

if (process.env.NODE_ENV !== 'production') {
  global.__realtimeBus = realtimeBus;
}

/**
 * Broadcast an event to all connected SSE clients
 */
export function broadcastRealtimeEvent(payload: RealtimeEventPayload) {
  const fullPayload = {
    ...payload,
    timestamp: Date.now()
  };

  try {
    realtimeBus.emit('realtime-event', fullPayload);
  } catch (err) {
    console.error('Error emitting realtime event:', err);
  }
}

/**
 * Subscribe a callback to realtime events
 */
export function subscribeToRealtimeEvents(callback: (payload: RealtimeEventPayload) => void) {
  realtimeBus.on('realtime-event', callback);
  return () => {
    realtimeBus.off('realtime-event', callback);
  };
}