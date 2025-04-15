import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PricingCard({ className, title, price, description, features, badge, buttonText, variant = "outline" }) {
    return (
        <Card className={cn("flex flex-col p-6 relative w-full min-w-sm", className)}>
            {badge && (
                <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                    variant="secondary"
                >
                    {badge}
                </Badge>
            )}
            <CardHeader className="text-center rounded-t-lg p-6">
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                <div className="mt-4 flex justify-center items-baseline gap-1">
                    <p className="text-4xl font-bold">{price}</p>
                    <p className="text-lg text-muted-foreground">/bulan</p>
                </div>
                <CardDescription className="mt-2 text-base">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1">
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <div className="p-6">
                <Button variant={variant} className="w-full" size="lg">
                    {buttonText}
                </Button>
            </div>
        </Card>
    );
}