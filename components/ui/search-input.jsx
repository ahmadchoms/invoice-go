import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

export function SearchInput({ value, onChange, placeholder, className }) {
    return (
        <div className={cn("relative flex-1", className)}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                className="pl-8"
                value={value}
                onChange={onChange}
            />
        </div>
    )
}