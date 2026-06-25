import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/db.js';
import { User, Deck, Lesson, Vocabulary } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    // 1. Sync database (reset tables)
    await sequelize.sync({ force: true });
    console.log("Database synced and cleared!");

    // 2. Create a test user
    const user = await User.create({
      name: 'Test Learner',
      email: 'test@hanmemo.com',
      password_hash: '$2b$10$YourHashedPasswordHere', // Dummy hash for testing
      role: 'learner'
    });

    // 3. Create a deck and lesson
    const deck = await Deck.create({ title: 'HSK 1', hsk_level: 1 });
    const lesson = await Lesson.create({ deck_id: deck.id, title: 'Greetings', lesson_number: 1 });

    // 4. Read the JSON file and seed the Vocabulary table
    const rawData = await fs.readFile(path.resolve(__dirname, '../data/hsk1.json'), 'utf-8');
    const vocabList = JSON.parse(rawData);

    // Add the missing required fields (deck_id, lesson_id, hsk_level) to each word
    const vocabDataToInsert = vocabList.map(word => ({
      ...word,
      deck_id: deck.id,
      lesson_id: lesson.id,
      hsk_level: 1
    }));

    // Use bulkCreate to insert the whole array at once (much faster!)
    await Vocabulary.bulkCreate(vocabDataToInsert);

    console.log(`Database seeded successfully! Added ${vocabDataToInsert.length} vocabulary words.`);
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    process.exit();
  }
};

seedDatabase();