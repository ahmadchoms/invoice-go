import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Tooltip } from "../ui/tooltip"

const COLORS = ['#10B981', '#F59E0B', '#EF4444']

const StatusPieChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => {
                    if (isNaN(percent)) return '';
                    return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                    />
                ))}
            </Pie>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
            />
        </PieChart>
    </ResponsiveContainer>
)

export default StatusPieChart