import Image from "next/image";
import Hero from "./Components/Hero/Hero";
import WhyChooseUs from "./Components/Choose/WhyChooseUs";
import Feedback from "./Components/Feedback/Feedback";
import VetTeam from "./Components/VetTeam/VetTeam";
import OurServices from "./Components/OurServices/OurServices";

export default function Home() {
  return (
    <div className="space-y-5">
      <Hero />
      <OurServices />
      <WhyChooseUs />
      <Feedback />
      <VetTeam />
    </div>
  );
}
