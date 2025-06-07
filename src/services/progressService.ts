import api from './api';

export interface CourseProgress {
  id: number;
  student: number;
  course: any;
  completed_lessons: number[];
  total_lessons: number;
  progress_percentage: number;
  last_accessed: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface LessonProgress {
  id: number;
  student: number;
  lesson: number;
  is_completed: boolean;
  completed_at: string | null;
  time_spent: number;
  last_position: number;
}

export interface ExamProgress {
  id: number;
  student: number;
  exam: number;
  attempts: number[];
  best_score: number | null;
  last_attempt: string | null;
}

export interface CourseProgressOverview {
  course: any;
  progress_percentage: number;
  completed_lessons: number;
  total_lessons: number;
  last_accessed_lesson: any;
  is_completed: boolean;
  completed_at: string | null;
}

const progressService = {
  // Course Progress
  async getCourseProgress(courseId: number) {
    const response = await api.get(`/progress/course/${courseId}/`);
    return response.data;
  },

  async updateCourseProgress(courseId: number, data: Partial<CourseProgress>) {
    const response = await api.put(`/progress/course/${courseId}/`, data);
    return response.data;
  },

  async getCourseProgressOverview(courseId: number) {
    const response = await api.get(`/progress/course/${courseId}/overview/`);
    return response.data;
  },

  async getAllCourseProgress(): Promise<CourseProgress[]> {
    try {
      const response = await api.get('/progress/courses/');
      // Handle paginated response
      const data = response.data.results || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching all course progress:', error);
      return [];
    }
  },

  // Lesson Progress
  async getLessonProgress(lessonId: number) {
    const response = await api.get(`/progress/lesson/${lessonId}/`);
    return response.data;
  },

  async updateLessonProgress(lessonId: number, data: Partial<LessonProgress>) {
    const response = await api.put(`/progress/lesson/${lessonId}/`, data);
    return response.data;
  },

  async completeLesson(lessonId: number) {
    const response = await api.post(`/progress/lesson/${lessonId}/complete/`);
    return response.data;
  },

  async getAllLessonProgress() {
    const response = await api.get('/progress/lessons/');
    return response.data;
  },

  // Exam Progress
  async getExamProgress(examId: number) {
    const response = await api.get(`/progress/exam/${examId}/`);
    return response.data;
  },

  async updateExamProgress(examId: number, data: Partial<ExamProgress>) {
    const response = await api.put(`/progress/exam/${examId}/`, data);
    return response.data;
  },

  async getAllExamProgress() {
    const response = await api.get('/progress/exams/');
    return response.data;
  },

  // Learning Journey Analytics
  async getLearningJourneyStats() {
    const response = await api.get('/progress/learning-journey/stats/');
    return response.data;
  },

  async getRecentActivity() {
    const response = await api.get('/progress/learning-journey/recent-activity/');
    return response.data;
  },

  async getLearningPath(courseId: number) {
    const response = await api.get(`/progress/learning-journey/path/${courseId}/`);
    return response.data;
  }
};

export default progressService; 