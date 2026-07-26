// app/stay/page.tsx
import { getPlaces } from "@/data";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import StayFeed from "@/components/feed/StayFeed";

export default async function StayPage() {
  const places = await getPlaces();
  
  // Filter only places with Stay category
  const stayPlaces = places.filter((place: any) => 
    place.category === 'Stay' || 
    place.category === 'Hotel' || 
    place.category === 'Resort' ||
    place.category === 'Lodge'
  );

  return (
    <main className="
      h-screen
      bg-black
      text-white
      overflow-hidden
    ">
      <Header />
      <StayFeed places={stayPlaces} />
      <BottomNav />
    </main>
  );
}