import { FileText } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Footer() {
    return (
        <footer className="w-full border-t bg-muted/40">
            <div className=" px-10 py-12 md:px-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">InvoiceGO</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Platform pengelolaan invoice untuk UMKM Indonesia.
                        </p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Avatar key={i}>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4">Produk</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Fitur
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Harga
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Integrasi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4">Perusahaan</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Karir
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4">Dukungan</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Bantuan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Status
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-8 mt-8">
                    <p className="text-xs text-muted-foreground">
                        © 2025 InvoiceGO. All rights reserved.
                    </p>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms
                        </Link>
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
