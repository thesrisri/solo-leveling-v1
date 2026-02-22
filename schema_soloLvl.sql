CREATE EXTENSION IF NOT EXISTS "pgcrypto";

TRUNCATE TABLE
  daily_logs,
  rewards,
  subtasks,
  tasks,
  challenges
  RESTART IDENTITY CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
select * from users
update users set total_xp = '0'
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

select * from challenges
UPDATE challenges SET end_date = '2026-02-22'

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    stat_category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

select * from tasks

CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    xp_value INTEGER NOT NULL CHECK (xp_value >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

select * from subtasks

CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subtask_id UUID REFERENCES subtasks(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (subtask_id, completed_date)
);

CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NULL,
    reward_type VARCHAR(50),
    earned_date DATE DEFAULT CURRENT_DATE,
    UNIQUE (user_id, reward_type, earned_date)
);