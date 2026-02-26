import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Plus, ShieldPlus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { inviteUserInternal } from '@/lib/internalAutomation';
import { useCompany } from '@/contexts/CompanyContext';

const COMPANY_ROLES = ['owner', 'admin', 'manager', 'user', 'viewer'] as const;
type CompanyRole = typeof COMPANY_ROLES[number];

const formatProfileCreatedAt = (raw: unknown) => {
    if (raw === null || raw === undefined) return '-';
    if (typeof raw === 'number') {
        return format(new Date(raw * 1000), "d 'de' MMMM, yyyy", { locale: es });
    }
    if (typeof raw === 'string') {
        const date = new Date(raw);
        if (!Number.isNaN(date.getTime())) {
            return format(date, "d 'de' MMMM, yyyy", { locale: es });
        }
    }
    return '-';
};

export default function Users() {
    const { selectedEmpresaId, selectedEmpresa, isGlobalAdmin, refreshCompanies } = useCompany();

    const [users, setUsers] = useState<any[]>([]);
    const [memberships, setMemberships] = useState<Record<string, CompanyRole>>({});
    const [loading, setLoading] = useState(true);

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("user");
    const [isInviting, setIsInviting] = useState(false);

    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState("");
    const [newCompanyLogo, setNewCompanyLogo] = useState("");
    const [isCreatingCompany, setIsCreatingCompany] = useState(false);

    useEffect(() => {
        if (selectedEmpresaId) {
            fetchUsers();
        }
    }, [selectedEmpresaId]);

    const fetchUsers = async () => {
        if (!selectedEmpresaId) return;

        setLoading(true);
        try {
            const [{ data: profileData, error: profilesError }, { data: membershipData, error: membershipsError }] = await Promise.all([
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                supabase.from('user_empresas').select('user_id, role').eq('empresa_id', selectedEmpresaId),
            ]);

            if (profilesError) throw profilesError;
            if (membershipsError) throw membershipsError;

            const roleMap: Record<string, CompanyRole> = {};
            for (const row of membershipData || []) {
                if (COMPANY_ROLES.includes(row.role)) {
                    roleMap[row.user_id] = row.role;
                }
            }

            setUsers(profileData || []);
            setMemberships(roleMap);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail) return;
        setIsInviting(true);
        try {
            await inviteUserInternal(inviteEmail, inviteRole as "user" | "admin");
            alert("Invitación enviada con éxito.");
            setIsInviteOpen(false);
            setInviteEmail("");
            fetchUsers();
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsInviting(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) return;

        try {
            const { error } = await supabase.rpc('delete_user_completely', { user_id: userId });
            if (error) throw error;

            setUsers(prev => prev.filter(u => u.id !== userId));
            alert("Usuario eliminado correctamente (Auth + Perfil).");
        } catch (error: any) {
            console.error("Error deleting user:", error);
            alert(`Error al eliminar usuario: ${error.message}`);
        }
    };

    const handleSetCompanyRole = async (userId: string, role: CompanyRole) => {
        if (!selectedEmpresaId) return;

        try {
            const { error } = await supabase
                .from('user_empresas')
                .upsert([
                    { user_id: userId, empresa_id: selectedEmpresaId, role },
                ], { onConflict: 'user_id,empresa_id' });

            if (error) throw error;

            setMemberships((prev) => ({
                ...prev,
                [userId]: role,
            }));
        } catch (error: any) {
            alert(`No se pudo actualizar permiso: ${error.message}`);
        }
    };

    const handleRemoveAccess = async (userId: string) => {
        if (!selectedEmpresaId) return;
        if (!confirm('¿Quitar acceso de este usuario a la empresa actual?')) return;

        try {
            const { error } = await supabase
                .from('user_empresas')
                .delete()
                .eq('user_id', userId)
                .eq('empresa_id', selectedEmpresaId);

            if (error) throw error;
            setMemberships((prev) => {
                const next = { ...prev };
                delete next[userId];
                return next;
            });
        } catch (error: any) {
            alert(`No se pudo quitar acceso: ${error.message}`);
        }
    };

    const handleCreateCompany = async () => {
        if (!newCompanyName.trim()) return;

        setIsCreatingCompany(true);
        try {
            const { error } = await supabase
                .from('empresas')
                .insert([
                    {
                        nombre: newCompanyName.trim(),
                        logo_url: newCompanyLogo.trim() || null,
                        activa: true,
                    },
                ]);

            if (error) throw error;

            setIsCompanyOpen(false);
            setNewCompanyName("");
            setNewCompanyLogo("");
            await refreshCompanies();
        } catch (error: any) {
            alert(`No se pudo crear empresa: ${error.message}`);
        } finally {
            setIsCreatingCompany(false);
        }
    };

    const usersWithAccess = useMemo(() => users.filter((u) => memberships[u.id]), [users, memberships]);

    if (!selectedEmpresaId) {
        return (
            <div className="rounded-lg border bg-card p-6 text-muted-foreground">
                Selecciona una empresa para gestionar usuarios y permisos.
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground mt-1">
                        Permisos por empresa: <span className="font-semibold">{selectedEmpresa?.nombre || 'Empresa actual'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {isGlobalAdmin && (
                        <Dialog open={isCompanyOpen} onOpenChange={setIsCompanyOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <ShieldPlus className="w-4 h-4" /> Nueva Empresa
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px]">
                                <DialogHeader>
                                    <DialogTitle>Crear Empresa</DialogTitle>
                                    <DialogDescription>
                                        Crea una empresa nueva con logo propio para trabajar datos separados.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="company-name">Nombre</Label>
                                        <Input
                                            id="company-name"
                                            value={newCompanyName}
                                            onChange={(e) => setNewCompanyName(e.target.value)}
                                            placeholder="Empresa Clínica Norte"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="company-logo">Logo URL</Label>
                                        <Input
                                            id="company-logo"
                                            value={newCompanyLogo}
                                            onChange={(e) => setNewCompanyLogo(e.target.value)}
                                            placeholder="https://.../logo.png"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCompanyOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleCreateCompany} disabled={isCreatingCompany}>
                                        {isCreatingCompany ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Crear
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" /> Invitar Usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
                                <DialogDescription>
                                    Se enviará un correo con instrucciones para acceder al sistema.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="usuario@lab3d.cl"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Rol Global</Label>
                                    <Select value={inviteRole} onValueChange={setInviteRole}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">Usuario</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
                                <Button onClick={handleInvite} disabled={isInviting}>
                                    {isInviting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                                    Enviar Invitación
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Rol Global</TableHead>
                            <TableHead>Permiso en Empresa</TableHead>
                            <TableHead>Fecha Registro</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No hay usuarios registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => {
                                const companyRole = memberships[user.id];
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {user.email?.substring(0, 2).toUpperCase()}
                                                </div>
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={companyRole || undefined}
                                                    onValueChange={(value) => handleSetCompanyRole(user.id, value as CompanyRole)}
                                                >
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue placeholder="Sin acceso" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {COMPANY_ROLES.map((role) => (
                                                            <SelectItem key={role} value={role}>
                                                                {role}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {!companyRole && (
                                                    <Badge variant="outline">Sin acceso</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatProfileCreatedAt(user.created_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {companyRole && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                                                        onClick={() => handleRemoveAccess(user.id)}
                                                        title="Quitar acceso a esta empresa"
                                                    >
                                                        <ShieldPlus className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    title="Eliminar usuario"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="text-sm text-muted-foreground">
                Usuarios con acceso en esta empresa: <strong>{usersWithAccess.length}</strong>
            </div>
        </div>
    );
}
