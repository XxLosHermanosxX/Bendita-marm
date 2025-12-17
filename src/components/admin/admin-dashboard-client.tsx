"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, LogOut, Activity, MapPin, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Definindo o tipo de evento (agora vem do Supabase)
interface TrackingEvent {
    id: number;
    timestamp: string;
    event: string;
    details: Record<string, any>;
    ip: string;
}

interface AdminDashboardClientProps {
    initialEvents: TrackingEvent[];
}

// Helper function to map event names to icons
const getEventIcon = (event: string) => {
    switch (event) {
        case 'Page Visit':
            return <MapPin className="h-4 w-4 text-blue-500" />;
        case 'Add to Cart':
            return <ShoppingCart className="h-4 w-4 text-primary" />;
        case 'Address Confirmed':
        case 'User Data Confirmed':
        case 'Payment Method Selected':
            return <CheckCircle2 className="h-4 w-4 text-success" />;
        case 'Reached Review Step':
            return <Activity className="h-4 w-4 text-yellow-500" />;
        case 'Order Placed - Redirecting to PIX':
        case 'Reached PIX Payment Page':
            return <Activity className="h-4 w-4 text-red-500" />;
        case 'Payment Approved':
            return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        default:
            return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
};

export const AdminDashboardClient = ({ initialEvents }: AdminDashboardClientProps) => {
    const router = useRouter();
    const [events, setEvents] = useState(initialEvents);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollPositionRef = useRef(0); // Para armazenar a posição de scroll

    // Função para buscar eventos do Supabase via API
    const fetchEvents = async () => {
        setIsLoading(true);
        
        // Salva a posição atual do scroll antes de buscar novos dados
        if (scrollRef.current) {
            scrollPositionRef.current = scrollRef.current.scrollTop;
        }

        try {
            const response = await fetch('/api/admin/events');
            if (response.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
                // Não redireciona aqui, o logout fará isso
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data: TrackingEvent[] = await response.json();
            setEvents(data);
        } catch (error) {
            toast.error('Erro ao carregar eventos.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Efeito para restaurar a posição do scroll após a atualização dos dados
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollPositionRef.current;
        }
    }, [events]); // Roda sempre que a lista de eventos é atualizada

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            toast.info('Saindo...');
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Falha ao sair.');
        }
    };
    
    // Set up polling to refresh data every 10 seconds
    useEffect(() => {
        const interval = setInterval(fetchEvents, 10000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Activity className="h-7 w-7 text-primary" /> Rastreamento de Clientes
                </h1>
                <div className="flex gap-2">
                    <Button onClick={fetchEvents} disabled={isLoading} variant="outline">
                        <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                        Atualizar
                    </Button>
                    <Button onClick={handleLogout} variant="destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                    </Button>
                </div>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="border-b">
                    <CardTitle className="text-xl">Eventos Recentes ({events.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div ref={scrollRef} className="max-h-[70vh] overflow-y-auto">
                        {events.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                Nenhum evento rastreado ainda.
                            </div>
                        ) : (
                            <ul className="divide-y divide-border">
                                {events.map((event) => (
                                    <li key={event.id} className="p-4 hover:bg-secondary/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                {getEventIcon(event.event)}
                                                <span className="font-semibold text-foreground">{event.event}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                                {format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground pl-7">
                                            {Object.entries(event.details).map(([key, value]) => (
                                                <p key={key}>
                                                    <span className="font-medium capitalize">{key}:</span> 
                                                    <span className="ml-1 font-mono">
                                                        {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                                                    </span>
                                                </p>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};