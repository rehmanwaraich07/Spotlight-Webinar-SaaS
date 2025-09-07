import { GoCopy } from "react-icons/go";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OBS Streaming Keys</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">RTMP URL</Label>
            <div className="flex">
              <Input value={rtmpURL} readOnly className="flex-1" />
              <Button
                variant={"outline"}
                size={"icon"}
                className="ml-2 cursor-pointer"
                onClick={() => copyToClipboard(rtmpURL, "RTMP URL")}
              >
                <GoCopy size={16} />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Password Key</Label>
            <div className="flex">
              <Input
                className="flex-1"
                value={streamKey}
                readOnly
                type="password"
              />
              <Button
                variant={"outline"}
                size={"icon"}
                className="ml-2 cursor-pointer"
                onClick={() => copyToClipboard(streamKey, "Stream Key")}
              >
                <GoCopy size={16} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              These are your Personal OBS Sutdio Keys to go Live. Keep it safe
              and don't share it with anyone.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObsDialogBox;
