create database hanmemo;
use hanmemo;
CREATE TABLE users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('admin', 'learner') DEFAULT 'learner',
  hsk_level       TINYINT DEFAULT 1,
  language        ENUM('en', 'km') DEFAULT 'km',
  streak          INT DEFAULT 0,
  last_active     DATE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE decks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  hsk_level   TINYINT NOT NULL,
  description VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
  id                      INT AUTO_INCREMENT PRIMARY KEY,
  deck_id                 INT NOT NULL,
  title                   VARCHAR(100) NOT NULL,
  lesson_number           INT NOT NULL,
  is_unlocked_by_default  BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

CREATE TABLE vocabulary (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  deck_id         INT NOT NULL,
  lesson_id       INT NOT NULL,
  hanzi           VARCHAR(20) NOT NULL,
  pinyin          VARCHAR(50) NOT NULL,
  part_of_speech  VARCHAR(20),
  definition_en   VARCHAR(255) NOT NULL,
  definition_km   VARCHAR(255),
  example_cn      VARCHAR(255),
  example_pinyin  VARCHAR(255),
  example_en      VARCHAR(255),
  example_km      VARCHAR(255),
  hsk_level       TINYINT NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (deck_id)   REFERENCES decks(id)   ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)  ON DELETE CASCADE
);

CREATE TABLE user_lessons (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  lesson_id    INT NOT NULL,
  is_unlocked  BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,

  UNIQUE KEY unique_user_lesson (user_id, lesson_id),
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)  ON DELETE CASCADE
);

CREATE TABLE review_sessions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  vocab_id     INT NOT NULL,
  ease_factor  FLOAT DEFAULT 2.5,
  interval_day     INT DEFAULT 1,
  repetitions  INT DEFAULT 0,
  next_review  DATE NOT NULL,
  last_rating  TINYINT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
               ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_vocab (user_id, vocab_id),
  FOREIGN KEY (user_id)  REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (vocab_id) REFERENCES vocabulary(id)  ON DELETE CASCADE
);

CREATE TABLE notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  type       ENUM('review_reminder', 'streak_alert') NOT NULL,
  sent_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status     ENUM('sent', 'failed') DEFAULT 'sent',

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Most important query: "what cards are due today for this user?"
CREATE INDEX idx_review_user_date 
  ON review_sessions(user_id, next_review);

-- Getting all vocabulary for a lesson
CREATE INDEX idx_vocab_lesson 
  ON vocabulary(lesson_id);

-- Getting all vocabulary for a deck
CREATE INDEX idx_vocab_deck 
  ON vocabulary(deck_id);

-- User lookup by email (used on every login)
CREATE INDEX idx_user_email 
  ON users(email);

-- Getting all lessons in a deck
CREATE INDEX idx_lessons_deck 
  ON lessons(deck_id);
  
  -- App user: limited privileges, used by your Express app
CREATE USER 'Veasna'@'localhost' 
  IDENTIFIED BY 'veasna123';

GRANT SELECT, INSERT, UPDATE, DELETE 
  ON hanmaomo_db.* 
  TO 'Veasna'@'localhost';

-- Admin user: full privileges, used for maintenance
CREATE USER 'Eychhean'@'localhost' 
  IDENTIFIED BY 'Eychhean';

GRANT ALL PRIVILEGES 
  ON hanmaomo_db.* 
  TO 'Eychhean'@'localhost';

FLUSH PRIVILEGES;

-- 1. Get all vocabulary due for review today for a user
SELECT v.hanzi, v.pinyin, v.definition_en, v.definition_km,
       rs.ease_factor, rs.interval, rs.next_review
FROM review_sessions rs
JOIN vocabulary v ON v.id = rs.vocab_id
WHERE rs.user_id = 1
AND rs.next_review <= CURDATE()
ORDER BY rs.next_review ASC;

-- 2. Get lesson progress for a user
SELECT l.title, l.lesson_number,
       ul.is_unlocked, ul.is_completed,
       COUNT(v.id) AS total_words
FROM lessons l
LEFT JOIN user_lessons ul ON ul.lesson_id = l.id 
  AND ul.user_id = 1
LEFT JOIN vocabulary v ON v.lesson_id = l.id
WHERE l.deck_id = 1
GROUP BY l.id
ORDER BY l.lesson_number;

-- 3. Get user's overall retention rate
SELECT 
  COUNT(*) AS total_cards,
  SUM(CASE WHEN last_rating >= 3 THEN 1 ELSE 0 END) AS remembered,
  ROUND(
    SUM(CASE WHEN last_rating >= 3 THEN 1 ELSE 0 END) 
    / COUNT(*) * 100, 1
  ) AS retention_rate
FROM review_sessions
WHERE user_id = 1
AND last_rating IS NOT NULL;

-- 4. Get words a user struggles with most
SELECT v.hanzi, v.pinyin, v.definition_en,
       rs.ease_factor, rs.repetitions, rs.last_rating
FROM review_sessions rs
JOIN vocabulary v ON v.id = rs.vocab_id
WHERE rs.user_id = 1
ORDER BY rs.ease_factor ASC
LIMIT 10;

-- 5. Get daily review activity for streak calculation
SELECT 
  DATE(updated_at) AS review_date,
  COUNT(*) AS cards_reviewed
FROM review_sessions
WHERE user_id = 1
AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(updated_at)
ORDER BY review_date DESC;

# backup.sh
#!/bin/bash
-- DATE=$(date +%Y%m%d_%H%M%S)
-- mysqldump -u hanmaomo_admin -p hanmaomo_db \
--   > backups/hanmaomo_backup_$DATE.sql
-- echo "Backup complete: hanmaomo_backup_$DATE.sql"
