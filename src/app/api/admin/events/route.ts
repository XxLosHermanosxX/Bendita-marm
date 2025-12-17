import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('tracking_events')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100); // Limita a 100 eventos recentes

        if (error) {
            console.error('Supabase fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch tracking events' }, { status: 500 });
        }

        // O tipo de retorno deve ser compatível com TrackingEvent[]
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching tracking events:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}