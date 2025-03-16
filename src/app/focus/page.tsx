"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import { FireIcon, MoonIcon, BeakerIcon } from "@heroicons/react/24/solid";
import PomodoroTimer from "@/components/pomodoro/pomodoro-timer";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { format } from "date-fns";

// Focus aid types
type NoiseType = "white" | "brown" | "pink" | "rain" | "cafe" | "nature";
type VisualType = "none" | "breathing" | "particles" | "gentle-waves";

// Focus session history entry
interface FocusSession {
    date: Date;
    duration: number;
    type: "work" | "break";
}

export default function FocusPage() {
    // Session history state
    const [sessionHistory, setSessionHistory] = useState<FocusSession[]>([]);

    // Focus aid states
    const [activeNoise, setActiveNoise] = useState<NoiseType | null>(null);
    const [activeVisual, setActiveVisual] = useState<VisualType>("none");
    const [noiseVolume, setNoiseVolume] = useState(50);

    // Handle completion of a pomodoro session
    const handleSessionComplete = (type: "work" | "break", duration: number) => {
        const newSession: FocusSession = {
            date: new Date(),
            duration,
            type,
        };
        setSessionHistory([newSession, ...sessionHistory].slice(0, 10)); // Keep last 10 sessions
    };

    // Toggle ambient noise
    const toggleNoise = (type: NoiseType) => {
        if (activeNoise === type) {
            setActiveNoise(null);
        } else {
            setActiveNoise(type);
        }
    };

    // Toggle visual aid
    const selectVisual = (type: VisualType) => {
        setActiveVisual(type);
    };

    // Calculate total focus time today
    const getTodaysFocusTime = () => {
        const today = new Date();
        const todaySessions = sessionHistory.filter(
            (session) =>
                session.date.getDate() === today.getDate() &&
                session.date.getMonth() === today.getMonth() &&
                session.date.getFullYear() === today.getFullYear() &&
                session.type === "work"
        );

        return todaySessions.reduce((total, session) => total + session.duration, 0);
    };

    return (
        <DashboardShell title="Focus Mode" subtitle="Stay focused and productive">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Timer */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">Pomodoro Timer</h2>
                        <p className="text-muted-foreground">
                            Using timed work sessions can help maintain focus for ADHD. The
                            Pomodoro technique uses 25-minute sessions followed by short breaks.
                        </p>
                    </div>

                    <PomodoroTimer onSessionComplete={handleSessionComplete} />

                    {/* Visual aid display */}
                    {activeVisual !== "none" && (
                        <div className="mt-6 h-40 rounded-lg border overflow-hidden">
                            <div
                                className={`w-full h-full flex items-center justify-center ${activeVisual === "breathing" ? "breathing-animation bg-primary/10" :
                                        activeVisual === "particles" ? "particles-bg" :
                                            activeVisual === "gentle-waves" ? "waves-bg" : ""
                                    }`}
                            >
                                {activeVisual === "breathing" && (
                                    <div className="text-center text-lg font-medium text-primary">
                                        Breathe in... and out...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column - Focus aids */}
                <div>
                    <div className="rounded-xl border shadow-sm">
                        <Tab.Group>
                            <Tab.List className="flex rounded-t-xl bg-muted">
                                <Tab className={({ selected }) =>
                                    `flex-1 py-2.5 text-sm font-medium leading-5 rounded-tl-xl
                  ${selected ? 'bg-background text-primary' : 'text-muted-foreground hover:bg-muted/80'}`
                                }>
                                    <div className="flex justify-center items-center gap-1.5">
                                        <MoonIcon className="h-4 w-4" />
                                        <span>Ambient</span>
                                    </div>
                                </Tab>
                                <Tab className={({ selected }) =>
                                    `flex-1 py-2.5 text-sm font-medium leading-5
                  ${selected ? 'bg-background text-primary' : 'text-muted-foreground hover:bg-muted/80'}`
                                }>
                                    <div className="flex justify-center items-center gap-1.5">
                                        <FireIcon className="h-4 w-4" />
                                        <span>Visual</span>
                                    </div>
                                </Tab>
                                <Tab className={({ selected }) =>
                                    `flex-1 py-2.5 text-sm font-medium leading-5 rounded-tr-xl
                  ${selected ? 'bg-background text-primary' : 'text-muted-foreground hover:bg-muted/80'}`
                                }>
                                    <div className="flex justify-center items-center gap-1.5">
                                        <BeakerIcon className="h-4 w-4" />
                                        <span>Stats</span>
                                    </div>
                                </Tab>
                            </Tab.List>
                            <Tab.Panels className="p-4">
                                {/* Ambient Sounds */}
                                <Tab.Panel>
                                    <div className="mb-4">
                                        <label htmlFor="volume" className="block text-sm font-medium mb-1">
                                            Volume
                                        </label>
                                        <input
                                            id="volume"
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={noiseVolume}
                                            onChange={(e) => setNoiseVolume(parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            disabled={activeNoise === null}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { type: "white", label: "White Noise" },
                                            { type: "brown", label: "Brown Noise" },
                                            { type: "pink", label: "Pink Noise" },
                                            { type: "rain", label: "Rain Sounds" },
                                            { type: "cafe", label: "Cafe Ambience" },
                                            { type: "nature", label: "Nature Sounds" },
                                        ].map((noise) => (
                                            <button
                                                key={noise.type}
                                                onClick={() => toggleNoise(noise.type as NoiseType)}
                                                className={`p-3 rounded-lg text-sm ${activeNoise === noise.type
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted hover:bg-muted/80"
                                                    }`}
                                            >
                                                {noise.label}
                                            </button>
                                        ))}
                                    </div>
                                </Tab.Panel>

                                {/* Visual Aids */}
                                <Tab.Panel>
                                    <div className="space-y-4">
                                        <div className="text-sm text-muted-foreground mb-2">
                                            Visual aids can help maintain attention and reduce distractions.
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { type: "none", label: "None" },
                                                { type: "breathing", label: "Breathing Guide" },
                                                { type: "particles", label: "Gentle Particles" },
                                                { type: "gentle-waves", label: "Gentle Waves" },
                                            ].map((visual) => (
                                                <button
                                                    key={visual.type}
                                                    onClick={() => selectVisual(visual.type as VisualType)}
                                                    className={`p-3 rounded-lg text-sm ${activeVisual === visual.type
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted hover:bg-muted/80"
                                                        }`}
                                                >
                                                    {visual.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="p-3 rounded-lg bg-muted/50 text-sm mt-4">
                                            <p className="font-medium">Visual Focus Tips</p>
                                            <ul className="list-disc list-inside mt-2 text-muted-foreground">
                                                <li>Change your environment when stuck</li>
                                                <li>Remove visual clutter from workspace</li>
                                                <li>Use noise-cancelling headphones</li>
                                                <li>Try different visual aids to find what works</li>
                                            </ul>
                                        </div>
                                    </div>
                                </Tab.Panel>

                                {/* Stats */}
                                <Tab.Panel>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg bg-primary/10 flex flex-col items-center">
                                            <div className="text-sm text-muted-foreground">Today's Focus Time</div>
                                            <div className="text-3xl font-bold text-primary">
                                                {getTodaysFocusTime()} minutes
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-medium">Recent Sessions</h3>
                                            {sessionHistory.length === 0 ? (
                                                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                                    No focus sessions recorded yet. Complete a timer session to track your progress.
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {sessionHistory.slice(0, 5).map((session, i) => (
                                                        <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-muted/50 text-sm">
                                                            <div className="flex items-center">
                                                                <div className={`w-2 h-2 rounded-full mr-2 ${session.type === "work" ? "bg-primary" : "bg-success"}`} />
                                                                <span>{session.type === "work" ? "Work" : "Break"} - {session.duration} min</span>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {format(session.date, "h:mm a")}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>

                    <div className="mt-6 p-4 rounded-lg border bg-muted/20">
                        <h3 className="font-medium mb-2">ADHD Focus Tips</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">1</div>
                                <span>Break large tasks into smaller, manageable pieces</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">2</div>
                                <span>Use the Pomodoro technique to maintain focus</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">3</div>
                                <span>Remove distractions from your environment</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">4</div>
                                <span>Use ambient noise to mask distracting sounds</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">5</div>
                                <span>Take regular breaks to prevent mental fatigue</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* CSS for visual effects */}
            <style jsx>{`
        .breathing-animation {
          animation: breathe 5s infinite ease-in-out;
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        .particles-bg, .waves-bg {
          position: relative;
          overflow: hidden;
          background-color: #f5f8ff;
        }
      `}</style>
        </DashboardShell>
    );
} 