"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ClientForm } from "@/components/fragments/client-form"
import { PageHeader } from "@/components/fragments/page-header"
import { EmptyState } from "@/components/fragments/empty-state"
import useClients from "@/hooks/useClients"

export default function EditClientPage() {
    const params = useParams()
    const [client, setClient] = useState(null)
    const { clients, isLoading } = useClients()

    useEffect(() => {
        if (clients.length > 0) {
            const foundClient = clients.find(client => client.slug_name === params.id)

            if (foundClient) {
                setClient({
                    id: foundClient.id,
                    name: foundClient.name,
                    email: foundClient.email,
                    address: foundClient.address || "",
                    phone: foundClient.phone || "",
                    company: foundClient.company || "",
                })
            } else {
                setClient(null)
            }
        }
    }, [clients, params.id])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin mx-auto" />
                <p className="mt-4 text-muted-foreground">Memuat data klien...</p>
            </div>
        )
    }

    if (!client) {
        return (
            <div className="flex-1 p-4 md:p-8 pt-6">
                <EmptyState
                    title="Tidak ada klien"
                    description="Data klien yang Anda cari tidak tersedia"
                    buttonText="Kembali ke Daftar Klien"
                />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader title="Edit Klien" backButton={true} />

            <div className="mt-6">
                <ClientForm client={client} isEditing={true} />
            </div>
        </div>
    )
}