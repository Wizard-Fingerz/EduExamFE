import type { ContentType } from ".";

export interface LearningStyle {
  id: string;
  type: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  preference: number; // 0-100 scale
}

export interface PerformanceMetrics {
  comprehensionRate: number; // 0-100
  completionTime: number; // in seconds
  attemptsCount: number;
  accuracyRate: number; // 0-100
  confidenceLevel: number; // 1-5 scale
}

export interface AdaptiveSettings {
  difficultyLevel: number;
  pacePreference: 'slow' | 'medium' | 'fast';
  requiresAdditionalSupport: boolean;
  preferredContentTypes: ('video' | 'audio' | 'text' | 'interactive')[];
  accommodations: {
    type: string;
    enabled: boolean;
  }[];
}

export interface Accommodation {
  type: 'extendedTime' | 'simplifiedLanguage' | 'visualAids' | 'audioSupport' | 'breakdowns';
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface ExamSession {
  id: string;
  studentId: string;
  subjectId: string;
  topicId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  startTime: string;
  timeAllowed: number;
  questions: AdaptiveQuestion[];
  currentQuestionIndex: number;
  adaptiveSettings: AdaptiveSettings;
  performance: PerformanceMetrics;
}

export interface AdaptiveQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'matching';
  difficulty: number;
  content: {
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    hints: string[];
    explanation: string;
    supportMaterial?: {
      type: 'video' | 'audio' | 'image' | 'text';
      url?: string;
      description: string;
    }[];
  };
  metadata: {
    topic: string;
    subtopic: string;
    learningObjective: string;
    skillLevel: 'basic' | 'intermediate' | 'advanced';
  };
}

export interface SupportMaterial {
  type: 'image' | 'video' | 'audio' | 'diagram' | 'example';
  url: string;
  description: string;
  transcription?: string;
}

export interface QuestionAttempt {
  timestamp: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  confidenceLevel: number;
  needsHelp: boolean;
  hintUsed: boolean;
}

export interface AdaptiveFeedback {
  type: 'encouragement' | 'hint' | 'explanation' | 'suggestion';
  message: string;
  action?: string;
}

export interface LearningPath {
  id: string;
  studentId: string;
  subject: string;
  currentLevel: number;
  targetLevel: number;
  milestones: LearningMilestone[];
  adaptiveSettings: AdaptiveSettings;
  progress: number;
  recommendations: Recommendation[];
}

export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  objectives: string[];
  content: AdaptiveContent[];
  assessments: AdaptiveQuestion[];
  completed: boolean;
  performance?: PerformanceMetrics;
}

export interface AdaptiveContent {
  id: string;
  type: ContentType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  content: {
    title: string;
    description: string;
    mainContent: string;
    simplifiedVersion?: string;
    visualAids?: SupportMaterial[];
    interactiveElements?: InteractiveElement[];
  };
  estimatedDuration: number;
  actualDuration?: number;
  completed: boolean;
  comprehensionChecks: ComprehensionCheck[];
}

export interface InteractiveElement {
  type: 'quiz' | 'simulation' | 'exercise' | 'game';
  config: Record<string, any>;
  feedback: AdaptiveFeedback[];
}

export interface ComprehensionCheck {
  question: string;
  expectedAnswer: string;
  studentAnswer?: string;
  isCorrect?: boolean;
  feedback?: string;
}

export interface Recommendation {
  type: 'content' | 'practice' | 'review' | 'support';
  reason: string;
  priority: number;
  content: {
    title: string;
    description: string;
    link: string;
    difficulty: number;
  };
  status: 'pending' | 'accepted' | 'completed' | 'skipped';
} 