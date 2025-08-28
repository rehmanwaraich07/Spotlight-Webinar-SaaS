import { useWebinarStore } from "@/store/useWebinarStore";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, ChevronRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createWebinar } from "@/actions/webinar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Step = {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

type Props = {
  steps: Step[];
  onComplete: (id: string) => void;
};

const MultiStepForm = ({ steps, onComplete }: Props) => {
  const {
    formData,
    validateStep,
    isSubmitting,
    setIsSubmitting,
    setIsModalOpen,
    setShowErrorsForStep,
  } = useWebinarStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string | null>(null);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const router = useRouter();

  const handleBack = () => {
    if (isFirstStep) {
      setIsModalOpen(false);
    } else {
      setCurrentStepIndex(currentStepIndex - 1);
      setValidationErrors(null);
    }
  };

  const handleNext = async () => {
    setValidationErrors(null);
    const isValid = validateStep(currentStep.id as keyof typeof formData);

    if (!isValid) {
      setValidationErrors("Please fill out all required fields.");
      setShowErrorsForStep(currentStep.id as keyof typeof formData, true);
      return;
    }

    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }

    if (isLastStep) {
      try {
        setIsSubmitting(true);
        const result = await createWebinar(formData);
        if (result.status === 200 && result.webinarId) {
          toast.success("Your Webinar has been created successfully!");
          onComplete(result.webinarId);
        } else {
          toast.error(result.message || "Failed to create Webinar.");
          setValidationErrors(result.message);
        }
        router.refresh();
      } catch (error) {
        toast.error("Failed to create Webinar.");
        setValidationErrors("Failed to create Webinar.");
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#27272A]/20 border border-border rounded-3xl overflow-hidden w-full md:w-[960px] mx-auto backdrop-blur-[106px]">
      <div className="flex flex-col md:flex-row items-stretch justify-start w-full">
        <div className="w-full md:w-[280px] flex-shrink-0 p-6 md:border-r md:border-border/60">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = index === currentStepIndex;
              const isPast = index < currentStepIndex;

              return (
                <>
                  <div className="relative" key={step.id}>
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <motion.div
                          initial={false}
                          animate={{
                            backgroundColor:
                              isCurrent || isCompleted
                                ? "rgb(147,51, 234)"
                                : "rgb(31, 41, 55)",
                            scale: [isCurrent && isCompleted ? 0.8 : 1, 1],
                            transition: { duration: 0.3 },
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-full z-10"
                        >
                          <AnimatePresence mode="wait">
                            {isCompleted ? (
                              <motion.div
                                key={"check"}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="w-5 h-5 text-white" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key={"number"}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                className="text-white"
                              >
                                <Check className="w-5 h-5 text-white/50" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        {index < steps.length - 1 && (
                          <div className="absolute top-8 left-4 w-0.5 h-16 bg-gray-700 overflow-hidden">
                            <motion.div
                              initial={{
                                height: isPast || isCompleted ? "100%" : "0%",
                              }}
                              animate={{
                                height: isPast || isCompleted ? "100%" : "0%",
                                backgroundColor: "rgb(147,51, 234)",
                              }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className={"w-full h-full"}
                            ></motion.div>
                          </div>
                        )}
                      </div>
                      <div className="pt-1">
                        <motion.h3
                          animate={{
                            color:
                              isCurrent || isCompleted
                                ? "rgb(255,255, 255"
                                : "rgb(156, 163, 175",
                          }}
                          transition={{
                            duration: 0.3,
                          }}
                          className="font-medium"
                        >
                          {step.title}
                        </motion.h3>
                        <p className="text-sm text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>

        <div className="w-full md:flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              className="p-6 md:p-8"
              key={currentStep.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{currentStep.title}</h2>
                <p className="text-gray-500">{currentStep.description}</p>
              </div>

              {/* Render the Current Step Component */}
              {currentStep.component}

              {/* Validate error messsage */}

              {validationErrors && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start gap-2 text-red-300">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p>{validationErrors}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="w-full p-6 justify-between flex items-center">
        <Button
          variant={"outline"}
          onClick={handleBack}
          disabled={isSubmitting}
          className={cn(
            "border-gray-700 text-white hover:bg-gray-800 cursor-pointer",
            isFirstStep && "opacity-50 cursor-not-allowed"
          )}
        >
          {isFirstStep ? "Cancel" : "back"}
        </Button>
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {isLastStep ? (
            isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Creating...
              </>
            ) : (
              "Complete"
            )
          ) : (
            "Next"
          )}
          {!isLastStep && <ChevronRight className="ml-1 w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default MultiStepForm;
