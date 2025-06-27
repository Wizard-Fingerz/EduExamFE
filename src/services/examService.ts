import api from './api';

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: any;
  students: any; 
  modules: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  passing_score: number;
  price: number;
  // add other relevant fields if needed
}


export interface Exam {
  passing_score: ReactNode;
  subject: any;
  id: number;
  title: string;
  description: string;
  course: any;
  duration: number;
  total_marks: number;
  passing_marks: number;
  start_time: string;
  end_time: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  exam: number;
  text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  points: number;
}

export interface ExamAttempt {
  id: number;
  exam: number;
  student: number;
  start_time: string;
  end_time?: string;
  score?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface Answer {
  question: number;
  answer: string;
}

const examService = {
  async getExams() {
    const response = await api.get('/exams/');
    return response.data;
  },

  async getExam(id: number) {
    const response = await api.get(`/exams/${id}/`);
    return response.data;
  },

  async createExam(data: Partial<Exam>) {
    const response = await api.post('/exams/create/', data);
    return response.data;
  },

  async updateExam(id: number, data: Partial<Exam>) {
    const response = await api.patch(`/exams/${id}/update/`, data);
    return response.data;
  },

  async deleteExam(id: number) {
    await api.delete(`/exams/${id}/delete/`);
  },

  async getQuestions(examId: number) {
    const response = await api.get(`/exams/${examId}/questions/`);
    return response.data;
  },

  async getQuestion(id: number) {
    const response = await api.get(`/exams/questions/${id}/`);
    return response.data;
  },

  async startExam(examId: number) {
    const response = await api.post(`/exams/${examId}/attempt/`);
    return response.data;
  },

  async submitExam(attemptId: number, answers: Answer[]) {
    const response = await api.post(`/exams/attempts/${attemptId}/submit/`, {
      answers,
    });
    return response.data;
  },

  async getAttempt(attemptId: number) {
    const response = await api.get(`/exams/attempts/${attemptId}/`);
    return response.data;
  },

  async fetchAllExamTypes() {
    const response = await api.get('/users/examination-types/');
    return response.data;
  },
};

export default examService; 