import { createAsssitant } from "@/actions/vapi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateAssistantModal = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createAsssitant(name);
      if (!res.success) {
        const errorMsg =
          typeof res.data === "string"
            ? res.data
            : "Failed to create assistant";
        throw new Error(errorMsg);
      }
      router.refresh();
      setName("");
      onClose();

      toast.success("Assitant Created Successfully!");
    } catch (error) {
      toast.error("Failed to create assistant");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-muted/80 rounded-lg w-full max-w-md  p-6 border border-input shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Assistant</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 cursor-pointer hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Label className="block font-medium mb-2">Assistant Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name of your Assistant"
              className="bg-neutral-800 border-neutral-700"
              required
            />
            <p className="text-xs text-neutral-400 mt-2">
              This name will be used to identify your assistant.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={onClose} variant={"outline"}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                </>
              ) : (
                "Create Assistant"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssistantModal;
