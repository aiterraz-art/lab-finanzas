import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { format, addDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, Loader2 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

export default function CashFlow() {
    const { selectedEmpresaId } = useCompany();
    const [loading, setLoading] = useState(true);
    const [recurringExpenses, setRecurringExpenses] = useState<any[]>([]);
    const [projectionData, setProjectionData] = useState<any[]>([]);
    const [newExpense, setNewExpense] = useState({ descripcion: "", monto: "", dia_pago: "" });

    useEffect(() => {
        if (selectedEmpresaId) fetchData();
    }, [selectedEmpresaId]);

    const fetchData = async () => {
        if (!selectedEmpresaId) return;
        setLoading(true);
        try {
            const { data: recurring } = await supabase
                .from('gastos_recurrentes')
                .select('*')
                .eq('empresa_id', selectedEmpresaId)
                .eq('activo', true);
            setRecurringExpenses(recurring || []);

            const { data: latestMov } = await supabase
                .from('movimientos_banco')
                .select('saldo')
                .eq('empresa_id', selectedEmpresaId)
                .order('id_secuencial', { ascending: false })
                .limit(1)
                .single();
            const currentBalance = latestMov?.saldo || 0;

            const { data: pendingInvoices } = await supabase
                .from('facturas')
                .select('monto, fecha_vencimiento, fecha_emision')
                .eq('empresa_id', selectedEmpresaId)
                .eq('tipo', 'venta')
                .eq('estado', 'pendiente');

            const { data: pendingPurchases } = await supabase
                .from('facturas')
                .select('monto, fecha_vencimiento, fecha_emision')
                .eq('empresa_id', selectedEmpresaId)
                .eq('tipo', 'compra')
                .eq('estado', 'pendiente');

            const projections = [];
            let runningBalance = currentBalance;
            const now = startOfDay(new Date());

            for (let i = 0; i < 30; i++) {
                const date = addDays(now, i);
                const dateString = format(date, 'yyyy-MM-dd');
                const dayOfMonth = date.getDate();

                const recurringToday = (recurring || []).filter(e => Number(e.dia_pago) === dayOfMonth).reduce((sum, e) => sum + Number(e.monto), 0);

                const purchasesToday = (pendingPurchases || []).filter(inv => {
                    const vDate = inv.fecha_vencimiento || (inv.fecha_emision ? format(addDays(new Date(inv.fecha_emision + 'T12:00:00'), 30), 'yyyy-MM-dd') : null);
                    return vDate === dateString;
                }).reduce((sum, inv) => sum + Number(inv.monto), 0);

                const expensesToday = recurringToday + purchasesToday;

                const incomeToday = (pendingInvoices || []).filter(inv => {
                    const vDate = inv.fecha_vencimiento || (inv.fecha_emision ? format(addDays(new Date(inv.fecha_emision + 'T12:00:00'), 30), 'yyyy-MM-dd') : null);
                    return vDate === dateString;
                }).reduce((sum, inv) => sum + Number(inv.monto), 0);

                runningBalance = runningBalance + incomeToday - expensesToday;
                projections.push({
                    date: format(date, 'dd MMM', { locale: es }),
                    balance: runningBalance,
                    income: incomeToday,
                    expenses: expensesToday
                });
            }
            setProjectionData(projections);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async () => {
        if (!selectedEmpresaId) return;
        const dia = parseInt(newExpense.dia_pago);
        if (!newExpense.descripcion || !newExpense.monto || isNaN(dia) || dia < 1 || dia > 31) return;
        try {
            await supabase.from('gastos_recurrentes').insert([{ empresa_id: selectedEmpresaId, descripcion: newExpense.descripcion, monto: Number(newExpense.monto), dia_pago: dia, categoria: 'General' }]);
            setNewExpense({ descripcion: "", monto: "", dia_pago: "" });
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleDeleteExpense = async (id: string) => {
        if (!selectedEmpresaId) return;
        await supabase.from('gastos_recurrentes').update({ activo: false }).eq('id', id).eq('empresa_id', selectedEmpresaId);
        fetchData();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto py-6 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Flujo de Caja Proyectado</h2>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Disponibilidad de Efectivo (Próximos 30 días)</CardTitle>
                        <CardDescription>Barras: Movimiento del día | Línea: Saldo total acumulado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[430px] w-full relative pt-10 pb-20 px-6 group flex flex-col">
                            {/* Grid Lines */}
                            <div className="absolute inset-x-6 top-10 bottom-20 flex flex-col justify-between pointer-events-none">
                                {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-muted-foreground/10 border-dashed"></div>)}
                            </div>

                            <div className="flex-1 relative">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    {(() => {
                                        const maxBalance = Math.max(...projectionData.map(d => Math.abs(d.balance))) || 1;
                                        const maxDaily = Math.max(...projectionData.map(d => Math.max(d.income, d.expenses))) || 1;
                                        const width = 100 / projectionData.length;
                                        const points = projectionData.map((d, i) => `${(i * width) + (width / 2)}%,${50 - (d.balance / maxBalance) * 40}%`).join(" ");

                                        return (
                                            <>
                                                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                                                {projectionData.map((d, i) => {
                                                    const x = i * width;
                                                    const barW = width * 0.8;
                                                    const barX = x + (width * 0.1);
                                                    const dailyNet = d.income - d.expenses;
                                                    const h = (Math.abs(dailyNet) / maxDaily) * 45;
                                                    const y = dailyNet >= 0 ? 50 - h : 50;

                                                    return (
                                                        <g key={i} className="group/item">
                                                            <rect x={`${x}%`} y="0" width={`${width}%`} height="100%" className="fill-transparent cursor-pointer pointer-events-auto" />
                                                            <rect x={`${barX}%`} y={`${y}%`} width={`${barW}%`} height={`${h}%`} className={`${dailyNet >= 0 ? 'fill-primary' : 'fill-red-400'} opacity-40 group-hover/item:opacity-100 transition-opacity pointer-events-none`} />
                                                            <line x1={`${x + width / 2}%`} y1="0" x2={`${x + width / 2}%`} y2="100%" className="stroke-muted-foreground/30 stroke-1 opacity-0 group-hover/item:opacity-100 pointer-events-none" strokeDasharray="4 2" />
                                                            <foreignObject x={`${(i / 30) > 0.7 ? (i * width) - 30 : (i * width)}%`} y="-20%" width="200" height="150" className="opacity-0 group-hover/item:opacity-100 transition-opacity z-50 overflow-visible pointer-events-none">
                                                                <div className="bg-popover text-popover-foreground text-[11px] p-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-2 border-primary/20 bg-white/95 backdrop-blur-md">
                                                                    <p className="font-bold border-b pb-2 mb-2 text-sm">{d.date}</p>
                                                                    <div className="space-y-1.5">
                                                                        <p className="flex justify-between gap-4"><span>Saldo Proyectado:</span> <strong className={d.balance >= 0 ? 'text-primary' : 'text-red-600'}>{formatCurrency(d.balance)}</strong></p>
                                                                        {d.income > 0 && <p className="flex justify-between text-green-700"><span>Ingreso Hoy:</span> <span>+{formatCurrency(d.income)}</span></p>}
                                                                        {d.expenses > 0 && <p className="flex justify-between text-red-600"><span>Gasto Hoy:</span> <span>-{formatCurrency(d.expenses)}</span></p>}
                                                                    </div>
                                                                </div>
                                                            </foreignObject>
                                                        </g>
                                                    );
                                                })}
                                                <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={points} className="text-secondary/60 pointer-events-none" />
                                                {projectionData.map((d, i) => (
                                                    <circle key={i} cx={`${(i * width) + (width / 2)}%`} cy={`${50 - (d.balance / maxBalance) * 40}%`} r="4" className={`${d.balance >= 0 ? 'fill-primary' : 'fill-red-600'} pointer-events-none`} />
                                                ))}
                                            </>
                                        );
                                    })()}
                                </svg>
                            </div>

                            {/* X-Axis Dates Labels (Outside SVG for stability) */}
                            <div className="absolute inset-x-6 bottom-0 h-16 flex justify-between items-start pt-6 border-t pointer-events-none">
                                {projectionData.map((d, i) => (
                                    i % 4 === 0 ? (
                                        <div key={i} className="flex-1 text-center">
                                            <span className="text-[10px] font-bold text-muted-foreground block -rotate-45 origin-center mt-2">
                                                {d.date}
                                            </span>
                                        </div>
                                    ) : (
                                        <div key={i} className="flex-1" />
                                    )
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm border-t pt-6">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary/60 rounded"></div> Tendencia (Saldo)</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary/40 rounded"></div> Entrada</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400/40 rounded"></div> Salida</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Gastos Recurrentes</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Label>Nuevo Gasto</Label>
                        <Input placeholder="Descripción" value={newExpense.descripcion} onChange={e => setNewExpense({ ...newExpense, descripcion: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                            <Input type="number" placeholder="Monto" value={newExpense.monto} onChange={e => setNewExpense({ ...newExpense, monto: e.target.value })} />
                            <Input type="number" placeholder="Día" value={newExpense.dia_pago} onChange={e => setNewExpense({ ...newExpense, dia_pago: e.target.value })} />
                        </div>
                        <Button className="w-full" onClick={handleAddExpense}>Agregar</Button>
                        <div className="pt-4 divide-y max-h-[300px] overflow-y-auto">
                            {recurringExpenses.map(e => (
                                <div key={e.id} className="py-2 flex justify-between items-center text-sm">
                                    <div><p className="font-bold">{e.descripcion}</p><p className="text-xs text-muted-foreground">Día {e.dia_pago} • {formatCurrency(e.monto)}</p></div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(e.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
