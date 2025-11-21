"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [raindrops, setRaindrops] = useState<{ left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const drops = [...Array(100)].map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
    }));
    setRaindrops(drops);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("❌ Email dan password wajib diisi!");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMessage("❌ " + signUpError.message);
      return;
    }

    setMessage("✅ Registered! Check your email to confirm.");
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">

      {/* Hujan */}
      <div className="absolute inset-0">
        {raindrops.map((drop, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            }}
          />
        ))}
      </div>

      <form
        onSubmit={handleRegister}
        className="relative bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 z-10"
      >
        {/* Logo / Foto */}
        <div className="flex justify-center">
          <Image
            src="/images/TaskoraLogin.jpg"
            alt="Logo Taskora"
            width={200}
            height={200}
            className="rounded-full object-cover mb-4"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-white">Create Account 💙</h1>

        {/* Email input */}
        <div className="relative w-full">
          <HiOutlineMail className="absolute top-2.5 left-3 text-gray-400" size={24} />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-12 border border-gray-600 bg-gray-900 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div className="relative w-full">
          <HiOutlineLockClosed className="absolute top-2.5 left-3 text-gray-400" size={24} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 chars)"
            className="w-full pl-12 border border-gray-600 bg-gray-900 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <HiOutlineEyeOff size={24} /> : <HiOutlineEye size={24} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Register
        </button>

        {message && <p className="text-center text-sm text-gray-200">{message}</p>}

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400 hover:underline">
            Login here
          </Link>
        </p>
        <Link
          href="/"
          className="block text-center w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition mt-3"
        >
          Back to Landing Page
        </Link>
      </form>

      {/* Styles Hujan */}
      <style jsx>{`
        .raindrop {
          position: absolute;
          top: -10px;
          width: 2px;
          height: 12px;
          background: rgba(255, 255, 255, 0.4);
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes fall {
          to {
            transform: translateY(110vh);
          }
        }
      `}</style>
    </div>
  );
}
