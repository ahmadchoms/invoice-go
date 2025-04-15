"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { setDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase/init"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { PageHeader } from "@/components/fragments/page-header"
import { InvoiceSummary } from "@/components/fragments/invoice-summary"
import { InvoiceItemTable } from "@/components/fragments/invoice-item-table"
import { DatePickerWithPresets } from "@/components/fragments/date-picker"
import { ClientCombobox } from "@/components/ui/combobox"
import SubmitButton from "@/components/ui/submit-button"
import useInvoices from "@/hooks/useInvoices"

const invoiceSchema = z.object({
    client_name: z.string().min(2, { message: "Nama klien minimal 2 karakter" }),
    client_email: z.string().email({ message: "Email tidak valid" }),
    client_address: z.string().optional(),
    client_id: z.string().optional(),
    invoice_date: z.date(),
    due_date: z.date(),
    items: z
        .array(
            z.object({
                description: z.string().min(1, { message: "Deskripsi tidak boleh kosong" }),
                quantity: z.number().min(1, { message: "Jumlah minimal 1" }),
                price: z.number().min(0, { message: "Harga tidak boleh negatif" }),
            }),
        )
        .min(1, { message: "Minimal 1 item" }),
    notes: z.string().optional(),
    tax_percentage: z.number().min(0).max(100).optional(),
})

export default function CreateInvoicePage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedClientName, setSelectedClientName] = useState("")
    const { invoices } = useInvoices()

    const form = useForm({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            client_name: "",
            client_email: "",
            client_address: "",
            client_id: "",
            invoice_date: new Date(),
            due_date: new Date(new Date().setDate(new Date().getDate() + 14)),
            items: [{ description: "", quantity: 1, price: 0 }],
            notes: "",
            tax_percentage: 0,
        },
    })

    const { control, watch, formState, setValue } = form
    const items = watch("items")
    const taxPercentage = watch("tax_percentage") || 0

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    })

    const subtotal = items?.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0) || 0
    const taxAmount = subtotal * (taxPercentage / 100)
    const total = subtotal + taxAmount

    const handleClientSelect = (clientData) => {
        setValue("client_name", clientData.client_name);
        setValue("client_email", clientData.client_email);
        setValue("client_address", clientData.client_address);
        setValue("client_id", clientData.client_id);
        setSelectedClientName(clientData.client_name);
    };

    const generateInvoiceId = async () => {
        const today = new Date()
        const datePart = today.toISOString().slice(0, 10).replace(/-/g, "")
        const todaysInvoices = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.invoice_date)
            return invoiceDate.toDateString() === today.toDateString()
        })
        const invoiceNumber = (todaysInvoices.length + 1).toString().padStart(3, "0")
        return `INV-${datePart}-${invoiceNumber}`
    }

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const invoiceId = await generateInvoiceId()
            const invoiceData = {
                ...data,
                user_id: session.user.id,
                subtotal,
                tax: taxAmount,
                total,
                status: "pending",
                created_at: new Date().toISOString(),
                invoice_date: data.invoice_date.toISOString(),
                due_date: data.due_date.toISOString(),
            }
            await setDoc(doc(db, "invoices", invoiceId), invoiceData)
            toast.success("Berhasil", {
                description: "Invoice berhasil dibuat",
            })
            form.reset()
            router.push(`/invoices/${invoiceId}`)
        } catch (error) {
            console.error("Error creating invoice:", error)
            toast.error("Error", {
                description: "Terjadi kesalahan saat membuat invoice",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <PageHeader
                title="Buat Invoice Baru"
                description="Buat dan kirim invoice kepada klien Anda"
                backButton={true}
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Detail Klien</CardTitle>
                                <CardDescription>Pilih klien yang sudah ada atau tambahkan baru</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormLabel className="mb-2 block">Pilih Klien</FormLabel>
                                <ClientCombobox
                                    value={selectedClientName}
                                    onClientSelect={handleClientSelect}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tanggal Invoice</CardTitle>
                                <CardDescription>Atur tanggal invoice dan jatuh tempo</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="invoice_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Tanggal Invoice</FormLabel>
                                            <DatePickerWithPresets
                                                date={field.value}
                                                setDate={field.onChange}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="due_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Tanggal Jatuh Tempo</FormLabel>
                                            <DatePickerWithPresets
                                                date={field.value}
                                                setDate={field.onChange}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Item Invoice</CardTitle>
                            <CardDescription>Tambahkan produk atau jasa yang akan ditagihkan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InvoiceItemTable
                                fields={fields}
                                form={form}
                                remove={remove}
                            />

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => append({ description: "", quantity: 1, price: 0 })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Item
                            </Button>

                            {formState.errors.items && (
                                <p className="text-sm text-destructive">{formState.errors.items.message}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <FormField
                                    control={form.control}
                                    name="tax_percentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pajak (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    min="0"
                                                    max="100"
                                                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Catatan (Opsional)</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Tambahkan catatan untuk klien" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <InvoiceSummary
                                subtotal={subtotal}
                                taxPercentage={taxPercentage}
                                taxAmount={taxAmount}
                                total={total}
                            />
                        </CardFooter>
                    </Card>

                    <div className="flex justify-end">
                        <SubmitButton isLoading={isSubmitting} loadingText="Menyimpan..." text="Simpan Invoice" />
                    </div>
                </form>
            </Form>
        </div>
    )
}