import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Phone, Mail } from "lucide-react";

// Mock data for clinics
const clinics = [
    {
        id: 1,
        name: "Clínica Dental Sonrisas",
        address: "Av. Providencia 1234, Of 202",
        phone: "+56 9 1234 5678",
        email: "contacto@sonrisas.cl",
        status: "active",
        type: "Clínica Grande"
    },
    {
        id: 2,
        name: "Dr. Juan Pérez",
        address: "Calle Los Leones 45, Consulta 1",
        phone: "+56 9 8765 4321",
        email: "dr.perez@dentist.com",
        status: "active",
        type: "Consulta Privada"
    },
    {
        id: 3,
        name: "Centro Odontológico Norte",
        address: "Independencia 500",
        phone: "+56 2 2345 6789",
        email: "admin@centronorte.cl",
        status: "inactive",
        type: "Red Dental"
    },
    {
        id: 4,
        name: "Dra. Ana López",
        address: "Alameda 300, Piso 5",
        phone: "+56 9 5555 4444",
        email: "ana.lopez@gmail.com",
        status: "active",
        type: "Consulta Privada"
    },
];

export default function Clinics() {
    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clínicas y Clientes</h2>
                    <p className="text-muted-foreground">Directorio de clínicas dentales y profesionales asociados.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Clínica
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar clínica..." className="pl-8" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clinics.map((clinic) => (
                    <Card key={clinic.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold truncate pr-4">
                                {clinic.name}
                            </CardTitle>
                            <Badge variant={clinic.status === 'active' ? 'default' : 'secondary'}>
                                {clinic.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mb-4">{clinic.type}</CardDescription>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{clinic.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{clinic.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{clinic.email}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Ver Detalles</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
