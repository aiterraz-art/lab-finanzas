import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useCompany } from "@/contexts/CompanyContext";

export default function DashboardLayout() {
    const { loading, selectedEmpresaId } = useCompany();

    return (
        <div className="min-h-screen bg-background font-sans">
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {loading ? (
                            <div className="text-muted-foreground">Cargando empresa...</div>
                        ) : selectedEmpresaId ? (
                            <Outlet />
                        ) : (
                            <div className="rounded-lg border bg-card p-6 text-muted-foreground">
                                No tienes empresas asignadas. Pide acceso a un administrador.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
