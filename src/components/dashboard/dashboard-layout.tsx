"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    CalendarIcon,
    ListBulletIcon,
    ClockIcon,
    ChartBarIcon,
    UserCircleIcon,
    BoltIcon,
    Cog6ToothIcon,
    BellIcon,
} from "@heroicons/react/24/outline";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [isDemoUser, setIsDemoUser] = useState(true);

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
        { name: "Goals", href: "/goals", icon: ListBulletIcon },
        { name: "Daily Planner", href: "/planner", icon: CalendarIcon },
        { name: "Habits", href: "/habits", icon: ClockIcon },
        { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="bg-card shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="text-2xl font-bold text-primary">
                                FocusFlow
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 text-muted-foreground hover:text-foreground focus-ring rounded-full">
                                <BellIcon className="h-6 w-6" />
                            </button>
                            <button className="p-2 text-muted-foreground hover:text-foreground focus-ring rounded-full">
                                <Cog6ToothIcon className="h-6 w-6" />
                            </button>
                            <div className="relative">
                                <button className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center focus-ring">
                                    <span className="text-sm font-medium">
                                        {isDemoUser ? "DJ" : "U"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Sidebar navigation for desktop */}
                <div className="hidden md:flex flex-col w-64 border-r bg-card">
                    <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
                        <div className="px-2 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Upgrade button */}
                        <div className="mt-6 px-3">
                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-9 w-9 rounded-full bg-warning/20 flex items-center justify-center">
                                        <BoltIcon className="h-5 w-5 text-warning" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Free Plan</h3>
                                        <p className="text-xs text-muted-foreground">5/10 breakdowns used</p>
                                    </div>
                                </div>
                                <button className="w-full py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Mobile nav bar at bottom */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-card border-t">
                    <div className="flex justify-around items-center">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex flex-col items-center py-3 px-2 ${isActive ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    <item.icon
                                        className={`h-6 w-6 ${isActive ? "text-primary" : ""}`}
                                    />
                                    <span className="text-xs mt-1">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
} 