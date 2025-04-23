import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Lock, Zap, Activity, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 px-4 md:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to <span className="text-primary">Asma's Smart Home</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Control your home from anywhere in the world with our intuitive smart home solution.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-6">
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6">
              <Link href="/login">
                Login
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Smart Features for Your Home</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Remote Access</h3>
              <p className="text-muted-foreground">
                Control your home from anywhere using our secure mobile app.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Security</h3>
              <p className="text-muted-foreground">
                Manage your door locks and monitor entry points remotely.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Energy Control</h3>
              <p className="text-muted-foreground">
                Optimize energy usage and control electricity to save costs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Motion Detection</h3>
              <p className="text-muted-foreground">
                Get real-time alerts when motion is detected in your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make Your Home Smarter?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of homeowners who have transformed their living experience with Asma Smart Home.
          </p>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link href="/signup">
              Get Started Now
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}