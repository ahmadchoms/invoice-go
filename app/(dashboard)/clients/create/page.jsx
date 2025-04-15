"use client"

import { ClientForm } from "@/components/fragments/client-form"
import { PageHeader } from "@/components/fragments/page-header"

export default function CreateClientPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader title="Tambah Klien" backButton={true} />
            <ClientForm />
        </div>
    )
}