import { onBoardingSteps } from "@/lib/data";
import { FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";

const OnBoarding = () => {
  return (
    <div className="flex flex-col gap-1 items-start justify-start">
      {onBoardingSteps.map((step, index) => (
        <Link href={step.link} key={index} className="flex items-center gap-2">
          <FaCircleCheck />
          <p className="text-base text-foreground">{step.title}</p>
        </Link>
      ))}
    </div>
  );
};

export default OnBoarding;
