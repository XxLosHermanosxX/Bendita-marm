"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, LogOut, Activity, MapPin, ShoppingCart, CheckCircle2, MousePointerClick, ArrowDown } from 'lucide-react';
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
        case 'Scroll':
            return <ArrowDown className="h-4 w-4 text-gray-500" />;
        case 'Open Product Modal':
            return <MousePointerClick className="h-4 w-4 text-purple-500" />;
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

// Helper function to format event details into a readable string
const formatDetails = (event: TrackingEvent): string => {
    const details = event.details;
    switch (event.event) {
        case 'Page Visit':
            return `Página: ${details.page}`;
        case 'Scroll':
            return `Rolagem em ${details.page} (${details.scrollDepth}%)`;
        case 'Open Product Modal':
            return `Produto: ${details.productName} (ID: ${details.productId})`;
        case 'Add to Cart':
            return `Produto: ${details.productName} (${details.quantity}x). Total: ${details.totalPrice ? formatCurrency(details.totalPrice) : 'N/A'}`;
        case 'Address Confirmed':
            return `Endereço: ${details.city}, CEP: ${details.cep}`;
        case 'User Data Confirmed':
            return `Nome: ${details.name}, Telefone: ${details.phone}`;
        case 'Payment Method Selected':
            return `Método: ${details.method}`;
        case 'Reached Review Step':
            return `Subtotal: ${formatCurrency(details.subtotal)}, Total: ${formatCurrency(details.total)}`;
        case 'Order Placed - Redirecting to PIX':
            return `Total: ${formatCurrency(details.total)}, Itens: ${details.itemsCount}`;
        case 'Reached PIX Payment Page':
            return `Total: ${formatCurrency(details.total)}, ID Pedido: ${details.orderId}`;
        case 'Payment Approved':
            return `Transação ID: ${details.transactionId}, Valor: ${formatCurrency(details.amount)}`;
        default:
            return Object.entries(details)
                .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`)
                .join(', ');
    }
};

// Função para formatar moeda (copiada de utils.ts para evitar dependência de cliente)
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(amount);
};


export const AdminDashboardClient = ({ initialEvents }: AdminDashboardClientProps) => {
    const router = useRouter();
    const [events, setEvents] = useState(initialEvents);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollPositionRef = useRef(0); // Para armazenar a posição de scroll

    // Agrupar eventos por IP
    const groupedEvents = useMemo(() => {
        return events.reduce((acc, event) => {
            if (!acc[event.ip]) {
                acc[event.ip] = [];
            }
            acc[event.ip].push(event);
            return acc;
        }, {} as Record<string, TrackingEvent[]>);
    }, [events]);

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
                    <CardTitle className="text-xl">Sessões Recentes ({Object.keys(groupedEvents).length} IPs)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div ref={scrollRef} className="max-h-[70vh] overflow-y-auto">
                        {Object.keys(groupedEvents).length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                Nenhum evento rastreado ainda.
                            </div>
                        ) : (
                            <ul className="divide-y divide-border">
                                {Object.entries(groupedEvents).map(([ip, ipEvents]) => (
                                    <li key={ip} className="p-4">
                                        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-red-600" /> Cliente IP: <span className="font-mono text-sm bg-secondary p-1 rounded">{ip}</span>
                                        </h3>
                                        <ol className="space-y-2 border-l-2 border-border ml-3 pl-4">
                                            {ipEvents.map((event, index) => (
                                                <li key={event.id} className="relative">
                                                    {/* Ponto de linha do tempo */}
                                                    <div className="absolute -left-[11px] top-1 h-4 w-4 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                                                        {getEventIcon(event.event)}
                                                    </div>
                                                    <div className="text-sm">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-semibold text-foreground">{event.event}</span>
                                                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                                                {format(new Date(event.timestamp), 'HH:mm:ss', { locale: ptBR })}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            {formatDetails(event)}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
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