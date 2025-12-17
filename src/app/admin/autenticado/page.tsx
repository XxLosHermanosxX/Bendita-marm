import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';

// Definindo o tipo TrackingEvent para uso no Server Component
interface TrackingEvent {
    id: number;
    timestamp: string;
    event: string;
    details: Record<string, any>;
    ip: string;
}

export default async function AuthenticatedAdminPage() {
    // O módulo tracker-store foi removido. O componente cliente fará a busca inicial via API.
    // Tipando explicitamente como array vazio de TrackingEvent
    const initialEvents: TrackingEvent[] = []; 

    return (
        <div className="min-h-screen bg-secondary/50">
            <AdminDashboardClient initialEvents={initialEvents} />
        </div>
    );
}