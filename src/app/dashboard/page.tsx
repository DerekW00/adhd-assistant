"use client";

import { useState } from "react";
import Link from "next/link";
import {
    PlusIcon,
    CalendarIcon,
    CheckCircleIcon,
    BoltIcon,
    BellIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

// Sample data for demonstration
const sampleTasks = [
    { id: 1, title: "Research paper - find references", completed: false, dueDate: "Today", priority: "high", category: "Research" },
    { id: 2, title: "Email Dr. Johnson about project", completed: true, dueDate: "Today", priority: "medium", category: "Communication" },
    { id: 3, title: "Review notes for meeting", completed: false, dueDate: "Today", priority: "medium", category: "Work" },
    { id: 4, title: "Set up study schedule", completed: false, dueDate: "Tomorrow", priority: "medium", category: "Planning" },
    { id: 5, title: "Clean desk space", completed: false, dueDate: "Tomorrow", priority: "low", category: "Home" },
];

const sampleGoals = [
    { id: 1, title: "Complete Research Paper", progress: 35, dueDate: "May 15, 2024", category: "Academic" },
    { id: 2, title: "Learn React Native", progress: 60, dueDate: "Ongoing", category: "Career" },
];

const sampleHabits = [
    { id: 1, title: "5-minute meditation", streak: 4, daysCompleted: [true, true, true, true, false, false, false] },
    { id: 2, title: "Review daily tasks", streak: 7, daysCompleted: [true, true, true, true, true, true, true] },
    { id: 3, title: "15-min exercise", streak: 2, daysCompleted: [false, true, true, false, false, false, false] },
];

export default function DashboardPage() {
    const [currentTab, setCurrentTab] = useState("today");
    const [energyLevel, setEnergyLevel] = useState(3);

    return (
        <DashboardLayout>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold">Welcome back, Derek!</h1>
                                <p className="text-muted-foreground">Here's what's on your plate for today.</p>
                            </div>

                            <Link
                                href="/goals"
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Add New Goal
                            </Link>
                        </div>
                    </div>

                    {/* Energy level selector */}
                    <div className="mb-10 p-6 bg-card rounded-xl shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">How's your focus today?</h2>
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Low Energy</span>
                                <span className="text-sm">High Energy</span>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setEnergyLevel(level)}
                                        className={`flex-1 h-10 rounded-full ${level === energyLevel
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary hover:bg-secondary/80'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                We'll adjust your task recommendations based on your current energy level.
                            </p>
                        </div>
                    </div>

                    {/* Dashboard grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Today's tasks */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-card rounded-xl shadow-sm border p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">Today's Tasks</h2>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setCurrentTab("today")}
                                            className={`px-3 py-1 rounded-full text-sm ${currentTab === "today"
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted'
                                                }`}
                                        >
                                            Today
                                        </button>
                                        <button
                                            onClick={() => setCurrentTab("all")}
                                            className={`px-3 py-1 rounded-full text-sm ${currentTab === "all"
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted'
                                                }`}
                                        >
                                            All Tasks
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {sampleTasks
                                        .filter(task => currentTab === "today" ? task.dueDate === "Today" : true)
                                        .map(task => (
                                            <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                                                <button className="rounded-full flex-shrink-0">
                                                    {task.completed ? (
                                                        <CheckCircleIcon className="h-6 w-6 text-success" />
                                                    ) : (
                                                        <div className="h-6 w-6 rounded-full border-2 border-muted-foreground hover:border-primary" />
                                                    )}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <p className={`truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                                        {task.title}
                                                    </p>
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-xs text-muted-foreground">
                                                            {task.dueDate}
                                                        </span>
                                                        <span className="mx-2 text-muted-foreground text-xs">•</span>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                                            {task.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-destructive' :
                                                    task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                                                    }`} />
                                            </div>
                                        ))}

                                    <button className="w-full mt-4 p-3 border border-dashed border-muted-foreground/30 rounded-lg text-muted-foreground hover:text-primary hover:border-primary flex items-center justify-center gap-2 transition-colors">
                                        <PlusIcon className="h-5 w-5" />
                                        <span>Add Task</span>
                                    </button>
                                </div>
                            </div>

                            {/* Goals section */}
                            <div className="bg-card rounded-xl shadow-sm border p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">Goals In Progress</h2>
                                    <Link href="/goals" className="text-sm text-primary hover:underline">
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-6">
                                    {sampleGoals.map(goal => (
                                        <div key={goal.id} className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium">{goal.title}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                        <CalendarIcon className="h-3.5 w-3.5" />
                                                        <span>Due: {goal.dueDate}</span>
                                                        <span className="px-1.5 py-0.5 rounded-full bg-muted">
                                                            {goal.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold">{goal.progress}%</span>
                                            </div>

                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${goal.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Streak section */}
                            <div className="bg-card rounded-xl shadow-sm border p-6">
                                <h2 className="text-xl font-semibold mb-4">Your Habits</h2>

                                <div className="space-y-6">
                                    {sampleHabits.map(habit => (
                                        <div key={habit.id} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-medium">{habit.title}</h3>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <BoltIcon className="h-4 w-4 text-warning" />
                                                    <span>Streak: {habit.streak}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-1">
                                                {habit.daysCompleted.map((completed, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-7 w-7 rounded-md flex items-center justify-center ${completed
                                                            ? 'bg-primary/20 text-primary'
                                                            : 'bg-muted text-muted-foreground'
                                                            }`}
                                                    >
                                                        {completed && <CheckIcon className="h-4 w-4" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <button className="w-full p-3 border border-dashed border-muted-foreground/30 rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                                        Add New Habit
                                    </button>
                                </div>
                            </div>

                            {/* Stats section */}
                            <div className="bg-card rounded-xl shadow-sm border p-6">
                                <h2 className="text-xl font-semibold mb-4">Stats</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckIcon className="h-5 w-5 text-success" />
                                            <span>Completed Today</span>
                                        </div>
                                        <span className="font-semibold">2/5</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ArrowTrendingUpIcon className="h-5 w-5 text-primary" />
                                            <span>Week Progress</span>
                                        </div>
                                        <span className="font-semibold">68%</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BoltIcon className="h-5 w-5 text-warning" />
                                            <span>Focus Score</span>
                                        </div>
                                        <span className="font-semibold">72</span>
                                    </div>

                                    <Link
                                        href="/analytics"
                                        className="flex items-center justify-center gap-2 text-primary text-sm mt-2 hover:underline"
                                    >
                                        <ChartBarIcon className="h-4 w-4" />
                                        <span>View detailed analytics</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 