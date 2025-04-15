"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounceHook } from "@/hooks/useDebounce"
import { SearchInput } from "@/components/ui/search-input"
import useInvoices from "@/hooks/useInvoices"
import { formatCurrency, formatDate } from "@/lib/utils/formatters"

const STATUS_CONFIG = {
    paid: {
        badge: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle,
        label: "Lunas"
    },
    pending: {
        badge: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
        label: "Menunggu",
        variant: "outline"
    },
    overdue: {
        badge: "",
        icon: AlertCircle,
        label: "Terlambat",
        variant: "destructive"
    }
}

export default function InvoicesPage() {
    const { invoices, isLoading } = useInvoices()
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    const debouncedSearchTerm = useDebounceHook(searchTerm, 300)

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const matchesSearch = !debouncedSearchTerm ||
                invoice.client_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                invoice.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase())

            const matchesStatus = activeTab === "all" ||
                invoice.status.toLowerCase() === activeTab

            return matchesSearch && matchesStatus
        })
    }, [debouncedSearchTerm, activeTab, invoices])

    const getStatusBadge = (status) => {
        const config = STATUS_CONFIG[status] || { label: status }
        const Icon = config.icon

        return (
            <Badge
                variant={config.variant}
                className={config.badge}
            >
                {Icon && <Icon className="mr-1 h-3 w-3" />}
                {config.label}
            </Badge>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Invoice</h2>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <SearchInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari invoice atau klien..."
                        className={"min-w-[240px]"}
                    />
                    <Link href="/invoices/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Invoice
                        </Button>
                    </Link>
                </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="all" className="flex-1 sm:flex-auto">Semua</TabsTrigger>
                    <TabsTrigger value="paid" className="flex-1 sm:flex-auto">Lunas</TabsTrigger>
                    <TabsTrigger value="pending" className="flex-1 sm:flex-auto">Menunggu</TabsTrigger>
                    <TabsTrigger value="overdue" className="flex-1 sm:flex-auto">Terlambat</TabsTrigger>
                </TabsList>

                <InvoiceTableContent
                    invoices={filteredInvoices}
                    isLoading={isLoading}
                    getStatusBadge={getStatusBadge}
                />
            </Tabs>
        </div>
    )
}

function InvoiceTableContent({ invoices, isLoading, getStatusBadge }) {
    if (isLoading) {
        return (
            <div className="mt-4">
                <TableSkeleton />
            </div>
        )
    }

    if (invoices.length === 0) {
        return (
            <Card className="mt-4">
                <CardContent className="flex flex-col items-center justify-center p-6 py-10">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Tidak ada invoice</p>
                    <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
                        Buat invoice baru untuk mulai mengelola keuangan bisnis Anda
                    </p>
                    <Link href="/invoices/create" className="mt-6">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Invoice
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="rounded-md border mt-4 overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className={"bg-accent"}>
                            <TableHead>No. Invoice</TableHead>
                            <TableHead>Klien</TableHead>
                            <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                            <TableHead className="hidden md:table-cell">Jatuh Tempo</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {invoices.map((invoice) => (
                                <motion.tr
                                    key={invoice.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.client_name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{formatDate(invoice.created_at)}</TableCell>
                                    <TableCell className="hidden md:table-cell">{formatDate(invoice.due_date)}</TableCell>
                                    <TableCell>{formatCurrency(invoice.total)}</TableCell>
                                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                    <TableCell className="flex justify-center">
                                        <Link href={`/invoices/${invoice.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                                Detail
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function TableSkeleton() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No. Invoice</TableHead>
                        <TableHead>Klien</TableHead>
                        <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                        <TableHead className="hidden md:table-cell">Jatuh Tempo</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end">
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
