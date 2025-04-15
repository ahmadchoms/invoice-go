import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function ClientTable({ clients, formatCurrency, formatDate }) {
    const router = useRouter()
    console.log(clients)

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Jumlah Invoice</TableHead>
                        <TableHead>Total Transaksi</TableHead>
                        <TableHead>Transaksi Terakhir</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <motion.tr
                            key={client.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.invoiceCount}</TableCell>
                            <TableCell>{formatCurrency(client.totalSpent)}</TableCell>
                            <TableCell>{client.lastInvoice ? formatDate(client.lastInvoice) : "Belum ada transaksi"}</TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/clients/${client.slug_name}`)}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Detail
                                </Button>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}