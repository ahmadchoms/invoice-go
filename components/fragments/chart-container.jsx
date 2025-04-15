import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const ChartContainer = ({ title, description, children, className }) => (
    <Card className={`border-0 shadow-md bg-white dark:bg-gray-800 ${className}`}>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
            {children}
        </CardContent>
    </Card>
)

export default ChartContainer