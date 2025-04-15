'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, FileText, Clock, Zap } from 'lucide-react'

export default function HeroSection() {
    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                            Buat Invoice Profesional dengan <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">InvoiceGo</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Solusi invoice modern untuk UMKM yang ingin tumbuh dan lebih profesional
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/invoices">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Buat Invoice <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    Lihat Fitur
                                </Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="text-sm">Invoice Profesional</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-400" />
                                <span className="text-sm">Hemat Waktu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-yellow-400" />
                                <span className="text-sm">Mudah Digunakan</span>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-video relative rounded-lg overflow-hidden shadow-xl border bg-background/50">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-teal-100 opacity-30"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-lg font-bold">Invoice #INV-001</div>
                                        <div className="text-sm text-blue-600">InvoiceGo</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="border-b pb-2">
                                            <div className="text-sm text-muted-foreground">Untuk:</div>
                                            <div className="font-medium">PT Maju Bersama</div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="text-sm text-muted-foreground">Tanggal:</div>
                                                <div>20 Maret 2025</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Jatuh Tempo:</div>
                                                <div>30 Maret 2025</div>
                                            </div>
                                        </div>
                                        <div className="border-t pt-2 mt-4">
                                            <div className="flex justify-between font-semibold">
                                                <div>Total:</div>
                                                <div>Rp 5.000.000</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}