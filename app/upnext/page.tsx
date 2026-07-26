// app/upnext/page.tsx
import { getUpNextExperiences } from "@/data";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import UpNextFeed from "@/components/feed/UpNextFeed";

export default async function UpNextPage() {
  const experiences = await getUpNextExperiences();

  return (
    <main
      className="
        h-screen
        bg-black
        text-white
        overflow-hidden
      "
    >
      <Header />
      <UpNextFeed experiences={experiences} />
      <BottomNav />
    </main>
  );
}