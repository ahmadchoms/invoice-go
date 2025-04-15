"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText } from "lucide-react"
import SubmitButton from "@/components/ui/submit-button"

const loginSchema = z.object({
    email: z.string().email({ message: "Email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
})

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            })

            if (result?.error) {
                setError("Email atau password salah")
                setIsLoading(false)
                return
            }

            router.push("/dashboard")
        } catch (error) {
            setError("Terjadi kesalahan. Silakan coba lagi.")
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-6">
                        <FileText className="h-10 w-10 text-primary" />
                        <span className="text-2xl font-bold ml-2">InvoiceGO</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                    <CardDescription className="text-center">Masukkan email dan password Anda untuk login</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="nama@perusahaan.com" {...register("email")} />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                                    Lupa password?
                                </Link>
                            </div>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                        <SubmitButton className="w-full" isLoading={isLoading} loadingText="Memproses..." text="Login" />
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Belum punya akun?{" "}
                        <Link href="/auth/signup" className="text-primary hover:underline">
                            Daftar
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

