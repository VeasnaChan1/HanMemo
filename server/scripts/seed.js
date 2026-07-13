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

    // 3. Create the main deck
    const deck = await Deck.create({ title: 'HSK 1', hsk_level: 1 });

    // 4. Read the JSON file
    const rawData = await fs.readFile(path.resolve(__dirname, '../data/hsk1.json'), 'utf-8');
    const vocabList = JSON.parse(rawData);

    // 5. >>> NEW CHUNKING LOGIC <<<
    const WORDS_PER_LESSON = 10;
    let totalWordsAdded = 0;

    // Loop through the JSON array in chunks of 10
    for (let i = 0; i < vocabList.length; i += WORDS_PER_LESSON) {
      // Grab the next 10 words
      const lessonChunk = vocabList.slice(i, i + WORDS_PER_LESSON);

      // Calculate the current lesson number (1, 2, 3, etc.)
      const lessonNumber = Math.floor(i / WORDS_PER_LESSON) + 1;

      // Create a new Lesson in the database for this chunk
      const newLesson = await Lesson.create({
        deck_id: deck.id,
        title: `HSK 1 - Lesson ${lessonNumber}`,
        lesson_number: lessonNumber
      });

      // Add the missing required fields to each word in this specific chunk
      const vocabDataToInsert = lessonChunk.map(word => ({
        ...word,
        deck_id: deck.id,
        lesson_id: newLesson.id, // Attach to the newly created lesson!
        hsk_level: 1
      }));

      // Insert these 10 words into the database
      await Vocabulary.bulkCreate(vocabDataToInsert);

      totalWordsAdded += vocabDataToInsert.length;
      console.log(`Created Lesson ${lessonNumber} with ${vocabDataToInsert.length} words.`);
    }

    console.log(`\n🎉 Database seeded successfully! Added ${totalWordsAdded} vocabulary words across ${Math.ceil(vocabList.length / WORDS_PER_LESSON)} lessons.`);
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    process.exit();
  }
};

seedDatabase();


