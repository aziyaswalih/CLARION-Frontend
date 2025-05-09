import { Link } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    FileText,
    // Settings,
    PieChart,
    // DollarSign,
    Building2,
    BarChart,
    Lock,
} from "lucide-react";

interface MenuItem {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string;
    active?: boolean;
}

const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { title: "Beneficiaries", icon: Users, href: "/admin/beneficiaries" },
    { title: "Volunteers", icon: FileText, href: "/admin/volunteers" },
    { title: "Donors", icon: BarChart, href: "/admin/donors" },
    { title: "Report & Analytics", icon: PieChart, href: "/admin/analytics" },
    { title: "Recent Stories", icon: Building2, href: "/admin/recentstories" },
    // { title: "Finance Management", icon: DollarSign, href: "/admin/finance" },
    // { title: "Donation Management", icon: Settings, href: "/admin/donation" },
    { title: "Logout", icon: Lock, href: "/admin/logout" },
];

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-[#453c36] text-white h-screen fixed left-0 top-0">
            <div className="p-6">
                <Link to="/admin/dashboard" className="text-3xl font-serif text-[#c26262]">
                    CLARION
                </Link>
            </div>

            <nav className="mt-6">
                {menuItems.map(({ title, icon: Icon, href, active }) => (
                    <Link
                        key={title}
                        to={href}
                        className={`flex items-center gap-3 px-6 py-3 text-sm hover:bg-white/10 transition-colors ${
                            active ? "bg-white/10" : ""
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        {title}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;