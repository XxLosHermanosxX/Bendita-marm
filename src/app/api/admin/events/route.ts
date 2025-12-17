import { NextRequest, NextResponse } from 'next/server';
import { getTrackingEvents } from '@/lib/tracker-store';

export async function GET(request: NextRequest) {
    try {
        const events = getTrackingEvents();
        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching tracking events:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}