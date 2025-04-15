import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Tooltip } from "../ui/tooltip"

const RevenueAreaChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={350}>
        <AreaChart
            data={data}
            margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
            }}
        >
            <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                }).format(value)}
            />
            <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                payload={[
                    { value: 'Tahun Ini', type: 'line', color: '#8884d8' },
                    { value: 'Tahun Lalu', type: 'line', color: '#82ca9d' }
                ]}
            />
            <Area
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
                name="Tahun Ini"
            />
            <Area
                type="monotone"
                dataKey="previous"
                stroke="#82ca9d"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrevious)"
                name="Tahun Lalu"
            />
        </AreaChart>
    </ResponsiveContainer>
)

export default RevenueAreaChart