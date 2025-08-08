import Dashboard from "~/components/dashboard/Dashboard";
import DashboardPanel from "~/components/dashboard/DashboardPanel";

export default function TestPage() {
    return (
        <main class="mt-48">
            <Dashboard>
                <DashboardPanel/>
            </Dashboard>
        </main>
    );
}