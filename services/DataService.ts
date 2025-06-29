import { supabase } from '@/lib/supabase';
import { Course, Category, Instructor, CoachingSession, Achievement, LearningPath } from '@/types/course';

export class DataService {
  // Categories
  static async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return data.map(category => ({
        id: category.id,
        name: category.name,
        courses: category.course_count || 0,
        icon: category.icon
      }));
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching category:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        courses: data.course_count || 0,
        icon: data.icon
      };
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      return null;
    }
  }

  // Courses
  static async getFeaturedCourses(): Promise<Course[]> {
    try {
      // First, try the original query with joins
      let { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          categories!inner (name),
          instructors!inner (id, name, title, avatar_url)
        `)
        .eq('is_featured', true)
        .eq('is_published', true)
        .limit(5);

      // If the join fails due to missing foreign key relationships, fall back to separate queries
      if (error && error.message.includes('relationship')) {
        console.warn('Foreign key relationship missing, using fallback query method');
        
        // Get courses without joins
        const coursesResult = await supabase
          .from('courses')
          .select('*')
          .eq('is_featured', true)
          .eq('is_published', true)
          .limit(5);

        if (coursesResult.error) {
          console.error('Error fetching courses:', coursesResult.error);
          return [];
        }

        // Get categories and instructors separately
        const [categoriesResult, instructorsResult] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('instructors').select('*')
        ]);

        // Combine the data manually
        data = coursesResult.data.map(course => ({
          ...course,
          categories: categoriesResult.data?.find(cat => cat.id === course.category_id) || { name: 'General' },
          instructors: instructorsResult.data?.find(inst => inst.id === course.instructor_id) || {
            id: '',
            name: 'Unknown Instructor',
            title: 'Instructor',
            avatar_url: null
          }
        }));
      } else if (error) {
        console.error('Error fetching featured courses:', error);
        return [];
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user is logged in, fetch their enrollments to get progress
      let enrollments = [];
      if (user) {
        const { data: enrollmentsData } = await supabase
          .from('enrollments')
          .select('course_id, progress_percentage')
          .eq('user_id', user.id);
          
        enrollments = enrollmentsData || [];
      }

      return data.map(course => this.mapCourseData(course, false, enrollments));
    } catch (error) {
      console.error('Error in getFeaturedCourses:', error);
      return [];
    }
  }

  static async getRecommendedCourses(): Promise<Course[]> {
    try {
      // First, try the original query with joins
      let { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          categories!inner (name),
          instructors!inner (id, name, title, avatar_url)
        `)
        .eq('is_published', true)
        .order('rating', { ascending: false })
        .limit(5);

      // If the join fails due to missing foreign key relationships, fall back to separate queries
      if (error && error.message.includes('relationship')) {
        console.warn('Foreign key relationship missing, using fallback query method');
        
        // Get courses without joins
        const coursesResult = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('rating', { ascending: false })
          .limit(5);

        if (coursesResult.error) {
          console.error('Error fetching courses:', coursesResult.error);
          return [];
        }

        // Get categories and instructors separately
        const [categoriesResult, instructorsResult] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('instructors').select('*')
        ]);

        // Combine the data manually
        data = coursesResult.data.map(course => ({
          ...course,
          categories: categoriesResult.data?.find(cat => cat.id === course.category_id) || { name: 'General' },
          instructors: instructorsResult.data?.find(inst => inst.id === course.instructor_id) || {
            id: '',
            name: 'Unknown Instructor',
            title: 'Instructor',
            avatar_url: null
          }
        }));
      } else if (error) {
        console.error('Error fetching recommended courses:', error);
        return [];
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user is logged in, fetch their enrollments to get progress
      let enrollments = [];
      if (user) {
        const { data: enrollmentsData } = await supabase
          .from('enrollments')
          .select('course_id, progress_percentage')
          .eq('user_id', user.id);
          
        enrollments = enrollmentsData || [];
      }

      return data.map(course => this.mapCourseData(course, false, enrollments));
    } catch (error) {
      console.error('Error in getRecommendedCourses:', error);
      return [];
    }
  }

  static async getCoursesByCategory(categoryId: string): Promise<Course[]> {
    try {
      // First, try the original query with joins
      let { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          categories!inner (name),
          instructors!inner (id, name, title, avatar_url)
        `)
        .eq('category_id', categoryId)
        .eq('is_published', true);

      // If the join fails due to missing foreign key relationships, fall back to separate queries
      if (error && error.message.includes('relationship')) {
        console.warn('Foreign key relationship missing, using fallback query method');
        
        // Get courses without joins
        const coursesResult = await supabase
          .from('courses')
          .select('*')
          .eq('category_id', categoryId)
          .eq('is_published', true);

        if (coursesResult.error) {
          console.error('Error fetching courses:', coursesResult.error);
          return [];
        }

        // Get categories and instructors separately
        const [categoriesResult, instructorsResult] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('instructors').select('*')
        ]);

        // Combine the data manually
        data = coursesResult.data.map(course => ({
          ...course,
          categories: categoriesResult.data?.find(cat => cat.id === course.category_id) || { name: 'General' },
          instructors: instructorsResult.data?.find(inst => inst.id === course.instructor_id) || {
            id: '',
            name: 'Unknown Instructor',
            title: 'Instructor',
            avatar_url: null
          }
        }));
      } else if (error) {
        console.error('Error fetching courses by category:', error);
        return [];
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user is logged in, fetch their enrollments to get progress
      let enrollments = [];
      if (user) {
        const { data: enrollmentsData } = await supabase
          .from('enrollments')
          .select('course_id, progress_percentage')
          .eq('user_id', user.id);
          
        enrollments = enrollmentsData || [];
      }

      return data.map(course => this.mapCourseData(course, false, enrollments));
    } catch (error) {
      console.error('Error in getCoursesByCategory:', error);
      return [];
    }
  }

  static async getCourseById(id: string): Promise<Course | null> {
    try {
      // First, try the original query with joins
      let { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          categories!inner (name),
          instructors!inner (id, name, title, avatar_url, bio),
          lessons (id, title, duration_minutes, content_type, is_preview)
        `)
        .eq('id', id)
        .single();

      // If the join fails due to missing foreign key relationships, fall back to separate queries
      if (error && error.message.includes('relationship')) {
        console.warn('Foreign key relationship missing, using fallback query method');
        
        // Get course without joins
        const courseResult = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseResult.error) {
          console.error('Error fetching course:', courseResult.error);
          return null;
        }

        // Get related data separately
        const [categoriesResult, instructorsResult, lessonsResult] = await Promise.all([
          supabase.from('categories').select('*').eq('id', courseResult.data.category_id).single(),
          supabase.from('instructors').select('*').eq('id', courseResult.data.instructor_id).single(),
          supabase.from('lessons').select('id, title, duration_minutes, content_type, is_preview').eq('course_id', id)
        ]);

        // Combine the data manually
        data = {
          ...courseResult.data,
          categories: categoriesResult.data || { name: 'General' },
          instructors: instructorsResult.data || {
            id: '',
            name: 'Unknown Instructor',
            title: 'Instructor',
            avatar_url: null,
            bio: null
          },
          lessons: lessonsResult.data || []
        };
      } else if (error) {
        console.error('Error fetching course:', error);
        return null;
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user is logged in, fetch their enrollment and lesson progress
      let enrollments = [];
      let lessonProgress = [];
      if (user) {
        const [enrollmentsResult, progressResult] = await Promise.all([
          supabase
            .from('enrollments')
            .select('course_id, progress_percentage')
            .eq('user_id', user.id)
            .eq('course_id', id),
          supabase
            .from('lesson_progress')
            .select('lesson_id, completed')
            .eq('user_id', user.id)
        ]);
        
        enrollments = enrollmentsResult.data || [];
        lessonProgress = progressResult.data || [];
      }

      return this.mapCourseData(data, true, enrollments, lessonProgress);
    } catch (error) {
      console.error('Error in getCourseById:', error);
      return null;
    }
  }

  // Instructors
  static async getInstructors(): Promise<Instructor[]> {
    try {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching instructors:', error);
        return [];
      }

      return data.map(instructor => ({
        id: instructor.id,
        name: instructor.name,
        title: instructor.title,
        avatar: instructor.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: instructor.bio
      }));
    } catch (error) {
      console.error('Error in getInstructors:', error);
      return [];
    }
  }

  // Coaching Sessions
  static async getUpcomingCoachingSessions(userId: string): Promise<CoachingSession[]> {
    try {
      // First, try the original query with joins
      let { data, error } = await supabase
        .from('coaching_sessions')
        .select(`
          *,
          instructors!inner (id, name, title, avatar_url)
        `)
        .eq('user_id', userId)
        .eq('status', 'scheduled')
        .order('scheduled_at');

      // If the join fails, fall back to separate queries
      if (error && error.message.includes('relationship')) {
        console.warn('Foreign key relationship missing, using fallback query method');
        
        const sessionsResult = await supabase
          .from('coaching_sessions')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'scheduled')
          .order('scheduled_at');

        if (sessionsResult.error) {
          console.error('Error fetching coaching sessions:', sessionsResult.error);
          return [];
        }

        const instructorsResult = await supabase
          .from('instructors')
          .select('*');

        data = sessionsResult.data.map(session => ({
          ...session,
          instructors: instructorsResult.data?.find(inst => inst.id === session.coach_id) || {
            id: '',
            name: 'Unknown Coach',
            title: 'Coach',
            avatar_url: null
          }
        }));
      } else if (error) {
        console.error('Error fetching coaching sessions:', error);
        return [];
      }

      return data.map(session => ({
        id: session.id,
        title: session.title,
        coach: {
          id: session.instructors.id,
          name: session.instructors.name,
          title: session.instructors.title,
          avatar: session.instructors.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        date: session.scheduled_at,
        time: new Date(session.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        duration: session.duration_minutes,
        status: 'upcoming',
        meetingLink: session.meeting_url
      }));
    } catch (error) {
      console.error('Error in getUpcomingCoachingSessions:', error);
      return [];
    }
  }

  // Achievements
  static async getAchievements(userId?: string): Promise<Achievement[]> {
    try {
      // First get all achievements
      const { data: allAchievements, error: allError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true);

      if (allError) {
        console.error('Error fetching all achievements:', allError);
        return [];
      }

      // If no user ID provided, return all achievements with 0 progress
      if (!userId) {
        return allAchievements.map(a => ({
          id: a.id,
          title: a.title,
          description: a.description,
          icon: a.icon,
          progress: 0,
          completed: false
        }));
      }

      // Get user achievements
      const { data: userAchievements, error: userError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements!inner (id, title, description, icon, badge_color)
        `)
        .eq('user_id', userId);

      if (userError) {
        console.error('Error fetching user achievements:', userError);
        return [];
      }

      // Map completed achievements
      const completedAchievements = userAchievements.map(ua => ({
        id: ua.achievements.id,
        title: ua.achievements.title,
        description: ua.achievements.description,
        icon: ua.achievements.icon,
        progress: ua.progress,
        completed: ua.progress === 100,
        unlockedAt: ua.earned_at
      }));

      // Map incomplete achievements (not in user achievements)
      const completedIds = new Set(completedAchievements.map(a => a.id));
      const incompleteAchievements = allAchievements
        .filter(a => !completedIds.has(a.id))
        .map(a => ({
          id: a.id,
          title: a.title,
          description: a.description,
          icon: a.icon,
          progress: 0,
          completed: false
        }));

      return [...completedAchievements, ...incompleteAchievements];
    } catch (error) {
      console.error('Error in getAchievements:', error);
      return [];
    }
  }

  // Learning Paths
  static async getLearningPaths(): Promise<LearningPath[]> {
    try {
      // First, try the original query with joins
      let { data, error } = await supabase
        .from('learning_paths')
        .select(`
          *,
          learning_path_courses (
            order_index,
            courses (
              id, title, description, thumbnail_url, duration_minutes, level,
              categories (name),
              instructors (id, name, title, avatar_url)
            )
          )
        `)
        .order('created_at', { ascending: false });

      // If the join fails, fall back to separate queries
      if (error && error.message.includes('relationship')) {
        console.warn('Foreign key relationship missing, using fallback query method');
        
        const pathsResult = await supabase
          .from('learning_paths')
          .select('*')
          .order('created_at', { ascending: false });

        if (pathsResult.error) {
          console.error('Error fetching learning paths:', pathsResult.error);
          return [];
        }

        // Get path courses and related data separately
        const pathCoursesResult = await supabase
          .from('learning_path_courses')
          .select('*');

        const [coursesResult, categoriesResult, instructorsResult] = await Promise.all([
          supabase.from('courses').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('instructors').select('*')
        ]);

        // Combine the data manually
        data = pathsResult.data.map(path => ({
          ...path,
          learning_path_courses: pathCoursesResult.data
            ?.filter(pc => pc.learning_path_id === path.id)
            .map(pc => {
              const course = coursesResult.data?.find(c => c.id === pc.course_id);
              if (!course) return null;
              
              return {
                order_index: pc.order_index,
                courses: {
                  ...course,
                  categories: categoriesResult.data?.find(cat => cat.id === course.category_id) || { name: 'General' },
                  instructors: instructorsResult.data?.find(inst => inst.id === course.instructor_id) || {
                    id: '',
                    name: 'Unknown Instructor',
                    title: 'Instructor',
                    avatar_url: null
                  }
                }
              };
            })
            .filter(Boolean) || []
        }));
      } else if (error) {
        console.error('Error fetching learning paths:', error);
        return [];
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user is logged in, fetch their enrollments to get progress
      let enrollments = [];
      if (user) {
        const { data: enrollmentsData } = await supabase
          .from('enrollments')
          .select('course_id, progress_percentage')
          .eq('user_id', user.id);
          
        enrollments = enrollmentsData || [];
      }

      return data.map(path => {
        // Sort courses by order_index
        const sortedPathCourses = [...path.learning_path_courses].sort(
          (a, b) => a.order_index - b.order_index
        );

        // Map courses
        const courses = sortedPathCourses.map(pc => this.mapCourseData(pc.courses, false, enrollments));

        // Calculate overall progress
        let progress = 0;
        if (courses.length > 0) {
          const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0);
          progress = Math.round(totalProgress / courses.length);
        }

        return {
          id: path.id,
          title: path.title,
          description: path.description,
          courses: courses,
          progress: progress
        };
      });
    } catch (error) {
      console.error('Error in getLearningPaths:', error);
      return [];
    }
  }

  // Resources
  static async getResources(filters?: {
    type?: string;
    category?: string;
    isPremium?: boolean;
    isFeatured?: boolean;
    limit?: number;
  }): Promise<any[]> {
    try {
      let query = supabase
        .from('resources')
        .select('*');

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.isPremium !== undefined) {
        query = query.eq('is_premium', filters.isPremium);
      }

      if (filters?.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching resources:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getResources:', error);
      return [];
    }
  }

  // User Stats
  static async getUserStats(userId: string): Promise<{
    totalCourses: number;
    completedCourses: number;
    totalHours: number;
    achievements: number;
    streak: number;
  }> {
    try {
      // Get enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (duration_minutes)
        `)
        .eq('user_id', userId);

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
        throw enrollmentsError;
      }

      // Get achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

      if (achievementsError) {
        console.error('Error fetching achievements:', achievementsError);
        throw achievementsError;
      }

      // Calculate stats
      const totalCourses = enrollments.length;
      const completedCourses = enrollments.filter(e => e.completed_at).length;
      
      // Calculate total hours from course durations
      const totalMinutes = enrollments.reduce((sum, enrollment) => {
        const course = enrollment.courses as any;
        return sum + (course?.duration_minutes || 0);
      }, 0);
      
      const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

      // Calculate streak (in a real app, this would be more complex)
      // For now, we'll use a simple calculation based on recent lesson progress
      const { data: recentProgress, error: progressError } = await supabase
        .from('lesson_progress')
        .select('completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(30);

      if (progressError) {
        console.error('Error fetching lesson progress:', progressError);
        throw progressError;
      }

      // Simple streak calculation (consecutive days with completed lessons)
      let streak = 0;
      if (recentProgress && recentProgress.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Check if there's activity today or yesterday to maintain streak
        const hasRecentActivity = recentProgress.some(progress => {
          if (!progress.completed_at) return false;
          const completedDate = new Date(progress.completed_at);
          completedDate.setHours(0, 0, 0, 0);
          return completedDate.getTime() === today.getTime() || 
                 completedDate.getTime() === yesterday.getTime();
        });
        
        if (hasRecentActivity) {
          // Count consecutive days with activity
          const activityDays = new Set();
          recentProgress.forEach(progress => {
            if (progress.completed_at) {
              const date = new Date(progress.completed_at);
              activityDays.add(date.toDateString());
            }
          });
          
          // Simple approximation - in a real app, you'd check for actual consecutive days
          streak = Math.min(activityDays.size, 7);
        }
      }

      return {
        totalCourses,
        completedCourses,
        totalHours,
        achievements: achievements.length,
        streak: streak || 0
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return {
        totalCourses: 0,
        completedCourses: 0,
        totalHours: 0,
        achievements: 0,
        streak: 0
      };
    }
  }

  // Recent Activity
  static async getUserRecentActivity(userId: string, limit: number = 5): Promise<any[]> {
    try {
      // Get recent enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          id, 
          enrolled_at, 
          progress_percentage,
          courses (id, title, thumbnail_url)
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false })
        .limit(limit);

      if (enrollmentsError) {
        console.error('Error fetching recent enrollments:', enrollmentsError);
        throw enrollmentsError;
      }

      // Get recent lesson progress
      const { data: lessonProgress, error: progressError } = await supabase
        .from('lesson_progress')
        .select(`
          id,
          completed_at,
          lessons!inner (id, title, course_id),
          lessons!inner (courses (id, title))
        `)
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (progressError) {
        console.error('Error fetching recent lesson progress:', progressError);
        throw progressError;
      }

      // Get recent achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          id,
          earned_at,
          achievements (id, title, icon, badge_color)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
        .limit(limit);

      if (achievementsError) {
        console.error('Error fetching recent achievements:', achievementsError);
        throw achievementsError;
      }

      // Combine and format activities
      const activities = [
        ...enrollments.map(enrollment => ({
          id: `enrollment_${enrollment.id}`,
          type: 'enrollment',
          title: `Enrolled in ${enrollment.courses.title}`,
          timestamp: enrollment.enrolled_at,
          data: {
            courseId: enrollment.courses.id,
            courseName: enrollment.courses.title,
            thumbnail: enrollment.courses.thumbnail_url,
            progress: enrollment.progress_percentage
          }
        })),
        ...lessonProgress.map(progress => ({
          id: `lesson_${progress.id}`,
          type: 'lesson_completed',
          title: `Completed lesson: ${progress.lessons.title}`,
          timestamp: progress.completed_at,
          data: {
            lessonId: progress.lessons.id,
            lessonTitle: progress.lessons.title,
            courseId: progress.lessons.course_id,
            courseName: progress.lessons.courses.title
          }
        })),
        ...achievements.map(achievement => ({
          id: `achievement_${achievement.id}`,
          type: 'achievement',
          title: `Earned achievement: ${achievement.achievements.title}`,
          timestamp: achievement.earned_at,
          data: {
            achievementId: achievement.achievements.id,
            achievementTitle: achievement.achievements.title,
            icon: achievement.achievements.icon,
            badgeColor: achievement.achievements.badge_color
          }
        }))
      ];

      // Sort by timestamp (newest first)
      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Return the most recent activities
      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error in getUserRecentActivity:', error);
      return [];
    }
  }

  // Digital Badges (User Achievements with visual representation)
  static async getDigitalBadges(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          id,
          earned_at,
          progress,
          achievements (id, title, description, icon, badge_color, points)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching digital badges:', error);
        return [];
      }

      return data.map(badge => ({
        id: badge.id,
        name: badge.achievements.title,
        description: badge.achievements.description,
        issuer: 'Learning Platform',
        issuerLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
        badgeImage: this.getBadgeImage(badge.achievements.icon),
        dateEarned: badge.earned_at,
        verificationUrl: `https://example.com/verify/${badge.id}`,
        isVerified: true,
        category: 'Learning',
        skillLevel: this.getSkillLevelFromPoints(badge.achievements.points),
        credentialType: 'badge',
        shareCount: Math.floor(Math.random() * 50),
        viewCount: Math.floor(Math.random() * 200) + 50,
        tags: ['Learning', 'Achievement', badge.achievements.title.split(' ')[0]]
      }));
    } catch (error) {
      console.error('Error in getDigitalBadges:', error);
      return [];
    }
  }

  // Helper methods
  private static mapCourseData(
    courseData: any, 
    includeLessons = false, 
    enrollments: any[] = [], 
    lessonProgress: any[] = []
  ): Course {
    // Find user's enrollment for this course
    const enrollment = enrollments.find(e => e.course_id === courseData.id);
    const progress = enrollment ? enrollment.progress_percentage : 0;

    const lessons = includeLessons && courseData.lessons 
      ? courseData.lessons.map((lesson: any) => {
          // Find progress for this lesson
          const progress = lessonProgress.find(p => p.lesson_id === lesson.id);
          return {
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration_minutes || 0,
            completed: progress ? progress.completed : false,
            type: lesson.content_type as 'video' | 'reading' | 'quiz' | 'exercise'
          };
        })
      : [];

    return {
      id: courseData.id,
      title: courseData.title,
      description: courseData.description,
      thumbnail: courseData.thumbnail_url || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: courseData.duration_minutes,
      lessonsCount: courseData.lessons?.length || 0,
      progress: progress,
      category: courseData.categories?.name || 'General',
      level: courseData.level,
      tags: courseData.tags || [],
      instructor: {
        id: courseData.instructors?.id || '',
        name: courseData.instructors?.name || 'Unknown Instructor',
        title: courseData.instructors?.title || 'Instructor',
        avatar: courseData.instructors?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: courseData.instructors?.bio
      },
      lessons: lessons,
      rating: courseData.rating || 0,
      reviewsCount: courseData.review_count || 0,
      enrolledCount: courseData.enrolled_count || 0,
      price: courseData.price,
      isFeatured: courseData.is_featured
    };
  }

  private static getBadgeImage(icon: string): string {
    // Map icon names to appropriate images
    const iconImageMap: Record<string, string> = {
      'award': 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      'code': 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      'play-circle': 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      'message-circle': 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      'calendar': 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    return iconImageMap[icon] || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400';
  }

  private static getSkillLevelFromPoints(points: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (points < 20) return 'beginner';
    if (points < 50) return 'intermediate';
    if (points < 100) return 'advanced';
    return 'expert';
  }
}