import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

export function InvoiceItemTable({ fields, form, remove }) {
    const items = form.watch("items")

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="rounded-md border overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/50">
                    <tr>
                        <th className="h-12 px-4 text-left align-middle font-medium">Deskripsi</th>
                        <th className="h-12 px-4 text-left align-middle font-medium w-24">Jumlah</th>
                        <th className="h-12 px-4 text-left align-middle font-medium w-32">Harga</th>
                        <th className="h-12 px-4 text-left align-middle font-medium w-32">Total</th>
                        <th className="h-12 px-4 text-left align-middle font-medium w-16"></th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    <AnimatePresence>
                        {fields.map((field, index) => (
                            <motion.tr
                                key={field.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-b transition-colors hover:bg-muted/50"
                            >
                                <td className="p-3 align-middle">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} placeholder="Deskripsi item" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </td>
                                <td className="p-3 align-middle">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        {...field}
                                                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </td>
                                <td className="p-3 align-middle">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        {...field}
                                                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </td>
                                <td className="p-3 align-middle">
                                    {formatCurrency((items[index]?.quantity || 0) * (items[index]?.price || 0))}
                                </td>
                                <td className="p-3 align-middle">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                        className="h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    )
}