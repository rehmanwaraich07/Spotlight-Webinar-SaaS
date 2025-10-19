import SpotLightLogo from "@/components/Spotlight-Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Video, Users, Zap } from "lucide-react";

const Landing = () => {
  return (
    <div className="w-full">
      {/* Hero with animated Spotlight logo */}
      <SpotLightLogo />

      {/* Value props */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary text-center">
          Everything you need to host high‑converting webinars
        </h2>
        <p className="text-center text-muted-foreground mt-4 text-lg">
          Create and host webinars for free - no subscription required!
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/40 border-border">
            <CardContent className="p-6 flex items-start gap-4">
              <Video className="w-6 h-6 text-primary mt-1" />
              <div>
                <p className="font-medium">Go live or upload recordings</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Host live events or share pre‑recorded webinars with ease.
                  Schedule unlimited webinars and manage your content library.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-border">
            <CardContent className="p-6 flex items-start gap-4">
              <Users className="w-6 h-6 text-primary mt-1" />
              <div>
                <p className="font-medium">Engage and convert</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Interactive chat, custom CTAs, and AI-powered assistance to
                  maximize conversions. Real-time audience engagement tools.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-border">
            <CardContent className="p-6 flex items-start gap-4">
              <CalendarDays className="w-6 h-6 text-primary mt-1" />
              <div>
                <p className="font-medium">Automate follow‑ups</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Capture leads automatically and track your sales pipeline.
                  Automated email sequences and lead nurturing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional detailed features section */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-primary text-center mb-8">
            Why Choose Spotlight for Your Webinars?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Free to Use</h4>
              <p className="text-sm text-muted-foreground">
                Create unlimited webinars without any subscription fees or
                hidden costs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">AI-Powered</h4>
              <p className="text-sm text-muted-foreground">
                Smart AI agents help qualify leads and boost your conversion
                rates automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Easy Setup</h4>
              <p className="text-sm text-muted-foreground">
                Get started in minutes with our intuitive webinar creation and
                management tools.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">High Converting</h4>
              <p className="text-sm text-muted-foreground">
                Built-in conversion optimization tools to maximize your webinar
                ROI and sales.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/sign-in">Get Started Free</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/(ProtectedRoutes)/home">Explore Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="py-10 border-t border-border/60 bg-background/40">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Spotlight. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
