import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Plus, Download, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        receivables: 0,
        bankBalance: 0,
        pendingCount: 0,
        monthlyRevenue: 0,
        payables: 0,
        payablesCount: 0
    });
    const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
    const [recentMovements, setRecentMovements] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            // 1. Facturas Pendientes (Ventas)
            const { data: invData } = await supabase
                .from('facturas')
                .select('*')
                .eq('tipo', 'venta')
                .eq('estado', 'pendiente')
                .order('fecha_emision', { ascending: true })
                .limit(5);

            const { data: allPending } = await supabase
                .from('facturas')
                .select('monto')
                .eq('tipo', 'venta')
                .eq('estado', 'pendiente');

            // 2. Ingresos del Mes (Facturas de venta pagadas este mes)
            const { data: monthlyData } = await supabase
                .from('facturas')
                .select('monto')
                .eq('tipo', 'venta')
                .eq('estado', 'pagada')
                .gte('created_at', firstDayOfMonth);

            // 3. Movimientos del Banco
            const { data: bankData } = await supabase
                .from('movimientos_banco')
                .select('*')
                .order('id_secuencial', { ascending: false })
                .limit(5);

            // Obtenemos el saldo de la transacción más reciente (la que estaba más arriba en el Excel)
            const { data: latestMov } = await supabase
                .from('movimientos_banco')
                .select('saldo')
                .order('id_secuencial', { ascending: false })
                .limit(1)
                .single();

            // 4. Facturas por Pagar (Compras pendientes NO conciliadas)
            const { data: payablesData } = await supabase
                .from('facturas')
                .select(`
                    id,
                    monto,
                    facturas_pagos!left(id)
                `)
                .eq('tipo', 'compra')
                .eq('estado', 'pendiente')
                .is('facturas_pagos.id', null);

            const totalPayables = (payablesData || []).reduce((sum, inv) => sum + Number(inv.monto), 0);

            // Cálculos
            const totalReceivables = (allPending || []).reduce((sum, inv) => sum + Number(inv.monto), 0);
            const totalBank = latestMov?.saldo || 0;
            const revenue = (monthlyData || []).reduce((sum, inv) => sum + Number(inv.monto), 0);

            setStats({
                receivables: totalReceivables,
                bankBalance: totalBank,
                pendingCount: (allPending || []).length,
                monthlyRevenue: revenue,
                payables: totalPayables,
                payablesCount: (payablesData || []).length
            });

            setPendingInvoices(invData || []);
            setRecentMovements(bankData || []);

        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'S/F';
        return new Date(dateString).toLocaleDateString('es-CL');
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Resumen del Laboratorio</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestión de facturación dental y conciliación bancaria.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={fetchDashboardData}>
                        <Download className="w-4 h-4" />
                        Exportar Reporte
                    </Button>
                    <Button asChild className="gap-2">
                        <Link to="/facturas/nueva">
                            <Plus className="w-4 h-4" />
                            Nueva Factura
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Por Cobrar Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.receivables)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Saldo pendiente en facturas de venta
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Saldo en Banco</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.bankBalance)}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Suma neta de movimientos cargados
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Cobranzas Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingCount} Documentos</div>
                        <p className="text-xs text-primary font-medium mt-1">
                            Facturas esperando pago
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos del Mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            Pagado este mes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Por Pagar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.payables)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.payablesCount} facturas sin pagar
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Dashboard Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Pending Collections Section */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Cobranzas Pendientes</CardTitle>
                        <Button variant="ghost" size="sm" asChild className="text-primary">
                            <Link to="/facturas">Ver Todas</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase py-2 border-b">
                                <div className="col-span-2">Fecha</div>
                                <div className="col-span-4">Cliente</div>
                                <div className="col-span-2">N° Doc</div>
                                <div className="col-span-2 text-right">Monto</div>
                                <div className="col-span-2 text-center">Estado</div>
                            </div>

                            {pendingInvoices.length === 0 ? (
                                <p className="text-sm text-center py-4 text-muted-foreground">No hay facturas pendientes.</p>
                            ) : (
                                pendingInvoices.map((inv) => (
                                    <div key={inv.id} className="grid grid-cols-12 items-center text-sm py-2 hover:bg-muted/50 rounded-md transition-colors px-1">
                                        <div className="col-span-2 text-muted-foreground italic">
                                            {formatDate(inv.fecha_emision)}
                                        </div>
                                        <div className="col-span-4 font-medium">
                                            {inv.tercero_nombre || 'S/N'}
                                        </div>
                                        <div className="col-span-2 text-muted-foreground">#{inv.numero_documento}</div>
                                        <div className="col-span-2 text-right font-bold text-slate-900">{formatCurrency(inv.monto)}</div>
                                        <div className="col-span-2 flex justify-center">
                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">Pendiente</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Movements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-1 bg-primary/10 rounded">
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </div>
                            Movimientos Recientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentMovements.length === 0 ? (
                                <p className="text-sm text-center py-4 text-muted-foreground">Sin movimientos registrados.</p>
                            ) : (
                                recentMovements.map((mov) => (
                                    <div key={mov.id} className="flex items-start gap-3 p-3 bg-card border rounded-lg shadow-sm">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                            mov.monto > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                        )}>
                                            {mov.monto > 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold truncate uppercase">{mov.description || mov.descripcion || 'S/D'}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">{mov.estado === 'conciliado' ? 'Conciliado' : 'Pendiente'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn("text-xs font-bold", mov.monto > 0 ? "text-green-600" : "text-slate-900")}>
                                                {formatCurrency(mov.monto)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <Button variant="outline" className="w-full border-dashed text-xs" asChild>
                                <Link to="/banco">Ir a Banco</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Helper para classes
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

