import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';

export default async function AuthenticatedAdminPage() {
    // O componente cliente agora é responsável por buscar os dados via API.
    // Passamos um array vazio para satisfazer a tipagem inicial.
    const initialEvents: any[] = []; 

    return (
        <div className="min-h-screen bg-secondary/50">
            <AdminDashboardClient initialEvents={initialEvents} />
        </div>
    );
}