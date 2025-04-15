"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, AlertCircle, CheckCircle, Clock, TrendingUp, Activity } from "lucide-react"
import StatCard from "@/components/fragments/stat-card"
import FinanceMetricCard from "@/components/fragments/finance-metric-card"
import TabTriggerItem from "@/components/fragments/tab-trigger-item"
import ChartContainer from "@/components/fragments/chart-container"
import { formatCurrency } from "@/lib/utils/formatters"
import RevenueAreaChart from "@/components/fragments/revenue-area-chart"
import StatusPieChart from "@/components/fragments/status-pie-chart"
import YearlyBarChart from "@/components/fragments/yearly-bar-chart"
import RevenueLineChart from "@/components/fragments/revenue-line-chart"
import useInvoices from "@/hooks/useInvoices"
import useFilteredInvoices from "@/hooks/useFilteredInvoices"
import useChartData from "@/hooks/useChartData"
import useYearOptions from "@/hooks/useYearOptions"
import useInvoiceStats from "@/hooks/useInvoicesStat"

const getCurrentGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Selamat Pagi"
    if (hour < 17) return "Selamat Siang"
    return "Selamat Malam"
}

export default function DashboardPage() {
    const { data: session } = useSession()
    const currentYear = new Date().getFullYear()
    const [yearFilter, setYearFilter] = useState(currentYear.toString())
    const [activeTab, setActiveTab] = useState("overview")
    const { invoices } = useInvoices()
    const filteredInvoices = useFilteredInvoices(invoices, yearFilter)
    const { monthlyData, statusData } = useChartData(filteredInvoices, invoices, yearFilter)
    const yearOptions = useYearOptions(currentYear)
    const invoiceStats = useInvoiceStats(invoices);

    const averageInvoice = invoiceStats.paid ? invoiceStats.totalValue / invoiceStats.paid : 0
    const conversionRate = invoiceStats.total ? Math.round((invoiceStats.paid / invoiceStats.total) * 100) : 0

    return (
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight">
                        {`${getCurrentGreeting()}, ${session?.user?.name || "User"}!`}
                    </h2>
                    <p className="text-gray-500 font-medium dark:text-gray-400 mt-1">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger className="w-32">
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
                    <Link href="/invoices/create">
                        <Button className="text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Invoice Baru
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Invoice"
                    value={invoiceStats.total}
                    icon={FileText}
                    iconColor="text-indigo-600 dark:text-indigo-400"
                    iconBgColor="bg-indigo-100 dark:bg-indigo-900/30"
                    trend="12%"
                />
                <StatCard
                    title="Lunas"
                    value={invoiceStats.paid}
                    icon={CheckCircle}
                    iconColor="text-green-600 dark:text-green-400"
                    iconBgColor="bg-green-100 dark:bg-green-900/30"
                    trend="8%"
                />
                <StatCard
                    title="Menunggu"
                    value={invoiceStats.pending}
                    icon={Clock}
                    iconColor="text-amber-600 dark:text-amber-400"
                    iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                    trend="4%"
                />
                <StatCard
                    title="Terlambat"
                    value={invoiceStats.overdue}
                    icon={AlertCircle}
                    iconColor="text-red-600 dark:text-red-400"
                    iconBgColor="bg-red-100 dark:bg-red-900/30"
                    trend="2%"
                    trendDirection="down"
                />
            </div>

            <Card className="border-0 bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">Ringkasan Finansial {yearFilter}</CardTitle>
                    <CardDescription>Total pendapatan dan statistik pembayaran</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FinanceMetricCard
                            title="Total Pendapatan"
                            value={formatCurrency(invoiceStats.totalValue || 0)}
                            trend="+18.2% dari tahun lalu"
                            color="from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20"
                        />
                        <FinanceMetricCard
                            title="Rata-rata Invoice"
                            value={formatCurrency(averageInvoice)}
                            trend="+5.3% dari bulan lalu"
                            color="from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                        />
                        <FinanceMetricCard
                            title="Tingkat Konversi"
                            value={`${conversionRate}%`}
                            trend="+2.1% dari bulan lalu"
                            color="from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20"
                        />
                    </div>
                </CardContent>
            </Card>

            <Tabs
                defaultValue="overview"
                className="space-y-4"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <div className="flex justify-between items-center">
                    <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
                        <TabTriggerItem value="overview" icon={Activity} activeTab={activeTab} />
                        <TabTriggerItem value="analytics" icon={TrendingUp} activeTab={activeTab} />
                    </TabsList>
                    <div className="hidden md:flex">
                        <Button variant="outline" className="mr-2 text-sm">Export Data</Button>
                        <Button variant="outline" className="text-sm">Print Report</Button>
                    </div>
                </div>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <ChartContainer
                            title="Pendapatan Bulanan"
                            description={`Tren pendapatan ${yearFilter}`}
                            className="col-span-4"
                        >
                            <RevenueAreaChart data={monthlyData} />
                        </ChartContainer>
                        <ChartContainer
                            title="Status Invoice"
                            description="Distribusi status invoice saat ini"
                            className="col-span-4"
                        >
                            <StatusPieChart data={statusData} />
                        </ChartContainer>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <ChartContainer
                            title="Performa Tahunan"
                            description={`Perbandingan pendapatan per bulan ${yearFilter}`}
                            className="col-span-4"
                        >
                            <YearlyBarChart data={monthlyData} />
                        </ChartContainer>
                        <ChartContainer
                            title="Tren Pendapatan"
                            description={`Tren pendapatan ${yearFilter}`}
                            className="col-span-4"
                        >
                            <RevenueLineChart data={monthlyData} />
                        </ChartContainer>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}