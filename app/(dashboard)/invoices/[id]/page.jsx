"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/init"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    AlertCircle,
    MoreHorizontal,
    Pencil,
    Trash2,
    Send,
    Download,
    FileText,
    Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/fragments/page-header"

export default function InvoiceDetailPage({ params }) {
    const router = useRouter()
    const { data: session } = useSession()
    const [invoice, setInvoice] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const unwrappedParams = use(params);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!session?.user?.id) return;

            try {
                const docRef = doc(db, "invoices", unwrappedParams.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const invoiceData = {
                        id: docSnap.id,
                        ...docSnap.data(),
                    };

                    if (invoiceData.user_id !== session.user.id) {
                        toast.error("Error", {
                            description: "Anda tidak memiliki akses ke invoice ini",
                        });
                        router.push("/invoices");
                        return;
                    }

                    setInvoice(invoiceData);
                } else {
                    toast.error("Error", {
                        description: "Invoice tidak ditemukan",
                    });
                    router.push("/invoices");
                }
            } catch (error) {
                console.error("Error fetching invoice:", error);
                toast.error("Error", {
                    description: "Terjadi kesalahan saat mengambil data invoice",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoice();
    }, [session, unwrappedParams.id, router]);

    const handleUpdateStatus = async (newStatus) => {
        if (!invoice) return

        setIsUpdating(true)

        try {
            const docRef = doc(db, "invoices", invoice.id)
            await updateDoc(docRef, {
                status: newStatus,
            })

            setInvoice({
                ...invoice,
                status: newStatus,
            })

            toast.success("Berhasil", {
                description: `Status invoice berhasil diubah menjadi ${newStatus}`,
            })
        } catch (error) {
            console.error("Error updating invoice status:", error)
            toast.error("Error", {
                description: "Terjadi kesalahan saat mengubah status invoice",
            })
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteInvoice = async () => {
        if (!invoice) return

        setIsDeleting(true)

        try {
            const docRef = doc(db, "invoices", invoice.id)
            await deleteDoc(docRef)

            toast.success("Berhasil", {
                description: "Invoice berhasil dihapus",
            })

            router.push("/invoices")
        } catch (error) {
            console.error("Error deleting invoice:", error)
            toast.error("Error", {
                description: "Terjadi kesalahan saat menghapus invoice",
            })
            setIsDeleting(false)
        }
    }

    const handleSendInvoice = async () => {
        toast.info("Mengirim Invoice", {
            description: "Fitur ini akan segera tersedia",
        })
    }

    const handleDownloadInvoice = async () => {
        toast.info("Mengunduh Invoice", {
            description: "Fitur ini akan segera tersedia",
        })
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "paid":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Lunas
                    </Badge>
                )
            case "pending":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="mr-1 h-3 w-3" />
                        Menunggu
                    </Badge>
                )
            case "overdue":
                return (
                    <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Terlambat
                    </Badge>
                )
            default:
                return <Badge>{status}</Badge>
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        )
    }

    if (!invoice) {
        return (
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Invoice tidak ditemukan</p>
                        <Button onClick={() => router.push("/invoices")} className="mt-4">
                            Kembali ke Daftar Invoice
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <PageHeader title="Detail Invoice" backButton={true} />
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleDownloadInvoice}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button onClick={handleSendInvoice}>
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Invoice
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/invoices/edit/${invoice.id}`)} className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-green-600 cursor-pointer"
                                onClick={() => handleUpdateStatus("paid")}
                                disabled={invoice.status === "paid" || isUpdating}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Tandai Lunas
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-yellow-600 cursor-pointer"
                                onClick={() => handleUpdateStatus("pending")}
                                disabled={invoice.status === "pending" || isUpdating}
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                Tandai Menunggu
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleUpdateStatus("overdue")}
                                disabled={invoice.status === "overdue" || isUpdating}
                            >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Tandai Terlambat
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-red-600 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus Invoice
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Hapus Invoice</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Apakah Anda yakin ingin menghapus invoice ini? Tindakan ini tidak dapat dibatalkan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteInvoice}
                                            className="bg-red-600 hover:bg-red-700"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? "Menghapus..." : "Hapus"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Invoice #{invoice.id}</CardTitle>
                            <CardDescription>Dibuat pada {formatDate(invoice.created_at)}</CardDescription>
                        </div>
                        <div>{getStatusBadge(invoice.status)}</div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Dari</h3>
                                <p className="font-medium">{session?.user?.name || "Nama Bisnis"}</p>
                                <p>{session?.user?.email}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Untuk</h3>
                                <p className="font-medium">{invoice.client_name}</p>
                                <p>{invoice.client_email}</p>
                                {invoice.client_address && <p>{invoice.client_address}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tanggal Invoice</h3>
                                <p>{formatDate(invoice.invoice_date)}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tanggal Jatuh Tempo</h3>
                                <p>{formatDate(invoice.due_date)}</p>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium">Deskripsi</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium">Jumlah</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium">Harga</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {invoice.items.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                        >
                                            <td className="p-4 align-middle">{item.description}</td>
                                            <td className="p-4 align-middle text-right">{item.quantity}</td>
                                            <td className="p-4 align-middle text-right">{formatCurrency(item.price)}</td>
                                            <td className="p-4 align-middle text-right">{formatCurrency(item.quantity * item.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                            <div className="flex justify-between w-full md:w-1/3">
                                <span className="font-medium">Subtotal:</span>
                                <span>{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between w-full md:w-1/3">
                                <span className="font-medium">Pajak:</span>
                                <span>{formatCurrency(invoice.tax)}</span>
                            </div>
                            <Separator className="my-2 w-full md:w-1/3" />
                            <div className="flex justify-between w-full md:w-1/3">
                                <span className="text-lg font-bold">Total:</span>
                                <span className="text-lg font-bold">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>

                        {invoice.notes && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Catatan</h3>
                                <p className="text-muted-foreground">{invoice.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

