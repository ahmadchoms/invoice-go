"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/init"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { Download, FileText, Loader2 } from "lucide-react"
import useInvoices from "@/hooks/useInvoices"

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#EC4899"]
const STATUS_TYPES = ["paid", "pending", "overdue"]

export default function ReportsPage() {
    const { invoices, isLoading } = useInvoices()
    const currentYear = new Date().getFullYear()
    const [yearFilter, setYearFilter] = useState(currentYear.toString())

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.created_at)
            return invoiceDate.getFullYear().toString() === yearFilter
        })
    }, [invoices, yearFilter])

    const chartData = useMemo(() => {
        const monthlyData = Array(12)
            .fill()
            .map((_, i) => ({
                name: new Date(0, i).toLocaleString("id-ID", { month: "short" }),
                total: 0,
                count: 0,
            }))

        const statusCounts = STATUS_TYPES.reduce((acc, status) => {
            acc[status] = 0
            return acc
        }, {})

        const clientTotals = {}

        filteredInvoices.forEach(invoice => {
            const month = new Date(invoice.created_at).getMonth()

            monthlyData[month].total += invoice.total
            monthlyData[month].count += 1

            if (statusCounts[invoice.status] !== undefined) {
                statusCounts[invoice.status] += 1
            }

            if (!clientTotals[invoice.client_name]) {
                clientTotals[invoice.client_name] = 0
            }
            clientTotals[invoice.client_name] += invoice.total
        })

        const clientData = Object.entries(clientTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }))

        const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

        return {
            monthlyData,
            statusData,
            clientData
        }
    }, [filteredInvoices])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value)
    }

    const formatCompactNumber = (value) => {
        return new Intl.NumberFormat("id-ID", {
            notation: "compact",
            compactDisplay: "short",
        }).format(value)
    }

    const yearOptions = useMemo(() => {
        return Array(5).fill().map((_, i) => (currentYear - i).toString())
    }, [currentYear])

    const handleDownloadReport = (format) => {
        alert(`Downloading report in ${format} format...`)
    }

    const ChartContainer = ({ height = "400px", children }) => (
        <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
        </div>
    )

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[600px]">
                <Loader2 className="animate-spin w-10 h-10" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Laporan</h2>
                <div className="flex items-center gap-2">
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Pilih Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            {yearOptions.map((year) => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => handleDownloadReport("csv")}>
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                    </Button>
                    <Button variant="outline" onClick={() => handleDownloadReport("pdf")}>
                        <FileText className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="revenue" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
                    <TabsTrigger value="clients">Klien</TabsTrigger>
                    <TabsTrigger value="status">Status Invoice</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pendapatan Bulanan {yearFilter}</CardTitle>
                            <CardDescription>Grafik pendapatan bulanan berdasarkan invoice yang dibuat</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer>
                                <AreaChart
                                    data={chartData.monthlyData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={formatCompactNumber} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Jumlah Invoice per Bulan {yearFilter}</CardTitle>
                            <CardDescription>Grafik jumlah invoice yang dibuat per bulan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer>
                                <BarChart
                                    data={chartData.monthlyData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#82ca9d" name="Jumlah Invoice" />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="clients" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 5 Klien {yearFilter}</CardTitle>
                            <CardDescription>Klien dengan total transaksi tertinggi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer>
                                <BarChart
                                    data={chartData.clientData}
                                    layout="vertical"
                                    margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={formatCompactNumber} />
                                    <YAxis type="category" dataKey="name" />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Bar dataKey="value" fill="#8884d8" name="Total Transaksi" />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="status" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Invoice {yearFilter}</CardTitle>
                            <CardDescription>Distribusi status invoice</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData.statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {chartData.statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}