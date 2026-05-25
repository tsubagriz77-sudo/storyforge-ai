/*
  # StoryForge AI - Initial Database Schema

  1. New Tables
    - `characters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `personality` (text)
      - `appearance` (text)
      - `voice_style` (text)
      - `traits` (text array)
      - `created_at` (timestamptz)

    - `stories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `genre` (text)
      - `premise` (text)
      - `setting` (text)
      - `tone` (text)
      - `target_audience` (text)
      - `episode_count` (integer, default 10)
      - `status` (text, default 'draft')
      - `created_at` (timestamptz)

    - `episodes`
      - `id` (uuid, primary key)
      - `story_id` (uuid, references stories)
      - `user_id` (uuid, references auth.users)
      - `episode_number` (integer)
      - `title` (text)
      - `script` (text)
      - `hook` (text)
      - `duration_seconds` (integer, default 60)
      - `status` (text, default 'draft')
      - `created_at` (timestamptz)

    - `hooks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `story_id` (uuid, references stories, nullable)
      - `content` (text)
      - `hook_type` (text)
      - `engagement_score` (integer, default 0)
      - `created_at` (timestamptz)

    - `video_prompts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `episode_id` (uuid, references episodes, nullable)
      - `prompt_text` (text)
      - `tool_type` (text)
      - `style` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT '',
  description text DEFAULT '',
  personality text DEFAULT '',
  appearance text DEFAULT '',
  voice_style text DEFAULT '',
  traits text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT '',
  genre text DEFAULT '',
  premise text DEFAULT '',
  setting text DEFAULT '',
  tone text DEFAULT '',
  target_audience text DEFAULT '',
  episode_count integer DEFAULT 10,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  episode_number integer NOT NULL DEFAULT 1,
  title text NOT NULL DEFAULT '',
  script text DEFAULT '',
  hook text DEFAULT '',
  duration_seconds integer DEFAULT 60,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  story_id uuid REFERENCES stories(id) ON DELETE SET NULL,
  content text NOT NULL DEFAULT '',
  hook_type text DEFAULT 'opening',
  engagement_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  episode_id uuid REFERENCES episodes(id) ON DELETE SET NULL,
  prompt_text text NOT NULL DEFAULT '',
  tool_type text DEFAULT '',
  style text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_prompts ENABLE ROW LEVEL SECURITY;

-- Characters policies
CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own characters"
  ON characters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
  ON characters FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Stories policies
CREATE POLICY "Users can view own stories"
  ON stories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories"
  ON stories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories"
  ON stories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Episodes policies
CREATE POLICY "Users can view own episodes"
  ON episodes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own episodes"
  ON episodes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own episodes"
  ON episodes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own episodes"
  ON episodes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Hooks policies
CREATE POLICY "Users can view own hooks"
  ON hooks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own hooks"
  ON hooks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hooks"
  ON hooks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own hooks"
  ON hooks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Video prompts policies
CREATE POLICY "Users can view own video prompts"
  ON video_prompts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own video prompts"
  ON video_prompts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video prompts"
  ON video_prompts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own video prompts"
  ON video_prompts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_episodes_story_id ON episodes(story_id);
CREATE INDEX IF NOT EXISTS idx_episodes_user_id ON episodes(user_id);
CREATE INDEX IF NOT EXISTS idx_hooks_user_id ON hooks(user_id);
CREATE INDEX IF NOT EXISTS idx_hooks_story_id ON hooks(story_id);
CREATE INDEX IF NOT EXISTS idx_video_prompts_user_id ON video_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_video_prompts_episode_id ON video_prompts(episode_id);
