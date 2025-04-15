import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen overflow-hidden">
            <DashboardSidebar />
            <main className="h-screen flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}

