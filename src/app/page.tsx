import SpotLightLogo from "@/components/Spotlight-Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Video, Users } from "lucide-react";

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
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/40 border-border">
            <CardContent className="p-6 flex items-start gap-4">
              <Video className="w-6 h-6 text-primary mt-1" />
              <div>
                <p className="font-medium">Go live or upload recordings</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Host live events or share pre‑recorded webinars with ease.
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
                  Chat, CTAs, and AI assistance built for conversions.
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
                  Capture leads and track pipeline after each session.
                </p>
              </div>
            </CardContent>
          </Card>
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
