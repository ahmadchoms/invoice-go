import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function FeatureCard({ icon: Icon, title, description, features }) {
    return (
        <Card>
            <CardHeader>
                <Icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}