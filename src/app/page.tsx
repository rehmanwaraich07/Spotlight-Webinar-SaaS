import SpotLightLogo from "@/components/Spotlight-Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Video,
  Users,
  Zap,
  Bot,
  Mic,
  BarChart3,
  Shield,
  Clock,
  Target,
} from "lucide-react";

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
                  Schedule unlimited webinars, manage your content library, and
                  stream to multiple platforms simultaneously.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-border">
            <CardContent className="p-6 flex items-start gap-4">
              <Bot className="w-6 h-6 text-primary mt-1" />
              <div>
                <p className="font-medium">VAPI AI Voice Agents</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Powered by VAPI AI, our intelligent voice agents automatically
                  qualify leads, answer questions, and guide attendees through
                  your sales funnel with natural conversation flow.
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
                  Interactive chat, custom CTAs, real-time polls, and AI-powered
                  assistance to maximize conversions. Track engagement metrics
                  and optimize your presentation in real-time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VAPI AI Detailed Section */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-primary text-center mb-4">
            Revolutionary VAPI AI Integration
          </h3>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Spotlight integrates cutting-edge VAPI AI technology to transform
            your webinars into intelligent, automated sales machines that work
            24/7.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/40 border-border">
              <CardContent className="p-6 text-center">
                <Mic className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-medium mb-2">
                  Natural Voice Conversations
                </h4>
                <p className="text-sm text-muted-foreground">
                  VAPI AI agents speak naturally with your attendees,
                  understanding context and responding intelligently to
                  questions about your products or services.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/40 border-border">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-medium mb-2">Lead Qualification</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically qualify leads by asking strategic questions,
                  identifying pain points, and determining buying intent through
                  intelligent conversation analysis.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/40 border-border">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-medium mb-2">Sales Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Get detailed insights into conversation patterns, conversion
                  rates, and attendee behavior to continuously optimize your
                  webinar performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Why Choose Spotlight section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-primary text-center mb-4">
            Why Choose Spotlight for Your Webinars?
          </h3>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Spotlight isn't just another webinar platform - it's a complete
            AI-powered sales automation system designed to maximize your
            conversions and grow your business.
          </p>

          {/* Main Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-3 text-lg">100% Free Forever</h4>
              <p className="text-sm text-muted-foreground">
                Create unlimited webinars without any subscription fees, hidden
                costs, or usage limits. No credit card required to get started.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-3 text-lg">
                VAPI AI Integration
              </h4>
              <p className="text-sm text-muted-foreground">
                Advanced voice AI agents that qualify leads, answer questions,
                and guide prospects through your sales funnel automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-3 text-lg">5-Minute Setup</h4>
              <p className="text-sm text-muted-foreground">
                Get your first webinar live in under 5 minutes with our
                intuitive drag-and-drop interface and pre-built templates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-3 text-lg">Proven Results</h4>
              <p className="text-sm text-muted-foreground">
                Our users see 3x higher conversion rates compared to traditional
                webinar platforms with built-in optimization tools.
              </p>
            </div>
          </div>

          {/* Detailed Feature Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card/40 border-border">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-lg">
                    Enterprise-Grade Security
                  </h4>
                </div>
                <p className="text-muted-foreground mb-4">
                  Your data and your attendees' information are protected with
                  bank-level encryption, GDPR compliance, and SOC 2 Type II
                  certification.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• End-to-end encryption for all communications</li>
                  <li>• Secure payment processing with Stripe</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Data residency options for global compliance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-lg">Advanced Analytics</h4>
                </div>
                <p className="text-muted-foreground mb-4">
                  Track every interaction, conversation, and conversion with
                  detailed analytics that help you optimize your webinar
                  performance.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Real-time engagement tracking</li>
                  <li>• AI conversation analysis and insights</li>
                  <li>• Conversion funnel optimization</li>
                  <li>• Custom reporting and dashboards</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-lg">
                    Seamless Integrations
                  </h4>
                </div>
                <p className="text-muted-foreground mb-4">
                  Connect with your favorite tools and automate your entire
                  sales process from lead capture to customer onboarding.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• CRM integrations (Salesforce, HubSpot, Pipedrive)</li>
                  <li>• Email marketing platforms (Mailchimp, ConvertKit)</li>
                  <li>• Payment processors (Stripe, PayPal)</li>
                  <li>• Calendar scheduling (Calendly, Acuity)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold text-lg">24/7 AI Automation</h4>
                </div>
                <p className="text-muted-foreground mb-4">
                  Your VAPI AI agents work around the clock, qualifying leads,
                  answering questions, and nurturing prospects even when you're
                  not available.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Automated lead qualification and scoring</li>
                  <li>• Intelligent follow-up sequences</li>
                  <li>• Multi-language support for global reach</li>
                  <li>• Custom AI personality and voice training</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            Ready to Transform Your Webinars?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Spotlight to automate
            their sales process and increase conversions with AI-powered
            webinars.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="px-8 py-3">
              <Link href="/sign-in">Start Creating Webinars Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="px-8 py-3">
              <Link href="/(ProtectedRoutes)/home">Explore Dashboard</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            No credit card required • Setup in 5 minutes • Cancel anytime
          </p>
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
