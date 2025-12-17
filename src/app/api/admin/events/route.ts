import { NextRequest, NextResponse } from 'next/server';
import { getTrackingEvents } from '@/lib/tracker-store';

// Simple check for the admin_auth cookie
function isAuthenticated(request: NextRequest): boolean {
    return request.cookies.get('admin_auth')?.value === 'true';
}

export async function GET(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const events = getTrackingEvents();
        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching tracking events:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}