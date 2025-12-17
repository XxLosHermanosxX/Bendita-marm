import { NextRequest, NextResponse } from 'next/server';
import { addTrackingEvent } from '@/lib/tracker-store';

export async function POST(request: NextRequest) {
    try {
        const { event, details } = await request.json();
        
        if (!event) {
            return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
        }

        // Attempt to get client IP (may be unreliable depending on deployment environment)
        const ip = request.headers.get('x-forwarded-for') || (request as any).ip || 'unknown';

        const fullDetails = {
            ...details,
            ip: ip,
        };

        addTrackingEvent(event, fullDetails);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing tracking event:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}