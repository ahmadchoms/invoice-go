"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { BarChart3, FileText, Home, LogOut, Settings, Users, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Invoice",
        href: "/invoices",
        icon: FileText,
    },
    {
        title: "Klien",
        href: "/clients",
        icon: Users,
    },
    {
        title: "Laporan",
        href: "/reports",
        icon: BarChart3,
    },
    {
        title: "Pengaturan",
        href: "/settings",
        icon: Settings,
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const isActive = (path) => {
        return pathname === path || pathname.startsWith(`${path}/`)
    }

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <FileText className="h-6 w-6 text-primary" />
                    <span>InvoiceGO</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive(item.href)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            onClick={() => setOpen(false)}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                <Button variant="outline" className="w-full justify-start" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                </Button>
            </div>
        </div>
    )

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <div className="min-h-full border-r p-1 md:hidden">
                        <Button variant="ghost">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader className="hidden">
                        <SheetTitle>Aokwowkok</SheetTitle>
                    </SheetHeader>
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            <div className="hidden border-r bg-background md:block">
                <div className="h-screen w-64 flex flex-col">
                    <SidebarContent />
                </div>
            </div>
        </>
    )
}