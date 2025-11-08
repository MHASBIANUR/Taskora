"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import { Pencil, Trash2, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

interface Column {
  id: string;
  name: string;
  position: number;
}

interface Card {
  id: string;
  title: string;
  description: string | null;
  position: number;
  column_id: string;
  done: boolean;
}

interface Board {
  id: string;
  name: string;
}

export default function BoardPage() {
  const router = useRouter();
  const { boardId } = useParams<{ boardId: string }>();

  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [cards, setCards] = useState<Record<string, Card[]>>({});

  // form states
  const [newColumnName, setNewColumnName] = useState("");
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // edit states
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editColumnName, setEditColumnName] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editCardTitle, setEditCardTitle] = useState("");
  const [editCardDesc, setEditCardDesc] = useState("");

  // Load board, columns & cards
  useEffect(() => {
    async function loadBoard() {
      if (!boardId) return;

      const { data: b } = await supabase
        .from("boards")
        .select("*")
        .eq("id", boardId)
        .single();
      if (!b) return router.push("/dashboard");
      setBoard(b);

      const { data: cols } = await supabase
        .from("columns")
        .select("*")
        .eq("board_id", boardId)
        .order("position");
      if (cols) setColumns(cols);

      const { data: allCards } = await supabase
        .from("cards")
        .select("*")
        .in("column_id", cols?.map((c) => c.id) || [])
        .order("position");

      if (allCards) {
        const grouped: Record<string, Card[]> = {};
        allCards.forEach((card: Card) => {
          if (!grouped[card.column_id]) grouped[card.column_id] = [];
          grouped[card.column_id].push(card);
        });
        setCards(grouped);
      }
    }
    loadBoard();
  }, [boardId, router]);

  // Move Card
  const moveCard = async (card: Card, direction: "left" | "right") => {
    const colIndex = columns.findIndex((c) => c.id === card.column_id);
    if (colIndex === -1) return;

    const targetIndex = direction === "left" ? colIndex - 1 : colIndex + 1;
    if (targetIndex < 0 || targetIndex >= columns.length) return;

    const targetColumn = columns[targetIndex];
    const position = (cards[targetColumn.id]?.length || 0) + 1;

    const { data } = await supabase
      .from("cards")
      .update({ column_id: targetColumn.id, position })
      .eq("id", card.id)
      .select()
      .single();

    if (data) {
      setCards((prev) => {
        const newState: Record<string, Card[]> = {};
        for (const [colId, colCards] of Object.entries(prev)) {
          newState[colId] = colCards.filter((c) => c.id !== card.id);
        }
        newState[targetColumn.id] = [...(newState[targetColumn.id] || []), data];
        return newState;
      });
    }
  };

  // Column CRUD
  const createColumn = async () => {
    if (!newColumnName || !board) return;
    const position = columns.length + 1;
    const { data } = await supabase
      .from("columns")
      .insert({ board_id: board.id, name: newColumnName, position })
      .select()
      .single();
    if (data) {
      setColumns([...columns, data]);
      setNewColumnName("");
    }
  };

  const editColumn = async (id: string) => {
    if (!editColumnName) return;
    const { data } = await supabase
      .from("columns")
      .update({ name: editColumnName })
      .eq("id", id)
      .select()
      .single();
    if (data) {
      setColumns(columns.map((c) => (c.id === id ? data : c)));
      setEditingColumn(null);
      setEditColumnName("");
    }
  };

  const deleteColumn = async (id: string) => {
    await supabase.from("columns").delete().eq("id", id);
    setColumns(columns.filter((c) => c.id !== id));
    const newCards = { ...cards };
    delete newCards[id];
    setCards(newCards);
  };

  // Card CRUD
  const createCard = async () => {
    if (!selectedColumn || !newCardTitle) return;
    const position = (cards[selectedColumn]?.length || 0) + 1;

    const { data } = await supabase
      .from("cards")
      .insert({
        column_id: selectedColumn,
        title: newCardTitle,
        description: newCardDesc,
        position,
        done: false,
      })
      .select()
      .single();

    if (data) {
      setCards({
        ...cards,
        [selectedColumn]: [...(cards[selectedColumn] || []), data],
      });
      setNewCardTitle("");
      setNewCardDesc("");
      setSelectedColumn(null);
    }
  };

  const editCard = async (id: string, columnId: string) => {
    if (!editCardTitle) return;
    const { data } = await supabase
      .from("cards")
      .update({ title: editCardTitle, description: editCardDesc })
      .eq("id", id)
      .select()
      .single();
    if (data) {
      setCards({
        ...cards,
        [columnId]: cards[columnId].map((c) => (c.id === id ? data : c)),
      });
      setEditingCardId(null);
      setEditCardTitle("");
      setEditCardDesc("");
    }
  };

  const deleteCard = async (id: string, columnId: string) => {
    await supabase.from("cards").delete().eq("id", id);
    setCards({
      ...cards,
      [columnId]: cards[columnId].filter((c) => c.id !== id),
    });
  };

  const toggleCardDone = async (id: string, columnId: string, done: boolean) => {
    const { data } = await supabase
      .from("cards")
      .update({ done: !done })
      .eq("id", id)
      .select()
      .single();

    if (data) {
      setCards({
        ...cards,
        [columnId]: cards[columnId].map((c) => (c.id === id ? data : c)),
      });
    }
  };

  // AI description generator
  const generateDescription = async () => {
    if (!newCardTitle) return alert("Isi dulu judul kartu!");
    try {
      setGenerating(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCardTitle }),
      });
      const data = await res.json();
      if (!data.error) setNewCardDesc(data.description ?? "");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />

      <div className="text-center mt-10">
        <h1 className="text-4xl font-extrabold">{board?.name}</h1>
        <p className="mt-2 text-gray-400 text-lg">That&apos;s your board ⬆️</p>
      </div>

      {/* Add Column */}
      <div className="mt-8 flex gap-2 justify-center">
        <input
          type="text"
          placeholder="New Column Name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none w-72"
        />
        <button
          onClick={createColumn}
          className="bg-green-600 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-green-700"
        >
          + Add Column
        </button>
      </div>

      {/* Columns */}
      <div className="flex gap-6 overflow-x-auto p-6">
        {columns.map((col) => {
          const colCards = cards[col.id] || [];
          const allDone = colCards.length > 0 && colCards.every((c) => c.done);

          return (
            <div
              key={col.id}
              className={`rounded-xl shadow-md p-4 w-72 flex-shrink-0 relative transition ${
                allDone
                  ? "bg-green-900/50 border border-green-600"
                  : "bg-gray-800"
              }`}
            >
              {/* Column Header */}
              {editingColumn === col.id ? (
                <div className="flex gap-2 mb-4">
                  <input
                    value={editColumnName}
                    onChange={(e) => setEditColumnName(e.target.value)}
                    className="px-2 py-1 rounded bg-gray-700 w-full"
                  />
                  <button
                    onClick={() => editColumn(col.id)}
                    className="bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingColumn(null)}
                    className="bg-gray-500 px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg">
                    {col.name} {allDone && "✅"}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingColumn(col.id);
                        setEditColumnName(col.name);
                      }}
                      className="p-1 rounded hover:bg-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteColumn(col.id)}
                      className="p-1 rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Cards */}
              <div className="space-y-3 mb-3">
                {colCards.map((card) => (
                  <div
                    key={card.id}
                    className={`p-3 rounded-lg shadow relative bg-gray-700 transition ${
                      card.done ? "opacity-60 line-through" : ""
                    }`}
                  >
                    {editingCardId === card.id ? (
                      <div className="space-y-2">
                        <input
                          value={editCardTitle}
                          onChange={(e) => setEditCardTitle(e.target.value)}
                          className="px-2 py-1 rounded bg-gray-600 w-full"
                        />
                        <textarea
                          value={editCardDesc}
                          onChange={(e) => setEditCardDesc(e.target.value)}
                          className="px-2 py-1 rounded bg-gray-600 w-full"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => editCard(card.id, col.id)}
                            className="bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCardId(null)}
                            className="bg-gray-500 px-2 py-1 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Header: Checkbox + Title */}
                        <div className="flex gap-2 items-start">
                          <input
                            type="checkbox"
                            checked={card.done}
                            onChange={() =>
                              toggleCardDone(card.id, col.id, card.done)
                            }
                            className="mt-1 cursor-pointer"
                          />
                          <p className="font-semibold text-white text-sm">
                            {card.title}
                          </p>
                        </div>

                        {/* Description full width */}
                        <p className="text-sm text-gray-300 mt-2 text-justify leading-relaxed break-words max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                          {card.description ?? ""}
                        </p>

                        {/* Action buttons di bawah */}
                        <div className="flex justify-between mt-3">
                          {/* Move Left / Right */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => moveCard(card, "left")}
                              className="p-1 rounded hover:bg-gray-600"
                            >
                              <ArrowLeft size={14} />
                            </button>
                            <button
                              onClick={() => moveCard(card, "right")}
                              className="p-1 rounded hover:bg-gray-600"
                            >
                              <ArrowRight size={14} />
                            </button>
                          </div>

                          {/* Edit / Delete */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingCardId(card.id);
                                setEditCardTitle(card.title);
                                setEditCardDesc(card.description ?? "");
                              }}
                              className="p-1 rounded hover:bg-blue-600"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => deleteCard(card.id, col.id)}
                              className="p-1 rounded hover:bg-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Card */}
              {selectedColumn === col.id ? (
                <div className="space-y-2">
                  <input
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="Card Title"
                    className="px-3 py-2 rounded bg-gray-700 w-full focus:outline-none"
                  />
                  <textarea
                    value={newCardDesc}
                    onChange={(e) => setNewCardDesc(e.target.value)}
                    placeholder="Description"
                    className="px-3 py-2 rounded bg-gray-700 w-full focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createCard}
                      className="bg-green-600 px-3 py-2 rounded w-full hover:bg-green-700"
                    >
                      Add Card
                    </button>
                    <button
                      onClick={generateDescription}
                      disabled={generating}
                      className="bg-blue-600 px-3 py-2 rounded flex items-center gap-1 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Sparkles size={16} />
                      {generating ? "..." : "Generate"}
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedColumn(null)}
                    className="text-xs text-gray-400 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedColumn(col.id)}
                  className="bg-gray-600 px-3 py-2 rounded w-full hover:bg-gray-500"
                >
                  + Add Card
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
