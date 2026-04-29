"use client";

import Image from "next/image";
import { Search, Bookmark, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { SlUserFollowing } from "react-icons/sl";

const places = [
  { id: 1, slug: "gowork-fatmawati", name: "GoWork Fatmawati", type: "Coworking Space", rating: 4.8, ratingIcon: "/beaming-black.png", image: "/gowork.png" },
  { id: 2, slug: "foreword-library", name: "ForeWord Library", type: "Library", rating: 4.8, ratingIcon: "/beaming-black.png", image: "/foreword.png" },
  { id: 3, slug: "urban-forest-cipete", name: "Urban Forest Cipete", type: "Park", rating: 4.6, ratingIcon: "/beaming-black.png", image: "/urbanforest.png" },
  { id: 4, slug: "dialogue-artspace", name: "Dia.Lo.Gue Artspace", type: "Cafe, Art Gallery", rating: 4.5, ratingIcon: "/smiley-black.png", image: "/dialogue.png" },
];

const recentPlaces = [
  {
    id: 1,
    slug: "erasmus-huis",
    name: "Erasmus Huis",
    type: "Cultural Center",
    rating: 4.8,
    lastVisited: "5 mins ago",
    ratingIcon: "/beaming-black.png",
    image: "/erasmus.png",
    description:
      "A Dutch cultural center library with a minimalist, all-white interior design. The atmosphere is very cool, quiet, and gives off a professional vibe, making it ideal for reading or working on assignments.",
  },
  {
    id: 2,
    slug: "tebet-eco-park",
    name: "Tebet Eco Park",
    type: "Park",
    rating: 4.7,
    lastVisited: "20 mins ago",
    ratingIcon: "/beaming-black.png",
    image: "/tebet.png",
    description:
      "Perfect for those who want to clear their minds in the heart of the city, take a leisurely stroll among the trees, or simply sit back and enjoy the serene atmosphere.",
  },
  {
    id: 3,
    slug: "taman-cempaka",
    name: "Taman Cempaka",
    type: "Park",
    rating: 4.6,
    lastVisited: "1 hour ago",
    ratingIcon: "/smiley-black.png",
    image: "/cempaka.png",
    description:
      "Perfect for those who are tired of being indoors and want to get some work done in a relaxed atmosphere while enjoying the fresh air under the shade of lush trees.",
  },
];

export default function DashboardPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const recentScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

  const onMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    dragDistance.current = Math.abs(walk);
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const handleCardClick = (slug: string) => {
    if (dragDistance.current < 5) {
      router.push(`/dashboard/card-spot/${slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF2F3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAVBAR */}
      <div className="bg-[#2f4b2f] px-6 py-3 flex items-center justify-between rounded-b-[32px]">
        <Image
          src="/logo white.png"
          alt="logo"
          width={0}
          height={0}
          className="h-8 w-auto object-contain"
        />
        <div className="relative w-[42%]">
          <input
            type="text"
            placeholder="Find your quiet spot..."
            onFocus={() => router.push("/dashboard/search")}
            className="w-full px-4 py-1.5 rounded-full bg-[#EBEDEA] text-[#C0C8BF] text-sm outline-none placeholder:text-[#C0C8BF] placeholder:italic shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C0C8BF]" size={16} />
        </div>
        <div className="flex items-center gap-4">
          <Bookmark className="text-white" size={20} />
          <div className="w-9 h-9 rounded-full bg-[#c5a98e] flex items-center justify-center">
            <span className="text-white text-xs font-semibold tracking-wide">AR</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="relative">
        <Image
          src="/bg-library.webp"
          alt="hero"
          width={1440}
          height={350}
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/25 to-[#FBF2F3]" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-center px-4">
          <h1 className="text-[2rem] font-bold text-[#2f4b2f] leading-tight tracking-tight">
            Discover Your Teduh Spot!
          </h1>
          <p className="text-[#2f4b2f] mt-2 max-w-sm text-sm leading-[1.5] tracking-[-0.1px] font-medium">
            Discover quiet spaces, curated for focus and tranquility in the heart of the city.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 pb-12">

        {/* TOP SATISFACTION PICKS */}
        <div className="mb-8 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[15px] text-[#2f4b2f]">
              Top Satisfaction Picks
            </h2>
            <ArrowRight className="text-[#2f4b2f]" size={18} />
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseDown={(e) => onMouseDown(e, scrollRef)}
            onMouseMove={(e) => onMouseMove(e, scrollRef)}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {places.map((place) => (
              <div
                key={place.id}
                onClick={() => handleCardClick(place.slug)}
                className="min-w-[200px] max-w-[200px] bg-white rounded-2xl shadow-sm p-3 flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={place.image}
                    alt={place.name}
                    width={200}
                    height={125}
                    className="w-full h-[125px] object-cover"
                  />

                  {/* GRADIENT */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                  {/* OVERLAY */}
                  <div
                    className="absolute bottom-2 left-2 right-2 flex justify-between items-center backdrop-blur-md border border-black/10 px-3 py-1 text-[11px]"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.35)", borderRadius: "8px" }}
                  >
                    <span className="text-black font-bold">{place.type}</span>
                    <span className="flex items-center gap-1 text-black font-semibold">
                      <Image src={place.ratingIcon} alt="rating" width={14} height={14} className="object-contain" />
                      {place.rating}
                    </span>
                  </div>
                </div>

                <h3 className="mt-2 font-semibold text-sm text-[#2f4b2f]">{place.name}</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-3">
                  A cozy spot with a relaxed atmosphere and warm lighting—perfect for taking a quick break from a busy schedule.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RECENTLY VIEWED */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[15px] text-[#2f4b2f]">Recently Viewed</h2>
          </div>

          <div
            ref={recentScrollRef}
            className="flex gap-4 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseDown={(e) => onMouseDown(e, recentScrollRef)}
            onMouseMove={(e) => onMouseMove(e, recentScrollRef)}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {recentPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => handleCardClick(place.slug)}
                className="min-w-[280px] max-w-[280px] bg-white rounded-2xl shadow-sm p-3 flex-shrink-0 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={place.image}
                    alt={place.name}
                    width={80}
                    height={80}
                    className="w-[80px] h-[80px] object-cover rounded-xl"
                    draggable={false}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-[#2f4b2f]">{place.name}</h3>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-2">
                    {place.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400">
                      Last Visited: {place.lastVisited}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-600 font-semibold">
                      <Image src={place.ratingIcon} alt="rating" width={12} height={12} className="object-contain" />
                      {place.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}