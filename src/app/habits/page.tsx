"use client";

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import HabitTracker from "@/components/habits/habit-tracker";
import { BoltIcon } from "@heroicons/react/24/outline";

export default function HabitsPage() {
    return (
        <DashboardLayout>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Habits</h1>
                        <p className="text-muted-foreground mt-2">
                            Build and maintain consistent habits to improve your focus and productivity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                        {/* Quick stats */}
                        <div className="bg-card rounded-xl shadow-sm border p-6 flex items-center gap-4">
                            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                                <BoltIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Active Habits</div>
                                <div className="text-2xl font-bold">3</div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl shadow-sm border p-6 flex items-center gap-4">
                            <div className="h-12 w-12 bg-success/20 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Completions Today</div>
                                <div className="text-2xl font-bold">2/3</div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl shadow-sm border p-6 flex items-center gap-4">
                            <div className="h-12 w-12 bg-warning/20 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Weekly Streak</div>
                                <div className="text-2xl font-bold">5 days</div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl shadow-sm border p-6 flex items-center gap-4">
                            <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Completion Rate</div>
                                <div className="text-2xl font-bold">85%</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <HabitTracker />

                        <div className="bg-card rounded-xl shadow-sm border p-6">
                            <h2 className="text-2xl font-semibold mb-6">Suggested Habits for ADHD</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer">
                                    <h3 className="font-medium mb-1">Morning brain dump</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Spend 5 minutes writing down all thoughts to clear your mind
                                    </p>
                                </div>

                                <div className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer">
                                    <h3 className="font-medium mb-1">Pomodoro work session</h3>
                                    <p className="text-sm text-muted-foreground">
                                        25 minutes of focused work followed by a 5-minute break
                                    </p>
                                </div>

                                <div className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer">
                                    <h3 className="font-medium mb-1">Evening planning session</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Plan tomorrow's tasks and set priorities before bed
                                    </p>
                                </div>

                                <div className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer">
                                    <h3 className="font-medium mb-1">Hydration check</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Drink a glass of water every 2 hours to stay hydrated
                                    </p>
                                </div>

                                <div className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer">
                                    <h3 className="font-medium mb-1">Quick exercise break</h3>
                                    <p className="text-sm text-muted-foreground">
                                        2-minute stretching or movement to reset focus
                                    </p>
                                </div>

                                <div className="p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer">
                                    <h3 className="font-medium mb-1">Mindful breathing</h3>
                                    <p className="text-sm text-muted-foreground">
                                        30 seconds of deep breathing when feeling overwhelmed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 