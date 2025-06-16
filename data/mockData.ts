import { Course, Category, CoachingSession, Achievement, LearningPath } from '../types/course';

export const featuredCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to UI/UX Design',
    description: 'Learn the fundamentals of UI/UX design and create your first portfolio-ready project.',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 240,
    lessonsCount: 12,
    progress: 45,
    category: 'Design',
    level: 'beginner',
    tags: ['UI', 'UX', 'Design', 'Figma'],
    instructor: {
      id: 'i1',
      name: 'Sarah Johnson',
      title: 'Senior UI/UX Designer',
      avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: '10+ years of experience in UI/UX design for major tech companies'
    },
    lessons: [
      {
        id: 'l1',
        title: 'Understanding User Experience',
        duration: 20,
        completed: true,
        type: 'video',
        thumbnail: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: 'l2',
        title: 'UI Design Principles',
        duration: 25,
        completed: true,
        type: 'video',
        thumbnail: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: 'l3',
        title: 'Color Theory in Design',
        duration: 18,
        completed: false,
        type: 'reading',
        thumbnail: 'https://images.pexels.com/photos/1212407/pexels-photo-1212407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ],
    rating: 4.7,
    reviewsCount: 328,
    enrolledCount: 1254,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Advanced JavaScript Concepts',
    description: 'Master advanced JavaScript concepts like closures, prototypes, async programming and more.',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 320,
    lessonsCount: 16,
    progress: 25,
    category: 'Development',
    level: 'advanced',
    tags: ['JavaScript', 'Web Development', 'Frontend'],
    instructor: {
      id: 'i2',
      name: 'Michael Chen',
      title: 'Senior JavaScript Developer',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'JavaScript expert with focus on modern frameworks and performance optimization'
    },
    lessons: [
      {
        id: 'l1',
        title: 'Understanding Closures',
        duration: 22,
        completed: true,
        type: 'video',
        thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: 'l2',
        title: 'Prototypal Inheritance',
        duration: 25,
        completed: false,
        type: 'video',
        thumbnail: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: 'l3',
        title: 'Async/Await Deep Dive',
        duration: 30,
        completed: false,
        type: 'exercise',
        thumbnail: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ],
    rating: 4.9,
    reviewsCount: 412,
    enrolledCount: 2154,
    isFeatured: true
  }
];

export const categories: Category[] = [
  { id: 'c1', name: 'Design', courses: 24, icon: 'palette' },
  { id: 'c2', name: 'Development', courses: 36, icon: 'code' },
  { id: 'c3', name: 'Business', courses: 18, icon: 'briefcase' },
  { id: 'c4', name: 'Marketing', courses: 12, icon: 'trending-up' },
  { id: 'c5', name: 'Photography', courses: 8, icon: 'camera' },
  { id: 'c6', name: 'Music', courses: 15, icon: 'music' },
  { id: 'c7', name: 'Health & Fitness', courses: 20, icon: 'activity' },
  { id: 'c8', name: 'Personal Development', courses: 22, icon: 'user' }
];

export const recommendedCourses: Course[] = [
  {
    id: '3',
    title: 'Data Science Fundamentals',
    description: 'Learn the basics of data science, from statistics to machine learning algorithms.',
    thumbnail: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 280,
    lessonsCount: 14,
    progress: 10,
    category: 'Data Science',
    level: 'intermediate',
    tags: ['Data Science', 'Python', 'Machine Learning'],
    instructor: {
      id: 'i3',
      name: 'Emily Rodriguez',
      title: 'Data Scientist',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Former data scientist at a Fortune 500 company with PhD in Statistics'
    },
    lessons: [
      {
        id: 'l1',
        title: 'Introduction to Python for Data Science',
        duration: 28,
        completed: true,
        type: 'video',
        thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: 'l2',
        title: 'Statistical Analysis Basics',
        duration: 32,
        completed: false,
        type: 'reading',
        thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ],
    rating: 4.8,
    reviewsCount: 215,
    enrolledCount: 987,
    price: 89.99
  },
  {
    id: '4',
    title: 'Digital Marketing Masterclass',
    description: 'Comprehensive guide to digital marketing strategies and tools for modern businesses.',
    thumbnail: 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: 210,
    lessonsCount: 10,
    progress: 0,
    category: 'Marketing',
    level: 'beginner',
    tags: ['Digital Marketing', 'SEO', 'Social Media'],
    instructor: {
      id: 'i4',
      name: 'Daniel Brown',
      title: 'Marketing Director',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: '15 years of experience in digital marketing for startups and established brands'
    },
    lessons: [
      {
        id: 'l1',
        title: 'Digital Marketing Overview',
        duration: 22,
        completed: false,
        type: 'video',
        thumbnail: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: 'l2',
        title: 'SEO Fundamentals',
        duration: 26,
        completed: false,
        type: 'video',
        thumbnail: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ],
    rating: 4.6,
    reviewsCount: 178,
    enrolledCount: 842,
    price: 69.99
  }
];

export const upcomingCoachingSessions: CoachingSession[] = [
  {
    id: 's1',
    title: 'Career Development Strategy',
    coach: {
      id: 'c1',
      name: 'Robert Williams',
      title: 'Career Coach',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    date: '2025-06-15',
    time: '10:00 AM',
    duration: 60,
    status: 'upcoming',
    meetingLink: 'https://zoom.us/j/123456789'
  },
  {
    id: 's2',
    title: 'UI/UX Portfolio Review',
    coach: {
      id: 'c2',
      name: 'Sarah Johnson',
      title: 'Senior UI/UX Designer',
      avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    date: '2025-06-18',
    time: '3:30 PM',
    duration: 45,
    status: 'upcoming',
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  }
];

export const achievements: Achievement[] = [
  {
    id: 'a1',
    title: 'Course Completer',
    description: 'Complete your first course',
    icon: 'award',
    progress: 100,
    completed: true,
    unlockedAt: '2025-05-10'
  },
  {
    id: 'a2',
    title: 'Coding Novice',
    description: 'Complete 3 programming exercises',
    icon: 'code',
    progress: 66,
    completed: false
  },
  {
    id: 'a3',
    title: 'Discussion Starter',
    description: 'Post your first comment in the community',
    icon: 'message-circle',
    progress: 0,
    completed: false
  }
];

export const learningPaths: LearningPath[] = [
  {
    id: 'lp1',
    title: 'Become a Full-Stack Developer',
    description: 'A comprehensive path to master both frontend and backend development',
    progress: 35,
    courses: featuredCourses.concat(recommendedCourses).slice(0, 3)
  },
  {
    id: 'lp2',
    title: 'Digital Marketing Professional',
    description: 'Master the skills needed for a career in digital marketing',
    progress: 15,
    courses: recommendedCourses.slice(0, 2)
  }
];

export const recentActivities = [
  {
    id: '1',
    type: 'course_progress',
    title: 'Introduction to UI/UX Design',
    description: 'Completed lesson: Understanding User Experience',
    time: '2 hours ago',
    icon: 'book-open'
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Course Completer',
    description: 'You\'ve completed your first course!',
    time: '3 days ago',
    icon: 'award'
  },
  {
    id: '3',
    type: 'coaching',
    title: 'Career Development Strategy',
    description: 'Scheduled a coaching session',
    time: '1 week ago',
    icon: 'calendar'
  }
];