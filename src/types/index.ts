// User related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  preferences: UserPreferences;
}

export type UserRole = 'student' | 'instructor' | 'admin';

export interface UserPreferences {
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

// Course related types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  level: CourseLevel;
  category: CourseCategory;
  duration: {
    weeks: number;
    hoursPerWeek: number;
  };
  instructor: Instructor;
  thumbnail: string;
  price: number;
  rating: number;
  enrolledStudents: number;
  syllabus: CourseSyllabus[];
  prerequisites: string[];
  objectives: string[];
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
}

export interface CourseSyllabus {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: ContentType;
  order: number;
  isRequired: boolean;
  children?: CourseSyllabus[];
}

export type ContentType = 'video' | 'article' | 'quiz' | 'assignment' | 'live-session';

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  expertise: string[];
  rating: number;
  totalStudents: number;
  totalCourses: number;
}

// Learning Progress types
export interface LearningProgress {
  userId: string;
  courseId: string;
  progress: number;
  status: LearningStatus;
  startedAt: string;
  lastAccessedAt: string;
  completedModules: string[];
  currentModule: string;
  timeSpent: number; // in minutes
  assessmentScores: AssessmentScore[];
}

export type LearningStatus = 'not-started' | 'in-progress' | 'completed' | 'paused';

export interface AssessmentScore {
  moduleId: string;
  score: number;
  maxScore: number;
  completedAt: string;
  attempts: number;
}

// Achievement types
export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  criteria: AchievementCriteria;
}

export type AchievementType = 'badge' | 'certificate' | 'milestone';

export interface AchievementCriteria {
  type: string;
  requirement: number;
  progress: number;
}

// Analytics types
export interface LearningAnalytics {
  userId: string;
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  averageScore: number;
  streakDays: number;
  learningGoals: LearningGoal[];
  weeklyProgress: WeeklyProgress[];
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'overdue';
}

export interface WeeklyProgress {
  week: string;
  hoursSpent: number;
  coursesProgressed: number;
  achievementsEarned: number;
} 