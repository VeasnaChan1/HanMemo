CREATE DATABASE IF NOT EXISTS HanMemo;
USE HanMemo;

CREATE TABLE Users (
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

CREATE TABLE Decks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  hsk_level   TINYINT NOT NULL,
  description VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Lessons (
  id                      INT AUTO_INCREMENT PRIMARY KEY,
  deck_id                 INT NOT NULL,
  title                   VARCHAR(100) NOT NULL,
  lesson_number           INT NOT NULL,
  is_unlocked_by_default  BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (deck_id) REFERENCES Decks(id) ON DELETE CASCADE
);

CREATE TABLE Vocabularies (
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

  FOREIGN KEY (deck_id)   REFERENCES Decks(id)   ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES Lessons(id)  ON DELETE CASCADE
);

CREATE TABLE UserLessons (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  lesson_id    INT NOT NULL,
  is_unlocked  BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,

  UNIQUE KEY unique_user_lesson (user_id, lesson_id),
  FOREIGN KEY (user_id)   REFERENCES Users(id)   ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES Lessons(id)  ON DELETE CASCADE
);

CREATE TABLE ReviewSessions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  vocab_id     INT NOT NULL,
  ease_factor  FLOAT DEFAULT 2.5,
  interval_day INT DEFAULT 1,
  repetitions  INT DEFAULT 0,
  next_review  DATE NOT NULL,
  last_rating  TINYINT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
               ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_vocab (user_id, vocab_id),
  FOREIGN KEY (user_id)  REFERENCES Users(id)      ON DELETE CASCADE,
  FOREIGN KEY (vocab_id) REFERENCES Vocabularies(id)  ON DELETE CASCADE
);

-- Indexes for performance optimization
CREATE INDEX idx_review_user_date 
  ON ReviewSessions(user_id, next_review);

CREATE INDEX idx_vocab_lesson 
  ON Vocabularies(lesson_id);

CREATE INDEX idx_vocab_deck 
  ON Vocabularies(deck_id);

CREATE INDEX idx_user_email 
  ON Users(email);

CREATE INDEX idx_lessons_deck 
  ON Lessons(deck_id);
  
-- Create Roles
CREATE ROLE IF NOT EXISTS 'app_role';
CREATE ROLE IF NOT EXISTS 'admin_role';

-- Grant privileges to Roles
GRANT SELECT, INSERT, UPDATE, DELETE ON HanMemo.* TO 'app_role';
GRANT ALL PRIVILEGES ON HanMemo.* TO 'admin_role';

-- App user: limited privileges, used by your Express app
CREATE USER IF NOT EXISTS 'Veasna'@'%' 
  IDENTIFIED BY 'veasna123';

-- Admin user: full privileges, used for maintenance
CREATE USER IF NOT EXISTS 'Eychhean'@'%' 
  IDENTIFIED BY 'Eychhean';

-- Grant Roles to Users
GRANT 'app_role' TO 'Veasna'@'%';
GRANT 'admin_role' TO 'Eychhean'@'%';

-- Set default roles for users (makes the roles active automatically upon login)
SET DEFAULT ROLE 'app_role' TO 'Veasna'@'%';
SET DEFAULT ROLE 'admin_role' TO 'Eychhean'@'%';

FLUSH PRIVILEGES;

-- 1. Get all vocabulary due for review today for a user
SELECT v.hanzi, v.pinyin, v.definition_en, v.definition_km,
       rs.ease_factor, rs.interval_day, rs.next_review
FROM ReviewSessions rs
JOIN Vocabularies v ON v.id = rs.vocab_id
WHERE rs.user_id = 1
AND rs.next_review <= CURDATE()
ORDER BY rs.next_review ASC;

-- 2. Get lesson progress for a user
SELECT l.title, l.lesson_number,
       ul.is_unlocked, ul.is_completed,
       COUNT(v.id) AS total_words
FROM Lessons l
LEFT JOIN UserLessons ul ON ul.lesson_id = l.id 
  AND ul.user_id = 1
LEFT JOIN Vocabularies v ON v.lesson_id = l.id
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
FROM ReviewSessions
WHERE user_id = 1
AND last_rating IS NOT NULL;

-- 4. Get words a user struggles with most
SELECT v.hanzi, v.pinyin, v.definition_en,
       rs.ease_factor, rs.repetitions, rs.last_rating
FROM ReviewSessions rs
JOIN Vocabularies v ON v.id = rs.vocab_id
WHERE rs.user_id = 1
ORDER BY rs.ease_factor ASC
LIMIT 10;

-- 5. Get daily review activity for streak calculation
SELECT 
  DATE(updated_at) AS review_date,
  COUNT(*) AS cards_reviewed
FROM ReviewSessions
WHERE user_id = 1
AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(updated_at)
ORDER BY review_date DESC;

-- # backup.sh
-- #!/bin/bash
-- DATE=$(date +%Y%m%d_%H%M%S)
-- mysqldump -u HanMemo_admin -p HanMemo \
--   > backups/HanMemo_backup_$DATE.sql
-- echo "Backup complete: HanMemo_backup_$DATE.sql"

-- =========================================================================
-- DATABASE BACKEND AUTOMATION EXPLANATION
-- =========================================================================
-- Instead of running the manual backup script above, the HanMemo project
-- uses a fully automated database backup pipeline:
--
-- 1. Automation Trigger (GitHub Actions):
--    - Defined in `.github/workflows/backup.yml`.
--    - Configured to run automatically on a daily cron schedule at 00:00 UTC.
--    - Can be triggered manually at any time via the GitHub Actions dashboard.
--
-- 2. Secure Credentials:
--    - Production database credentials are not hardcoded.
--    - They are stored securely in GitHub Repository Secrets (Settings -> Secrets)
--      and injected into the runtime environment as variables.
--
-- 3. Execution Script (`backup/backup.py`):
--    - Runs inside the GitHub Ubuntu runner.
--    - Calls `mysqldump` with options like `--single-transaction` and `--quick`
--      to ensure a consistent database snapshot without locking tables or 
--      causing downtime for the live Express application.
--    - Compresses the generated `.sql` file into a `.gz` package to save 
--      up to 80% of storage space and reduce download times.
--
-- 4. Artifact Storage:
--    - The zipped backup is saved as a secure workflow artifact with a
--      7-day retention limit, ready to be downloaded by team members.
--
-- 5. Security & Git Safety:
--    - The local `backups/` directory is ignored in `.gitignore` so that
--      local database dumps containing sensitive data are never committed.
-- =========================================================================
