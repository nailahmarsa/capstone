"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";

type BookmarkedPlace = {
  slug: string;
  name: string;
  image: string;
  type: string;
  rating: number;
  ratingIcon: string;
};

export default function BookmarkPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkedPlace[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) setBookmarks(JSON.parse(stored));
  }, []);

  const removeBookmark = (slug: string) => {
    const updated = bookmarks.filter((b) => b.slug !== slug);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background:
          "linear-gradient(180deg, #f5c6cb 0%, #fbe8ea 30%, #fdf0f1 100%)",
      }}
    >
      {/* HEADER*/}
      <div className="px-10 pt-8 pb-4">
        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md rounded-full p-2 pr-10 shadow-sm border border-white/20">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-300 hover:bg-[#2f4b2f] group"
          >
            <ArrowLeft
              size={20}
              className="text-[#2f4b2f] transition-colors duration-300 group-hover:text-white"
            />
          </button>
          <span className="text-[#2f4b2f] font-bold text-lg tracking-tight">
            Bookmark
          </span>
        </div>
      </div>

      {/* MAIN CONTENT*/}
      <div className="max-w-6xl mx-auto px-10 pt-4 pb-12">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 gap-4 text-center">
            <Bookmark size={48} className="text-[#2f4b2f]/20" />
            <p className="text-[#2f4b2f]/50 text-base font-medium">
              No bookmarks yet.
              <br />
              Start saving your favorite quiet spots!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {bookmarks.map((place) => (
              <div
                key={place.slug}
                className="w-[230px] bg-white rounded-[20px] shadow-sm p-3.5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  router.push(`/dashboard/card-spot/${place.slug}`)
                }
              >
                <div className="relative w-full h-[144px] rounded-[14px] overflow-hidden">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Text & Icon Section */}
                <div className="mt-3.5 flex items-start justify-between gap-2 px-0.5">
                  <span className="text-[#2f4b2f] text-[15px] font-bold leading-snug line-clamp-2">
                    {place.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBookmark(place.slug);
                    }}
                    className="flex-shrink-0 mt-0.5"
                  >
                    <Bookmark
                      size={18}
                      className="text-[#2f4b2f] fill-[#2f4b2f]"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
