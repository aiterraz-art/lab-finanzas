import { Bell, Building2, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/contexts/CompanyContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function Header() {
    const { empresas, selectedEmpresaId, setSelectedEmpresaId, loading } = useCompany();

    return (
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center w-full max-w-2xl gap-3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search invoices..."
                        className="w-full pl-9 bg-muted/50 border-none focus-visible:ring-1"
                    />
                </div>
                <div className="w-64">
                    <Select
                        value={selectedEmpresaId || undefined}
                        onValueChange={setSelectedEmpresaId}
                        disabled={loading || empresas.length === 0}
                    >
                        <SelectTrigger className="h-9">
                            <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder={loading ? "Cargando empresas..." : "Selecciona empresa"} />
                        </SelectTrigger>
                        <SelectContent>
                            {empresas.map((empresa) => (
                                <SelectItem key={empresa.id} value={empresa.id}>
                                    {empresa.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                </Button>

                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border overflow-hidden">
                    <User className="w-5 h-5 text-muted-foreground" />
                </div>
            </div>
        </header>
    );
}
