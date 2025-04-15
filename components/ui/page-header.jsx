import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function PageHeader({ title, buttonText, buttonPath }) {
    const router = useRouter()

    return (
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <Button onClick={() => router.push(buttonPath)}>
                <Plus className="mr-2 h-4 w-4" />
                {buttonText}
            </Button>
        </div>
    )
}