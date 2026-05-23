"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserCog, Pencil, LogOut, X, Save } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [imgError, setImgError] = useState(false);
  const [historyReviews, setHistoryReviews] = useState<any[]>([]);
   const [avatar, setAvatar] = useState("/default-pfp.jpg");
   const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [draftUsername, setDraftUsername] = useState("");
  const [draftEmail, setDraftEmail] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const userData = JSON.parse(savedUser);

      setUsername(userData.username);
      setEmail(userData.email);
      setAvatar(userData.avatar || "/default-pfp.jpg");

      setDraftUsername(userData.username);
      setDraftEmail(userData.email);
    }
  }, []);

  useEffect(() => {
    const allReviews: any[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith("reviews-")) {
        const reviews = JSON.parse(localStorage.getItem(key) || "[]");
        allReviews.push(...reviews);
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

      const savedUser = localStorage.getItem("user");
      const userData = savedUser ? JSON.parse(savedUser) : {};

      const updatedUser = {
        username: userData.username || username || "",
        email: userData.email || email || "",
        avatar: result,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    reader.readAsDataURL(file);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
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
      className={`${sizeClasses} flex-shrink-0 bg-[#c5a98e] flex items-center justify-center rounded-3xl overflow-hidden cursor-pointer`}
    >
      {imgError ? (
        <span className={`${textClass} font-bold text-white uppercase`}>
          {username.charAt(0)}
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

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background:
          "linear-gradient(180deg, #f5c6cb 0%, #fbe8ea 30%, #fdf0f1 100%)",
      }}
    >
      <div className="px-10 pt-8 pb-4">
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md rounded-full px-4 py-2.5 shadow-sm border border-white/20">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-300 hover:bg-[#2f4b2f] group"
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

      <div className="max-w-5xl mx-auto px-10">
        <div className="mt-8">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
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

              <div>
                {editing ? (
                  <div className="flex flex-col gap-3">
                    <input
                      value={draftUsername}
                      onChange={(e) => setDraftUsername(e.target.value)}
                      className="bg-white/80 rounded-xl px-4 py-2 text-sm outline-none border border-white/60 text-[#1f2937]"
                      placeholder="Username"
                    />
                    <input
                      value={draftEmail}
                      onChange={(e) => setDraftEmail(e.target.value)}
                      className="bg-white/80 rounded-xl px-4 py-2 text-sm outline-none border border-white/60 text-[#1f2937]"
                      placeholder="Email"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-extrabold text-[#1f2937]">
                      {username}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      {email}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <button className="p-1 transition-colors duration-300 text-[#1f2937] hover:text-[#c1697a]">
                <UserCog size={28} />
              </button>

              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const updatedUser = {
                        username: draftUsername,
                        email: draftEmail,
                        avatar: "/default-pfp.jpg",
                      };

                      setUsername(updatedUser.username);
                      setEmail(updatedUser.email);

                      localStorage.setItem("user", JSON.stringify(updatedUser));

                      setEditing(false);
                    }}
                    className="flex items-center gap-2 bg-white/70 text-[#1f2937] text-sm font-bold px-5 py-3 rounded-2xl hover:bg-white transition-all shadow-sm active:scale-95"
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

                      setEditing(false);
                    }}
                    className="flex items-center gap-2 bg-[#2f4b2f] text-white text-sm font-bold px-5 py-3 rounded-2xl hover:bg-[#3d6b3d] transition-all shadow-lg active:scale-95"
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
                  className="flex items-center gap-2 bg-[#2f4b2f] text-white text-sm font-bold px-6 py-3 rounded-2xl hover:bg-[#3d6b3d] transition-all shadow-lg active:scale-95"
                >
                  <Pencil size={14} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-[17px] font-bold text-[#c1697a] mb-5 tracking-wide">
            Your History Reviews
          </h2>

          <div className="flex flex-col gap-4">
            {historyReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="bg-white/80 backdrop-blur-sm rounded-[24px] px-6 py-5 flex items-start gap-4 shadow-sm border border-white/40 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-[#c5a98e] flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-sm text-[#1f2937]">
                      {username}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Recent
                    </span>
                  </div>
                  <p className="text-[12.5px] text-gray-500 mt-1.5 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end pb-16">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border-2 border-[#A36065] text-[#A36065] text-sm font-bold px-6 py-3 rounded-2xl hover:bg-[#A36065] hover:text-white transition-all shadow-sm active:scale-95"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}