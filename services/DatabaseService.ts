import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type Course = Tables['courses']['Row'];
type Category = Tables['categories']['Row'];
type Instructor = Tables['instructors']['Row'];
type Lesson = Tables['lessons']['Row'];
type Enrollment = Tables['enrollments']['Row'];
type LessonProgress = Tables['lesson_progress']['Row'];
type Resource = Tables['resources']['Row'];
type Achievement = Tables['achievements']['Row'];
type UserAchievement = Tables['user_achievements']['Row'];
type LearningPath = Tables['learning_paths']['Row'];
type CoachingSession = Tables['coaching_sessions']['Row'];
type Profile = Tables['profiles']['Row'];

export class DatabaseService {
  // Profile methods
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  }

  // Category methods
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }

    return data;
  }

  // Course methods
  static async getCourses(filters?: {
    categoryId?: string;
    level?: string;
    isFeatured?: boolean;
    limit?: number;
  }): Promise<Course[]> {
    let query = supabase
      .from('courses')
      .select(`
        *,
        categories (name, icon),
        instructors (name, title, avatar_url)
      `)
      .eq('is_published', true);

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.level) {
      query = query.eq('level', filters.level);
    }

    if (filters?.isFeatured) {
      query = query.eq('is_featured', filters.isFeatured);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return data || [];
  }

  static async getCourseById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        categories (name, icon, color),
        instructors (name, title, bio, avatar_url, expertise),
        lessons (id, title, duration_minutes, order_index, is_preview)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching course:', error);
      return null;
    }

    return data;
  }

  static async searchCourses(query: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        categories (name, icon),
        instructors (name, title, avatar_url)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_published', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error searching courses:', error);
      return [];
    }

    return data || [];
  }

  // Enrollment methods
  static async enrollInCourse(userId: string, courseId: string): Promise<Enrollment | null> {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error enrolling in course:', error);
      return null;
    }

    return data;
  }

  static async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          id, title, thumbnail_url, duration_minutes, level,
          categories (name),
          instructors (name, avatar_url)
        )
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }

    return data || [];
  }

  static async getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (error) {
      console.error('Error fetching enrollment:', error);
      return null;
    }

    return data;
  }

  static async updateEnrollmentProgress(
    userId: string,
    courseId: string,
    progressPercentage: number
  ): Promise<Enrollment | null> {
    const { data, error } = await supabase
      .from('enrollments')
      .update({
        progress_percentage: progressPercentage,
        last_accessed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .select()
      .single();

    if (error) {
      console.error('Error updating enrollment progress:', error);
      return null;
    }

    return data;
  }

  // Lesson methods
  static async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    if (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }

    return data || [];
  }

  static async getLessonById(id: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }

    return data;
  }

  // Lesson progress methods
  static async getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | null> {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();

    if (error) {
      console.error('Error fetching lesson progress:', error);
      return null;
    }

    return data;
  }

  static async updateLessonProgress(
    userId: string,
    lessonId: string,
    completed: boolean,
    timeSpentMinutes?: number
  ): Promise<LessonProgress | null> {
    const updateData: any = {
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    };

    if (timeSpentMinutes !== undefined) {
      updateData.time_spent_minutes = timeSpentMinutes;
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        ...updateData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating lesson progress:', error);
      return null;
    }

    return data;
  }

  static async getUserLessonProgress(userId: string, courseId: string): Promise<LessonProgress[]> {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select(`
        *,
        lessons!inner (course_id)
      `)
      .eq('user_id', userId)
      .eq('lessons.course_id', courseId);

    if (error) {
      console.error('Error fetching user lesson progress:', error);
      return [];
    }

    return data || [];
  }

  // Resource methods
  static async getResources(filters?: {
    type?: string;
    category?: string;
    isPremium?: boolean;
    limit?: number;
  }): Promise<Resource[]> {
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
  }

  static async searchResources(query: string): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error searching resources:', error);
      return [];
    }

    return data || [];
  }

  // Achievement methods
  static async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('points');

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data || [];
  }

  static async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (title, description, icon, points, badge_color)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }

    return data || [];
  }

  static async awardAchievement(
    userId: string,
    achievementId: string,
    progress: number = 100
  ): Promise<UserAchievement | null> {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        progress,
      })
      .select()
      .single();

    if (error) {
      console.error('Error awarding achievement:', error);
      return null;
    }

    return data;
  }

  // Learning path methods
  static async getLearningPaths(): Promise<LearningPath[]> {
    const { data, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        learning_path_courses (
          order_index,
          is_required,
          courses (id, title, duration_minutes, level)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching learning paths:', error);
      return [];
    }

    return data || [];
  }

  static async getLearningPathById(id: string): Promise<LearningPath | null> {
    const { data, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        learning_path_courses (
          order_index,
          is_required,
          courses (
            id, title, description, thumbnail_url, duration_minutes, level,
            categories (name),
            instructors (name, avatar_url)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching learning path:', error);
      return null;
    }

    return data;
  }

  // Coaching session methods
  static async getCoachingSessions(userId: string): Promise<CoachingSession[]> {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .select(`
        *,
        instructors (name, title, avatar_url)
      `)
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });

    if (error) {
      console.error('Error fetching coaching sessions:', error);
      return [];
    }

    return data || [];
  }

  static async createCoachingSession(
    userId: string,
    coachId: string,
    title: string,
    scheduledAt: string,
    durationMinutes: number = 60
  ): Promise<CoachingSession | null> {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .insert({
        user_id: userId,
        coach_id: coachId,
        title,
        scheduled_at: scheduledAt,
        duration_minutes: durationMinutes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating coaching session:', error);
      return null;
    }

    return data;
  }

  // Instructor methods
  static async getInstructors(): Promise<Instructor[]> {
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching instructors:', error);
      return [];
    }

    return data || [];
  }

  static async getInstructorById(id: string): Promise<Instructor | null> {
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching instructor:', error);
      return null;
    }

    return data;
  }

  // Analytics and statistics
  static async getUserStats(userId: string): Promise<{
    totalCourses: number;
    completedCourses: number;
    totalHours: number;
    achievements: number;
  }> {
    try {
      const [enrollments, achievements] = await Promise.all([
        this.getUserEnrollments(userId),
        this.getUserAchievements(userId),
      ]);

      const totalCourses = enrollments.length;
      const completedCourses = enrollments.filter(e => e.completed_at).length;
      const totalHours = enrollments.reduce((sum, enrollment) => {
        const course = enrollment.courses as any;
        return sum + (course?.duration_minutes || 0);
      }, 0) / 60;

      return {
        totalCourses,
        completedCourses,
        totalHours: Math.round(totalHours * 10) / 10,
        achievements: achievements.length,
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        totalCourses: 0,
        completedCourses: 0,
        totalHours: 0,
        achievements: 0,
      };
    }
  }
}