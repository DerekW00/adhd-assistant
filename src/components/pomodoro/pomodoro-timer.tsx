"use client";

import { useState, useEffect, useRef } from "react";
import { PlayIcon, PauseIcon, ForwardIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";

interface PomodoroTimerProps {
    onSessionComplete?: (sessionType: "work" | "break", duration: number) => void;
    defaultWorkMinutes?: number;
    defaultBreakMinutes?: number;
    defaultLongBreakMinutes?: number;
    sessionsBeforeLongBreak?: number;
}

export default function PomodoroTimer({
    onSessionComplete,
    defaultWorkMinutes = 25,
    defaultBreakMinutes = 5,
    defaultLongBreakMinutes = 15,
    sessionsBeforeLongBreak = 4,
}: PomodoroTimerProps) {
    // Timer settings
    const [workMinutes, setWorkMinutes] = useState(defaultWorkMinutes);
    const [breakMinutes, setBreakMinutes] = useState(defaultBreakMinutes);
    const [longBreakMinutes, setLongBreakMinutes] = useState(defaultLongBreakMinutes);

    // Timer state
    const [timerMode, setTimerMode] = useState<"work" | "break" | "longBreak">("work");
    const [isRunning, setIsRunning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(workMinutes * 60);
    const [sessionCount, setSessionCount] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    // Audio references
    const workCompleteSound = useRef<HTMLAudioElement | null>(null);
    const breakCompleteSound = useRef<HTMLAudioElement | null>(null);

    // Timer interval reference
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Set up audio elements
    useEffect(() => {
        workCompleteSound.current = new Audio("/sounds/work-complete.mp3");
        breakCompleteSound.current = new Audio("/sounds/break-complete.mp3");

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Update timer when settings change
    useEffect(() => {
        const duration =
            timerMode === "work"
                ? workMinutes * 60
                : timerMode === "break"
                    ? breakMinutes * 60
                    : longBreakMinutes * 60;

        setTimeRemaining(duration);

        if (timerRef.current) {
            clearInterval(timerRef.current);
            setIsRunning(false);
        }
    }, [workMinutes, breakMinutes, longBreakMinutes, timerMode]);

    // Main timer logic
    useEffect(() => {
        if (!isRunning) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    // Timer complete
                    handleTimerComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning]);

    // Handle timer completion
    const handleTimerComplete = () => {
        setIsRunning(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Play sound based on which timer finished
        if (timerMode === "work") {
            workCompleteSound.current?.play().catch(() => { });

            // Update session count
            const newSessionCount = sessionCount + 1;
            setSessionCount(newSessionCount);

            // Determine if it's time for a long break
            if (newSessionCount % sessionsBeforeLongBreak === 0) {
                setTimerMode("longBreak");
                setTimeRemaining(longBreakMinutes * 60);
                toast.success(`Work session complete! Time for a longer ${longBreakMinutes}-minute break.`);
            } else {
                setTimerMode("break");
                setTimeRemaining(breakMinutes * 60);
                toast.success(`Work session complete! Time for a ${breakMinutes}-minute break.`);
            }

            if (onSessionComplete) {
                onSessionComplete("work", workMinutes);
            }
        } else {
            // Break is complete, switch to work mode
            breakCompleteSound.current?.play().catch(() => { });
            setTimerMode("work");
            setTimeRemaining(workMinutes * 60);
            toast.success("Break complete! Ready to focus again?");

            if (onSessionComplete) {
                onSessionComplete("break", timerMode === "break" ? breakMinutes : longBreakMinutes);
            }
        }
    };

    // Toggle timer running state
    const toggleTimer = () => {
        setIsRunning(!isRunning);

        if (!isRunning) {
            toast.info(
                timerMode === "work"
                    ? "Focus time started. You've got this!"
                    : "Break time started. Take a moment to recharge."
            );
        }
    };

    // Skip to the next timer
    const skipToNext = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setIsRunning(false);

        if (timerMode === "work") {
            // Skip to break
            if ((sessionCount + 1) % sessionsBeforeLongBreak === 0) {
                setTimerMode("longBreak");
                setTimeRemaining(longBreakMinutes * 60);
                toast.info(`Skipped to long break (${longBreakMinutes} min)`);
            } else {
                setTimerMode("break");
                setTimeRemaining(breakMinutes * 60);
                toast.info(`Skipped to break (${breakMinutes} min)`);
            }

            // Since we're manually skipping, increment session count
            setSessionCount(sessionCount + 1);
        } else {
            // Skip to work
            setTimerMode("work");
            setTimeRemaining(workMinutes * 60);
            toast.info(`Skipped to work session (${workMinutes} min)`);
        }
    };

    // Reset timer completely
    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setIsRunning(false);
        setTimerMode("work");
        setTimeRemaining(workMinutes * 60);
        setSessionCount(0);
        toast.info("Timer reset");
    };

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Get display color based on timer mode
    const getTimerColor = () => {
        switch (timerMode) {
            case "work":
                return "text-primary border-primary";
            case "break":
                return "text-success border-success";
            case "longBreak":
                return "text-accent border-accent";
        }
    };

    // Get background color class based on timer mode
    const getBackgroundColor = () => {
        switch (timerMode) {
            case "work":
                return "bg-primary/10";
            case "break":
                return "bg-success/10";
            case "longBreak":
                return "bg-accent/10";
        }
    };

    // Calculate progress percentage
    const calculateProgress = () => {
        const totalSeconds =
            timerMode === "work"
                ? workMinutes * 60
                : timerMode === "break"
                    ? breakMinutes * 60
                    : longBreakMinutes * 60;

        return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
    };

    return (
        <div className="rounded-xl shadow-sm border p-6">
            <div className="flex flex-col items-center">
                {/* Timer label */}
                <div className="flex justify-between items-center w-full mb-4">
                    <h2 className="text-xl font-semibold">
                        {timerMode === "work"
                            ? "Focus Time"
                            : timerMode === "break"
                                ? "Short Break"
                                : "Long Break"}
                    </h2>

                    <div className="flex items-center gap-1">
                        <div className="text-sm text-muted-foreground">
                            Session {sessionCount}
                        </div>

                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="ml-2 p-2 hover:bg-muted rounded-full transition-colors"
                            aria-label="Settings"
                            title="Settings"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-muted-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Settings panel */}
                {showSettings && (
                    <div className="w-full mb-6 p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-3">Timer Settings</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Work Duration (min)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={workMinutes}
                                    onChange={(e) => setWorkMinutes(parseInt(e.target.value) || defaultWorkMinutes)}
                                    className="w-full px-3 py-1 rounded border focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Break Duration (min)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={breakMinutes}
                                    onChange={(e) => setBreakMinutes(parseInt(e.target.value) || defaultBreakMinutes)}
                                    className="w-full px-3 py-1 rounded border focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Long Break Duration (min)
                                </label>
                                <input
                                    type="number"
                                    min="5"
                                    max="60"
                                    value={longBreakMinutes}
                                    onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || defaultLongBreakMinutes)}
                                    className="w-full px-3 py-1 rounded border focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="text-xs text-muted-foreground mt-3">
                            A long break will be taken after every {sessionsBeforeLongBreak} work sessions.
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                )}

                {/* Timer display */}
                <div className="relative mb-8">
                    <div
                        className={`w-48 h-48 rounded-full flex items-center justify-center border-4 ${getTimerColor()} ${getBackgroundColor()}`}
                    >
                        <div className="text-4xl font-bold">
                            {formatTime(timeRemaining)}
                        </div>
                    </div>

                    {/* Progress circle */}
                    <svg
                        className="absolute top-0 left-0"
                        width="192"
                        height="192"
                        viewBox="0 0 192 192"
                    >
                        <circle
                            className={timerMode === "work" ? "text-primary" : timerMode === "break" ? "text-success" : "text-accent"}
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            r="94"
                            cx="96"
                            cy="96"
                            strokeDasharray={`${2 * Math.PI * 94}`}
                            strokeDashoffset={`${2 * Math.PI * 94 * (1 - calculateProgress() / 100)}`}
                            transform="rotate(-90 96 96)"
                        />
                    </svg>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-4 mb-6">
                    <button
                        onClick={resetTimer}
                        className="p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Reset timer"
                        title="Reset timer"
                    >
                        <ArrowPathIcon className="h-6 w-6" />
                    </button>

                    <button
                        onClick={toggleTimer}
                        className={`p-4 rounded-full ${isRunning ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"} hover:opacity-90 transition-colors`}
                        aria-label={isRunning ? "Pause timer" : "Start timer"}
                        title={isRunning ? "Pause timer" : "Start timer"}
                    >
                        {isRunning ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                    </button>

                    <button
                        onClick={skipToNext}
                        className="p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Skip to next"
                        title="Skip to next"
                    >
                        <ForwardIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Timer info */}
                <div className="text-sm text-muted-foreground flex gap-4">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span>Work: {workMinutes}min</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span>Break: {breakMinutes}min</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <span>Long: {longBreakMinutes}min</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 