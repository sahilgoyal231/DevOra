import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <div className="container mx-auto px-4 pb-20 pt-10 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-bold mb-6">Latest Questions</h2>
            <LatestQuestions />
          </div>
          <div className="w-full lg:w-1/3">
            <h2 className="text-3xl font-bold mb-6">Top Contributors</h2>
            <TopContributers />
          </div>
        </div>
      </div>
    </main>
  );
}
