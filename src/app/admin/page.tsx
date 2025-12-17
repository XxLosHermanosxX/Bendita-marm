import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
    
    // Se autenticado, redireciona para a página de dashboard real
    redirect('/admin/autenticado');
}