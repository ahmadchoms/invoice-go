import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Tooltip } from "../ui/tooltip"

const YearlyBarChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={350}>
        <BarChart
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
                    { value: 'Tahun Ini', type: 'rect', color: '#8884d8' },
                    { value: 'Tahun Lalu', type: 'rect', color: '#82ca9d' }
                ]}
            />
            <Bar dataKey="total" name="Tahun Ini" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="previous" name="Tahun Lalu" fill="#82ca9d" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
)

export default YearlyBarChart