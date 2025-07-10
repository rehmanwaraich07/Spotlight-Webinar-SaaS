import React from "react";
import OnBoarding from "./_components/OnBoarding";
import { Upload, Webcam } from "lucide-react";
import FeatureCard from "./_components/FeatureCard";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="w-full mx-auto h-full py-16">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-14">
        <div className="space-y-6">
          <h2 className="text-primary font-semibold text-3xl">
            Get maximum Conversion from your webinars
          </h2>
          <OnBoarding />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-content-center">
          <FeatureCard
            Icon={<Upload className="w-10 h-10" />}
            heading="Browse or drag a pre-recorded webinar file"
            link="#"
          />
          <FeatureCard
            Icon={<Webcam className="w-10 h-10" />}
            heading="Browse or drag a pre-recorded webinar file"
            link="/webinars"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
