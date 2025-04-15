import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function EmptyState({ title, description, buttonText }) {
    const router = useRouter()

    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
                <Button className="mt-4" onClick={() => router.push("/clients/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    )
}