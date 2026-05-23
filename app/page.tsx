"use client";

import { useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type AuthCardProps = {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
};

type InputProps = {
  label: string;
  placeholder: string;
  type?: string;
};

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/bg1.jpg"
        alt="background"
        fill
        className="object-cover blur-[2px] scale-100 brightness-90"
      />

      <div className="absolute inset-0 bg-white/40" />

      <div className="relative z-10 w-full flex items-center justify-center">
        <AuthCard isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
      </div>
    </main>
  );
}

function AuthCard({ isSignUp, setIsSignUp }: AuthCardProps) {
  return (
    <div className="bg-white/95 rounded-2xl shadow-lg p-6 w-[360px] mx-auto">
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/Group 3.png"
          alt="logo"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>

      <h2 className="text-center text-sm mt-4 text-[#354e30] font-semibold">
        Welcome, Kawan Teduh!
      </h2>

      <form className="space-y-4 mt-8">
        <Input label="Username" placeholder="Enter your username" />
        <Input label="Password" placeholder="******" type="password" />

        <div className="text-right text-xs font-medium text-[#354e30] mt-0.5 cursor-pointer hover:underline transition">
          Forgot password?
        </div>

        <button
          type="button"
          className="w-full bg-[#354e30] text-[#ebedea] py-3 rounded-md hover:bg-[#202f1d] transition"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-[#354e30]">
        {isSignUp ? (
          <>
            Have an account?{" "}
            <span
              className="font-semibold cursor-pointer"
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </span>
          </>
        ) : (
          <>
            Didn&apos;t have an account?{" "}
            <span
              className="font-semibold cursor-pointer"
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </span>
          </>
        )}
      </p>
    </div>
  );
}

function Input({ label, placeholder, type = "text" }: InputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-sm mb-1 text-[#354e30] font-bold">
        {label}
      </label>

      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-gray-100 text-black rounded-md px-3 py-2 pr-10 outline-none text-sm placeholder:text-gray-400"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {show ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
    </div>
  );
}