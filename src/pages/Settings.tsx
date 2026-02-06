import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function Settings() {
    return (
        <div className="container mx-auto py-10 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
                <p className="text-muted-foreground">Administra tu cuenta y preferencias del sistema.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="billing">Facturación</TabsTrigger>
                    <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Laboratorio</CardTitle>
                            <CardDescription>
                                Actualiza los datos principales de tu laboratorio.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="lab-name">Nombre del Laboratorio</Label>
                                <Input id="lab-name" defaultValue="LabFlow Finance" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico de Contacto</Label>
                                <Input id="email" type="email" defaultValue="admin@labflow.cl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input id="phone" defaultValue="+56 9 1234 5678" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Guardar Cambios</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="billing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferencias Monetarias</CardTitle>
                            <CardDescription>
                                Configura la moneda y formatos de fecha.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currency">Moneda</Label>
                                <Input id="currency" defaultValue="CLP (Peso Chileno)" disabled />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
