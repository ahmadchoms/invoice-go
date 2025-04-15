'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function PricingSection() {
    const plans = [
        {
            name: "Gratis",
            price: "Rp 0",
            description: "Untuk UMKM yang baru memulai",
            features: [
                "5 invoice per bulan",
                "1 template invoice",
                "Ekspor ke PDF",
                "Manajemen pelanggan dasar"
            ],
            highlight: false,
            cta: "Mulai Sekarang"
        },
        {
            name: "Pro",
            price: "Rp 99.000",
            period: "/bulan",
            description: "Untuk bisnis yang berkembang",
            features: [
                "Invoice tidak terbatas",
                "5 template invoice",
                "Ekspor ke PDF & Excel",
                "Analitik dasar",
                "Manajemen pelanggan lengkap",
                "Pengingat jatuh tempo"
            ],
            highlight: true,
            cta: "Berlangganan Sekarang"
        },
        {
            name: "Bisnis",
            price: "Rp 299.000",
            period: "/bulan",
            description: "Untuk bisnis yang lebih besar",
            features: [
                "Semua fitur Pro",
                "Template invoice kustom",
                "Analitik lengkap",
                "Integrasi dengan software akuntansi",
                "Dukungan prioritas",
                "Pembayaran online"
            ],
            highlight: false,
            cta: "Hubungi Kami"
        }
    ]

    return (
        <section id="pricing" className="py-20">
            <div className="container px-4 md:px-6">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight">Pilih Paket yang Sesuai</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Kami menyediakan paket yang fleksibel untuk berbagai skala bisnis
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`bg-background p-6 rounded-lg shadow-sm border ${plan.highlight ? 'border-primary ring-1 ring-primary' : ''}`}
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                <div className="flex justify-center items-baseline">
                                    <span className="text-3xl font-bold">{plan.price}</span>
                                    {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                            </div>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <Check className="h-4 w-4 text-primary mr-2" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/api/auth/signin">
                                <Button
                                    className="w-full"
                                    variant={plan.highlight ? "default" : "outline"}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}