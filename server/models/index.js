// src/models/index.js
import User from './User.js';
import Deck from './Deck.js';
import Lesson from './Lesson.js';
import Vocabulary from './Vocabulary.js';
import UserLesson from './UserLesson.js';
import ReviewSession from './ReviewSession.js';

// ------------------------------------------
// 1. Core Curriculum Relationships
// ------------------------------------------
// Deck <-> Lesson
Deck.hasMany(Lesson, { foreignKey: 'deck_id', onDelete: 'CASCADE' });
Lesson.belongsTo(Deck, { foreignKey: 'deck_id' });

// Deck <-> Vocabulary
Deck.hasMany(Vocabulary, { foreignKey: 'deck_id', onDelete: 'CASCADE' });
Vocabulary.belongsTo(Deck, { foreignKey: 'deck_id' });

// Lesson <-> Vocabulary
Lesson.hasMany(Vocabulary, { foreignKey: 'lesson_id', onDelete: 'CASCADE' });
Vocabulary.belongsTo(Lesson, { foreignKey: 'lesson_id' });


// ------------------------------------------
// 2. User Activity Relationships (The Junctions)
// ------------------------------------------

// User <-> Lesson (Through UserLesson)
User.belongsToMany(Lesson, { through: UserLesson, foreignKey: 'user_id' });
Lesson.belongsToMany(User, { through: UserLesson, foreignKey: 'lesson_id' });
// Add direct relations so we can easily query "UserLesson.findAll({ where: ... })"
User.hasMany(UserLesson, { foreignKey: 'user_id' });
UserLesson.belongsTo(User, { foreignKey: 'user_id' });
Lesson.hasMany(UserLesson, { foreignKey: 'lesson_id' });
UserLesson.belongsTo(Lesson, { foreignKey: 'lesson_id' });


// User <-> Vocabulary (Through ReviewSession)
User.belongsToMany(Vocabulary, { through: ReviewSession, foreignKey: 'user_id' });
Vocabulary.belongsToMany(User, { through: ReviewSession, foreignKey: 'vocab_id' });
// Add direct relations for ReviewSession
User.hasMany(ReviewSession, { foreignKey: 'user_id' });
ReviewSession.belongsTo(User, { foreignKey: 'user_id' });
Vocabulary.hasMany(ReviewSession, { foreignKey: 'vocab_id' });
ReviewSession.belongsTo(Vocabulary, { foreignKey: 'vocab_id' });

// Export everything!
export { User, Deck, Lesson, Vocabulary, UserLesson, ReviewSession };