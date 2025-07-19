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

// Syllabus related types
export interface Syllabus {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  level: SyllabusLevel;
  category: SyllabusCategory;
  duration: {
    weeks: number;
    hoursPerWeek: number;
  };
  instructor: Instructor;
  thumbnail: string;
  price: number;
  rating: number;
  enrolledStudents: number;
  syllabus: Syllabusyllabus[];
  prerequisites: string[];
  objectives: string[];
  status: Syllabustatus;
  createdAt: string;
  updatedAt: string;
}

export type SyllabusLevel = 'beginner' | 'intermediate' | 'advanced';

export type Syllabustatus = 'draft' | 'published' | 'archived';

export interface SyllabusCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
}

export interface Syllabusyllabus {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: ContentType;
  order: number;
  isRequired: boolean;
  children?: Syllabusyllabus[];
}

export type ContentType = 'video' | 'article' | 'quiz' | 'quiz' | 'live-session';

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  expertise: string[];
  rating: number;
  totalStudents: number;
  totalSyllabus: number;
}

// Learning Progress types
export interface LearningProgress {
  userId: string;
  syllabusId: string;
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
  totalSyllabus: number;
  completedSyllabus: number;
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
  syllabusProgressed: number;
  achievementsEarned: number;
} 