"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PlusIcon, XMarkIcon, ArrowPathIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

type Subtask = {
    id: string;
    title: string;
    description?: string;
    estimatedDuration: string;
    dueDate?: string;
    completed: boolean;
};

type Goal = {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    complexity: "low" | "medium" | "high";
    category?: string;
    subtasks: Subtask[];
};

// Mock function to simulate AI task breakdown
const simulateAIBreakdown = (
    goalTitle: string,
    complexity: string,
    dueDate?: string
): Subtask[] => {
    // This would be replaced with an actual API call to an AI service
    const subtasks: Subtask[] = [];

    // Research phase
    subtasks.push({
        id: crypto.randomUUID(),
        title: `Research phase for ${goalTitle}`,
        description: "Gather information and resources needed for this goal",
        estimatedDuration: "2 hours",
        dueDate: dueDate ? new Date(new Date(dueDate).setDate(new Date(dueDate).getDate() - 14)).toISOString().split('T')[0] : undefined,
        completed: false,
    });

    // Planning phase
    subtasks.push({
        id: crypto.randomUUID(),
        title: `Create detailed plan for ${goalTitle}`,
        description: "Break down the goal into specific actionable steps",
        estimatedDuration: "1 hour",
        dueDate: dueDate ? new Date(new Date(dueDate).setDate(new Date(dueDate).getDate() - 12)).toISOString().split('T')[0] : undefined,
        completed: false,
    });

    // Initial work
    subtasks.push({
        id: crypto.randomUUID(),
        title: `Start initial work on ${goalTitle}`,
        description: "Begin the first phase of implementation",
        estimatedDuration: "3 hours",
        dueDate: dueDate ? new Date(new Date(dueDate).setDate(new Date(dueDate).getDate() - 10)).toISOString().split('T')[0] : undefined,
        completed: false,
    });

    // Mid-point review
    subtasks.push({
        id: crypto.randomUUID(),
        title: `Mid-point review of ${goalTitle}`,
        description: "Assess progress and make adjustments as needed",
        estimatedDuration: "1 hour",
        dueDate: dueDate ? new Date(new Date(dueDate).setDate(new Date(dueDate).getDate() - 7)).toISOString().split('T')[0] : undefined,
        completed: false,
    });

    // Final implementation
    subtasks.push({
        id: crypto.randomUUID(),
        title: `Complete main implementation of ${goalTitle}`,
        description: "Finish the core work required for this goal",
        estimatedDuration: "4 hours",
        dueDate: dueDate ? new Date(new Date(dueDate).setDate(new Date(dueDate).getDate() - 3)).toISOString().split('T')[0] : undefined,
        completed: false,
    });

    // Review and finalize
    subtasks.push({
        id: crypto.randomUUID(),
        title: `Review and finalize ${goalTitle}`,
        description: "Polish, refine, and complete any remaining details",
        estimatedDuration: "2 hours",
        dueDate: dueDate,
        completed: false,
    });

    // Add more subtasks for higher complexity
    if (complexity === "medium" || complexity === "high") {
        subtasks.push({
            id: crypto.randomUUID(),
            title: `Additional refinement for ${goalTitle}`,
            description: "Extra polishing and quality improvements",
            estimatedDuration: "2 hours",
            dueDate: dueDate,
            completed: false,
        });
    }

    if (complexity === "high") {
        subtasks.push({
            id: crypto.randomUUID(),
            title: `Advanced optimization for ${goalTitle}`,
            description: "Take it to the next level with additional improvements",
            estimatedDuration: "3 hours",
            dueDate: dueDate,
            completed: false,
        });

        subtasks.push({
            id: crypto.randomUUID(),
            title: `Expert review of ${goalTitle}`,
            description: "Get feedback from relevant experts or peers",
            estimatedDuration: "1 hour",
            dueDate: dueDate ? new Date(new Date(dueDate).setDate(new Date(dueDate).getDate() - 5)).toISOString().split('T')[0] : undefined,
            completed: false,
        });
    }

    return subtasks;
};

export default function GoalBreakdown() {
    const [isCreating, setIsCreating] = useState(false);
    const [goal, setGoal] = useState<Goal | null>(null);
    const [newGoal, setNewGoal] = useState({
        title: "",
        description: "",
        dueDate: "",
        complexity: "medium" as "low" | "medium" | "high",
        category: "",
    });
    const [loading, setLoading] = useState(false);
    const [editingSubtask, setEditingSubtask] = useState<string | null>(null);

    const handleCreateGoal = () => {
        setIsCreating(true);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewGoal({
            title: "",
            description: "",
            dueDate: "",
            complexity: "medium",
            category: "",
        });
    };

    const handleGenerateBreakdown = async () => {
        if (!newGoal.title) {
            toast.error("Please enter a goal title");
            return;
        }

        setLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Get AI-generated subtasks
            const subtasks = simulateAIBreakdown(
                newGoal.title,
                newGoal.complexity,
                newGoal.dueDate
            );

            // Create the new goal
            const createdGoal: Goal = {
                id: crypto.randomUUID(),
                title: newGoal.title,
                description: newGoal.description,
                dueDate: newGoal.dueDate,
                complexity: newGoal.complexity,
                category: newGoal.category,
                subtasks,
            };

            setGoal(createdGoal);
            setIsCreating(false);
            toast.success("Goal breakdown generated successfully!");
        } catch (error) {
            toast.error("Failed to generate goal breakdown");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubtask = () => {
        if (!goal) return;

        const newSubtask: Subtask = {
            id: crypto.randomUUID(),
            title: "",
            estimatedDuration: "1 hour",
            completed: false,
        };

        setGoal({
            ...goal,
            subtasks: [...goal.subtasks, newSubtask],
        });

        setEditingSubtask(newSubtask.id);
    };

    const handleUpdateSubtask = (id: string, data: Partial<Subtask>) => {
        if (!goal) return;

        setGoal({
            ...goal,
            subtasks: goal.subtasks.map(subtask =>
                subtask.id === id ? { ...subtask, ...data } : subtask
            ),
        });
    };

    const handleDeleteSubtask = (id: string) => {
        if (!goal) return;

        setGoal({
            ...goal,
            subtasks: goal.subtasks.filter(subtask => subtask.id !== id),
        });

        toast.success("Subtask removed");
    };

    const handleToggleSubtask = (id: string) => {
        if (!goal) return;

        setGoal({
            ...goal,
            subtasks: goal.subtasks.map(subtask =>
                subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
            ),
        });
    };

    const handleRegenerateBreakdown = async () => {
        if (!goal) return;

        setLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Get new AI-generated subtasks
            const subtasks = simulateAIBreakdown(
                goal.title,
                goal.complexity,
                goal.dueDate
            );

            // Update the goal with new subtasks
            setGoal({
                ...goal,
                subtasks,
            });

            toast.success("Goal breakdown regenerated!");
        } catch (error) {
            toast.error("Failed to regenerate goal breakdown");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Goal Breakdown</h2>
                {!isCreating && !goal && (
                    <button
                        onClick={handleCreateGoal}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Create New Goal
                    </button>
                )}
                {goal && (
                    <button
                        onClick={handleRegenerateBreakdown}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                    >
                        <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Regenerate Breakdown
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="space-y-6">
                    <div className="bg-secondary/30 rounded-lg p-6 space-y-4">
                        <h3 className="text-xl font-medium">Create New Goal</h3>
                        <p className="text-muted-foreground">
                            Enter your goal details and we'll help break it down into manageable steps.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">
                                    Goal Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    placeholder="E.g., Complete research paper"
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    value={newGoal.description}
                                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                    placeholder="Add more details about your goal..."
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                                        Due Date (Optional)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="date"
                                            id="dueDate"
                                            value={newGoal.dueDate}
                                            onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium mb-1">
                                        Category (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="category"
                                        value={newGoal.category}
                                        onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                        placeholder="E.g., Work, School, Personal"
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Complexity
                                </label>
                                <div className="flex gap-3">
                                    {["low", "medium", "high"].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setNewGoal({ ...newGoal, complexity: level as "low" | "medium" | "high" })}
                                            className={`flex-1 py-2 rounded-lg border-2 text-center capitalize ${newGoal.complexity === level
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={handleCancelCreate}
                                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateBreakdown}
                                disabled={loading}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                {loading && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
                                Generate Breakdown
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {goal && (
                <div className="space-y-6">
                    <div className="bg-secondary/30 rounded-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-xl font-medium">{goal.title}</h3>
                                {goal.description && (
                                    <p className="text-muted-foreground mt-1">{goal.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                    {goal.dueDate && (
                                        <div className="flex items-center gap-1 text-sm">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {goal.category && (
                                        <div className="text-sm px-2 py-0.5 rounded-full bg-secondary">
                                            {goal.category}
                                        </div>
                                    )}
                                    <div className="text-sm flex items-center gap-1">
                                        <span className="font-medium">Complexity:</span>
                                        <span className="capitalize">{goal.complexity}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {goal.subtasks.filter(s => s.completed).length} of {goal.subtasks.length} completed
                                </span>
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-success rounded-full"
                                        style={{
                                            width: `${(goal.subtasks.filter(s => s.completed).length / goal.subtasks.length) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <h4 className="font-medium mb-4">Subtasks</h4>
                        <div className="space-y-3">
                            {goal.subtasks.map((subtask) => (
                                <div
                                    key={subtask.id}
                                    className={`p-3 rounded-lg border ${subtask.completed ? "bg-muted/50" : "bg-card"
                                        }`}
                                >
                                    {editingSubtask === subtask.id ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={subtask.title}
                                                onChange={(e) =>
                                                    handleUpdateSubtask(subtask.id, { title: e.target.value })
                                                }
                                                placeholder="Task title"
                                                className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                            />
                                            <div className="flex flex-col md:flex-row gap-3">
                                                <div className="flex-1">
                                                    <label className="text-xs text-muted-foreground">
                                                        Estimated Duration
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={subtask.estimatedDuration}
                                                        onChange={(e) =>
                                                            handleUpdateSubtask(subtask.id, {
                                                                estimatedDuration: e.target.value,
                                                            })
                                                        }
                                                        placeholder="e.g., 2 hours"
                                                        className="w-full mt-1 px-3 py-1 text-sm rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-muted-foreground">
                                                        Due Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={subtask.dueDate || ""}
                                                        onChange={(e) =>
                                                            handleUpdateSubtask(subtask.id, {
                                                                dueDate: e.target.value,
                                                            })
                                                        }
                                                        className="w-full mt-1 px-3 py-1 text-sm rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteSubtask(subtask.id)}
                                                    className="px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => setEditingSubtask(null)}
                                                    className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3">
                                            <button
                                                onClick={() => handleToggleSubtask(subtask.id)}
                                                className="mt-0.5 flex-shrink-0"
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${subtask.completed
                                                            ? "bg-primary border-primary"
                                                            : "border-muted-foreground"
                                                        }`}
                                                >
                                                    {subtask.completed && (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="w-3 h-3 text-primary-foreground"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p
                                                        className={`font-medium ${subtask.completed ? "line-through text-muted-foreground" : ""
                                                            }`}
                                                    >
                                                        {subtask.title}
                                                    </p>
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => setEditingSubtask(subtask.id)}
                                                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                className="w-4 h-4"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                {subtask.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {subtask.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center flex-wrap gap-3 mt-2">
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>{subtask.estimatedDuration}</span>
                                                    </div>

                                                    {subtask.dueDate && (
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                            <span>
                                                                {new Date(subtask.dueDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={handleAddSubtask}
                                className="w-full p-3 border border-dashed border-muted-foreground/30 rounded-lg text-muted-foreground hover:text-primary hover:border-primary flex items-center justify-center gap-2 transition-colors"
                            >
                                <PlusIcon className="h-5 w-5" />
                                <span>Add Custom Subtask</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isCreating && !goal && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="w-8 h-8 text-primary"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Active Goals</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                        Break down your big goals into manageable steps with our AI task breakdown engine.
                    </p>
                    <button
                        onClick={handleCreateGoal}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Create a Goal
                    </button>
                </div>
            )}
        </div>
    );
} 