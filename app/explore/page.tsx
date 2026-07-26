// app/explore/page.tsx
import { getExploreExperiences } from "@/data";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import ExploreFeed from "@/components/feed/ExploreFeed";

export default async function ExplorePage() {
  const experiences = await getExploreExperiences();

  return (
    <main
      className="
        h-screen
        overflow-hidden
        bg-black
        text-white
      "
    >
      <Header />
      <ExploreFeed experiences={experiences} />
      <BottomNav />
    </main>
  );
}