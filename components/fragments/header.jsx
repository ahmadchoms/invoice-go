import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold tracking-tight">InvoiceGO</span>
                <Badge variant="outline" className="ml-2 hidden sm:inline-flex">
                    UMKM
                </Badge>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <nav className="flex gap-6">
                    <NavLink href="#features">Fitur</NavLink>
                    <NavLink href="#why">Keunggulan</NavLink>
                    <NavLink href="#pricing">Harga</NavLink>
                </nav>
                <div className="flex gap-2">
                    <Link href="/auth/signin">
                        <Button variant="ghost" size="sm">
                            Login
                        </Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button size="sm">Register</Button>
                    </Link>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <nav className="flex flex-col gap-4 mt-8">
                        <NavLink href="#features">Fitur</NavLink>
                        <NavLink href="#why">Keunggulan</NavLink>
                        <NavLink href="#pricing">Harga</NavLink>
                        <div className="flex flex-col gap-2 mt-4">
                            <Link href="/auth/signin">
                                <Button variant="outline" className="w-full">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button className="w-full">Register</Button>
                            </Link>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    );
}

function NavLink({ href, children }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium hover:text-primary transition-colors"
        >
            {children}
        </Link>
    );
}