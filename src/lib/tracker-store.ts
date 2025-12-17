import { NextRequest } from 'next/server';

export interface TrackingEvent {
    id: string;
    timestamp: string;
    event: string;
    details: Record<string, any>;
}

// In-memory store (will reset on server restart)
const trackingEvents: TrackingEvent[] = [];

export function addTrackingEvent(event: string, details: Record<string, any>) {
    const newEvent: TrackingEvent = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        event,
        details,
    };
    trackingEvents.push(newEvent);
    // Keep the list manageable (e.g., last 100 events)
    if (trackingEvents.length > 100) {
        trackingEvents.shift();
    }
    console.log(`[TRACKER] New event: ${event}`);
}

export function getTrackingEvents(): TrackingEvent[] {
    return trackingEvents.slice().reverse(); // Return a reversed copy for display
}