/*
  # Sample Data Migration

  1. Data Population
    - Adds unique constraints to categories and instructors tables
    - Inserts sample categories with descriptions and visual attributes
    - Inserts sample instructors with professional details
    - Inserts sample courses with complete metadata
  
  2. Constraints
    - Uses DO blocks to check for existing constraints
    - Handles conflicts gracefully with ON CONFLICT clauses
*/

-- Add unique constraints to ensure ON CONFLICT works properly
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

-- Insert sample categories
INSERT INTO categories (name, description, icon, color) VALUES
  ('Technology', 'Programming, AI, and tech skills', 'laptop', '#3B82F6'),
  ('Business', 'Entrepreneurship and business skills', 'briefcase', '#10B981'),
  ('Design', 'UI/UX, graphic design, and creativity', 'palette', '#F59E0B'),
  ('Marketing', 'Digital marketing and growth strategies', 'megaphone', '#EF4444'),
  ('Personal Development', 'Self-improvement and productivity', 'user', '#8B5CF6'),
  ('Health & Fitness', 'Wellness and physical fitness', 'heart', '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- Insert sample instructors
INSERT INTO instructors (name, title, bio, avatar_url, email) VALUES
  (
    'Sarah Chen',
    'Senior Software Engineer at Google',
    'Full-stack developer with 8+ years of experience in React, Node.js, and cloud architecture.',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    'sarah.chen@example.com'
  ),
  (
    'Marcus Johnson',
    'Startup Founder & Business Strategist',
    'Serial entrepreneur who has built and sold 3 successful startups. Expert in lean methodology.',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    'marcus.johnson@example.com'
  ),
  (
    'Elena Rodriguez',
    'Lead UX Designer at Airbnb',
    'Award-winning designer with expertise in user research, prototyping, and design systems.',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    'elena.rodriguez@example.com'
  ),
  (
    'David Kim',
    'Digital Marketing Director',
    'Growth hacker who has scaled multiple companies from startup to IPO through data-driven marketing.',
    'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    'david.kim@example.com'
  ),
  (
    'Dr. Amanda Foster',
    'Executive Coach & Psychologist',
    'PhD in Psychology with 15+ years helping executives and entrepreneurs optimize their performance.',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    'amanda.foster@example.com'
  ),
  (
    'Jake Thompson',
    'Certified Personal Trainer & Nutritionist',
    'Former Olympic athlete turned fitness coach, specializing in sustainable lifestyle changes.',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    'jake.thompson@example.com'
  )
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (
  title, 
  description, 
  thumbnail_url, 
  duration_minutes, 
  level, 
  price, 
  is_featured, 
  is_published,
  category_id,
  instructor_id
) VALUES
  (
    'Complete React Development Bootcamp',
    'Master React from basics to advanced concepts including hooks, context, and modern patterns.',
    'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    1200,
    'intermediate',
    199.99,
    true,
    true,
    (SELECT id FROM categories WHERE name = 'Technology'),
    (SELECT id FROM instructors WHERE email = 'sarah.chen@example.com')
  ),
  (
    'Startup Fundamentals: From Idea to Launch',
    'Learn how to validate your business idea, build an MVP, and launch your startup successfully.',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    900,
    'beginner',
    149.99,
    true,
    true,
    (SELECT id FROM categories WHERE name = 'Business'),
    (SELECT id FROM instructors WHERE email = 'marcus.johnson@example.com')
  ),
  (
    'UX Design Masterclass: Research to Prototype',
    'Complete guide to user experience design including research methods, wireframing, and prototyping.',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    800,
    'intermediate',
    179.99,
    true,
    true,
    (SELECT id FROM categories WHERE name = 'Design'),
    (SELECT id FROM instructors WHERE email = 'elena.rodriguez@example.com')
  ),
  (
    'Digital Marketing Strategy & Analytics',
    'Data-driven approach to digital marketing including SEO, social media, and conversion optimization.',
    'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    600,
    'intermediate',
    129.99,
    true,
    true,
    (SELECT id FROM categories WHERE name = 'Marketing'),
    (SELECT id FROM instructors WHERE email = 'david.kim@example.com')
  ),
  (
    'Peak Performance: Executive Leadership',
    'Develop executive presence, decision-making skills, and leadership strategies for high performance.',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    720,
    'advanced',
    249.99,
    true,
    true,
    (SELECT id FROM categories WHERE name = 'Personal Development'),
    (SELECT id FROM instructors WHERE email = 'amanda.foster@example.com')
  ),
  (
    'Functional Fitness & Nutrition Fundamentals',
    'Build sustainable fitness habits with functional movement patterns and evidence-based nutrition.',
    'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    480,
    'beginner',
    99.99,
    false,
    true,
    (SELECT id FROM categories WHERE name = 'Health & Fitness'),
    (SELECT id FROM instructors WHERE email = 'jake.thompson@example.com')
  ),
  (
    'Advanced JavaScript & Node.js',
    'Deep dive into JavaScript concepts, async programming, and building scalable Node.js applications.',
    'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    1000,
    'advanced',
    219.99,
    false,
    true,
    (SELECT id FROM categories WHERE name = 'Technology'),
    (SELECT id FROM instructors WHERE email = 'sarah.chen@example.com')
  ),
  (
    'Brand Strategy & Visual Identity',
    'Create compelling brand strategies and design systems that resonate with your target audience.',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    540,
    'intermediate',
    159.99,
    false,
    true,
    (SELECT id FROM categories WHERE name = 'Design'),
    (SELECT id FROM instructors WHERE email = 'elena.rodriguez@example.com')
  );