'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function TestimonialSection() {
    const testimonials = [
        {
            name: "Budi Santoso",
            company: "PT Maju Bersama",
            comment: "InvoiceGo membantu kami menghemat waktu administrasi hingga 70%. Sangat direkomendasikan untuk UMKM!",
            rating: 5
        },
        {
            name: "Ani Kusuma",
            company: "Coffee Shop Aroma",
            comment: "Template invoice yang profesional dan mudah digunakan. Pelanggan kami jadi lebih menghargai bisnis kami.",
            rating: 5
        },
        {
            name: "Dian Pratama",
            company: "Studio Desain Kreatif",
            comment: "Fitur analitik sangat membantu untuk memantau arus kas dan invoice yang belum dibayar.",
            rating: 4
        }
    ]

    return (
        <section id="testimonials" className="py-20 bg-secondary/50">
            <div className="container px-4 md:px-6">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight">Apa Kata Pengguna</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Lihat bagaimana InvoiceGo membantu bisnis UMKM berkembang
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm">"{testimonial.comment}"</p>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{testimonial.name}</span>
                                        <span className="text-sm text-muted-foreground">{testimonial.company}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}