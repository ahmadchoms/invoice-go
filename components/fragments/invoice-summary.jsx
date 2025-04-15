import { Separator } from "@/components/ui/separator"

export function InvoiceSummary({ subtotal, taxPercentage, taxAmount, total }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="ml-auto w-full md:w-1/2 lg:w-1/3 space-y-2">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Pajak ({taxPercentage}%):</span>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold">{formatCurrency(total)}</span>
            </div>
        </div>
    )
}