/*
  # Learning Platform Database Schema

  1. New Tables
    - `categories` - Course categories with icons and metadata
    - `instructors` - Course instructors with profiles and ratings
    - `courses` - Main courses table with all course information
    - `lessons` - Individual lessons within courses
    - `enrollments` - User course enrollments and progress
    - `lesson_progress` - Individual lesson completion tracking
    - `coaching_sessions` - One-on-one coaching sessions
    - `resources` - Learning resources and materials
    - `achievements` - Available achievements in the platform
    - `user_achievements` - User-earned achievements
    - `learning_paths` - Structured learning paths
    - `learning_path_courses` - Courses within learning paths

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Ensure data privacy and access control

  3. Sample Data
    - Insert sample categories, instructors, and courses
    - Provide realistic data for development and testing
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  icon text NOT NULL,
  color text,
  course_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  title text NOT NULL,
  bio text,
  avatar_url text,
  email text,
  website text,
  social_links jsonb,
  expertise text[],
  rating numeric(3,2),
  total_students integer DEFAULT 0,
  total_courses integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text,
  duration_minutes integer NOT NULL,
  level text CHECK (level IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  instructor_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
  price numeric(10,2),
  currency text DEFAULT 'USD',
  tags text[],
  learning_objectives text[],
  prerequisites text[],
  rating numeric(3,2),
  review_count integer DEFAULT 0,
  enrolled_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  content_type text CHECK (content_type IN ('video', 'text', 'quiz', 'exercise', 'assignment')) NOT NULL,
  content_url text,
  duration_minutes integer,
  order_index integer NOT NULL,
  is_preview boolean DEFAULT false,
  transcript text,
  resources jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at timestamptz,
  certificate_url text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Lesson progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  time_spent_minutes integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Coaching sessions table
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coach_id uuid REFERENCES instructors(id) ON DELETE SET NULL NOT NULL,
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL,
  status text CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')) DEFAULT 'scheduled',
  meeting_url text,
  notes text,
  feedback text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('document', 'video', 'audio', 'image', 'link', 'tool')) NOT NULL,
  category text,
  file_url text,
  external_url text,
  file_size bigint,
  file_type text,
  tags text[],
  is_premium boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  download_count integer DEFAULT 0,
  rating numeric(3,2),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  criteria jsonb NOT NULL,
  points integer DEFAULT 0,
  badge_color text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now(),
  progress integer DEFAULT 100 CHECK (progress >= 0 AND progress <= 100),
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Learning paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text,
  estimated_duration_hours integer,
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  tags text[],
  is_featured boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Learning path courses junction table
CREATE TABLE IF NOT EXISTS learning_path_courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  learning_path_id uuid REFERENCES learning_paths(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  order_index integer NOT NULL,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(learning_path_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories: Public read access
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Instructors: Public read access
CREATE POLICY "Instructors are viewable by everyone"
  ON instructors FOR SELECT
  TO public
  USING (true);

-- Courses: Public read access for published courses
CREATE POLICY "Published courses are viewable by everyone"
  ON courses FOR SELECT
  TO public
  USING (is_published = true);

-- Lessons: Public read access for lessons of published courses
CREATE POLICY "Lessons of published courses are viewable by everyone"
  ON lessons FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.is_published = true
    )
  );

-- Enrollments: Users can only see their own enrollments
CREATE POLICY "Users can view their own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Lesson progress: Users can only see their own progress
CREATE POLICY "Users can view their own lesson progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Coaching sessions: Users can only see their own sessions
CREATE POLICY "Users can view their own coaching sessions"
  ON coaching_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coaching sessions"
  ON coaching_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching sessions"
  ON coaching_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Resources: Public read access for non-premium, authenticated for premium
CREATE POLICY "Non-premium resources are viewable by everyone"
  ON resources FOR SELECT
  TO public
  USING (is_premium = false);

CREATE POLICY "Premium resources are viewable by authenticated users"
  ON resources FOR SELECT
  TO authenticated
  USING (is_premium = true);

-- Achievements: Public read access
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  TO public
  USING (is_active = true);

-- User achievements: Users can only see their own achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Learning paths: Public read access
CREATE POLICY "Learning paths are viewable by everyone"
  ON learning_paths FOR SELECT
  TO public
  USING (true);

-- Learning path courses: Public read access
CREATE POLICY "Learning path courses are viewable by everyone"
  ON learning_path_courses FOR SELECT
  TO public
  USING (true);

-- Insert sample data

-- Sample categories
INSERT INTO categories (name, description, icon, color) VALUES
  ('Programming', 'Learn coding and software development', 'code', '#3B82F6'),
  ('Design', 'UI/UX design and creative skills', 'palette', '#EC4899'),
  ('Business', 'Business strategy and entrepreneurship', 'briefcase', '#10B981'),
  ('Marketing', 'Digital marketing and growth strategies', 'trending-up', '#F59E0B'),
  ('Data Science', 'Analytics, AI, and machine learning', 'bar-chart', '#8B5CF6'),
  ('Personal Development', 'Self-improvement and productivity', 'user', '#EF4444')
ON CONFLICT DO NOTHING;

-- Sample instructors
INSERT INTO instructors (name, title, bio, avatar_url, rating, total_students, total_courses) VALUES
  ('Sarah Johnson', 'Senior Software Engineer', 'Full-stack developer with 8+ years of experience in React and Node.js', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', 4.8, 12500, 15),
  ('Michael Chen', 'UX Design Lead', 'Design leader at top tech companies, specializing in user-centered design', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', 4.9, 8200, 12),
  ('Emily Rodriguez', 'Data Scientist', 'PhD in Machine Learning with expertise in Python and AI applications', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400', 4.7, 6800, 8),
  ('David Kim', 'Marketing Director', 'Growth marketing expert who scaled multiple startups to millions in revenue', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400', 4.6, 15200, 18),
  ('Lisa Thompson', 'Business Coach', 'Executive coach and entrepreneur with 15+ years of leadership experience', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400', 4.9, 3400, 6)
ON CONFLICT DO NOTHING;

-- Sample courses
INSERT INTO courses (title, description, thumbnail_url, duration_minutes, level, category_id, instructor_id, price, rating, review_count, enrolled_count, is_featured) VALUES
  (
    'React Native Mastery',
    'Build professional mobile apps with React Native. Learn navigation, state management, and deployment.',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    480,
    'intermediate',
    (SELECT id FROM categories WHERE name = 'Programming' LIMIT 1),
    (SELECT id FROM instructors WHERE name = 'Sarah Johnson' LIMIT 1),
    99.99,
    4.8,
    342,
    2150,
    true
  ),
  (
    'UI/UX Design Fundamentals',
    'Master the principles of user interface and user experience design from scratch.',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    360,
    'beginner',
    (SELECT id FROM categories WHERE name = 'Design' LIMIT 1),
    (SELECT id FROM instructors WHERE name = 'Michael Chen' LIMIT 1),
    79.99,
    4.9,
    567,
    3200,
    true
  ),
  (
    'Python for Data Science',
    'Learn Python programming specifically for data analysis, visualization, and machine learning.',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    540,
    'intermediate',
    (SELECT id FROM categories WHERE name = 'Data Science' LIMIT 1),
    (SELECT id FROM instructors WHERE name = 'Emily Rodriguez' LIMIT 1),
    129.99,
    4.7,
    289,
    1850,
    true
  ),
  (
    'Digital Marketing Strategy',
    'Complete guide to digital marketing including SEO, social media, and paid advertising.',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    420,
    'beginner',
    (SELECT id FROM categories WHERE name = 'Marketing' LIMIT 1),
    (SELECT id FROM instructors WHERE name = 'David Kim' LIMIT 1),
    89.99,
    4.6,
    445,
    2800,
    true
  ),
  (
    'Leadership Excellence',
    'Develop essential leadership skills for managing teams and driving organizational success.',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    300,
    'advanced',
    (SELECT id FROM categories WHERE name = 'Personal Development' LIMIT 1),
    (SELECT id FROM instructors WHERE name = 'Lisa Thompson' LIMIT 1),
    149.99,
    4.9,
    178,
    950,
    true
  )
ON CONFLICT DO NOTHING;

-- Sample lessons for React Native course
INSERT INTO lessons (course_id, title, description, content_type, duration_minutes, order_index, is_preview) VALUES
  (
    (SELECT id FROM courses WHERE title = 'React Native Mastery' LIMIT 1),
    'Introduction to React Native',
    'Overview of React Native and setting up your development environment',
    'video',
    25,
    1,
    true
  ),
  (
    (SELECT id FROM courses WHERE title = 'React Native Mastery' LIMIT 1),
    'Building Your First App',
    'Create a simple React Native application from scratch',
    'video',
    35,
    2,
    false
  ),
  (
    (SELECT id FROM courses WHERE title = 'React Native Mastery' LIMIT 1),
    'Navigation Patterns',
    'Implement navigation using React Navigation library',
    'video',
    40,
    3,
    false
  )
ON CONFLICT DO NOTHING;

-- Sample achievements
INSERT INTO achievements (title, description, icon, criteria, points, badge_color) VALUES
  ('First Steps', 'Complete your first lesson', 'play-circle', '{"type": "lesson_completed", "count": 1}', 10, '#10B981'),
  ('Course Crusher', 'Complete your first course', 'award', '{"type": "course_completed", "count": 1}', 50, '#F59E0B'),
  ('Learning Streak', 'Learn for 7 consecutive days', 'calendar', '{"type": "daily_streak", "count": 7}', 25, '#8B5CF6'),
  ('Knowledge Seeker', 'Enroll in 5 different courses', 'book-open', '{"type": "course_enrolled", "count": 5}', 30, '#3B82F6'),
  ('Community Helper', 'Help other learners in discussions', 'message-circle', '{"type": "discussion_helpful", "count": 10}', 20, '#EC4899')
ON CONFLICT DO NOTHING;

-- Update course counts in categories
UPDATE categories SET course_count = (
  SELECT COUNT(*) FROM courses WHERE courses.category_id = categories.id AND courses.is_published = true
);

-- Update instructor stats
UPDATE instructors SET 
  total_courses = (SELECT COUNT(*) FROM courses WHERE courses.instructor_id = instructors.id AND courses.is_published = true),
  total_students = (SELECT COALESCE(SUM(courses.enrolled_count), 0) FROM courses WHERE courses.instructor_id = instructors.id AND courses.is_published = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);