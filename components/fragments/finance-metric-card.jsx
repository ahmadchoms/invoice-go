import { TrendingUp } from "lucide-react"

const FinanceMetricCard = ({ title, value, trend, color }) => (
    <div className={`p-4 rounded-lg bg-gradient-to-br ${color}`}>
        <p className={`text-xs font-medium ${title === "Total Pendapatan" ? "text-indigo-600 dark:text-indigo-400" :
            title === "Rata-rata Invoice" ? "text-green-600 dark:text-green-400" :
                "text-violet-600 dark:text-violet-400"}`}>
            {title}
        </p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <div className="flex items-center mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <p className="text-xs text-green-500">{trend}</p>
        </div>
    </div>
)

export default FinanceMetricCard