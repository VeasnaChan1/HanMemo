import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch all cards from your backend
    axios.get("/api/cards").then((res) => setCards(res.data));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Vocabulary Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <Plus className="mr-2" size={18} /> Add New Card
        </button>
      </div>

      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-4">Character</th>
            <th className="p-4">Pinyin</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id} className="border-t">
              <td className="p-4">{card.character}</td>
              <td className="p-4">{card.pinyin}</td>
              <td className="p-4 flex gap-2">
                <button>
                  <Edit2 size={18} />
                </button>
                <button className="text-red-500">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
