"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Place = {
  id: number;
  slug: string;
  name: string;
  tags: string[];
  crowdedness: string;
};

const DEFAULT_PLACES: Place[] = [
  {
    id: 1,
    slug: "gowork-fatmawati",
    name: "GoWork Fatmawati",
    tags: ["Indoor", "Quiet", "Group", "Focused"],
    crowdedness: "High",
  },
  {
    id: 2,
    slug: "foreword-library",
    name: "ForeWord Library",
    tags: ["Indoor", "Quiet", "Alone", "Focused"],
    crowdedness: "Low",
  },
  {
    id: 3,
    slug: "urban-forest-cipete",
    name: "Urban Forest Cipete",
    tags: ["Outdoor", "Relaxed", "Alone", "Busy"],
    crowdedness: "Low",
  },
  {
    id: 4,
    slug: "dialogue-artspace",
    name: "Dia.Lo.Gue Artspace",
    tags: ["Indoor", "Quiet", "Alone", "Focused"],
    crowdedness: "High",
  },
];

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#efefef] px-6 py-8 text-sm text-[#2f4b2f] italic">
          Loading...
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allPlaces, setAllPlaces] = useState<Place[]>(DEFAULT_PLACES);

  const query = searchParams.get("q")?.toLowerCase() || "";
  const facilities = searchParams.get("facilities")?.split(",") || [];
  const crowdedness = searchParams.get("crowdedness")?.split(",") || [];

  // Sinkronisasi dinamis: Menggabungkan semua spot buatan Admin dari LocalStorage
  useEffect(() => {
    const savedSpots = localStorage.getItem("spots");
    if (savedSpots) {
      try {
        const adminSpots = JSON.parse(savedSpots).map((spot: any) => ({
          id: spot.id,
          slug: spot.name.toLowerCase().replaceAll(" ", "-"),
          name: spot.name,
          tags: [...(spot.facilities || []), spot.category || ""],
          crowdedness: Array.isArray(spot.crowdedness)
            ? spot.crowdedness[0] || "Low"
            : spot.crowdedness || "Low",
        }));

        // Gabungkan seluruh spot admin dengan data default agar pencarian mencakup semua data
        setAllPlaces([...adminSpots, ...DEFAULT_PLACES]);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const filtered = useMemo(() => {
    return allPlaces.filter((p) => {
      const matchQuery = !query || p.name.toLowerCase().includes(query);

      const matchFacilities =
        facilities.length === 0 ||
        facilities.every((f) =>
          p.tags.map((t) => t.toLowerCase()).includes(f.toLowerCase()),
        );

      const matchCrowd =
        crowdedness.length === 0 ||
        crowdedness.some(
          (c) => p.crowdedness.toLowerCase() === c.toLowerCase(),
        );

      return matchQuery && matchFacilities && matchCrowd;
    });
  }, [allPlaces, query, facilities, crowdedness]);

  // NOTE: Efek useEffect router.replace lama yang otomatis lompat ke detail spot ketika filtered.length === 1 sudah dihapus total!

  return (
    <div
      className="min-h-screen bg-[#efefef] px-6 py-8"
      style={{ fontFamily: "sans-serif" }}
    >
      {/* HEADER DENGAN ICON BACK (ORISINAL) */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors border-none cursor-pointer"
        >
          <ArrowLeft size={20} className="text-[#2f4b2f]" />
        </button>
        <h1 className="text-lg font-bold text-[#2f4b2f]">Search Results</h1>
      </div>

      {/* EMPTY STATE (ORISINAL) */}
      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm italic ml-2">
          No places found. Try adjusting your filters.
        </p>
      )}

      {/* RESULTS DISPLAY LIST (ORISINAL STYLE) */}
      <div className="flex flex-col gap-3">
        {filtered.map((place) => (
          <div
            key={`${place.slug}-${place.id}`}
            onClick={() => router.push(`/dashboard/card-spot/${place.slug}`)}
            className="bg-white p-4 rounded-xl cursor-pointer hover:shadow-sm transition border border-transparent hover:border-[#2f4b2f]/20 animate-in fade-in slide-in-from-bottom-1 duration-200"
          >
            <h2 className="font-semibold text-[#2f4b2f] text-base m-0">
              {place.name}
            </h2>

            <p className="text-xs text-gray-500 mt-1 m-0">
              {place.tags.join(", ")} • {place.crowdedness}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
