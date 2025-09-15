import { GoCopy } from "react-icons/go";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle, AlertCircle, Info } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rtmpURL: string;
  streamKey: string;
};

const ObsDialogBox = ({ open, onOpenChange, rtmpURL, streamKey }: Props) => {
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} Copied to Clipboard`);
    } catch (error) {
      console.error("Failed to copy the Key");
      toast.error("Failed to Copy the Key");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            OBS Studio Streaming Setup
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[75vh] overflow-y-auto hide-scrollbar">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Setup Instructions:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Open OBS Studio and go to Settings → Stream</li>
                  <li>Set Service to "Custom..."</li>
                  <li>Copy and paste the RTMP URL below</li>
                  <li>Copy and paste the Stream Key as your password</li>
                  <li>
                    <strong>IMPORTANT:</strong> Optimize OBS settings first (see
                    below)
                  </li>
                  <li>Click "Start Streaming" in OBS</li>
                </ol>
              </div>
            </div>
          </div>

          {/* RTMP URL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <span>RTMP URL</span>
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                Required
              </span>
            </Label>
            <div className="flex">
              <Input
                value={rtmpURL}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant={"outline"}
                size={"icon"}
                className="ml-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-950"
                onClick={() => copyToClipboard(rtmpURL, "RTMP URL")}
              >
                <GoCopy size={16} />
              </Button>
            </div>
          </div>

          {/* Stream Key */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <span>Stream Key (Password)</span>
              <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded">
                Keep Secret
              </span>
            </Label>
            <div className="flex">
              <Input
                className="flex-1 font-mono text-sm"
                value={streamKey}
                readOnly
                type="password"
              />
              <Button
                variant={"outline"}
                size={"icon"}
                className="ml-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-950"
                onClick={() => copyToClipboard(streamKey, "Stream Key")}
              >
                <GoCopy size={16} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ⚠️ Keep these credentials secure and don't share them with anyone.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="font-medium text-amber-900 dark:text-amber-100">
                  Connection Status
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Once you start streaming in OBS, you'll see a success
                  notification here. If you encounter issues, check your
                  internet connection and OBS settings.
                </p>
                <div className="mt-2 p-2 bg-black/10 rounded text-xs font-mono">
                  <div>RTMP URL: {rtmpURL}</div>
                  <div>Stream Key: {streamKey.substring(0, 20)}...</div>
                </div>
              </div>
            </div>
          </div>

          {/* OBS Optimization */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  OBS Optimization (CRITICAL)
                </h4>
                <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
                  <p>
                    <strong>Settings → Output:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      Output Mode: <strong>Advanced</strong>
                    </li>
                    <li>
                      Encoder: <strong>Software (x264)</strong> or{" "}
                      <strong>Hardware (NVENC/QuickSync)</strong>
                    </li>
                    <li>
                      Rate Control: <strong>CBR</strong>
                    </li>
                    <li>
                      Bitrate: <strong>2500-4000 kbps</strong> (adjust based on
                      your internet)
                    </li>
                    <li>
                      Keyframe Interval: <strong>2</strong>
                    </li>
                  </ul>
                  <p>
                    <strong>Settings → Video:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      Base Resolution: <strong>1920x1080</strong> or your screen
                      resolution
                    </li>
                    <li>
                      Output Resolution: <strong>1280x720</strong> (for better
                      stability)
                    </li>
                    <li>
                      FPS: <strong>30</strong> (or 60 if your system can handle
                      it)
                    </li>
                  </ul>
                  <p>
                    <strong>Settings → Advanced:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      Process Priority: <strong>High</strong>
                    </li>
                    <li>
                      Color Format: <strong>NV12</strong>
                    </li>
                    <li>
                      Color Space: <strong>709</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-red-900 dark:text-red-100">
                  Troubleshooting
                </h4>
                <ul className="text-sm text-red-800 dark:text-red-200 space-y-1 list-disc list-inside">
                  <li>
                    Make sure OBS is using the exact RTMP URL and Stream Key
                    above
                  </li>
                  <li>
                    Check that your internet connection is stable (minimum 5
                    Mbps upload)
                  </li>
                  <li>Try restarting OBS if connection fails</li>
                  <li>Check OBS logs: Help → Log Files → Show Log Files</li>
                  <li>Ensure no firewall is blocking the connection</li>
                  <li>Close other bandwidth-heavy applications</li>
                  <li>Run OBS as Administrator if issues persist</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObsDialogBox;
