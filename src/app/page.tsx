import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="w-full py-4 px-6 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">FocusFlow</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
          <Link href="#testimonials" className="hover:text-primary transition-colors">ADHD Support</Link>
        </nav>
        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Your Personalized ADHD Assistant
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Break down goals, build habits, and stay focused with AI-powered planning tailored to your ADHD brain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/onboarding"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              Start Your Free Trial <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="px-6 py-3 border border-primary text-primary rounded-full text-lg font-medium hover:bg-primary/10 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          {/* App Preview Mockup */}
          <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[500px] bg-secondary rounded-xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center text-2xl text-muted-foreground">
              App Preview Mockup
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Designed Specifically for ADHD Brains
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card p-6 rounded-lg shadow-sm card-hover">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Task Breakdown</h3>
                <p className="text-muted-foreground">
                  Turn overwhelming projects into manageable steps with our AI task breakdown engine.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card p-6 rounded-lg shadow-sm card-hover">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-accent text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Daily Planner</h3>
                <p className="text-muted-foreground">
                  Adaptive scheduling that adjusts to your energy levels and focus capacity each day.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card p-6 rounded-lg shadow-sm card-hover">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-success text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Accountability Check-ins</h3>
                <p className="text-muted-foreground">
                  Gentle or firm reminders based on your preferences to keep you on track.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who have improved their focus and achieved their goals.
            </p>
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Start Your Free 14-Day Trial <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-primary">FocusFlow</span>
            <p className="text-sm text-muted-foreground mt-1">
              Your personalized ADHD assistant
            </p>
          </div>

          <div className="flex gap-8">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
              Contact Us
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2024 FocusFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
