import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }
    return (
        <div className="flex min-h-screen overflow-hidden">
            <DashboardSidebar />
            <main className="h-screen flex-1 overflow-y-auto">{children}</main>
        </div>
    )
}

