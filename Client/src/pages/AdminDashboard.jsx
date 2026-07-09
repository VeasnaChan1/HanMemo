import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all vocabulary cards via admin API
    const load = async () => {
      try {
        const [vRes, uRes] = await Promise.all([
          API.get("/admin/vocabulary"),
          API.get("/admin/users"),
        ]);
        setCards(vRes.data.vocabulary || []);
        setUsers(uRes.data.users || []);
      } catch (err) {
        console.error("Failed to load admin data", err);
      }
    };
    load();
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
              <td className="p-4">{card.hanzi || card.character}</td>
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

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4 flex gap-2">
                  <button
                    className="text-red-600"
                    onClick={async () => {
                      if (!confirm(`Delete user ${u.email}?`)) return;
                      try {
                        await API.delete(`/admin/users/${u.id}`);
                        setUsers((prev) => prev.filter((x) => x.id !== u.id));
                      } catch (err) {
                        console.error("Failed to delete user", err);
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
