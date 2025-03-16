"use client";

import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, XMarkIcon, BoltIcon, FireIcon, PencilIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";

interface Habit {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    currentStreak: number;
    bestStreak: number;
    completedDates: string[];
    category?: string;
    color?: string;
}

const COLORS = [
    { name: "blue", value: "bg-primary/20 text-primary" },
    { name: "purple", value: "bg-accent/20 text-accent" },
    { name: "green", value: "bg-success/20 text-success" },
    { name: "orange", value: "bg-warning/20 text-warning" },
    { name: "red", value: "bg-destructive/20 text-destructive" },
];

const sampleHabits: Habit[] = [
    {
        id: "1",
        title: "Morning meditation",
        description: "5 minutes of mindfulness to start the day",
        currentStreak: 3,
        bestStreak: 10,
        createdAt: "2024-01-15",
        completedDates: [
            "2024-03-13",
            "2024-03-14",
            "2024-03-15",
        ],
        category: "Wellness",
        color: COLORS[0].value,
    },
    {
        id: "2",
        title: "Review daily tasks",
        description: "Check planner and prepare for the day",
        currentStreak: 5,
        bestStreak: 15,
        createdAt: "2023-12-01",
        completedDates: [
            "2024-03-11",
            "2024-03-12",
            "2024-03-13",
            "2024-03-14",
            "2024-03-15",
        ],
        category: "Productivity",
        color: COLORS[2].value,
    },
    {
        id: "3",
        title: "15-min reading",
        description: "Reading non-fiction books",
        currentStreak: 0,
        bestStreak: 7,
        createdAt: "2024-02-01",
        completedDates: [
            "2024-03-10",
            "2024-03-11",
        ],
        category: "Learning",
        color: COLORS[1].value,
    },
];

export default function HabitTracker() {
    const [habits, setHabits] = useState<Habit[]>(sampleHabits);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [newHabit, setNewHabit] = useState({
        title: "",
        description: "",
        category: "",
        color: COLORS[0].value,
    });

    // Generate last 7 dates including today
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
    }).reverse();

    const today = new Date().toISOString().split("T")[0];

    const handleToggleHabit = (habitId: string) => {
        const updatedHabits = habits.map(habit => {
            if (habit.id !== habitId) return habit;

            const isCompletedToday = habit.completedDates.includes(today);
            let currentStreak = habit.currentStreak;
            let completedDates = [...habit.completedDates];

            if (isCompletedToday) {
                // Removing today's completion
                completedDates = completedDates.filter(date => date !== today);
                currentStreak = Math.max(0, currentStreak - 1);
                toast.info("Habit completion removed");
            } else {
                // Adding today's completion
                completedDates.push(today);
                currentStreak += 1;

                if (currentStreak > 1) {
                    toast.success(`🔥 ${currentStreak} day streak!`);
                } else {
                    toast.success("Habit completed! Keep it up!");
                }
            }

            return {
                ...habit,
                completedDates,
                currentStreak,
                bestStreak: Math.max(habit.bestStreak, currentStreak),
            };
        });

        setHabits(updatedHabits);
    };

    const handleCreateHabit = () => {
        if (!newHabit.title.trim()) {
            toast.error("Please enter a habit title");
            return;
        }

        const habit: Habit = {
            id: crypto.randomUUID(),
            title: newHabit.title,
            description: newHabit.description,
            category: newHabit.category,
            color: newHabit.color,
            createdAt: today,
            currentStreak: 0,
            bestStreak: 0,
            completedDates: [],
        };

        setHabits([...habits, habit]);
        setNewHabit({
            title: "",
            description: "",
            category: "",
            color: COLORS[0].value,
        });
        setIsCreating(false);
        toast.success("New habit created!");
    };

    const handleUpdateHabit = (habitId: string) => {
        if (!newHabit.title.trim()) {
            toast.error("Please enter a habit title");
            return;
        }

        const updatedHabits = habits.map(habit => {
            if (habit.id !== habitId) return habit;

            return {
                ...habit,
                title: newHabit.title,
                description: newHabit.description,
                category: newHabit.category,
                color: newHabit.color,
            };
        });

        setHabits(updatedHabits);
        setNewHabit({
            title: "",
            description: "",
            category: "",
            color: COLORS[0].value,
        });
        setIsEditing(null);
        toast.success("Habit updated!");
    };

    const handleEditHabit = (habit: Habit) => {
        setNewHabit({
            title: habit.title,
            description: habit.description || "",
            category: habit.category || "",
            color: habit.color || COLORS[0].value,
        });
        setIsEditing(habit.id);
    };

    const handleDeleteHabit = (habitId: string) => {
        setHabits(habits.filter(habit => habit.id !== habitId));
        toast.success("Habit deleted");

        if (isEditing === habitId) {
            setIsEditing(null);
            setNewHabit({
                title: "",
                description: "",
                category: "",
                color: COLORS[0].value,
            });
        }
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewHabit({
            title: "",
            description: "",
            category: "",
            color: COLORS[0].value,
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
        setNewHabit({
            title: "",
            description: "",
            category: "",
            color: COLORS[0].value,
        });
    };

    // Check if a habit is completed on a specific date
    const isCompletedOnDate = (habit: Habit, date: string) => {
        return habit.completedDates.includes(date);
    };

    // Check if a habit's streak is at risk (not completed today or yesterday)
    const isStreakAtRisk = (habit: Habit) => {
        if (habit.currentStreak === 0) return false;

        // If already completed today, streak is safe
        if (isCompletedOnDate(habit, today)) return false;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        // If not completed yesterday, streak is already broken
        if (!isCompletedOnDate(habit, yesterdayStr)) return false;

        // Current streak exists, completed yesterday, but not today = at risk
        return true;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
    };

    return (
        <div className="bg-card rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Habit Tracker</h2>
                {!isCreating && !isEditing && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add New Habit
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="mb-6 bg-secondary/30 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-medium">Create New Habit</h3>
                        <button
                            onClick={handleCancelCreate}
                            className="p-1 rounded-full hover:bg-muted/70 transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-1">
                                Habit Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={newHabit.title}
                                onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                                placeholder="E.g., 5-minute meditation"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-1">
                                Description (Optional)
                            </label>
                            <input
                                type="text"
                                id="description"
                                value={newHabit.description}
                                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                                placeholder="Brief description of your habit"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium mb-1">
                                Category (Optional)
                            </label>
                            <input
                                type="text"
                                id="category"
                                value={newHabit.category}
                                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                                placeholder="E.g., Wellness, Productivity"
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Color</label>
                            <div className="flex gap-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setNewHabit({ ...newHabit, color: color.value })}
                                        className={`w-8 h-8 rounded-full ${color.value.split(" ")[0]} ${newHabit.color === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={handleCreateHabit}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Create Habit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditing && (
                <div className="mb-6 bg-secondary/30 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-medium">Edit Habit</h3>
                        <button
                            onClick={handleCancelEdit}
                            className="p-1 rounded-full hover:bg-muted/70 transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="edit-title" className="block text-sm font-medium mb-1">
                                Habit Title *
                            </label>
                            <input
                                type="text"
                                id="edit-title"
                                value={newHabit.title}
                                onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="edit-description" className="block text-sm font-medium mb-1">
                                Description (Optional)
                            </label>
                            <input
                                type="text"
                                id="edit-description"
                                value={newHabit.description}
                                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="edit-category" className="block text-sm font-medium mb-1">
                                Category (Optional)
                            </label>
                            <input
                                type="text"
                                id="edit-category"
                                value={newHabit.category}
                                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Color</label>
                            <div className="flex gap-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setNewHabit({ ...newHabit, color: color.value })}
                                        className={`w-8 h-8 rounded-full ${color.value.split(" ")[0]} ${newHabit.color === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 flex justify-between">
                            <button
                                onClick={() => {
                                    if (isEditing) handleDeleteHabit(isEditing);
                                }}
                                className="px-4 py-2 text-sm text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors flex items-center gap-1"
                            >
                                <TrashIcon className="h-4 w-4" />
                                Delete
                            </button>

                            <button
                                onClick={() => {
                                    if (isEditing) handleUpdateHabit(isEditing);
                                }}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {habits.length === 0 && !isCreating ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
                        <BoltIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Habits Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Build consistency with daily habits. Start small and track your progress over time.
                    </p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Create Your First Habit
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="text-left pb-4 font-medium text-sm text-muted-foreground w-1/3">Habit</th>
                                {last7Days.map((date) => (
                                    <th key={date} className="font-medium text-center pb-4 text-xs text-muted-foreground">
                                        {formatDate(date)}
                                        <div className="text-[10px] opacity-70">
                                            {date === today ? "Today" : date.split("-")[2]}
                                        </div>
                                    </th>
                                ))}
                                <th className="text-center pb-4 font-medium text-sm text-muted-foreground">Streak</th>
                                <th className="text-center pb-4 font-medium text-sm text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => (
                                <tr key={habit.id} className="group">
                                    <td className="py-4 pr-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-full flex-shrink-0 ${habit.color?.split(" ")[0]} flex items-center justify-center`}>
                                                <span className={`font-bold ${habit.color?.split(" ")[1]}`}>
                                                    {habit.title.substring(0, 1).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium">{habit.title}</div>
                                                {habit.description && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {habit.description}
                                                    </div>
                                                )}
                                                {habit.category && (
                                                    <div className="text-xs mt-1">
                                                        <span className="px-2 py-0.5 rounded-full bg-secondary">
                                                            {habit.category}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {last7Days.map((date) => (
                                        <td key={date} className="py-4 text-center">
                                            <button
                                                disabled={date !== today && date > today}
                                                onClick={() => date === today && handleToggleHabit(habit.id)}
                                                className={`w-8 h-8 rounded-md mx-auto flex items-center justify-center ${isCompletedOnDate(habit, date)
                                                        ? `${habit.color} ring-offset-card ring-2 ring-offset-2 ring-primary/30`
                                                        : date === today
                                                            ? "bg-muted hover:bg-muted/70 cursor-pointer"
                                                            : date > today
                                                                ? "bg-muted/50 cursor-not-allowed opacity-50"
                                                                : "bg-muted/50"
                                                    }`}
                                            >
                                                {isCompletedOnDate(habit, date) && <CheckIcon className="h-5 w-5" />}
                                            </button>
                                        </td>
                                    ))}

                                    <td className="py-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <FireIcon className={`h-4 w-4 ${habit.currentStreak > 0 ? "text-warning" : "text-muted-foreground"}`} />
                                            <span className={`font-medium ${isStreakAtRisk(habit) ? "text-warning" : ""}`}>
                                                {habit.currentStreak}
                                            </span>
                                        </div>
                                        {habit.bestStreak > 0 && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Best: {habit.bestStreak}
                                            </div>
                                        )}
                                    </td>

                                    <td className="py-4 text-center">
                                        <button
                                            onClick={() => handleEditHabit(habit)}
                                            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 