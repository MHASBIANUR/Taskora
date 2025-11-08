"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-900">
      <h1 className="text-3xl font-bold mb-8">Welcome to My App</h1>
      <div className="flex gap-4">
        <button
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
          onClick={() => router.push("/register")}
        >
          Register
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
}
