// server/scripts/seed.js

import path from 'path';
require('dotenv').config({ 
  path: path.join(__dirname, '../.env') 
});

const fs   = require('fs');
const db   = require('../config/db');

const WORDS_PER_LESSON = 8;

async function seed() {
  // Load your complete ChatGPT-generated file
  const words = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../data/hsk1.json'),
      'utf8'
    )
  );

  console.log(` Seeding ${words.length} HSK 1 words...`);

  // Create deck
  const [deckRow] = await db.query(
    `INSERT INTO decks (title, hsk_level, description)
     VALUES (?, ?, ?)`,
    ['HSK 1', 1, 'HSK 1 vocabulary for Cambodian learners']
  );
  const deckId = deckRow.insertId;
  console.log(` Created deck id: ${deckId}`);

  // Create lessons
  const totalLessons = Math.ceil(words.length / WORDS_PER_LESSON);
  const lessonIds    = [];

  for (let i = 0; i < totalLessons; i++) {
    // Get words for this lesson to generate a theme name
    const lessonWords = words.slice(
      i * WORDS_PER_LESSON,
      (i + 1) * WORDS_PER_LESSON
    );

    const [lessonRow] = await db.query(
      `INSERT INTO lessons
       (deck_id, title, lesson_number, is_unlocked_by_default)
       VALUES (?, ?, ?, ?)`,
      [
        deckId,
        `Lesson ${i + 1}`,
        i + 1,
        i === 0 ? 1 : 0
      ]
    );
    lessonIds.push(lessonRow.insertId);
    console.log(` Created lesson ${i + 1}`);
  }

  // Insert vocabulary
  for (let i = 0; i < words.length; i++) {
    const word      = words[i];
    const lessonIdx = Math.floor(i / WORDS_PER_LESSON);
    const lessonId  = lessonIds[lessonIdx];

    await db.query(
      `INSERT INTO vocabulary
       (deck_id, lesson_id, hanzi, pinyin,
        definition_en, definition_km,
        example_cn, example_pinyin,
        example_en, example_km,
        hsk_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        deckId,
        lessonId,
        word.hanzi,
        word.pinyin,
        word.definition_en,
        word.definition_km,
        word.example_cn,
        word.example_pinyin,
        word.example_en,
        word.example_km,
        1
      ]
    );

    console.log(`  Inserted: ${word.hanzi}`);
  }

  console.log(`\n Done! ${words.length} words seeded.`);
  process.exit(0);
}

seed().catch(err => {
  console.error(' Seed failed:', err);
  process.exit(1);
});