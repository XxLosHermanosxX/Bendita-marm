import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function POST(request: NextRequest) {
    try {
        const { event, details } = await request.json();
        
        if (!event) {
            return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('tracking_events')
            .insert({
                event: event,
                details: details,
                ip: (request as any).ip || request.headers.get('x-forwarded-for') || 'unknown',
            });

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to save tracking event' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing tracking event:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}