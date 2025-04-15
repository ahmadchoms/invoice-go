import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import useClients from "@/hooks/useClients";

const clientSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    address: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
});

export function ClientForm({ client, isEditing = false }) {
    const router = useRouter();
    const { data: session } = useSession();
    const { addClient, updateClient } = useClients();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: client?.name || "",
            email: client?.email || "",
            address: client?.address || "",
            phone: client?.phone || "",
            company: client?.company || "",
        },
    });

    const createSlugName = (name) => {
        return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError("");

        try {
            if (isEditing && client?.id) {
                await updateClient(client.id, {
                    ...data,
                    updated_at: new Date().toISOString(),
                });

                toast.success("Berhasil", {
                    description: "Data klien berhasil diperbarui",
                });
            } else {
                const slug_name = createSlugName(data.name);

                await addClient({
                    user_id: session.user.id,
                    ...data,
                    slug_name,
                    created_at: new Date().toISOString(),
                });

                toast.success("Berhasil", {
                    description: "Data klien berhasil disimpan",
                });
            }

            router.push("/clients");
        } catch (error) {
            console.error("Error saving client:", error);
            setError("Gagal menyimpan data klien. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Edit Klien" : "Tambah Klien Baru"}</CardTitle>
                    <CardDescription>
                        {isEditing
                            ? "Perbarui informasi klien Anda"
                            : "Tambahkan klien baru untuk memudahkan pembuatan invoice"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Klien <span className="text-red-500">*</span></Label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="name"
                                        placeholder="Nama lengkap klien"
                                    />
                                )}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                    />
                                )}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="phone"
                                        placeholder="+62812XXXXXXXX"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company">Perusahaan</Label>
                            <Controller
                                name="company"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="company"
                                        placeholder="Nama perusahaan (opsional)"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="address"
                                    placeholder="Alamat lengkap klien"
                                    rows={3}
                                />
                            )}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? "Perbarui Klien" : "Simpan Klien"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}