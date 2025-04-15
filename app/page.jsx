import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, FileText, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/fragments/header";
import { FeatureCard } from "@/components/fragments/feature-card";
import { PricingCard } from "@/components/fragments/pricing-card";
import Footer from "@/components/fragments/footer";

export default function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: "Pembuatan Invoice",
      description: "Buat invoice profesional dengan mudah dan cepat",
      features: [
        "Template profesional",
        "Buat invoice dalam 1 menit",
        "Logo & branding kustom",
      ],
    },
    {
      icon: Users,
      title: "Manajemen Klien",
      description: "Kelola data klien dan histori transaksi dengan rapi",
      features: [
        "Database klien terintegrasi",
        "Pengingat pembayaran otomatis",
        "Histori transaksi lengkap",
      ],
    },
    {
      icon: BarChart3,
      title: "Laporan & Analitik",
      description:
        "Dapatkan insight bisnis melalui laporan keuangan yang detail",
      features: [
        "Dashboard pendapatan real-time",
        "Laporan keuangan bulanan",
        "Ekspor data untuk perpajakan",
      ],
    },
  ];

  const pricingPlans = [
    {
      title: "Starter",
      price: "Rp 0",
      description: "Untuk UMKM yang baru memulai",
      features: [
        "5 invoice per bulan",
        "Manajemen 10 klien",
        "Template invoice dasar",
      ],
      buttonText: "Mulai Gratis",
    },
    {
      className: "border-primary",
      title: "Business",
      price: "Rp 99.000",
      description: "Untuk bisnis yang berkembang",
      features: [
        "Unlimited invoice",
        "Manajemen unlimited klien",
        "5 template premium",
        "Laporan keuangan lengkap",
        "Reminder pembayaran",
      ],
      buttonText: "Pilih Paket",
      badge: "Populer",
    },
    {
      title: "Enterprise",
      price: "Rp 249.000",
      description: "Untuk bisnis menengah dan besar",
      features: [
        "Semua fitur Business",
        "10 pengguna (multi-user)",
        "API akses",
        "Template kustom",
        "Dukungan prioritas",
      ],
      buttonText: "Hubungi Sales",
      variant: "outline",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-36 bg-gradient-to-b from-background to-muted/50">
          <div className="px-10 md:px-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <Badge className="w-fit" variant="secondary">
                  Untuk UMKM Indonesia
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Kelola Invoice UMKM Anda dengan Mudah
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    InvoiceGO membantu UMKM membuat, mengelola, dan mengirimkan
                    invoice secara efisien. Tingkatkan profesionalisme bisnis
                    Anda sekarang.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className="inline-flex items-center gap-2"
                    >
                      Mulai Buat Invoice
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Avatar key={i}>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Bergabung dengan 1,000+ pengguna UMKM
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground/20 rounded-xl blur-lg opacity-50"></div>
                  <img
                    src="/atm.jpg"
                    alt="Invoice Dashboard Preview"
                    className="relative rounded-xl shadow-lg bg-background object-cover"
                    width={550}
                    height={550}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-10 md:px-20">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="outline">Fitur</Badge>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Fitur Utama InvoiceGO
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Solusi lengkap untuk pengelolaan invoice dan keuangan UMKM
                  Anda
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-10 md:px-20">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge>Harga</Badge>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Paket Harga yang Terjangkau
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Pilih paket yang sesuai dengan kebutuhan bisnis Anda
                </p>
              </div>
              <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                {pricingPlans.map((plan, index) => (
                  <PricingCard key={index} {...plan} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
