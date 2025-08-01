import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWebinarStore } from "@/store/useWebinarStore";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import MultiStepForm from "./MultiStepForm";
import BasicInfoStep from "./BasicInfoStep";
import CTAStep from "./CTAStep";
import AdditionalInfoStep from "./AdditionalInfoStep";

const CreateWebinarButton = () => {
  const { isModalOpen, setIsModalOpen, isComplete, setIsComplete } =
    useWebinarStore();
  const [webinarLink, setWebinarLink] = useState("");
  const steps = [
    {
      id: "basicInfo",
      title: "Basic Information",
      description: "Enter Basic Information for Webinar",
      component: <BasicInfoStep />,
    },
    {
      id: "cta",
      title: "CTA",
      description: "Enter the CTA for Webinar",
      component: <CTAStep assistants={[]} stripeProducts={[]} />,
    },
    {
      id: "additionalInfo",
      title: "Additional Information",
      description: "Enter Additional information for Webinar",
      component: <AdditionalInfoStep />,
    },
  ];

  const handleComplete = (webinarId: string) => {
    setIsComplete(true);
    setWebinarLink(`${process.env.NEXT_PUBLIC_URL}/live-webinar/${webinarId}`);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-lg flex gap-2 items-center hover:cursor-pointer px-4 py-2 border border-border bg-primary/10 backdrop-blur-sm text-sm font-normal text-primary hover:bg-primary/20"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="w-5 h-5" /> Create Webinar
        </button>
      </DialogTrigger>
      <DialogContent className="sm:w-[900px] p-0 bg-transparent border-none xl:min-w-fit">
        {isComplete ? (
          <div className="bg-muted text-primary rounded-lg overflow-hidden">
            <DialogTitle className="sr-only">Webinar Created</DialogTitle>
            {/* SuccessStep */}
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only">Create Webinar</DialogTitle>
            <MultiStepForm steps={steps} onComplete={handleComplete} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateWebinarButton;
