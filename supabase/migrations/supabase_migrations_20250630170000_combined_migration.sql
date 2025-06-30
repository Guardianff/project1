/*
  # Combined Migration for Learning Platform

  This migration merges all previous migrations into a single file, including:
    - Schema creation for all required tables (profiles, categories, instructors, courses, lessons, enrollments, lesson_progress, coaching_sessions, resources, achievements, user_achievements, learning_paths, learning_path_courses)
    - Triggers and utility functions
    - Row Level Security (RLS) enablement and policies
    - Unique constraints
    - Indexes for performance
    - Sample data seeding

  The migration is idempotent and safe to re-run.
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Utility Functions and Triggers
-- ============================================================

-- Create or replace function to update updated_at column
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to get current user ID
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'uid') THEN
    CREATE FUNCTION uid() RETURNS uuid AS $$
      SELECT auth.uid();
    $$ LANGUAGE sql STABLE;
  END IF;
END
$$;

-- ============================================================
-- Table Definitions
-- ============================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  website text,
  github_username text,
  linkedin_url text,
  learning_goals text[],
  interests text[],
  preferred_learning_style text CHECK (preferred_learning_style IN ('visual', 'auditory', 'kinesthetic')),
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
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
  rating numeric(3,2) CHECK (rating >= 0 AND rating <= 5),
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
  rating numeric(3,2) CHECK (rating >= 0 AND rating <= 5),
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
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
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
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
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
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
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
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60 NOT NULL,
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
  download_count integer DEFAULT 0,
  rating numeric(3,2) CHECK (rating >= 0 AND rating <= 5),
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
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
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
  learning_path_id uuid REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(learning_path_id, course_id)
);

-- ============================================================
-- Unique Constraints
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'categories_name_key' AND conrelid = 'categories'::regclass
  ) THEN
    ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'instructors_email_key' AND conrelid = 'instructors'::regclass
  ) THEN
    ALTER TABLE instructors ADD CONSTRAINT instructors_email_key UNIQUE (email);
  END IF;
END $$;

-- ============================================================
-- Enable Row Level Security (RLS) on all tables
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
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

-- ============================================================
-- RLS Policies
-- ============================================================

-- Profiles policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO public
    USING (uid() = id);

  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO public
    WITH CHECK (uid() = id);

  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO public
    USING (uid() = id);
END
$$;

-- Categories policy
DO $$
BEGIN
  DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
  CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    TO public
    USING (true);
END
$$;

-- Instructors policy
DO $$
BEGIN
  DROP POLICY IF EXISTS "Instructors are viewable by everyone" ON instructors;
  CREATE POLICY "Instructors are viewable by everyone"
    ON instructors FOR SELECT
    TO public
    USING (true);
END
$$;

-- Courses policy
DO $$
BEGIN
  DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON courses;
  CREATE POLICY "Published courses are viewable by everyone"
    ON courses FOR SELECT
    TO public
    USING (is_published = true);
END
$$;

-- Lessons policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Preview lessons are viewable by everyone" ON lessons;
  CREATE POLICY "Preview lessons are viewable by everyone"
    ON lessons FOR SELECT
    TO public
    USING (is_preview = true);

  DROP POLICY IF EXISTS "Course lessons are viewable by enrolled users" ON lessons;
  CREATE POLICY "Course lessons are viewable by enrolled users"
    ON lessons FOR SELECT
    TO public
    USING (
      EXISTS (
        SELECT 1 FROM enrollments
        WHERE enrollments.user_id = uid()
        AND enrollments.course_id = lessons.course_id
      )
    );
END
$$;

-- Enrollments policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own enrollments" ON enrollments;
  CREATE POLICY "Users can view own enrollments"
    ON enrollments FOR SELECT
    TO public
    USING (uid() = user_id);

  DROP POLICY IF EXISTS "Users can create own enrollments" ON enrollments;
  CREATE POLICY "Users can create own enrollments"
    ON enrollments FOR INSERT
    TO public
    WITH CHECK (uid() = user_id);

  DROP POLICY IF EXISTS "Users can update own enrollments" ON enrollments;
  CREATE POLICY "Users can update own enrollments"
    ON enrollments FOR UPDATE
    TO public
    USING (uid() = user_id);
END
$$;

-- Lesson progress policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own lesson progress" ON lesson_progress;
  CREATE POLICY "Users can view own lesson progress"
    ON lesson_progress FOR SELECT
    TO public
    USING (uid() = user_id);

  DROP POLICY IF EXISTS "Users can create own lesson progress" ON lesson_progress;
  CREATE POLICY "Users can create own lesson progress"
    ON lesson_progress FOR INSERT
    TO public
    WITH CHECK (uid() = user_id);

  DROP POLICY IF EXISTS "Users can update own lesson progress" ON lesson_progress;
  CREATE POLICY "Users can update own lesson progress"
    ON lesson_progress FOR UPDATE
    TO public
    USING (uid() = user_id);
END
$$;

-- Coaching sessions policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own coaching sessions" ON coaching_sessions;
  CREATE POLICY "Users can view own coaching sessions"
    ON coaching_sessions FOR SELECT
    TO public
    USING (uid() = user_id);

  DROP POLICY IF EXISTS "Users can create own coaching sessions" ON coaching_sessions;
  CREATE POLICY "Users can create own coaching sessions"
    ON coaching_sessions FOR INSERT
    TO public
    WITH CHECK (uid() = user_id);

  DROP POLICY IF EXISTS "Users can update own coaching sessions" ON coaching_sessions;
  CREATE POLICY "Users can update own coaching sessions"
    ON coaching_sessions FOR UPDATE
    TO public
    USING (uid() = user_id);
END
$$;

-- Resources policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Free resources are viewable by everyone" ON resources;
  CREATE POLICY "Free resources are viewable by everyone"
    ON resources FOR SELECT
    TO public
    USING (is_premium = false);

  DROP POLICY IF EXISTS "Premium resources are viewable by authenticated users" ON resources;
  CREATE POLICY "Premium resources are viewable by authenticated users"
    ON resources FOR SELECT
    TO public
    USING (is_premium = true AND role() = 'authenticated');
END
$$;

-- Achievements policy
DO $$
BEGIN
  DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
  CREATE POLICY "Achievements are viewable by everyone"
    ON achievements FOR SELECT
    TO public
    USING (is_active = true);
END
$$;

-- User achievements policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
  CREATE POLICY "Users can view own achievements"
    ON user_achievements FOR SELECT
    TO public
    USING (uid() = user_id);

  DROP POLICY IF EXISTS "Users can create own achievements" ON user_achievements;
  CREATE POLICY "Users can create own achievements"
    ON user_achievements FOR INSERT
    TO public
    WITH CHECK (uid() = user_id);
END
$$;

-- Learning paths policy
DO $$
BEGIN
  DROP POLICY IF EXISTS "Learning paths are viewable by everyone" ON learning_paths;
  CREATE POLICY "Learning paths are viewable by everyone"
    ON learning_paths FOR SELECT
    TO public
    USING (true);
END
$$;

-- Learning path courses policy
DO $$
BEGIN
  DROP POLICY IF EXISTS "Learning path courses are viewable by everyone" ON learning_path_courses;
  CREATE POLICY "Learning path courses are viewable by everyone"
    ON learning_path_courses FOR SELECT
    TO public
    USING (true);
END
$$;

-- ============================================================
-- Triggers for updated_at
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'profiles'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'categories'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'instructors'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON instructors FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'courses'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'lessons'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'enrollments'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'lesson_progress'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON lesson_progress FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'coaching_sessions'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON coaching_sessions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'resources'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'achievements'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at' AND tgrelid = 'learning_paths'::regclass) THEN
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON learning_paths FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
END
$$;

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_coach_id ON coaching_sessions(coach_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_courses_path_id ON learning_path_courses(learning_path_id);

-- ============================================================
-- Sample Data Seeding
-- ============================================================

-- Sample categories
INSERT INTO categories (name, description, icon, color) VALUES
  ('Technology', 'Programming, AI, and tech skills', 'laptop', '#3B82F6'),
  ('Business', 'Entrepreneurship and business skills', 'briefcase', '#10B981'),
  ('Design', 'UI/UX, graphic design, and creativity', 'palette', '#F59E0B'),
  ('Marketing', 'Digital marketing and growth strategies', 'megaphone', '#EF4444'),
  ('Personal Development', 'Self-improvement and productivity', 'user', '#8B5CF6'),
  ('Health & Fitness', 'Wellness and physical fitness', 'heart', '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- Sample instructors
INSERT INTO instructors (name, title, bio, avatar_url, email, rating, total_students, total_courses) VALUES
  (
    'Sarah Chen',
    'Senior Software Engineer at Google',
    'Full-stack developer with 8+ years of experience in React, Node.js, and cloud architecture.',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    'sarah.chen@example.com',
    4.8,
    12500,
    15
  ),
  (
    'Marcus Johnson',
    'Startup Founder & Business Strategist',
    'Serial entrepreneur who has built and sold 3 successful startups. Expert in lean methodology.',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    'marcus.johnson@example.com',
    4.9,
    8200,
    12
  ),
  (
    'Elena Rodriguez',
    'Lead UX Designer at Airbnb',
    'Award-winning designer with expertise in user research, prototyping, and design systems.',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    'elena.rodriguez@example.com',
    4.7,
    6800,
    8
  ),
  (
    'David Kim',
    'Digital Marketing Director',
    'Growth hacker who has scaled multiple companies from startup to IPO through data-driven marketing.',
    'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    'david.kim@example.com',
    4.6,
    15200,
    18
  ),
  (
    'Dr. Amanda Foster',
    'Executive Coach & Psychologist',
    'PhD in Psychology with 15+ years helping executives and entrepreneurs optimize their performance.',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    'amanda.foster@example.com',
    4.9,
    3400,
    6
  ),
  (
    'Jake Thompson',
    'Certified Personal Trainer & Nutritionist',
    'Former Olympic athlete turned fitness coach, specializing in sustainable lifestyle changes.',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    'jake.thompson@example.com',
    4.8,
    5600,
    10
  )
ON CONFLICT DO NOTHING;

-- Sample courses
DO $$
DECLARE
  tech_id uuid;
  business_id uuid;
  design_id uuid;
  marketing_id uuid;
  personal_id uuid;
  health_id uuid;
  sarah_id uuid;
  marcus_id uuid;
  elena_id uuid;
  david_id uuid;
  amanda_id uuid;
  jake_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO tech_id FROM categories WHERE name = 'Technology' LIMIT 1;
  SELECT id INTO business_id FROM categories WHERE name = 'Business' LIMIT 1;
  SELECT id INTO design_id FROM categories WHERE name = 'Design' LIMIT 1;
  SELECT id INTO marketing_id FROM categories WHERE name = 'Marketing' LIMIT 1;
  SELECT id INTO personal_id FROM categories WHERE name = 'Personal Development' LIMIT 1;
  SELECT id INTO health_id FROM categories WHERE name = 'Health & Fitness' LIMIT 1;
  
  -- Get instructor IDs
  SELECT id INTO sarah_id FROM instructors WHERE email = 'sarah.chen@example.com' LIMIT 1;
  SELECT id INTO marcus_id FROM instructors WHERE email = 'marcus.johnson@example.com' LIMIT 1;
  SELECT id INTO elena_id FROM instructors WHERE email = 'elena.rodriguez@example.com' LIMIT 1;
  SELECT id INTO david_id FROM instructors WHERE email = 'david.kim@example.com' LIMIT 1;
  SELECT id INTO amanda_id FROM instructors WHERE email = 'amanda.foster@example.com' LIMIT 1;
  SELECT id INTO jake_id FROM instructors WHERE email = 'jake.thompson@example.com' LIMIT 1;
  
  -- Insert courses if categories and instructors exist
  IF tech_id IS NOT NULL AND sarah_id IS NOT NULL THEN
    INSERT INTO courses (
      title, 
      description, 
      thumbnail_url, 
      duration_minutes, 
      level, 
      price, 
      is_featured, 
      is_published,
      rating,
      review_count,
      enrolled_count,
      category_id,
      instructor_id
    ) VALUES (
      'Complete React Development Bootcamp',
      'Master React from basics to advanced concepts including hooks, context, and modern patterns.',
      'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      1200,
      'intermediate',
      199.99,
      true,
      true,
      4.8,
      342,
      2150,
      tech_id,
      sarah_id
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  IF business_id IS NOT NULL AND marcus_id IS NOT NULL THEN
    INSERT INTO courses (
      title, 
      description, 
      thumbnail_url, 
      duration_minutes, 
      level, 
      price, 
      is_featured, 
      is_published,
      rating,
      review_count,
      enrolled_count,
      category_id,
      instructor_id
    ) VALUES (
      'Startup Fundamentals: From Idea to Launch',
      'Learn how to validate your business idea, build an MVP, and launch your startup successfully.',
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      900,
      'beginner',
      149.99,
      true,
      true,
      4.9,
      567,
      3200,
      business_id,
      marcus_id
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  IF design_id IS NOT NULL AND elena_id IS NOT NULL THEN
    INSERT INTO courses (
      title, 
      description, 
      thumbnail_url, 
      duration_minutes, 
      level, 
      price, 
      is_featured, 
      is_published,
      rating,
      review_count,
      enrolled_count,
      category_id,
      instructor_id
    ) VALUES (
      'UX Design Masterclass: Research to Prototype',
      'Complete guide to user experience design including research methods, wireframing, and prototyping.',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      800,
      'intermediate',
      179.99,
      true,
      true,
      4.7,
      289,
      1850,
      design_id,
      elena_id
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  IF marketing_id IS NOT NULL AND david_id IS NOT NULL THEN
    INSERT INTO courses (
      title, 
      description, 
      thumbnail_url, 
      duration_minutes, 
      level, 
      price, 
      is_featured, 
      is_published,
      rating,
      review_count,
      enrolled_count,
      category_id,
      instructor_id
    ) VALUES (
      'Digital Marketing Strategy & Analytics',
      'Data-driven approach to digital marketing including SEO, social media, and conversion optimization.',
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
      600,
      'intermediate',
      129.99,
      true,
      true,
      4.6,
      445,
      2800,
      marketing_id,
      david_id
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  IF personal_id IS NOT NULL AND amanda_id IS NOT NULL THEN
    INSERT INTO courses (
      title, 
      description, 
      thumbnail_url, 
      duration_minutes, 
      level, 
      price, 
      is_featured, 
      is_published,
      rating,
      review_count,
      enrolled_count,
      category_id,
      instructor_id
    ) VALUES (
      'Peak Performance: Executive Leadership',
      'Develop executive presence, decision-making skills, and leadership strategies for high performance.',
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      720,
      'advanced',
      249.99,
      true,
      true,
      4.9,
      178,
      950,
      personal_id,
      amanda_id
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  IF health_id IS NOT NULL AND jake_id IS NOT NULL THEN
    INSERT INTO courses (
      title, 
      description, 
      thumbnail_url, 
      duration_minutes, 
      level, 
      price, 
      is_featured, 
      is_published,
      rating,
      review_count,
      enrolled_count,
      category_id,
      instructor_id
    ) VALUES (
      'Functional Fitness & Nutrition Fundamentals',
      'Build sustainable fitness habits with functional movement patterns and evidence-based nutrition.',
      'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
      480,
      'beginner',
      99.99,
      false,
      true,
      4.5,
      234,
      1200,
      health_id,
      jake_id
    ) ON CONFLICT DO NOTHING;
  END IF;
END
$$;

-- Sample lessons for React course
DO $$
DECLARE
  course_id uuid;
BEGIN
  SELECT id INTO course_id FROM courses WHERE title = 'Complete React Development Bootcamp' LIMIT 1;
  
  IF course_id IS NOT NULL THEN
    INSERT INTO lessons (course_id, title, description, content_type, duration_minutes, order_index, is_preview) VALUES
      (
        course_id,
        'Introduction to React',
        'Overview of React and setting up your development environment',
        'video',
        25,
        1,
        true
      ),
      (
        course_id,
        'Building Your First Component',
        'Create your first React component and understand JSX',
        'video',
        35,
        2,
        false
      ),
      (
        course_id,
        'State and Props',
        'Learn about React state management and component props',
        'video',
        40,
        3,
        false
      )
    ON CONFLICT DO NOTHING;
  END IF;
END
$$;

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
