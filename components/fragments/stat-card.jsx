import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const StatCard = ({ title, value, icon: Icon, iconColor, iconBgColor, trend, trendDirection = "up" }) => (
    <Card className="overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <div className={`p-2 rounded-full ${iconBgColor}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
        </CardHeader>
        <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{value}</div>
            {trend && (
                <div className="flex items-center mt-1">
                    <span className={`text-xs ${trendDirection === "up" ? "text-green-500" : "text-red-500"} font-medium flex items-center mr-1`}>
                        <ArrowUpRight className={`h-3 w-3 mr-1 ${trendDirection === "down" ? "rotate-180" : ""}`} /> {trend}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">dari bulan lalu</p>
                </div>
            )}
        </CardContent>
    </Card>
)

export default StatCard