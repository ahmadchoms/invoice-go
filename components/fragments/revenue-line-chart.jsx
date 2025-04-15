import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Tooltip } from "../ui/tooltip"

const RevenueLineChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={350}>
        <LineChart
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
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
            <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                name="Tahun Ini"
            />
            <Line
                type="monotone"
                dataKey="previous"
                stroke="#82ca9d"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                name="Tahun Lalu"
            />
        </LineChart>
    </ResponsiveContainer>
)

export default RevenueLineChart