import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "InvoiceGO - Invoice Management for UMKM",
  description:
    "Platform berbasis web untuk membantu UMKM dalam membuat, mengelola, dan mengirimkan invoice secara efisien",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main>{children}</main>
          </div>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
