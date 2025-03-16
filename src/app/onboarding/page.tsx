"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

// Onboarding steps
const STEPS = [
    {
        id: "welcome",
        title: "Welcome to FocusFlow",
        description: "Your personalized ADHD assistant for focus, planning, and accountability.",
    },
    {
        id: "mode",
        title: "Choose Your Mode",
        description: "Select the approach that works best for you.",
    },
    {
        id: "preferences",
        title: "Set Your Preferences",
        description: "Help us tailor the experience to your needs.",
    },
    {
        id: "complete",
        title: "You're All Set!",
        description: "Your personalized ADHD assistant is ready to go.",
    },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [userPreferences, setUserPreferences] = useState({
        mode: "",
        reminderStyle: "",
        reminderFrequency: "",
        struggleAreas: [] as string[],
    });

    const step = STEPS[currentStep];

    const handleNextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updatePreference = (key: string, value: string | string[]) => {
        setUserPreferences({
            ...userPreferences,
            [key]: value,
        });
    };

    const toggleStruggleArea = (area: string) => {
        const currentAreas = userPreferences.struggleAreas;
        const updatedAreas = currentAreas.includes(area)
            ? currentAreas.filter(a => a !== area)
            : [...currentAreas, area];

        updatePreference("struggleAreas", updatedAreas);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Progress bar */}
            <div className="w-full bg-muted h-2">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                />
            </div>

            {/* Step indicator */}
            <div className="py-4 px-6 border-b">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <p className="text-sm font-medium">
                        Step {currentStep + 1} of {STEPS.length}
                    </p>
                    <div className="flex gap-2">
                        {STEPS.map((s, index) => (
                            <div
                                key={s.id}
                                className={`w-2 h-2 rounded-full ${index <= currentStep ? 'bg-primary' : 'bg-muted'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 flex flex-col p-6">
                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">{step.title}</h1>
                    <p className="text-xl text-muted-foreground mb-10">{step.description}</p>

                    {/* Step content */}
                    <div className="flex-1">
                        {currentStep === 0 && (
                            <div className="flex flex-col items-center justify-center space-y-8 py-12">
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-primary text-4xl font-bold">F</span>
                                </div>
                                <div className="text-center max-w-lg">
                                    <h2 className="text-2xl font-semibold mb-4">Let's customize your experience</h2>
                                    <p className="text-muted-foreground">
                                        We'll ask you a few quick questions to tailor the app to your needs.
                                        This will only take about 2 minutes, and you can always change your preferences later.
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-8 max-w-lg mx-auto">
                                <h2 className="text-2xl font-semibold">What mode would you prefer?</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        className={`p-6 rounded-lg border-2 text-left ${userPreferences.mode === "adhd"
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                            }`}
                                        onClick={() => updatePreference("mode", "adhd")}
                                    >
                                        <h3 className="text-xl font-medium mb-2">ADHD Mode</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Designed specifically for ADHD brains with more reminders,
                                            smaller task breakdowns, and extra accountability features.
                                        </p>
                                    </button>

                                    <button
                                        className={`p-6 rounded-lg border-2 text-left ${userPreferences.mode === "general"
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                            }`}
                                        onClick={() => updatePreference("mode", "general")}
                                    >
                                        <h3 className="text-xl font-medium mb-2">General Mode</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Standard productivity features with task management,
                                            goal setting, and moderate reminders.
                                        </p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-8 max-w-lg mx-auto">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">What kind of reminders do you prefer?</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <button
                                            className={`p-4 rounded-lg border-2 text-left ${userPreferences.reminderStyle === "gentle"
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                            onClick={() => updatePreference("reminderStyle", "gentle")}
                                        >
                                            <h3 className="text-lg font-medium mb-2">Gentle Nudges</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Supportive and encouraging reminders.
                                            </p>
                                        </button>

                                        <button
                                            className={`p-4 rounded-lg border-2 text-left ${userPreferences.reminderStyle === "firm"
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                            onClick={() => updatePreference("reminderStyle", "firm")}
                                        >
                                            <h3 className="text-lg font-medium mb-2">Firm Coaching</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Direct and action-oriented reminders.
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">How often would you like check-ins?</h2>

                                    <div className="flex flex-col gap-3 mb-8">
                                        {["frequent", "moderate", "minimal"].map((frequency) => (
                                            <button
                                                key={frequency}
                                                className={`p-4 rounded-lg border-2 text-left ${userPreferences.reminderFrequency === frequency
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                                onClick={() => updatePreference("reminderFrequency", frequency)}
                                            >
                                                <h3 className="text-lg font-medium capitalize">{frequency}</h3>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">Which areas do you struggle with?</h2>
                                    <p className="text-muted-foreground mb-4">Select all that apply</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            "Starting tasks",
                                            "Time management",
                                            "Maintaining focus",
                                            "Completing projects",
                                            "Remembering deadlines",
                                            "Organizing thoughts"
                                        ].map((area) => (
                                            <button
                                                key={area}
                                                className={`p-4 rounded-lg border-2 text-left ${userPreferences.struggleAreas.includes(area)
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                                onClick={() => toggleStruggleArea(area)}
                                            >
                                                {area}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                <h2 className="text-2xl font-semibold mb-3">Your personalized experience is ready!</h2>
                                <p className="text-muted-foreground max-w-md mb-8">
                                    We've set up your preferences based on your answers. You can always change these later in your settings.
                                </p>

                                <Link
                                    href="/dashboard"
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Go to Dashboard
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Navigation buttons */}
                    {currentStep < 3 && (
                        <div className="pt-8 flex justify-between">
                            <button
                                onClick={handlePreviousStep}
                                disabled={currentStep === 0}
                                className={`px-4 py-2 flex items-center gap-2 rounded-full transition-colors ${currentStep === 0
                                    ? 'text-muted-foreground opacity-50'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                Back
                            </button>

                            <button
                                onClick={handleNextStep}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                Continue
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 