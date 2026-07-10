/**
 * adminApi.js
 * Centralised service layer for all Admin Console API calls.
 * Every function returns the unwrapped data payload directly.
 * Hierarchy: Deck (HSK 1-4)  →  Lesson (many)  →  Vocabulary (many words)
 */
import API from "./axios";

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────────────────────────────────────
export const adminApi = {
  // GET /api/admin/stats
  // Returns: { totalDecks, totalLessons, totalVocabulary, totalUsers }
  getStats: async () => {
    const { data } = await API.get("/admin/stats");
    return data;
  },

  // ─── DECKS ────────────────────────────────────────────────────────────────
  // GET /api/admin/decks
  // Returns: { decks: [ { id, title, hsk_level, description, lessonCount, wordCount, created_at } ] }
  getDecks: async () => {
    const { data } = await API.get("/admin/decks");
    return data.decks || [];
  },

  // POST /api/admin/decks
  createDeck: async (payload) => {
    const { data } = await API.post("/admin/decks", payload);
    return data.deck;
  },

  // PATCH /api/admin/decks/:id
  updateDeck: async (id, payload) => {
    const { data } = await API.patch(`/admin/decks/${id}`, payload);
    return data.deck;
  },

  // DELETE /api/admin/decks/:id
  deleteDeck: async (id) => {
    const { data } = await API.delete(`/admin/decks/${id}`);
    return data;
  },

  // ─── LESSONS ──────────────────────────────────────────────────────────────
  // GET /api/admin/lessons
  // Returns: { lessons: [ { id, title, lesson_number, deck_id, Deck: { title, hsk_level } } ] }
  getLessons: async (deckId) => {
    const params = deckId ? { deck_id: deckId } : {};
    const { data } = await API.get("/admin/lessons", { params });
    return data.lessons || [];
  },

  // POST /api/admin/lessons
  createLesson: async (payload) => {
    const { data } = await API.post("/admin/lessons", payload);
    return data.lesson;
  },

  // PATCH /api/admin/lessons/:id
  updateLesson: async (id, payload) => {
    const { data } = await API.patch(`/admin/lessons/${id}`, payload);
    return data.lesson;
  },

  // DELETE /api/admin/lessons/:id  (cascades vocab)
  deleteLesson: async (id) => {
    const { data } = await API.delete(`/admin/lessons/${id}`);
    return data;
  },

  // ─── VOCABULARY ───────────────────────────────────────────────────────────
  // GET /api/admin/vocabulary?page=&limit=&hsk=&search=&lesson_id=
  // Returns: { total, page, vocabulary: [ { id, hanzi, pinyin, definition_en, definition_km, hsk_level, Lesson } ] }
  getVocabulary: async ({ page = 1, limit = 10, hsk = "", search = "", lessonId = "" } = {}) => {
    const params = { page, limit };
    if (hsk) params.hsk = hsk;
    if (search) params.search = search;
    if (lessonId) params.lesson_id = lessonId;
    const { data } = await API.get("/admin/vocabulary", { params });
    return { total: data.total || 0, page: data.page || 1, vocabulary: data.vocabulary || [] };
  },

  // POST /api/admin/vocabulary
  createVocabulary: async (payload) => {
    const { data } = await API.post("/admin/vocabulary", payload);
    return data.vocab;
  },

  // PATCH /api/admin/vocabulary/:id
  updateVocabulary: async (id, payload) => {
    const { data } = await API.patch(`/admin/vocabulary/${id}`, payload);
    return data.vocab;
  },

  // DELETE /api/admin/vocabulary/:id
  deleteVocabulary: async (id) => {
    const { data } = await API.delete(`/admin/vocabulary/${id}`);
    return data;
  },

  // ─── USERS ────────────────────────────────────────────────────────────────
  // GET /api/admin/users
  // Returns: { users: [ { id, name, email, role, hsk_level, streak, created_at } ] }
  getUsers: async () => {
    const { data } = await API.get("/admin/users");
    return data.users || [];
  },

  // POST /api/admin/users
  createUser: async (payload) => {
    const { data } = await API.post("/admin/users", payload);
    return data.user;
  },

  // PATCH /api/admin/users/:id
  updateUser: async (id, payload) => {
    const { data } = await API.patch(`/admin/users/${id}`, payload);
    return data.user;
  },

  // DELETE /api/admin/users/:id
  deleteUser: async (id) => {
    const { data } = await API.delete(`/admin/users/${id}`);
    return data;
  },
};
