import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/db.js';
import { Deck, Lesson, Vocabulary } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDeck = async (level, fileName, deckTitle) => {
  // Check if deck already exists to prevent duplicate seeding
  let deck = await Deck.findOne({ where: { hsk_level: level } });
  if (deck) {
    console.log(`Deck ${deckTitle} already exists. Skipping.`);
    return 0;
  }

  deck = await Deck.create({ title: deckTitle, hsk_level: level });
  
  const filePath = path.resolve(__dirname, `../data/${fileName}`);
  const rawData = await fs.readFile(filePath, 'utf-8');
  const vocabList = JSON.parse(rawData);

  const WORDS_PER_LESSON = 10;
  let totalWordsAdded = 0;

  for (let i = 0; i < vocabList.length; i += WORDS_PER_LESSON) {
    const lessonChunk = vocabList.slice(i, i + WORDS_PER_LESSON);
    const lessonNumber = Math.floor(i / WORDS_PER_LESSON) + 1;

    // Create a new Lesson in the database for this chunk
    const newLesson = await Lesson.create({ 
      deck_id: deck.id, 
      title: `${deckTitle} - Lesson ${lessonNumber}`, 
      lesson_number: lessonNumber 
    });

    // Add the missing required fields to each word in this specific chunk
    const vocabDataToInsert = lessonChunk.map(word => ({
      ...word,
      deck_id: deck.id,
      lesson_id: newLesson.id,
      hsk_level: level
    }));

    // Insert these 10 words into the database
    await Vocabulary.bulkCreate(vocabDataToInsert);
    totalWordsAdded += vocabDataToInsert.length;
  }
  
  console.log(`Created ${deckTitle} with ${totalWordsAdded} words across ${Math.ceil(vocabList.length / WORDS_PER_LESSON)} lessons.`);
  return totalWordsAdded;
};

const runSeeder = async () => {
  try {
    console.log("Seeding HSK 2 and HSK 3 into the database (non-destructive)...");
    
    // Seed HSK 2 and 3 without wiping the tables
    let total = 0;
    total += await seedDeck(2, 'hsk2.json', 'HSK 2');
    total += await seedDeck(3, 'hsk3.json', 'HSK 3');

    console.log(`\n🎉 Successfully seeded ${total} new vocabulary words!`);
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    process.exit();
  }
};

runSeeder();
