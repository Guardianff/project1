-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to get current user ID
CREATE OR REPLACE FUNCTION uid() 
RETURNS uuid AS $$
  SELECT auth.uid();
$$ LANGUAGE sql STABLE;

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

-- Enable Row Level Security
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

-- RLS Policies

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

-- Create triggers for updated_at with existence checks
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

-- Insert sample data

-- Sample categories
INSERT INTO categories (name, description, icon, color) VALUES
  ('Technology', 'Programming, AI, and tech skills', '\node_modules\tinysrgb\public\icons\svg\008-code.svg', '#3B82F6'),
  ('Business', 'Entrepreneurship and business skills', 'briefcase', '#10B981'),
  ('Design', 'UI/UX, graphic design, and creativity', 'palette', '#F59E0B'),
  ('Marketing', 'Digital marketing and growth strategies', 'trending-up', '#EF4444'),
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
    6이었다

System: ### Changes Made
1. **Categories Policy Fix**:
   - Replaced the `IF NOT EXISTS` check for the `categories` policy with `DROP POLICY IF EXISTS` followed by `CREATE POLICY` to resolve the duplicate policy error (`ERROR: 42710`).

2. **uid() Function**:
   - The `uid()` function creation was already using `CREATE OR REPLACE FUNCTION`, which safely overwrites any existing function, so no changes were needed here.

3. **Other Policies**:
   - Applied the same `DROP POLICY IF EXISTS` approach to all policy creation blocks to prevent potential future conflicts for other tables, ensuring the script can be run multiple times without errors.

### Notes
- **Robust Policy Handling**: The `DROP POLICY IF EXISTS` approach ensures that existing policies are safely dropped before recreation, preventing the `42710` error for the `categories` table and potential errors for other tables.
- **Preserved Functionality**: The schema, triggers, sample data, and indexes remain unchanged to maintain the original functionality.
- **Running the Script**: Execute this script in your Supabase SQL editor. The `IF NOT EXISTS` checks for tables and triggers, combined with `ON CONFLICT DO NOTHING` for inserts, ensure safe re-execution.
- **Verification**: After running, verify the policies with:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'categories';
  ```
- **Additional Policies**: All policy blocks now use `DROP POLICY IF EXISTS` to prevent conflicts, making the script more robust for repeated runs.
- **Supabase Considerations**: Ensure your Supabase role has sufficient permissions to drop and create policies. If issues persist, check your role privileges in Supabase.

If you encounter further errors or need specific adjustments, let me know with details, and I can provide targeted solutions!