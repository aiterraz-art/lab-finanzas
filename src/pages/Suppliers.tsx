import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Search, FileText } from "lucide-react";

// Mock data for suppliers
const suppliers = [
    {
        id: 1,
        name: "Dental Import S.A.",
        category: "Insumos Generales",
        contact: "Roberto Gómez",
        phone: "+56 2 2555 1000",
        email: "ventas@dentalimport.cl",
        status: "active",
        balance: 1500000
    },
    {
        id: 2,
        name: "Cerámicas Dentales Chile",
        category: "Cerámicas",
        contact: "María José",
        phone: "+56 9 9999 8888",
        email: "mariajose@ceramicas.cl",
        status: "active",
        balance: 0
    },
    {
        id: 3,
        name: "Metales y Aleaciones Ltda.",
        category: "Metales",
        contact: "Venta Directa",
        phone: "+56 2 2444 3333",
        email: "pedidos@metales.cl",
        status: "inactive",
        balance: 45000
    },
    {
        id: 4,
        name: "TecnoLab Equipos",
        category: "Equipamiento",
        contact: "Andrés Silva",
        phone: "+56 9 7777 6666",
        email: "asilva@tecnolab.cl",
        status: "active",
        balance: 320000
    },
];

export default function Suppliers() {
    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Proveedores</h2>
                    <p className="text-muted-foreground">Gestión de proveedores y cuentas por pagar.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Proveedor
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar proveedor..." className="pl-8" />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Proveedores</CardTitle>
                    <CardDescription>Directorio de empresas y deudas pendientes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Proveedor</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Saldo Pendiente</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.map((supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell>
                                        <div className="font-medium">{supplier.name}</div>
                                        <div className="text-xs text-muted-foreground">{supplier.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{supplier.category}</Badge>
                                    </TableCell>
                                    <TableCell>{supplier.contact}</TableCell>
                                    <TableCell>
                                        <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                                            {supplier.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {supplier.balance > 0 ? (
                                            <span className="text-red-600">${supplier.balance.toLocaleString('es-CL')}</span>
                                        ) : (
                                            <span className="text-green-600">$0</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" title="Ver Facturas">
                                            <FileText className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
