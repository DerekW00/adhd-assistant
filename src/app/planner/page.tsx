"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { CheckCircleIcon, PlusIcon, TrashIcon, PencilIcon, ClockIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";

interface ScheduledTask {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    completed: boolean;
    category?: string;
    energyLevel: 1 | 2 | 3 | 4 | 5;
}

// Sample data
const initialTasks: ScheduledTask[] = [
    {
        id: "1",
        title: "Morning planning session",
        description: "Review goals and set priorities for the day",
        startTime: "08:00",
        endTime: "08:30",
        completed: true,
        category: "Planning",
        energyLevel: 3,
    },
    {
        id: "2",
        title: "Work on research paper",
        description: "Focus on writing the introduction section",
        startTime: "09:00",
        endTime: "10:30",
        completed: false,
        category: "Deep Work",
        energyLevel: 4,
    },
    {
        id: "3",
        title: "Email responses",
        description: "Reply to pending emails from yesterday",
        startTime: "11:00",
        endTime: "12:00",
        completed: false,
        category: "Communication",
        energyLevel: 3,
    },
    {
        id: "4",
        title: "Lunch break + short walk",
        description: "Take time to eat and refresh",
        startTime: "12:00",
        endTime: "13:00",
        completed: false,
        category: "Break",
        energyLevel: 1,
    },
    {
        id: "5",
        title: "Project review meeting",
        description: "Weekly check-in with the team",
        startTime: "14:00",
        endTime: "15:00",
        completed: false,
        category: "Meeting",
        energyLevel: 3,
    },
    {
        id: "6",
        title: "Administrative tasks",
        description: "Update logs and fill out forms",
        startTime: "15:30",
        endTime: "16:30",
        completed: false,
        category: "Admin",
        energyLevel: 2,
    },
];

// Time slots for the day (24-hour format)
const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8; // Start at 8 AM
    return `${hour.toString().padStart(2, "0")}:00`;
});

export default function PlannerPage() {
    const [tasks, setTasks] = useState<ScheduledTask[]>(initialTasks);
    const [currentEnergyLevel, setCurrentEnergyLevel] = useState<number>(4);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isEditingTask, setIsEditingTask] = useState<string | null>(null);
    const [newTask, setNewTask] = useState<Partial<ScheduledTask>>({
        title: "",
        description: "",
        startTime: "09:00",
        endTime: "10:00",
        category: "",
        energyLevel: 3,
        completed: false,
    });

    const handleToggleTask = (taskId: string) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
        ));

        const task = tasks.find(t => t.id === taskId);
        if (task) {
            toast.success(
                task.completed ? "Task marked as incomplete" : "Task completed! Great job!"
            );
        }
    };

    const handleAddTask = () => {
        if (!newTask.title || !newTask.startTime || !newTask.endTime) {
            toast.error("Please fill in all required fields");
            return;
        }

        const task: ScheduledTask = {
            id: crypto.randomUUID(),
            title: newTask.title as string,
            description: newTask.description,
            startTime: newTask.startTime as string,
            endTime: newTask.endTime as string,
            category: newTask.category,
            energyLevel: (newTask.energyLevel || 3) as 1 | 2 | 3 | 4 | 5,
            completed: false,
        };

        setTasks([...tasks, task].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
        ));

        setNewTask({
            title: "",
            description: "",
            startTime: "09:00",
            endTime: "10:00",
            category: "",
            energyLevel: 3,
        });

        setIsAddingTask(false);
        toast.success("Task added to your schedule");
    };

    const handleUpdateTask = () => {
        if (!isEditingTask) return;

        if (!newTask.title || !newTask.startTime || !newTask.endTime) {
            toast.error("Please fill in all required fields");
            return;
        }

        setTasks(tasks.map(task =>
            task.id === isEditingTask
                ? {
                    ...task,
                    title: newTask.title as string,
                    description: newTask.description,
                    startTime: newTask.startTime as string,
                    endTime: newTask.endTime as string,
                    category: newTask.category,
                    energyLevel: (newTask.energyLevel || task.energyLevel) as 1 | 2 | 3 | 4 | 5,
                }
                : task
        ).sort((a, b) => a.startTime.localeCompare(b.startTime)));

        setNewTask({
            title: "",
            description: "",
            startTime: "09:00",
            endTime: "10:00",
            category: "",
            energyLevel: 3,
        });

        setIsEditingTask(null);
        toast.success("Task updated");
    };

    const handleEditTask = (task: ScheduledTask) => {
        setNewTask({
            title: task.title,
            description: task.description,
            startTime: task.startTime,
            endTime: task.endTime,
            category: task.category,
            energyLevel: task.energyLevel,
        });

        setIsEditingTask(task.id);
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));

        if (isEditingTask === taskId) {
            setIsEditingTask(null);
            setNewTask({
                title: "",
                description: "",
                startTime: "09:00",
                endTime: "10:00",
                category: "",
                energyLevel: 3,
            });
        }

        toast.success("Task removed from schedule");
    };

    const handleCancelEdit = () => {
        setIsEditingTask(null);
        setNewTask({
            title: "",
            description: "",
            startTime: "09:00",
            endTime: "10:00",
            category: "",
            energyLevel: 3,
        });
    };

    const getMatchingEnergyTasks = () => {
        return tasks.filter(task =>
            !task.completed &&
            task.energyLevel <= currentEnergyLevel
        ).length;
    };

    // Get tasks for a specific time slot
    const getTasksForTimeSlot = (timeSlot: string) => {
        return tasks.filter(task => {
            const taskStart = task.startTime;
            const taskEnd = task.endTime;

            // Check if this task overlaps with the current time slot
            return taskStart <= timeSlot && taskEnd > timeSlot;
        });
    };

    // Function to determine if a task should be visible based on current energy levels
    const isTaskEnergyAppropriate = (task: ScheduledTask) => {
        // If task energy level is higher than current energy, it might be too demanding
        return task.energyLevel <= currentEnergyLevel;
    };

    // Get recommended task based on energy level
    const getRecommendedTask = () => {
        const incompleteTasks = tasks.filter(task => !task.completed);
        if (incompleteTasks.length === 0) return null;

        // Find tasks that match current energy level
        const matchingEnergyTasks = incompleteTasks.filter(task =>
            task.energyLevel <= currentEnergyLevel
        );

        if (matchingEnergyTasks.length === 0) {
            // If no tasks match, suggest the lowest energy task available
            return incompleteTasks.sort((a, b) => a.energyLevel - b.energyLevel)[0];
        }

        // Return first task with matching energy level
        return matchingEnergyTasks[0];
    };

    const recommendedTask = getRecommendedTask();

    return (
        <DashboardLayout>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Daily Planner</h1>
                        <p className="text-muted-foreground mt-2">
                            Schedule your day based on your energy levels and focus capacity.
                        </p>
                    </div>

                    {/* Energy Level Selector */}
                    <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">How's your energy today?</h2>
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Low Energy</span>
                                <span className="text-sm">High Energy</span>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setCurrentEnergyLevel(level)}
                                        className={`flex-1 h-10 rounded-full ${level === currentEnergyLevel
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary hover:bg-secondary/80'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {getMatchingEnergyTasks()} tasks match your current energy level.
                            </p>

                            {/* Energy-based recommendation */}
                            {recommendedTask && (
                                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-primary"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Recommended next task:</h3>
                                            <p className="text-primary">
                                                {recommendedTask.title} ({recommendedTask.startTime} - {recommendedTask.endTime})
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                This task matches your current energy level of {currentEnergyLevel}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Today's Schedule</h2>
                        {!isAddingTask && !isEditingTask && (
                            <button
                                onClick={() => setIsAddingTask(true)}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Add Task
                            </button>
                        )}
                    </div>

                    {/* Add/Edit Task Form */}
                    {(isAddingTask || isEditingTask) && (
                        <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-medium">
                                    {isEditingTask ? "Edit Task" : "Add New Task"}
                                </h3>
                                <button
                                    onClick={isEditingTask ? handleCancelEdit : () => setIsAddingTask(false)}
                                    className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                                        Task Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="E.g., Work on project presentation"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                                        Description (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="description"
                                        value={newTask.description || ""}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="Brief description of your task"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startTime" className="block text-sm font-medium mb-1">
                                            Start Time *
                                        </label>
                                        <input
                                            type="time"
                                            id="startTime"
                                            value={newTask.startTime}
                                            onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                                            End Time *
                                        </label>
                                        <input
                                            type="time"
                                            id="endTime"
                                            value={newTask.endTime}
                                            onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium mb-1">
                                            Category (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            id="category"
                                            value={newTask.category || ""}
                                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:outline-none"
                                            placeholder="E.g., Work, Personal, Study"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Energy Level Required
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => setNewTask({ ...newTask, energyLevel: level as 1 | 2 | 3 | 4 | 5 })}
                                                    className={`flex-1 py-1 rounded-lg border-2 text-center ${newTask.energyLevel === level
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

                                <div className="pt-2 flex justify-end gap-2">
                                    {isEditingTask && (
                                        <button
                                            onClick={() => isEditingTask && handleDeleteTask(isEditingTask)}
                                            className="px-4 py-2 text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors flex items-center gap-1"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            Delete
                                        </button>
                                    )}

                                    <button
                                        onClick={isEditingTask ? handleUpdateTask : handleAddTask}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        {isEditingTask ? "Update Task" : "Add to Schedule"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Schedule timeline */}
                    <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
                        {timeSlots.map((timeSlot, index) => {
                            const tasksInSlot = getTasksForTimeSlot(timeSlot);
                            const isEmpty = tasksInSlot.length === 0;

                            return (
                                <div
                                    key={timeSlot}
                                    className={`flex border-b last:border-b-0 ${index % 2 === 0 ? "bg-card" : "bg-secondary/10"
                                        }`}
                                >
                                    {/* Time column */}
                                    <div className="w-20 px-4 py-3 border-r flex-shrink-0 flex items-start">
                                        <span className="text-sm font-medium">{timeSlot}</span>
                                    </div>

                                    {/* Tasks column */}
                                    <div className={`flex-1 p-2 ${isEmpty ? "flex items-center justify-center" : ""}`}>
                                        {isEmpty ? (
                                            <button
                                                onClick={() => {
                                                    setIsAddingTask(true);
                                                    setNewTask({
                                                        ...newTask,
                                                        startTime: timeSlot,
                                                        endTime: `${parseInt(timeSlot.split(":")[0]) + 1}:00`,
                                                    });
                                                }}
                                                className="text-sm text-muted-foreground hover:text-primary hover:underline"
                                            >
                                                + Add task at {timeSlot}
                                            </button>
                                        ) : (
                                            <div className="space-y-2">
                                                {tasksInSlot.map(task => (
                                                    <div
                                                        key={task.id}
                                                        className={`p-3 rounded-lg border ${task.completed
                                                                ? "bg-muted/50"
                                                                : isTaskEnergyAppropriate(task)
                                                                    ? "bg-primary/5 border-primary/20"
                                                                    : "bg-warning/5 border-warning/20"
                                                            }`}
                                                    >
                                                        <div className="flex items-start">
                                                            <button
                                                                onClick={() => handleToggleTask(task.id)}
                                                                className="mt-0.5 flex-shrink-0 mr-3"
                                                            >
                                                                {task.completed ? (
                                                                    <CheckCircleIcon className="h-5 w-5 text-success" />
                                                                ) : (
                                                                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground hover:border-primary" />
                                                                )}
                                                            </button>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div>
                                                                        <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                                                                            {task.title}
                                                                        </p>
                                                                        {task.description && (
                                                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                                                {task.description}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <button
                                                                        onClick={() => handleEditTask(task)}
                                                                        className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
                                                                    >
                                                                        <PencilIcon className="h-4 w-4" />
                                                                    </button>
                                                                </div>

                                                                <div className="flex items-center flex-wrap gap-2 mt-2">
                                                                    <div className="flex items-center gap-1 text-xs">
                                                                        <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                                        <span>{task.startTime} - {task.endTime}</span>
                                                                    </div>

                                                                    {task.category && (
                                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
                                                                            {task.category}
                                                                        </span>
                                                                    )}

                                                                    <div className="flex items-center gap-1 ml-auto">
                                                                        <span className="text-xs text-muted-foreground">Energy:</span>
                                                                        <div
                                                                            className={`flex h-4 ${!isTaskEnergyAppropriate(task) ? "opacity-60" : ""
                                                                                }`}
                                                                        >
                                                                            {[1, 2, 3, 4, 5].map(level => (
                                                                                <div
                                                                                    key={level}
                                                                                    className={`w-1.5 h-4 mx-px rounded-sm ${level <= task.energyLevel
                                                                                            ? "bg-primary"
                                                                                            : "bg-muted"
                                                                                        }`}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {!task.completed && !isTaskEnergyAppropriate(task) && (
                                                                    <div className="mt-2 text-xs text-warning flex items-center gap-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                        </svg>
                                                                        <span>This task may require more energy than you currently have</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 