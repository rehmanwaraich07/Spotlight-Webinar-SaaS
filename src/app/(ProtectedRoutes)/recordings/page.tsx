"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Download, Play, RefreshCw, Search } from "lucide-react";

type Recording = {
  id: string;
  title: string;
  createdAt: string;
  durationSec?: number;
  url: string; // streamable url
  downloadUrl?: string; // direct download url (if different)
};

// TODO: replace with real API once available
async function fetchRecordings(): Promise<Recording[]> {
  // Placeholder: integrates later with your backend (prisma/Stream/Storage)
  return [];
}

const RecordingsPage = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchRecordings()
      .then(setRecordings)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return recordings;
    return recordings.filter((r) =>
      r.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [recordings, query]);

  return (
    <div className="w-full mx-auto h-full py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-primary font-semibold text-2xl">
            Recorded Webinars
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Watch and download recordings from your finished webinars.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search recordings..."
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true);
              fetchRecordings()
                .then(setRecordings)
                .finally(() => setLoading(false));
            }}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-44 rounded-md" />
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center bg-card">
          <p className="text-base font-medium">No recordings found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Once your live webinars end, recordings will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rec) => (
            <Card key={rec.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base truncate">
                  {rec.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(rec.createdAt).toLocaleString()}</span>
                  {rec.durationSec ? (
                    <Badge variant="secondary">
                      {Math.round(rec.durationSec / 60)} min
                    </Badge>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <video
                    src={rec.url}
                    controls
                    className="w-full rounded-md border border-border"
                  />
                  {rec.durationSec ? (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                      {new Date(rec.durationSec * 1000)
                        .toISOString()
                        .slice(14, 19)}
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button variant="default" asChild>
                    <a href={rec.url} target="_blank" rel="noopener noreferrer">
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={rec.downloadUrl ?? rec.url} download>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordingsPage;
