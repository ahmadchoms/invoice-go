"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Mail, MapPin, Phone, Building, FileText, CreditCard, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils/formatters"
import useInvoices from "@/hooks/useInvoices"
import useClients from "@/hooks/useClients"

export default function ClientDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const { invoices } = useInvoices()
    const { clients, isLoading } = useClients()
    const [client, setClient] = useState(null)

    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const foundClient = clients.find(client => client.slug_name === params.id)

                if (foundClient) {
                    const clientInvoices = invoices.filter(
                        invoice => invoice.client_id === foundClient.id
                    )

                    let totalSpent = 0
                    let lastInvoiceDate = null

                    clientInvoices.forEach(invoice => {
                        totalSpent += invoice.total || 0
                        if (!lastInvoiceDate || new Date(invoice.created_at) > new Date(lastInvoiceDate)) {
                            lastInvoiceDate = invoice.created_at
                        }
                    })

                    clientInvoices.sort((a, b) =>
                        new Date(b.created_at) - new Date(a.created_at)
                    )

                    setClient({
                        id: foundClient.id,
                        name: foundClient.name,
                        email: foundClient.email,
                        address: foundClient.address || "",
                        phone: foundClient.phone || "",
                        company: foundClient.company || "",
                        slug_name: foundClient.slug_name,
                        totalSpent,
                        invoiceCount: clientInvoices.length,
                        lastInvoice: lastInvoiceDate,
                    })
                }
            } catch (error) {
                console.error("Error fetching client details:", error)
            }
        }

        if (clients.length > 0 && invoices.length > 0) {
            fetchClientDetails()
        }
    }, [session, params.id, clients, invoices])

    if (isLoading) {
        return (
            <div className="flex-1 p-4 md:p-8 pt-6 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p className="mt-4 text-muted-foreground">Memuat data klien...</p>
                </div>
            </div>
        )
    }

    if (!client) {
        return (
            <div className="flex-1 p-4 md:p-8 pt-6">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <p className="text-lg font-medium">Klien tidak ditemukan</p>
                        <p className="text-sm text-muted-foreground">Data klien yang Anda cari tidak tersedia</p>
                        <Button className="mt-4" onClick={() => router.push("/clients")}>
                            Kembali ke Daftar Klien
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>

                <Button onClick={() => router.push(`/clients/${client.slug_name}/update`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Klien
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{client.name}</CardTitle>
                        <CardDescription>{client.company || "Personal"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{client.email}</p>
                                </div>
                            </div>

                            {client.phone && (
                                <div className="flex items-start">
                                    <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Telepon</p>
                                        <p className="text-sm text-muted-foreground">{client.phone}</p>
                                    </div>
                                </div>
                            )}

                            {client.address && (
                                <div className="flex items-start">
                                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Alamat</p>
                                        <p className="text-sm text-muted-foreground">{client.address}</p>
                                    </div>
                                </div>
                            )}

                            {client.company && (
                                <div className="flex items-start">
                                    <Building className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Perusahaan</p>
                                        <p className="text-sm text-muted-foreground">{client.company}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                                <p className="text-2xl font-bold">
                                    {client.invoiceCount > 0
                                        ? formatCurrency(client.totalSpent)
                                        : "Rp 0"}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Jumlah Invoice</p>
                                <p className="text-2xl font-bold">{client.invoiceCount}</p>
                            </div>

                            {invoices.length > 0 ? (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Invoice Terakhir</p>
                                        <p className="text-md font-medium">
                                            {formatDate(invoices[0].created_at)}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Status Terakhir</p>
                                        <div className="flex items-center">
                                            <div className={`h-2 w-2 rounded-full mr-2 ${invoices[0].status === 'paid' ? 'bg-green-500' :
                                                invoices[0].status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></div>
                                            <p className="text-md font-medium capitalize">
                                                {invoices[0].status === 'paid' ? 'Lunas' :
                                                    invoices[0].status === 'pending' ? 'Menunggu' : 'Belum Bayar'}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Invoice Terakhir</p>
                                        <p className="text-md font-medium">Belum ada invoice</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Status Terakhir</p>
                                        <p className="text-md font-medium">-</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="invoices" className="mt-6">
                <TabsList>
                    <TabsTrigger value="invoices">
                        <FileText className="h-4 w-4 mr-2" />
                        Invoice
                    </TabsTrigger>
                    <TabsTrigger value="payments">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pembayaran
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="invoices" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Invoice</CardTitle>
                            <CardDescription>
                                Daftar invoice yang telah dibuat untuk klien ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {invoices.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-muted-foreground">Belum ada invoice untuk klien ini</p>
                                    <Button
                                        className="mt-4"
                                        onClick={() => router.push(`/invoices/create?client=${client.slug_name}`)}
                                    >
                                        Buat Invoice Baru
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No. Invoice</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">
                                                    {invoice.id}
                                                </TableCell>
                                                <TableCell>{formatDate(invoice.created_at)}</TableCell>
                                                <TableCell>{formatCurrency(invoice.total)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <div className={`h-2 w-2 rounded-full mr-2 ${invoice.status === 'paid' ? 'bg-green-500' :
                                                            invoice.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}></div>
                                                        <span className="capitalize">
                                                            {invoice.status === 'paid' ? 'Lunas' :
                                                                invoice.status === 'pending' ? 'Menunggu' : 'Belum Bayar'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                                                    >
                                                        Lihat
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Pembayaran</CardTitle>
                            <CardDescription>
                                Daftar pembayaran yang telah dilakukan oleh klien ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6">
                                <p className="text-muted-foreground">Data pembayaran belum tersedia</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}