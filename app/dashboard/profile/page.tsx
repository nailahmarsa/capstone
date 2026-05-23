"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserCog, Pencil, LogOut, X, Save } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState("Kawan Teduh");
  const [email, setEmail] = useState("kawanteduh@mail.com");
  const [imgError, setImgError] = useState(false);
  const [historyReviews, setHistoryReviews] = useState<any[]>([]);
  const [avatar, setAvatar] = useState("/default-pfp.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [draftUsername, setDraftUsername] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // ─── 1. SECURE ROUTE GUARD: CEK TOKEN & ROLE VALID BE ───
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role === "admin") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      router.push("/auth?mode=signin");
      return;
    }

    // Jika token valid untuk user view, buka proteksi render halaman
    setIsAuthorized(true);

    // ─── 2. MEMBACA EMAIL & USERNAME REGISTERED SECARA TEPAT KETIKA MOUNT ───
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const savedUser = localStorage.getItem("user");

    let currentName = "Kawan Teduh";
    let currentEmail = "kawanteduh@mail.com";
    let currentAvatar = "/default-pfp.jpg";

    // Cek dari object 'user' JSON dahulu jika ada
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.username) currentName = userData.username;
        if (userData.email) currentEmail = userData.email;
        if (userData.avatar) currentAvatar = userData.avatar;
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    // Timpa dengan individual key 'username' & 'email' jika tersedia (Registered Data)
    if (storedUsername) currentName = storedUsername;
    if (storedEmail) currentEmail = storedEmail;

    // Set state utama
    setUsername(currentName);
    setEmail(currentEmail);
    setAvatar(currentAvatar);

    // Set draft form agar sinkron saat tombol edit ditekan
    setDraftUsername(currentName);
    setDraftEmail(currentEmail);
  }, [router]);

  useEffect(() => {
    // Hanya ambil data review jika user lolos validasi route guard
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role === "admin") return;

    // ─── MEMBACA HISTORY REVIEWS SECARA DINAMIS DARI LOCALSTORAGE ───
    const allReviews: any[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith("reviews-")) {
        try {
          const reviews = JSON.parse(localStorage.getItem(key) || "[]");
          allReviews.push(...reviews);
        } catch (e) {
          console.error(e);
        }
      }
    }

    allReviews.sort((a, b) => b.id - a.id);
    setHistoryReviews(allReviews);
  }, []);

  const handleAvatarChange = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatar(result);
      setImgError(false);

      const savedUser = localStorage.getItem("user");
      const userData = savedUser ? JSON.parse(savedUser) : {};

      const updatedUser = {
        ...userData,
        username: localStorage.getItem("username") || username,
        email: localStorage.getItem("email") || email,
        avatar: result,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.push("/");
  };

  const AvatarBox = ({
    sizeClasses,
    textClass,
  }: {
    sizeClasses: string;
    textClass: string;
  }) => (
    <div
      onClick={() => fileInputRef.current?.click()}
      className={`${sizeClasses} flex-shrink-0 bg-[#c5a98e] flex items-center justify-center rounded-3xl overflow-hidden cursor-pointer shadow-inner`}
    >
      {imgError || !avatar ? (
        <span className={`${textClass} font-bold text-white uppercase`}>
          {username ? username.charAt(0) : "K"}
        </span>
      ) : (
        <Image
          src={avatar}
          alt="profile"
          width={120}
          height={120}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );

  if (!isAuthorized) return null;

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background:
          "linear-gradient(180deg, #f5c6cb 0%, #fbe8ea 30%, #fdf0f1 100%)",
      }}
    >
      {/* HEADER */}
      <div className="px-10 pt-8 pb-4">
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md rounded-full p-2 pr-10 shadow-sm border border-white/20">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-300 hover:bg-[#2f4b2f] group border-none cursor-pointer"
          >
            <ArrowLeft
              size={20}
              className="text-[#2f4b2f] transition-colors duration-300 group-hover:text-white"
            />
          </button>
          <span className="text-[#1f2937] font-bold text-lg tracking-tight">
            Profile User
          </span>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto px-10">
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 bg-white/40 p-6 rounded-3xl border border-white/30 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full min-w-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarChange(file);
                }}
              />
              <AvatarBox
                sizeClasses="w-[120px] h-[120px]"
                textClass="text-4xl"
              />

              <div className="min-w-0 flex-1 w-full">
                {editing ? (
                  <div className="flex flex-col gap-2.5 max-w-sm mx-auto sm:mx-0">
                    <input
                      type="text"
                      value={draftUsername}
                      onChange={(e) => setDraftUsername(e.target.value)}
                      className="w-full bg-white/90 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200 text-[#1f2937] focus:border-[#2f4b2f] transition-all"
                      placeholder="Username"
                    />
                    <input
                      type="email"
                      value={draftEmail}
                      onChange={(e) => setDraftEmail(e.target.value)}
                      className="w-full bg-white/90 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200 text-[#1f2937] focus:border-[#2f4b2f] transition-all"
                      placeholder="Email"
                    />
                  </div>
                ) : (
                  <div className="truncate">
                    <h2 className="text-2xl font-extrabold text-[#1f2937] truncate">
                      {username}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium truncate">
                      {email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* BUTTON CONTROLS */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <button className="p-1 transition-colors duration-300 text-[#1f2937] hover:text-[#c1697a] bg-transparent border-none cursor-pointer">
                <UserCog size={28} />
              </button>

              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 bg-white/80 text-[#1f2937] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-white transition-all shadow-sm border-none cursor-pointer"
                  >
                    <X size={14} />
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setUsername(draftUsername);
                      setEmail(draftEmail);

                      localStorage.setItem("username", draftUsername);
                      localStorage.setItem("email", draftEmail);

                      const updatedUser = {
                        username: draftUsername,
                        email: draftEmail,
                        avatar: avatar,
                      };
                      localStorage.setItem("user", JSON.stringify(updatedUser));

                      setEditing(false);
                    }}
                    className="flex items-center gap-2 bg-[#2f4b2f] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#3d6b3d] transition-all shadow-md border-none cursor-pointer"
                  >
                    <Save size={14} />
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setDraftUsername(username);
                    setDraftEmail(email);
                    setEditing(true);
                  }}
                  className="flex items-center gap-2 bg-[#2f4b2f] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#3d6b3d] transition-all shadow-md border-none cursor-pointer"
                >
                  <Pencil size={14} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* HISTORIKAL REVIEW */}
        <div className="mt-14">
          <h2 className="text-[17px] font-bold text-[#c1697a] mb-5 tracking-wide">
            Your History Reviews
          </h2>

          <div className="flex flex-col gap-4">
            {historyReviews.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8 bg-white/30 rounded-2xl border border-dashed border-white/50">
                You haven&apos;t written any reviews yet.
              </p>
            ) : (
              historyReviews.map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="bg-white/80 backdrop-blur-sm rounded-[24px] px-6 py-5 flex items-start gap-4 shadow-sm border border-white/40 hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-full bg-[#c5a98e] flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                    {username ? username.charAt(0).toUpperCase() : "K"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-sm text-[#1f2937] truncate">
                        {username}
                      </p>
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">
                        Recent
                      </span>
                    </div>
                    <p className="text-[12.5px] text-gray-500 mt-1.5 leading-relaxed break-words">
                      {review.text || review.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="mt-10 flex justify-end pb-16">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border-2 border-[#A36065] text-[#A36065] text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#A36065] hover:text-white transition-all shadow-sm cursor-pointer bg-transparent"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
