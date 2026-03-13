import Link from "next/link";

export default function SetupCompletePage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-emerald-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4 12 14.01l-3-3" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-3">Your Company is Set Up!</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        Your tasks, milestones, and documents have been created. Let&apos;s start
        building your business.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-2xl font-bold text-primary">Tasks</p>
          <p className="text-sm text-muted-foreground">Registration checklist ready</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-2xl font-bold text-violet-500">4 Agents</p>
          <p className="text-sm text-muted-foreground">AI team ready to help</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-2xl font-bold text-amber-500">Roadmap</p>
          <p className="text-sm text-muted-foreground">Journey milestones set</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/tasks"
          className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
        >
          View Tasks
        </Link>
        <Link
          href="/agents"
          className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
        >
          Meet Your AI Team
        </Link>
      </div>
    </div>
  );
}
