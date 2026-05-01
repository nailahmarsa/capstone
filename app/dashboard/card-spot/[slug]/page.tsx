"use client";

import Image from "next/image";
import { ArrowLeft, Bookmark, Clock, ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

// ── DATA TEMPAT) ──
const placeData = {
  "gowork-fatmawati": {
    name: "GoWork Fatmawati",
    image: "/gowork.png",
    type: "Coworking Space",
    rating: 4.8,
    ratingIcon: "/beaming-black.png",
    mapLink: "https://www.google.com/maps?q=gowork+fatmawati",
    description:
      "A commercial workspace with premium amenities. It's perfect if you need a highly reliable internet connection and a work environment surrounded by other professionals.",
    tags: ["Indoor", "Quiet", "Group", "Alone", "Focused", "Low"],
    hours: [
      { day: "Mon – Fri", hours: "8 AM – 8 PM", closed: false },
      { day: "Sat", hours: "9 AM – 10 PM", closed: false },
      { day: "Sun", hours: "Closed", closed: true },
    ],
  },
  "foreword-library": {
    name: "ForeWord Library",
    image: "/foreword.png",
    type: "Library",
    rating: 4.8,
    ratingIcon: "/beaming-black.png",
    mapLink: "https://www.google.com/maps?q=foreword+library",
    description:
      "A private library with a cozy and stylish atmosphere. This place is designed to maintain a peaceful environment, making it perfect for those who need to concentrate fully without any noise disturbances.",
    tags: ["Indoor", "Low", "Quiet", "Alone", "Focused"],
    hours: [
      { day: "Tue – Fri", hours: "11 AM – 7:30 PM", closed: false },
      { day: "Sat", hours: "9 AM – 5 PM", closed: false },
      { day: "Sun – Mon", hours: "Closed", closed: true },
    ],
  },
  "urban-forest-cipete": {
    name: "Urban Forest Cipete",
    image: "/urbanforest.png",
    type: "Park",
    rating: 4.6,
    ratingIcon: "/beaming-black.png",
    mapLink: "https://www.google.com/maps?q=urban+forest+cipete",
    description:
      "A lush green open space in the heart of the city. Perfect for those who are tired of being indoors and want to get some work done in a relaxed atmosphere while enjoying the fresh air under the trees.",
    tags: ["Outdoor", "High", "Busy", "Group", "Relaxed"],
    hours: [{ day: "Sun – Sat", hours: "7 AM – 10 PM", closed: false }],
  },
  "dialogue-artspace": {
    name: "Dia.Lo.Gue Artspace",
    image: "/dialogue.png",
    type: "Cafe, Art Gallery",
    rating: 4.5,
    ratingIcon: "/smiley-black.png",
    mapLink: "https://www.google.com/maps?q=dialogue+artspace",
    description:
      "A contemporary art gallery featuring an iconic all-white minimalist interior design. The atmosphere is professional yet relaxed, making it the perfect spot for those who want to read, work on assignments, or simply seek inspiration among the artworks.",
    tags: ["Indoor", "Low", "Quiet", "Alone", "Focused"],
    hours: [
      { day: "Mon – Fri", hours: "11 AM – 8 PM", closed: false },
      { day: "Sat – Sun", hours: "8 AM – 8 PM", closed: false },
    ],
  },
  "erasmus-huis": {
    name: "Erasmus Huis",
    image: "/erasmus.png",
    type: "Cultural Center",
    rating: 4.8,
    ratingIcon: "/beaming-black.png",
    mapLink: "https://www.google.com/maps?q=erasmus+huis+jakarta",
    description:
      "A Dutch cultural center library with a minimalist, all-white interior design. The atmosphere is very cool, quiet, and gives off a professional vibe, making it ideal for reading or working on assignments.",
    tags: ["Indoor", "Quiet", "Alone", "Focused", "Low"],
    hours: [
      { day: "Tue – Fri", hours: "10 AM – 5 PM", closed: false },
      { day: "Sat", hours: "10 AM – 3 PM", closed: false },
      { day: "Sun – Mon", hours: "Closed", closed: true },
    ],
  },
  "tebet-eco-park": {
    name: "Tebet Eco Park",
    image: "/tebet.png",
    type: "Park",
    rating: 4.7,
    ratingIcon: "/beaming-black.png",
    mapLink: "https://www.google.com/maps?q=tebet+eco+park",
    description:
      "Perfect for those who want to clear their minds in the heart of the city, take a leisurely stroll among the trees, or simply sit back and enjoy the serene atmosphere.",
    tags: ["Outdoor", "Relaxed", "Group", "High"],
    hours: [{ day: "Sun – Sat", hours: "6 AM – 10 PM", closed: false }],
  },
  "taman-cempaka": {
    name: "Taman Cempaka",
    image: "/cempaka.png",
    type: "Park",
    rating: 4.6,
    ratingIcon: "/smiley-black.png",
    mapLink: "https://www.google.com/maps?q=taman+cempaka+jakarta",
    description:
      "Perfect for those who are tired of being indoors and want to get some work done in a relaxed atmosphere while enjoying the fresh air under the shade of lush trees.",
    tags: ["Outdoor", "Relaxed", "Alone", "Low"],
    hours: [{ day: "Sun – Sat", hours: "6 AM – 9 PM", closed: false }],
  },
};

// ── REVIEWS ──
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
    text: "One of my favorite places to focus and unwind at the same time. Definitely recommended for students and remote workers looking for calm spaces.",
  },
];

// ── EMOJIS ──
const emojis = [
  {
    val: 1,
    src: "/pensive.png",
    srcColor: "/pensive-color.png",
    label: "Very Bad",
  },
  {
    val: 2,
    src: "/frowning.png",
    srcColor: "/frowning-color.png",
    label: "Bad",
  },
  {
    val: 3,
    src: "/neutral.png",
    srcColor: "/neutral-color.png",
    label: "Neutral",
  },
  { val: 4, src: "/smiley.png", srcColor: "/smiley-color.png", label: "Good" },
  {
    val: 5,
    src: "/beaming.png",
    srcColor: "/beaming-color.png",
    label: "Great",
  },
];

// ── REVIEW MODAL ──
function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating || !text.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[12px] p-7 w-[420px] relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <h2 className="text-[24px] font-extrabold text-[#1f2937] text-center">
              Rate and Review
            </h2>
            <p className="text-[13px] text-gray-400 text-center mt-1">
              Tell us what you feel and think!
            </p>

            <div className="flex justify-center gap-4 my-6">
              {emojis.map((e) => (
                <button
                  key={e.val}
                  onClick={() => setRating(e.val)}
                  className={`w-14 h-14 flex items-center justify-center transition-all duration-150 ${
                    rating === e.val
                      ? "scale-125"
                      : "opacity-50 hover:opacity-80 hover:scale-110"
                  }`}
                >
                  <Image
                    src={rating === e.val ? e.srcColor : e.src}
                    alt={e.label}
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            <div className="bg-[#EBEDEA] border border-black rounded-lg p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message here."
                className="w-full bg-transparent text-[13px] text-gray-700 resize-none h-[120px] outline-none placeholder-gray-400"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!rating || !text.trim()}
                  className="flex items-center gap-2 bg-[#2f4b2f] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#3d6b3d] disabled:opacity-40"
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-[10px] bg-[#f0faf0] border border-[#2f4b2f]/20 flex flex-col items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path
                  d="M6 14 L12 20 L22 9"
                  stroke="#2f4b2f"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="w-6 h-[2px] bg-[#2f4b2f] rounded-full mt-1.5" />
            </div>
            <p className="text-[17px] font-bold text-gray-800 leading-snug">
              Your Review has been
              <br />
              submitted!
            </p>
            <p className="text-[12px] text-gray-400 mt-2 max-w-[200px] leading-relaxed">
              Thanks for sharing! Your input helps other users make better
              choices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN PAGE ──
export default function SpotDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [showReview, setShowReview] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const slug = params.slug as string;
  const place = placeData[slug as keyof typeof placeData];

  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) {
      const bookmarks = JSON.parse(stored);
      setIsBookmarked(bookmarks.some((b: any) => b.slug === slug));
    }
  }, [slug]);

  const toggleBookmark = () => {
    const stored = localStorage.getItem("bookmarks");
    const bookmarks = stored ? JSON.parse(stored) : [];

    if (isBookmarked) {
      const updated = bookmarks.filter((b: any) => b.slug !== slug);
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      const newBookmark = {
        slug,
        name: place.name,
        image: place.image,
        type: place.type,
        rating: place.rating,
        ratingIcon: place.ratingIcon,
      };
      const updated = [...bookmarks, newBookmark];
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(true);
    }
  };

  if (!place) {
    return <div className="p-10 text-center">Place not found.</div>;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: "#FBF2F3",
      }}
    >
      {/* HERO */}
      <div className="relative w-full h-[260px]">
        <Image
          src={place.image}
          alt={place.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF2F3]/30 via-[#FBF2F3]/70 to-[#FBF2F3]" />

        {/* TOP BAR */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between px-2 py-2 rounded-full bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all duration-300 hover:bg-[#2f4b2f] group"
            >
              <ArrowLeft
                size={18}
                className="text-[#2f4b2f] transition-colors duration-300 group-hover:text-white"
              />
            </button>
            <span className="text-[#2f4b2f] text-base font-semibold">
              Detail Spot
            </span>
          </div>

          <button
            onClick={toggleBookmark}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all"
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

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-5 pb-20 pt-5">
        {showReview && <ReviewModal onClose={() => setShowReview(false)} />}

        {/* TITLE */}
        <div className="flex items-start justify-between">
          <h1 className="text-[2rem] font-semibold text-[#2f4b2f] leading-[1.2] tracking-[-0.5px]">
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

        {/* DESCRIPTION */}
        <p className="text-[#6b7280] text-[13px] mt-2 leading-[1.6] max-w-[85%]">
          {place.description}
        </p>

        {/* TAGS + HOURS */}
        <div className="flex gap-4 mt-5 items-start">
          <div className="flex flex-wrap gap-2.5 flex-1">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full bg-[#2f4b2f]/10 text-[#2f4b2f] text-[12px] font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 min-w-[170px] border border-[#2f4b2f]">
            <div className="flex items-center gap-1.5 mb-3">
              <Clock size={13} className="text-[#2f4b2f]" />
              <span className="text-[12px] font-semibold text-[#2f4b2f]">
                Operating Hours
              </span>
            </div>
            {place.hours.map((item) => (
              <div
                key={item.day}
                className="flex justify-between items-center mb-1.5"
              >
                <span className="text-[11px] text-gray-400">{item.day}</span>
                <span
                  className={`text-[11px] font-bold ${item.closed ? "text-[#A36065]" : "text-[#2f4b2f]"}`}
                >
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => window.open(place.mapLink, "_blank")}
          className="mt-6 mb-12 flex items-center gap-2 bg-[#2f4b2f] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#3d6b3d] transition-colors"
        >
          Go There
          <ArrowRight size={16} />
        </button>

        {/* REVIEWS */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[15px] text-[#2f4b2f]">
            Latest Review
          </h2>
          <button
            onClick={() => setShowReview(true)}
            className="flex items-center gap-1.5 bg-[#2f4b2f] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#3d6b3d] transition-colors"
          >
            Write a Review
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 items-start"
            >
              <div className="w-9 h-9 rounded-full bg-[#c5a98e] flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">AR</span>
              </div>
              <div className="flex-1 min-w-0">
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
