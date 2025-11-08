"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

interface Board {
  id: string;
  name: string;
  category: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardCategory, setNewBoardCategory] = useState("Other");
  const [editBoardId, setEditBoardId] = useState<string | null>(null);
  const [editBoardName, setEditBoardName] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    async function loadUserBoards() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return router.push("/login");
      setUser(authData.user);

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", authData.user.id)
        .single();
      if (!profile) return;
      setProfileId(profile.id);

      const { data: boardsData } = await supabase
        .from("boards")
        .select("*")
        .eq("owner_id", profile.id)
        .order("created_at");
      if (boardsData) setBoards(boardsData);
    }
    loadUserBoards();
  }, [router]);

  const createBoard = async () => {
    if (!newBoardName || !profileId) return;
    const { data, error } = await supabase
      .from("boards")
      .insert({
        owner_id: profileId,
        name: newBoardName,
        category: newBoardCategory || "Other",
      })
      .select()
      .single();

    if (error) return console.error("Error creating board:", error);
    if (data) {
      setBoards([...boards, data]);
      setNewBoardName("");
      setNewBoardCategory("Other");
    }
  };

  const deleteBoard = async (id: string) => {
    await supabase.from("boards").delete().eq("id", id);
    setBoards(boards.filter((b) => b.id !== id));
  };

  const startEdit = (board: Board) => {
    setEditBoardId(board.id);
    setEditBoardName(board.name);
  };

  const saveEdit = async () => {
    if (!editBoardId || !editBoardName) return;
    const { data, error } = await supabase
      .from("boards")
      .update({ name: editBoardName })
      .eq("id", editBoardId)
      .select()
      .single();

    if (!error && data) {
      setBoards(
        boards.map((b) => (b.id === editBoardId ? { ...b, name: editBoardName } : b))
      );
      setEditBoardId(null);
      setEditBoardName("");
    }
  };

  const filteredBoards =
    filterCategory === "All"
      ? boards
      : boards.filter((b) => b.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="text-center mt-12">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-wide animate-fadeIn">
          Welcome In <span className="text-cyan-300">Taskora</span>
        </h1>
        <p className="mt-4 text-gray-400 text-lg md:text-xl italic">
          Task Management Or Productivity Tool{" "}
          <span className="text-cyan-300 font-bold">TASKORA</span>!
        </p>
      </div>

      {/* Create Board */}
      <div className="mt-12 flex flex-wrap gap-3 justify-center animate-fadeIn delay-400">
        <input
          type="text"
          placeholder="Enter new board name..."
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none w-72 backdrop-blur-md"
        />
        <select
          value={newBoardCategory}
          onChange={(e) => setNewBoardCategory(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 backdrop-blur-md"
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
          <option value="Other">Other</option>
        </select>
        <button
          onClick={createBoard}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform"
        >
          + Create Board
        </button>
      </div>

      {/* Filter by Category */}
      <div className="mt-6 flex justify-center animate-fadeIn delay-600">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 backdrop-blur-md"
        >
          <option value="All">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Boards List */}
      <div className="mt-12 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBoards.length > 0 ? (
          filteredBoards.map((b) => (
            <div
              key={b.id}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-gray-700 transition-transform transform hover:scale-105 flex flex-col justify-between animate-fadeIn"
            >
              {editBoardId === b.id ? (
                <div className="space-y-2">
                  <input
                    value={editBoardName}
                    onChange={(e) => setEditBoardName(e.target.value)}
                    className="px-3 py-2 rounded bg-gray-700 w-full outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditBoardId(null)}
                      className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    onClick={() => router.push(`/boards/${b.id}`)}
                    className="cursor-pointer"
                  >
                    <h2 className="font-bold text-xl">{b.name}</h2>
                    <p className="text-sm text-gray-400 mt-2">Category: {b.category}</p>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => startEdit(b)}
                      className="text-yellow-400 hover:text-yellow-500"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteBoard(b.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 italic">
            No boards found in this category ✨
          </div>
        )}
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeBounce {
          0% { opacity: 0; transform: translateY(-10px); }
          50% { opacity: 1; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeBounce 0.6s ease forwards; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
}
