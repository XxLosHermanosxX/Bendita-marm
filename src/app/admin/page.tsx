import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';
import { getTrackingEvents, TrackingEvent } from '@/lib/tracker-store';

// Server-side authentication check
function isAuthenticated(): boolean {
    // Fix 3: Cast cookies() to 'any' para resolver o erro de tipagem sobre Promise<ReadonlyRequestCookies>
    const cookieStore = cookies() as any; 
    return cookieStore.get('admin_auth')?.value === 'true';
}

export default async function AdminPage() {
    if (!isAuthenticated()) {
        redirect('/admin/login');
    }

    // Fetch initial data on the server
    // NOTE: This data is volatile and resets on server restart.
    const initialEvents: TrackingEvent[] = getTrackingEvents();

    return (
        <div className="min-h-screen bg-secondary/50">
            <AdminDashboardClient initialEvents={initialEvents} />
        </div>
    );
}