import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';
import { getTrackingEvents, TrackingEvent } from '@/lib/tracker-store';

export default async function AuthenticatedAdminPage() {
    // Fetch initial data on the server
    // NOTE: This data is volatile and resets on server restart.
    const initialEvents: TrackingEvent[] = getTrackingEvents();

    return (
        <div className="min-h-screen bg-secondary/50">
            <AdminDashboardClient initialEvents={initialEvents} />
        </div>
    );
}