"use client";

import Image from "next/image";
import { ArrowLeft, Bookmark, Clock, ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

// ── DATA DAFTAR REVIEW ──
const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: localStorage.getItem("username") || "User",
    text: "Absolutely love this spot for morning coding sessions.",
  },
  {
    id: 2,
    name: localStorage.getItem("username") || "User",
    text: "Very peaceful and comfortable atmosphere.",
  },
  {
    id: 3,
    name: localStorage.getItem("username") || "User",
    text: "One of my favorite places to focus and unwind at the same time. Definitely recommended for students and remote workers looking for calm spaces.",
  },
];

// ── DATA EMOJI ──
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

function ReviewModal({
  onClose,
  onSubmitReview,
}: {
  onClose: () => void;
  onSubmitReview: (review: any) => void;
}) {
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const savedUser = localStorage.getItem("user");
  const userData = savedUser ? JSON.parse(savedUser) : null;
  const handleSubmit = () => {
    if (!rating || !text.trim()) return;

    onSubmitReview({
      id: Date.now(),
      name: userData?.username || "User",
      text,
      rating,
    });

    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[24px] p-10 w-full max-w-[500px] relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl"
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

            <div className="flex justify-center gap-4 my-8">
              {emojis.map((e) => (
                <button
                  key={e.val}
                  onClick={() => setRating(e.val)}
                  className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
                    rating === e.val
                      ? "scale-125 opacity-100"
                      : "opacity-40 hover:opacity-70"
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

            <div className="bg-[#EBEDEA] border border-gray-200 rounded-2xl p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-transparent text-[13px] text-gray-700 resize-none h-[100px] outline-none placeholder-gray-400"
              />

              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!rating || !text.trim()}
                  className="bg-[#2f4b2f] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl hover:bg-[#3d6b3d] disabled:opacity-40 transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-20 h-20 rounded-[20px] bg-[#eef3ee] flex items-center justify-center mb-8">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M8 21 L17 30 L33 10"
                  stroke="#0B7A3B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 34 H31"
                  stroke="#0B7A3B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="text-[28px] leading-tight font-extrabold text-[#131B11]">
              Your Review has been
              <br />
              submitted!
            </h2>

            <p className="text-[14px] text-[#5E5E5E] mt-6 leading-relaxed max-w-[320px]">
              Thanks for sharing! Your input helps other users make better
              choices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpotDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/data/places.json")
      .then((res) => res.json())
      .then((data) => {
        if (data[slug]) {
          setPlace(data[slug]);
        } else {
          const savedSpots = localStorage.getItem("spots");
          const adminSpots = savedSpots ? JSON.parse(savedSpots) : [];

          const foundSpot = adminSpots.find((spot: any) => {
            const spotSlug = spot.name.toLowerCase().replaceAll(" ", "-");
            return spotSlug === slug;
          });

          if (foundSpot) {
            setPlace({
              name: foundSpot.name,
              image: foundSpot.img,
              rating: 4.8,
              ratingIcon: "/beaming-black.png",
              description: foundSpot.description,
              tags: foundSpot.facilities || [],
              hours: [
                {
                  day: "Everyday",
                  hours: `${foundSpot.openHour} - ${foundSpot.closeHour}`,
                  closed: false,
                },
              ],
              mapLink: `https://www.google.com/maps/search/?api=1&query=${foundSpot.coordinates}`,
            });
          }
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

    useEffect(() => {
      const stored = localStorage.getItem("bookmarks");

      if (stored) {
        const bookmarks = JSON.parse(stored);
        setIsBookmarked(bookmarks.some((b: any) => b.slug === slug));
      }
    }, [slug]);

  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews-${slug}`);

    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(DEFAULT_REVIEWS);
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
      localStorage.setItem(
        "bookmarks",
        JSON.stringify([...bookmarks, { slug, ...place }])
      );

      setIsBookmarked(true);
    }
  };

  const handleAddReview = (review: any) => {
    const updatedReviews = [review, ...reviews];

    setReviews(updatedReviews);

    localStorage.setItem(`reviews-${slug}`, JSON.stringify(updatedReviews));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF2F3] font-bold text-[#2f4b2f]">
        Loading...
      </div>
    );
  }

  if (!place) {
    return (
      <div className="p-10 text-center text-[#2f4b2f] font-bold">
        Spot tidak ditemukan.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: "#FBF2F3",
      }}
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

        <div className="absolute top-5 left-5 right-5 flex items-center justify-between px-2 py-2 rounded-full bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 ml-1">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-[#2f4b2f] group transition-all"
            >
              <ArrowLeft
                size={18}
                className="text-[#2f4b2f] group-hover:text-white transition-colors"
              />
            </button>

            <span className="text-[#2f4b2f] text-[15px] font-bold tracking-tight">
              Detail Spot
            </span>
          </div>

          <button
            onClick={toggleBookmark}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center mr-1 shadow-sm"
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

      <div className="max-w-2xl mx-auto px-5 pb-20 pt-5">
        {showReview && (
          <ReviewModal
            onClose={() => setShowReview(false)}
            onSubmitReview={handleAddReview}
          />
        )}

        <div className="flex items-start justify-between">
          <h1 className="text-[2rem] font-bold text-[#2f4b2f] leading-tight tracking-tight">
            {place.name}
          </h1>

          <div className="flex items-center gap-1.5 mt-1 flex-shrink-0 ml-3">
            <Image src={place.ratingIcon} alt="rating" width={18} height={18} />

            <span className="font-bold text-[#2f4b2f] text-[14px]">
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
                className="px-4 py-1.5 rounded-full bg-[#2f4b2f]/10 text-[#2f4b2f] text-[12px] font-bold"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 min-w-[170px] border border-[#2f4b2f]/20">
            <div className="flex items-center gap-1.5 mb-3 text-[12px] font-bold text-[#2f4b2f]">
              <Clock size={13} /> Operating Hours
            </div>

            {place.hours.map((item: any) => (
              <div
                key={item.day}
                className="flex justify-between items-center mb-1.5 text-[11px]"
              >
                <span className="text-gray-400">{item.day}</span>

                <span
                  className={`font-bold ${
                    item.closed ? "text-[#A36065]" : "text-[#2f4b2f]"
                  }`}
                >
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => window.open(place.mapLink, "_blank")}
          className="mt-6 mb-12 flex items-center gap-2 bg-[#2f4b2f] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#3d6b3d] transition-all"
        >
          Go There <ArrowRight size={16} />
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[16px] text-[#2f4b2f]">
            Latest Review
          </h2>

          <button
            onClick={() => setShowReview(true)}
            className="flex items-center gap-1.5 bg-[#2f4b2f] text-white text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-[#3d6b3d] transition-all"
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
              className="bg-white rounded-[24px] p-4 shadow-sm flex gap-3 items-start border border-gray-50"
            >
              <div className="w-10 h-10 rounded-full bg-[#c5a98e] flex items-center justify-center text-white text-xs font-bold">
                A
              </div>

              <div className="flex-1">
                <p className="font-bold text-[13px] text-[#2f4b2f]">
                  {review.name}
                </p>

                <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed font-medium">
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