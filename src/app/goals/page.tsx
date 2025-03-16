"use client";

import GoalBreakdown from "@/components/goals/goal-breakdown";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function GoalsPage() {
    return (
        <DashboardLayout>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Goals</h1>
                        <p className="text-muted-foreground mt-2">
                            Break down large goals into manageable steps with our AI-powered breakdown engine.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <GoalBreakdown />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 