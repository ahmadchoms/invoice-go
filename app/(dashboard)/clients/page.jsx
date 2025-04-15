"use client"

import { PageHeader } from "@/components/ui/page-header"
import { ClientStats } from "@/components/fragments/client-stats"
import { SearchInput } from "@/components/ui/search-input"
import { EmptyState } from "@/components/fragments/empty-state"
import { ClientTable } from "@/components/fragments/client-table"
import { Loader2 } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/formatters"
import { useTotalClients } from "@/hooks/useTotalClient"
import useFilteredClients from "@/hooks/useFilteredClient"
import useClientStats from "@/hooks/useClientStats"

export default function ClientsPage() {
    const { totalClients: clients, isLoading: isClientsLoading } = useTotalClients()
    const { searchTerm, setSearchTerm, filteredClients } = useFilteredClients(clients)
    const stats = useClientStats(clients)

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader
                title="Klien"
                buttonText="Tambah Klien"
                buttonPath="/clients/create"
            />

            {!isClientsLoading && clients.length > 0 && (
                <ClientStats
                    totalClients={stats.totalClients}
                    totalSpent={stats.totalSpent}
                    avgSpent={stats.avgSpent}
                    mostActiveClient={stats.mostActiveClient}
                />
            )}

            <div className="flex items-center space-x-2">
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari klien..."
                />
            </div>

            {isClientsLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-10 w-10 animate-spin" />
                </div>
            ) : filteredClients.length === 0 ? (
                <EmptyState
                    title="Tidak ada klien"
                    description="Buat invoice baru atau tambahkan klien langsung"
                    buttonText="Tambah Klien"
                    buttonPath="/clients/create"
                />
            ) : (
                <ClientTable
                    clients={filteredClients}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                />
            )}
        </div>
    )
}