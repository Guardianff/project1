export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  completed: boolean;
  type: 'video' | 'reading' | 'quiz' | 'exercise';
  thumbnail?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number; // in minutes
  lessonsCount: number;
  progress: number; // 0-100
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  instructor: Instructor;
  lessons: Lesson[];
  rating: number;
  reviewsCount: number;
  enrolledCount: number;
  price?: number;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  courses: number;
  icon: string;
}

export interface CoachingSession {
  id: string;
  title: string;
  coach: Instructor;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  meetingLink?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number; // 0-100
  completed: boolean;
  unlockedAt?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  progress: number; // 0-100
}