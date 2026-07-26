// app/place/[id]/page.tsx
import { getPlaceById } from "@/data";
import { notFound } from 'next/navigation';
import Header from "@/components/layout/Header";
import PlaceHero from "@/components/place/PlaceHero";
import PlaceInfo from "@/components/place/PlaceInfo";
import PlaceExperienceFeed from "@/components/PlaceExperienceFeed";

export default async function PlacePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const place = await getPlaceById(id);

  if (!place) {
    notFound();
  }

  // Get organization from the place data
  const organization = place.organization;

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <PlaceHero place={place} />
      <PlaceInfo
        organization={organization}
        place={place}
      />
      <PlaceExperienceFeed
        experiences={place.experiences || []}
        place={place}
      />
    </main>
  );
}