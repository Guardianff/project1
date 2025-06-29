/*
  # Learning Platform Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `instructors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `thumbnail_url` (text)
      - `duration_minutes` (integer)
      - `difficulty_level` (text)
      - `price` (decimal)
      - `is_featured` (boolean)
      - `is_published` (boolean)
      - `category_id` (uuid, foreign key)
      - `instructor_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to published content
    - Add policies for authenticated users to manage their own content

  3. Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for common query patterns
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  email text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text DEFAULT '',
  duration_minutes integer DEFAULT 0,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  price decimal(10,2) DEFAULT 0.00,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT false,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  instructor_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for instructors
CREATE POLICY "Instructors are viewable by everyone"
  ON instructors
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage instructors"
  ON instructors
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for courses
CREATE POLICY "Published courses are viewable by everyone"
  ON courses
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_featured_published ON courses(is_featured, is_published);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at
  BEFORE UPDATE ON instructors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();