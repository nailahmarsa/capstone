"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const facilities = ["Indoor", "Busy", "Groups", "Relaxed", "Outdoor", "Quiet", "Alone", "Focused"];
const crowdedness = ["Low", "High"];

export default function SearchFilterPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedCrowdedness, setSelectedCrowdedness] = useState<string[]>([]);

  const toggleFacility = (item: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    );
  };

  const toggleCrowdedness = (item: string) => {
    setSelectedCrowdedness((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedFacilities.length) params.set("facilities", selectedFacilities.join(","));
    if (selectedCrowdedness.length) params.set("crowdedness", selectedCrowdedness.join(","));

    router.push(`/results?${params.toString()}`);
  };

  return (
    <div
      className="min-h-screen bg-[#efefef] flex justify-center items-start pt-16 px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* CARD */}
      <div className="bg-white rounded-3xl p-6 flex flex-col gap-6 w-full max-w-xl shadow-sm">

        {/* SEARCH INPUT */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your quiet spot..."
            className="w-full px-4 py-2 rounded-full bg-[#f5f5f5] text-sm outline-none placeholder:text-gray-400 placeholder:italic"
          />
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
        </div>

        {/* FACILITIES */}
        <div>
          <h2 className="text-[13px] font-bold text-[#2f4b2f] mb-3">
            Facilities
          </h2>

          <div className="flex flex-wrap gap-2">
            {facilities.map((item) => (
              <button
                key={item}
                onClick={() => toggleFacility(item)}
                className={`px-4 py-1.5 rounded-full border text-[12px] transition-all duration-200 ${
                  selectedFacilities.includes(item)
                    ? "bg-[#354e30] text-white border-[#354e30]"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* CROWDEDNESS */}
        <div>
          <h2 className="text-[13px] font-bold text-[#2f4b2f] mb-3">
            Crowdedness
          </h2>

          <div className="flex gap-2">
            {crowdedness.map((item) => (
              <button
                key={item}
                onClick={() => toggleCrowdedness(item)}
                className={`px-6 py-1.5 rounded-full border text-[12px] transition-all duration-200 ${
                  selectedCrowdedness.includes(item)
                    ? "bg-[#354e30] text-white border-[#354e30]"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="group flex items-center gap-2 bg-[#354e30] text-white text-[13px] font-medium px-6 py-2.5 rounded-full hover:bg-[#c37379] transition-all duration-300"
          >
            Search
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>
        </div>

      </div>
    </div>
  );
}