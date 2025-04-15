import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function PageHeader({ title, description, backButton = false }) {
    const router = useRouter()

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center">
                {backButton && (
                    <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </Button>
                )}
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            </div>
            {description && (
                <p className="text-muted-foreground">{description}</p>
            )}
        </div>
    )
}