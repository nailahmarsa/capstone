"use client";

import Image from "next/image";
import { ArrowLeft, Bookmark, Clock, ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

const reviews = [
  {
    id: 1,
    name: "Aisyah Rahma",
    text: "Absolutely love this spot for morning coding sessions.",
  },
  {
    id: 2,
    name: "Aisyah Rahma",
    text: "Very peaceful and comfortable atmosphere.",
  },
  {
    id: 3,
    name: "Aisyah Rahma",
    text: "One of my favorite places to focus and unwind at the same time.",
  },
];

export default function SpotDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  // ── HOOKS: STATE ──
  const [place, setPlace] = useState<any>(null); // State untuk menampung data API
  const [loading, setLoading] = useState(true); // State untuk loading UI
  const [isBookmarked, setIsBookmarked] = useState(false);

  // ── HOOKS: EFFECT ──
  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/places.json");
        const data = await response.json();

        if (data[slug]) {
          setPlace(data[slug]);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceData();
  }, [slug]);

  // Cek status bookmark dari LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) {
      const bookmarks = JSON.parse(stored);
      setIsBookmarked(bookmarks.some((b: any) => b.slug === slug));
    }
  }, [slug]);

  const toggleBookmark = () => {
    if (!place) return;
    const stored = localStorage.getItem("bookmarks");
    const bookmarks = stored ? JSON.parse(stored) : [];

    if (isBookmarked) {
      const updated = bookmarks.filter((b: any) => b.slug !== slug);
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      const newBookmark = { slug, ...place };
      localStorage.setItem(
        "bookmarks",
        JSON.stringify([...bookmarks, newBookmark]),
      );
      setIsBookmarked(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF2F3]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#2f4b2f] border-t-transparent animate-spin"></div>
          <p className="mt-4 text-[#2f4b2f] font-bold">Memuat data tempat...</p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF2F3] p-10 text-center">
        <h2 className="text-2xl font-bold text-[#2f4b2f]">
          Ups! Tempat tidak ditemukan.
        </h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm font-semibold underline text-[#c1697a]"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FBF2F3]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* HERO SECTION */}
      <div className="relative w-full h-[260px]">
        <Image
          src={place.image}
          alt={place.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF2F3]/30 via-[#FBF2F3]/70 to-[#FBF2F3]" />

        {/* NAVBAR */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between px-2 py-2 rounded-full bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all duration-300 hover:bg-[#2f4b2f] group"
            >
              <ArrowLeft
                size={18}
                className="text-[#2f4b2f] group-hover:text-white transition-colors"
              />
            </button>
            <span className="text-[#2f4b2f] text-base font-semibold">
              Detail Spot
            </span>
          </div>

          <button
            onClick={toggleBookmark}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
          >
            <Bookmark
              size={17}
              className={
                isBookmarked
                  ? "text-[#2f4b2f] fill-[#2f4b2f]"
                  : "text-[#2f4b2f]"
              }
            />
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-2xl mx-auto px-5 pb-20 pt-5">
        <div className="flex items-start justify-between">
          <h1 className="text-[2rem] font-semibold text-[#2f4b2f] leading-tight">
            {place.name}
          </h1>
          <div className="flex items-center gap-1.5 mt-1 flex-shrink-0 ml-3">
            <Image
              src={place.ratingIcon}
              alt="rating"
              width={18}
              height={18}
              className="object-contain"
            />
            <span className="font-semibold text-[#2f4b2f] text-[14px]">
              {place.rating}
            </span>
          </div>
        </div>

        <p className="text-[#6b7280] text-[13px] mt-2 leading-relaxed">
          {place.description}
        </p>

        <div className="flex gap-4 mt-5 items-start">
          <div className="flex flex-wrap gap-2.5 flex-1">
            {place.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full bg-[#2f4b2f]/10 text-[#2f4b2f] text-[12px] font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 min-w-[170px] border border-[#2f4b2f]">
            <div className="flex items-center gap-1.5 mb-3 text-[#2f4b2f] font-semibold text-[12px]">
              <Clock size={13} /> Operating Hours
            </div>
            {place.hours.map((item: any) => (
              <div
                key={item.day}
                className="flex justify-between items-center mb-1.5 text-[11px]"
              >
                <span className="text-gray-400">{item.day}</span>
                <span
                  className={`font-bold ${item.closed ? "text-[#A36065]" : "text-[#2f4b2f]"}`}
                >
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => window.open(place.mapLink, "_blank")}
          className="mt-6 mb-12 flex items-center gap-2 bg-[#2f4b2f] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#3d6b3d] transition-colors"
        >
          Go There <ArrowRight size={16} />
        </button>

        {/* LATEST REVIEW */}
        <div className="flex items-center justify-between mb-4 text-[#2f4b2f] font-bold text-[15px]">
          <h2>Latest Review</h2>
          <button className="bg-[#2f4b2f] text-white text-xs px-4 py-2 rounded-xl">
            Write a Review
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 items-start"
            >
              <div className="w-9 h-9 rounded-full bg-[#c5a98e] flex items-center justify-center text-white text-xs font-semibold">
                AR
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[13px] text-[#2f4b2f]">
                  {review.name}
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">
                  {review.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
