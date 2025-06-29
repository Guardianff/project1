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
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          categories!inner (name),
          instructors!inner (id, name, title, avatar_url)
        `)
        .eq('is_featured', true)
        .eq('is_published', true)
        .limit(5);

      if (error) {
        console.error('Error fetching featured courses:', error);
        return [];
      }

      return data.map(course => this.mapCourseData(course));
    } catch (error) {
      console.error('Error in getFeaturedCourses:', error);
      return [];
    }
  }

  static async getRecommendedCourses(): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          categories!inner (name),
          instructors!inner (id, name, title, avatar_url)
        `)
        .eq('is_published', true)
        .order('rating', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recommended courses:', error);
        return [];
      }

      return data.map(course => this.mapCourseData(course));
    } catch (error) {
      console.error('Error in getRecommendedCourses:', error);
      return [];
    }
  }

  static async getCoursesByCategory(categoryId: string): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          categories!inner (name),
          instructors!inner (id, name, title, avatar_url)
        `)
        .eq('category_id', categoryId)
        .eq('is_published', true);

      if (error) {
        console.error('Error fetching courses by category:', error);
        return [];
      }

      return data.map(course => this.mapCourseData(course));
    } catch (error) {
      console.error('Error in getCoursesByCategory:', error);
      return [];
    }
  }

  static async getCourseById(id: string): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          categories!inner (name),
          instructors!inner (id, name, title, avatar_url, bio),
          lessons (id, title, duration_minutes, content_type, is_preview)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        return null;
      }

      return this.mapCourseData(data, true);
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
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select(`
          *,
          instructors!inner (id, name, title, avatar_url)
        `)
        .eq('user_id', userId)
        .eq('status', 'scheduled')
        .order('scheduled_at');

      if (error) {
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
        status: session.status,
        meetingLink: session.meeting_url
      }));
    } catch (error) {
      console.error('Error in getUpcomingCoachingSessions:', error);
      return [];
    }
  }

  // Achievements
  static async getAchievements(userId: string): Promise<Achievement[]> {
    try {
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

      const { data: allAchievements, error: allError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true);

      if (allError) {
        console.error('Error fetching all achievements:', allError);
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
      const { data, error } = await supabase
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

      if (error) {
        console.error('Error fetching learning paths:', error);
        return [];
      }

      return data.map(path => {
        // Sort courses by order_index
        const sortedPathCourses = [...path.learning_path_courses].sort(
          (a, b) => a.order_index - b.order_index
        );

        // Map courses
        const courses = sortedPathCourses.map(pc => this.mapCourseData(pc.courses));

        return {
          id: path.id,
          title: path.title,
          description: path.description,
          courses: courses,
          progress: 0 // This would need to be calculated based on user progress
        };
      });
    } catch (error) {
      console.error('Error in getLearningPaths:', error);
      return [];
    }
  }

  // Helper methods
  private static mapCourseData(courseData: any, includeLessons = false): Course {
    const lessons = includeLessons && courseData.lessons 
      ? courseData.lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration_minutes || 0,
          completed: false, // This would need to be determined from user progress
          type: lesson.content_type as 'video' | 'reading' | 'quiz' | 'exercise'
        }))
      : [];

    return {
      id: courseData.id,
      title: courseData.title,
      description: courseData.description,
      thumbnail: courseData.thumbnail_url || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: courseData.duration_minutes,
      lessonsCount: courseData.lessons?.length || 0,
      progress: 0, // This would need to be calculated based on user progress
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
}