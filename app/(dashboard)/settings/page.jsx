"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import { auth, db, storage } from "@/lib/firebase/init"
import { useRouter } from "next/navigation"
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth"
import SubmitButton from "@/components/ui/submit-button"

const profileSchema = z.object({
    name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
    business_name: z.string().min(2, { message: "Nama bisnis minimal 2 karakter" }),
    email: z.string().email({ message: "Email tidak valid" }).optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
})

const passwordSchema = z.object({
    currentPassword: z.string().min(8, { message: "Password saat ini minimal 8 karakter" }),
    newPassword: z.string().min(8, { message: "Password baru minimal 8 karakter" }),
    confirmPassword: z.string().min(8, { message: "Konfirmasi password minimal 8 karakter" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password baru dan konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});

const FormField = ({ id, label, type = "text", register, errors, placeholder = "", textarea = false }) => {
    const Component = textarea ? Textarea : Input;

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Component
                id={id}
                type={type}
                placeholder={placeholder}
                {...register(id)}
            />
            {errors[id] && <p className="text-sm text-red-500">{errors[id].message}</p>}
        </div>
    );
};

const useUserData = (userId) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    return { userData, isLoading, error };
};

const ProfileTab = ({ userId, userData, onUpdate }) => {
    const [logoUrl, setLogoUrl] = useState(userData?.logo_url || "");
    const [logoFile, setLogoFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [prevLogoPath, setPrevLogoPath] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: userData?.name || "",
            business_name: userData?.business_name || "",
            email: userData?.email || "",
            phone: userData?.phone || "",
            address: userData?.address || "",
        },
    });

    useEffect(() => {
        if (userData) {
            reset({
                name: userData.name || "",
                business_name: userData.business_name || "",
                email: userData.email || "",
                phone: userData.phone || "",
                address: userData.address || "",
            });

            if (userData.logo_url) {
                setLogoUrl(userData.logo_url);

                if (userData.logo_path) {
                    setPrevLogoPath(userData.logo_path);
                }
            }
        }
    }, [userData, reset]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        if (!userId) return;

        setIsSaving(true);

        try {
            const userRef = doc(db, "users", userId);
            const updatedData = { ...data };

            if (logoFile) {
                if (prevLogoPath) {
                    try {
                        const oldLogoRef = ref(storage, prevLogoPath);
                        await deleteObject(oldLogoRef);
                    } catch (err) {
                        console.error("Error deleting old logo:", err);
                    }
                }

                const logoPath = `logos/${userId}/${Date.now()}_${logoFile.name}`;
                const logoRef = ref(storage, logoPath);
                await uploadBytes(logoRef, logoFile);
                const logoURL = await getDownloadURL(logoRef);

                updatedData.logo_url = logoURL;
                updatedData.logo_path = logoPath;

                setLogoUrl(logoURL);
                setPrevLogoPath(logoPath);
            } else if (logoUrl === "" && prevLogoPath) {
                try {
                    const oldLogoRef = ref(storage, prevLogoPath);
                    await deleteObject(oldLogoRef);
                } catch (err) {
                    console.error("Error deleting logo:", err);
                }

                updatedData.logo_url = "";
                updatedData.logo_path = "";
                setPrevLogoPath("");
            }

            await updateDoc(userRef, updatedData);

            if (onUpdate) {
                onUpdate({
                    name: data.name,
                    business_name: data.business_name,
                });
            }

            toast.success("Berhasil", {
                description: "Profil bisnis berhasil diperbarui",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error", {
                description: "Terjadi kesalahan saat memperbarui profil",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Profil Bisnis</CardTitle>
                    <CardDescription>Kelola informasi bisnis Anda yang akan ditampilkan pada invoice</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={logoUrl} alt="Logo Bisnis" />
                            <AvatarFallback>{userData?.name?.charAt(0) || "B"}</AvatarFallback>
                        </Avatar>

                        <div className="flex items-center gap-2">
                            <Label htmlFor="logo" className="cursor-pointer">
                                <div className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                                    <Upload className="h-4 w-4" />
                                    <span>Upload Logo</span>
                                </div>
                                <Input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                            </Label>

                            {logoUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setLogoUrl("");
                                        setLogoFile(null);
                                    }}
                                >
                                    Hapus
                                </Button>
                            )}
                        </div>
                    </div>

                    <FormField id="name" label="Nama Pemilik" register={register} errors={errors} />
                    <FormField id="business_name" label="Nama Bisnis" register={register} errors={errors} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField id="email" label="Email Bisnis" type="email" register={register} errors={errors} />
                        <FormField id="phone" label="Nomor Telepon" register={register} errors={errors} />
                    </div>

                    <FormField id="address" label="Alamat" textarea={true} register={register} errors={errors} />
                </CardContent>

                <CardFooter>
                    <SubmitButton isLoading={isSaving} loadingText={"Menyimpan..."} text={"Simpan Perubahan"} />
                </CardFooter>
            </Card>
        </form>
    );
};

const AccountTab = ({ userId, userData }) => {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const handlePasswordChange = async (data) => {
        const { currentPassword, newPassword } = data;
        const user = auth.currentUser;
        console.log("Current Password:", currentPassword);
        console.log("New Password:", newPassword);

        if (!user) {
            toast.error("Error", {
                description: "Tidak ada pengguna yang login",
            });
            return;
        }

        setIsChangingPassword(true);

        try {
            // Re-authenticate pengguna
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            toast.success("Berhasil", {
                description: "Password berhasil diperbarui",
            });

            reset(); // Reset form setelah berhasil
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Error", {
                description: error.message || "Terjadi kesalahan saat memperbarui password",
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!userId || !confirm("Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.")) return;

        setIsDeletingAccount(true);

        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { deleted: true, deletedAt: new Date() });


            toast.success("Berhasil", {
                description: "Akun berhasil dihapus",
            });

            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Error", {
                description: "Terjadi kesalahan saat menghapus akun",
            });
        } finally {
            setIsDeletingAccount(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Akun</CardTitle>
                    <CardDescription>Kelola pengaturan akun dan keamanan</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-email">Email Saat Ini</Label>
                        <Input id="current-email" type="email" value={userData?.email || ""} disabled />
                    </div>

                    <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
                        <FormField
                            id="currentPassword"
                            label="Password Saat Ini"
                            type="password"
                            placeholder="••••••••"
                            register={register}
                            errors={errors}
                        />

                        <FormField
                            id="newPassword"
                            label="Password Baru"
                            type="password"
                            placeholder="••••••••"
                            register={register}
                            errors={errors}
                        />

                        <FormField
                            id="confirmPassword"
                            label="Konfirmasi Password"
                            type="password"
                            placeholder="••••••••"
                            register={register}
                            errors={errors}
                        />

                        <SubmitButton
                            isLoading={isChangingPassword}
                            loadingText="Memperbarui..."
                            text="Perbarui Password"
                        />
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Hapus Akun</CardTitle>
                    <CardDescription>Hapus akun dan semua data Anda secara permanen</CardDescription>
                </CardHeader>

                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Setelah Anda menghapus akun, semua data Anda akan dihapus secara permanen. Tindakan ini tidak dapat
                        dibatalkan.
                    </p>
                </CardContent>

                <CardFooter>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                    >
                        {isDeletingAccount ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            "Hapus Akun"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const userId = session?.user?.id;

    const { userData, isLoading, error } = useUserData(userId);

    const handleProfileUpdate = async (profileData) => {
        await update({
            ...session,
            user: {
                ...session.user,
                name: profileData.name,
                business_name: profileData.business_name,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8 h-full">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        );
    }

    if (error) {
        toast.error("Error", {
            description: "Terjadi kesalahan saat mengambil data profil",
        });
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profil Bisnis</TabsTrigger>
                    <TabsTrigger value="account">Akun</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <ProfileTab
                        userId={userId}
                        userData={userData}
                        onUpdate={handleProfileUpdate}
                    />
                </TabsContent>

                <TabsContent value="account" className="space-y-4">
                    <AccountTab
                        userId={userId}
                        userData={userData}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}