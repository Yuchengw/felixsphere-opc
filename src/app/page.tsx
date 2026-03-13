import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                F
              </span>
            </div>
            <span className="font-bold text-lg">FelixSphere</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full" />
            Built for solo founders worldwide
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            Build Your
            <br />
            <span className="text-primary">One Person Company</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-xl">
            The all-in-one platform to start, register, and grow your company.
            From formation to first sale, with AI-powered team agents that work
            alongside you.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start Free
            </Link>
            <Link
              href="#features"
              className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
            >
              See Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything You Need to Launch
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            From company registration to your first customer, we guide you
            through every step.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 4V2m0 14v-2M8 9H6m12 0h-2M12 9a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Setup Wizard</h3>
              <p className="text-muted-foreground">
                Step-by-step guidance to choose your jurisdiction, entity type,
                and register your company in any supported country.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-violet-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">AI Team Agents</h3>
              <p className="text-muted-foreground">
                Four AI agents — Sales, Marketing, PM, and Coder — that
                understand your business and provide tailored advice.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Progress Roadmap</h3>
              <p className="text-muted-foreground">
                Visual roadmap with milestones, tasks, and progress tracking
                from formation to growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="border-t border-border bg-muted/50">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Global Coverage</h2>
          <p className="text-muted-foreground mb-8">
            Register your company in multiple jurisdictions
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-4xl">
            <span title="United States">&#127482;&#127480;</span>
            <span title="United Kingdom">&#127468;&#127463;</span>
            <span title="India">&#127470;&#127475;</span>
            <span title="Singapore">&#127480;&#127468;</span>
            <span title="Germany">&#127465;&#127466;</span>
            <span className="text-muted-foreground text-lg self-center">
              + more coming
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Company?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join solo founders worldwide who are building their one-person
            companies with FelixSphere.
          </p>
          <Link
            href="/register"
            className="inline-flex bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                F
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              FelixSphere OPC
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 FelixSphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
