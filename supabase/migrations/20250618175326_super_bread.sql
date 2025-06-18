/*
  # Seed Data for Learning Platform

  1. Sample Data
    - Categories
    - Instructors
    - Courses
    - Lessons
    - Resources
    - Achievements
    - Learning Paths
*/

-- Insert sample categories
INSERT INTO categories (id, name, description, icon, color, course_count) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Design', 'UI/UX, Graphic Design, and Creative Arts', 'palette', '#EC4899', 24),
  ('550e8400-e29b-41d4-a716-446655440002', 'Development', 'Web, Mobile, and Software Development', 'code', '#3B82F6', 36),
  ('550e8400-e29b-41d4-a716-446655440003', 'Business', 'Entrepreneurship, Management, and Finance', 'briefcase', '#8B5CF6', 18),
  ('550e8400-e29b-41d4-a716-446655440004', 'Marketing', 'Digital Marketing, SEO, and Brand Strategy', 'trending-up', '#F59E0B', 12),
  ('550e8400-e29b-41d4-a716-446655440005', 'Photography', 'Digital Photography and Visual Storytelling', 'camera', '#06B6D4', 8),
  ('550e8400-e29b-41d4-a716-446655440006', 'Music', 'Music Production, Theory, and Performance', 'music', '#EF4444', 15),
  ('550e8400-e29b-41d4-a716-446655440007', 'Health & Fitness', 'Nutrition, Workout Plans, and Wellness', 'activity', '#F97316', 20),
  ('550e8400-e29b-41d4-a716-446655440008', 'Personal Development', 'Leadership, Communication, and Life Skills', 'user', '#10B981', 22)
ON CONFLICT (id) DO NOTHING;

-- Insert sample instructors
INSERT INTO instructors (id, name, title, bio, avatar_url, expertise, rating, total_students, total_courses) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'Sarah Johnson', 'Senior UI/UX Designer', '10+ years of experience in UI/UX design for major tech companies', 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['UI Design', 'UX Research', 'Figma', 'Design Systems'], 4.8, 1254, 3),
  ('550e8400-e29b-41d4-a716-446655440102', 'Michael Chen', 'Senior JavaScript Developer', 'JavaScript expert with focus on modern frameworks and performance optimization', 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript'], 4.9, 2154, 5),
  ('550e8400-e29b-41d4-a716-446655440103', 'Emily Rodriguez', 'Data Scientist', 'Former data scientist at a Fortune 500 company with PhD in Statistics', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['Python', 'Machine Learning', 'Statistics', 'Data Analysis'], 4.8, 987, 2),
  ('550e8400-e29b-41d4-a716-446655440104', 'Daniel Brown', 'Marketing Director', '15 years of experience in digital marketing for startups and established brands', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'], 4.6, 842, 4),
  ('550e8400-e29b-41d4-a716-446655440105', 'Robert Williams', 'Career Coach', 'Certified career coach helping professionals advance their careers', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['Career Development', 'Leadership', 'Interview Skills', 'Networking'], 4.9, 1500, 6)
ON CONFLICT (id) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (id, title, description, thumbnail_url, duration_minutes, level, category_id, instructor_id, price, tags, learning_objectives, rating, review_count, enrolled_count, is_featured) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', 'Introduction to UI/UX Design', 'Learn the fundamentals of UI/UX design and create your first portfolio-ready project.', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', 240, 'beginner', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', 89.99, ARRAY['UI', 'UX', 'Design', 'Figma'], ARRAY['Understand UX principles', 'Create wireframes', 'Design user interfaces', 'Build a portfolio'], 4.7, 328, 1254, true),
  ('550e8400-e29b-41d4-a716-446655440202', 'Advanced JavaScript Concepts', 'Master advanced JavaScript concepts like closures, prototypes, async programming and more.', 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800', 320, 'advanced', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440102', 129.99, ARRAY['JavaScript', 'Web Development', 'Frontend'], ARRAY['Master closures and scope', 'Understand prototypal inheritance', 'Handle async operations', 'Optimize performance'], 4.9, 412, 2154, true),
  ('550e8400-e29b-41d4-a716-446655440203', 'Data Science Fundamentals', 'Learn the basics of data science, from statistics to machine learning algorithms.', 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800', 280, 'intermediate', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440103', 149.99, ARRAY['Data Science', 'Python', 'Machine Learning'], ARRAY['Learn Python for data science', 'Understand statistical concepts', 'Build ML models', 'Analyze real datasets'], 4.8, 215, 987, false),
  ('550e8400-e29b-41d4-a716-446655440204', 'Digital Marketing Masterclass', 'Comprehensive guide to digital marketing strategies and tools for modern businesses.', 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=800', 210, 'beginner', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440104', 99.99, ARRAY['Digital Marketing', 'SEO', 'Social Media'], ARRAY['Create marketing strategies', 'Optimize for search engines', 'Run social media campaigns', 'Measure ROI'], 4.6, 178, 842, false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample lessons for UI/UX Design course
INSERT INTO lessons (id, course_id, title, description, content_type, content_url, duration_minutes, order_index, is_preview) VALUES
  ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440201', 'Understanding User Experience', 'Introduction to UX principles and user-centered design', 'video', 'https://example.com/video1', 20, 1, true),
  ('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440201', 'UI Design Principles', 'Learn the fundamental principles of user interface design', 'video', 'https://example.com/video2', 25, 2, false),
  ('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440201', 'Color Theory in Design', 'Understanding color psychology and application in UI design', 'text', null, 18, 3, false),
  ('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440201', 'Typography Fundamentals', 'Choosing and using fonts effectively in digital design', 'video', 'https://example.com/video4', 22, 4, false),
  ('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440201', 'Wireframing Exercise', 'Hands-on practice creating wireframes for a mobile app', 'exercise', null, 30, 5, false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample lessons for JavaScript course
INSERT INTO lessons (id, course_id, title, description, content_type, content_url, duration_minutes, order_index, is_preview) VALUES
  ('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440202', 'Understanding Closures', 'Deep dive into JavaScript closures and lexical scoping', 'video', 'https://example.com/video5', 22, 1, true),
  ('550e8400-e29b-41d4-a716-446655440307', '550e8400-e29b-41d4-a716-446655440202', 'Prototypal Inheritance', 'Master JavaScript\'s prototype-based inheritance system', 'video', 'https://example.com/video6', 25, 2, false),
  ('550e8400-e29b-41d4-a716-446655440308', '550e8400-e29b-41d4-a716-446655440202', 'Async/Await Deep Dive', 'Advanced asynchronous programming patterns', 'video', 'https://example.com/video7', 30, 3, false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample resources
INSERT INTO resources (id, title, description, type, category, file_url, tags, is_premium, download_count, rating) VALUES
  ('550e8400-e29b-41d4-a716-446655440401', 'Advanced Design System Kit', 'Complete design system with 200+ components', 'tool', 'Design', 'https://example.com/design-kit.zip', ARRAY['Design System', 'UI Kit', 'Figma'], true, 1250, 4.9),
  ('550e8400-e29b-41d4-a716-446655440402', 'React Native Boilerplate', 'Production-ready React Native starter template', 'tool', 'Development', 'https://github.com/example/rn-boilerplate', ARRAY['React Native', 'Boilerplate', 'Mobile'], false, 2100, 4.8),
  ('550e8400-e29b-41d4-a716-446655440403', 'Mobile App Marketing Guide', 'Complete guide to app store optimization', 'document', 'Marketing', 'https://example.com/marketing-guide.pdf', ARRAY['ASO', 'Marketing', 'Mobile Apps'], false, 890, 4.7),
  ('550e8400-e29b-41d4-a716-446655440404', 'User Research Toolkit', 'Templates and methods for user research', 'tool', 'Research', 'https://example.com/research-toolkit.zip', ARRAY['User Research', 'Templates', 'UX'], true, 650, 4.6)
ON CONFLICT (id) DO NOTHING;

-- Insert sample achievements
INSERT INTO achievements (id, title, description, icon, criteria, points, badge_color) VALUES
  ('550e8400-e29b-41d4-a716-446655440501', 'First Steps', 'Complete your first lesson', 'play-circle', '{"type": "lesson_completed", "count": 1}', 10, '#10B981'),
  ('550e8400-e29b-41d4-a716-446655440502', 'Course Completer', 'Complete your first course', 'award', '{"type": "course_completed", "count": 1}', 50, '#F59E0B'),
  ('550e8400-e29b-41d4-a716-446655440503', 'Coding Novice', 'Complete 3 programming exercises', 'code', '{"type": "exercise_completed", "category": "programming", "count": 3}', 25, '#3B82F6'),
  ('550e8400-e29b-41d4-a716-446655440504', 'Discussion Starter', 'Post your first comment in the community', 'message-circle', '{"type": "comment_posted", "count": 1}', 15, '#8B5CF6'),
  ('550e8400-e29b-41d4-a716-446655440505', 'Learning Streak', 'Learn for 7 consecutive days', 'calendar', '{"type": "daily_streak", "count": 7}', 100, '#EF4444')
ON CONFLICT (id) DO NOTHING;

-- Insert sample learning paths
INSERT INTO learning_paths (id, title, description, thumbnail_url, estimated_duration_hours, difficulty_level, tags, is_featured) VALUES
  ('550e8400-e29b-41d4-a716-446655440601', 'Become a Full-Stack Developer', 'A comprehensive path to master both frontend and backend development', 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800', 120, 'intermediate', ARRAY['Full-Stack', 'Web Development', 'JavaScript'], true),
  ('550e8400-e29b-41d4-a716-446655440602', 'UI/UX Design Professional', 'Master the skills needed for a career in UI/UX design', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', 80, 'beginner', ARRAY['UI Design', 'UX Design', 'Design Thinking'], true),
  ('550e8400-e29b-41d4-a716-446655440603', 'Digital Marketing Expert', 'Complete digital marketing training from beginner to expert', 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=800', 60, 'beginner', ARRAY['Digital Marketing', 'SEO', 'Social Media'], false)
ON CONFLICT (id) DO NOTHING;

-- Insert learning path courses
INSERT INTO learning_path_courses (learning_path_id, course_id, order_index, is_required) VALUES
  ('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440202', 1, true),
  ('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440203', 2, false),
  ('550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440201', 1, true),
  ('550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440204', 1, true)
ON CONFLICT (learning_path_id, course_id) DO NOTHING;