import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-semibold">Call not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find this live webinar call. It may have ended or the link
          is invalid.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/live-webinar">Browse Webinars</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
