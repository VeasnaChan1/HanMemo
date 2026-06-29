import { Vocabulary } from '../models/index.js';
import { Sequelize } from 'sequelize';

export const generateLessonQuiz = async (lessonId) => {
    // 1. Fetch all vocabulary for this specific lesson
    const lessonVocab = await Vocabulary.findAll({ 
        where: { lesson_id: lessonId } 
    });

    if (!lessonVocab || lessonVocab.length === 0) {
        throw new Error("No vocabulary found for this lesson.");
    }

    // 2. Generate a multiple-choice question for each word
    const quizQuestions = await Promise.all(lessonVocab.map(async (word) => {
        // Fetch 3 random "distractor" words that are NOT the current word
        const distractors = await Vocabulary.findAll({
            where: { 
                id: { [Sequelize.Op.ne]: word.id } 
            },
            order: Sequelize.literal('RAND()'), // MySQL command to grab random rows
            limit: 3
        });

        // Combine the correct answer with the distractors and shuffle them
        const options = [
            word.definition_en, 
            ...distractors.map(d => d.definition_en)
        ].sort(() => Math.random() - 0.5); // Simple JavaScript array shuffle

        return {
            vocabId: word.id,
            question: `What is the meaning of ${word.hanzi} (${word.pinyin})?`,
            correctAnswer: word.definition_en,
            options: options
        };
    }));

    return quizQuestions;
};