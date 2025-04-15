'use client'

import { motion } from 'framer-motion'
import {
    FileText,
    Clock,
    BarChart,
    CloudUpload,
    UserCheck,
    Globe
} from 'lucide-react'

export default function FeatureSection() {
    const features = [
        {
            icon: <FileText className="h-10 w-10 text-blue-600" />,
            title: "Template Profesional",
            description: "Berbagai template invoice profesional siap pakai untuk berbagai kebutuhan bisnis"
        },
        {
            icon: <Clock className="h-10 w-10 text-blue-600" />,
            title: "Hemat Waktu",
            description: "Pembuatan invoice cepat dan otomatis, hemat waktu operasional bisnis Anda"
        },
        {
            icon: <BarChart className="h-10 w-10 text-blue-600" />,
            title: "Analitik Keuangan",
            description: "Dapatkan insight dari data invoice untuk pengambilan keputusan bisnis"
        },
        {
            icon: <CloudUpload className="h-10 w-10 text-blue-600" />,
            title: "Ekspor & Impor",
            description: "Ekspor invoice ke PDF atau Excel dan impor data dengan mudah"
        },
        {
            icon: <UserCheck className="h-10 w-10 text-blue-600" />,
            title: "Manajemen Pelanggan",
            description: "Kelola data pelanggan untuk mempercepat pembuatan invoice berulang"
        },
        {
            icon: <Globe className="h-10 w-10 text-blue-600" />,
            title: "Akses Dimana Saja",
            description: "Akses InvoiceGo dari perangkat apa saja dengan koneksi internet"
        }
    ]

    return (
        <section id="features" className="py-20 bg-secondary/50 rounded-xl">
            <div className="container px-4 md:px-6">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight">Fitur Utama</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        InvoiceGo menyediakan berbagai fitur yang dibutuhkan UMKM untuk mengelola invoice dengan mudah dan profesional
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-background p-6 rounded-lg shadow-sm border"
                        >
                            <div className="mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}