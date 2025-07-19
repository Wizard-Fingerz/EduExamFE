import api from './api';

export interface Staff {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'staff';
  profile_picture: string | null;
  bio: string | null;
  date_of_birth: string | null;
  phone_number: string | null;
  address: string | null;
  department: string;
  position: string;
  hire_date: string;
  is_active: boolean;
}

export interface StaffDashboardStats {
  total_students: number;
  total_syllabus: number;
  total_exams: number;
  active_exams: number;
  recent_enrollments: number;
  average_syllabus_rating: number;
  total_revenue: number;
}

export interface StaffSyllabus {
  id: number;
  title: string;
  description: string;
  instructor: Staff;
  students: any[];
  modules: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  passing_score: number;
  price: number;
  enrollment_count: number;
  average_rating: number;
  category: string;
  level: string;
  duration: number;
}

export interface StaffSubject {
  id: number;
  name: string;
}

export interface StaffExam {
  id: number;
  title: string;
  description: string;
  subject: StaffSubject;
  duration: number;
  total_marks: number;
  passing_marks: number;
  start_time: string;
  end_time: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  total_attempts: number;
  average_score: number;
  questions?: any[];
}

export interface StaffQuiz {
  id: number;
  title: string;
  description: string;
  syllabus: StaffSyllabus;
  due_date: string;
  total_points: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  submission_count: number;
  average_score: number;
  questions?: any[];
}

const staffService = {
  // Staff Profile
  async getStaffProfile() {
    const response = await api.get('/users/staff/profile/');
    return response.data;
  },

  async updateStaffProfile(data: Partial<Staff>) {
    const response = await api.patch('/users/staff/profile/update/', data);
    return response.data;
  },

  // Dashboard Stats
  async getDashboardStats() {
    const response = await api.get('/users/staff/dashboard/stats/');
    return response.data;
  },

  // Syllabus Management
  async getStaffSyllabus() {
    try {
      console.log('Fetching staff syllabus...');
      const response = await api.get('/syllabus/staff/');
      console.log('Staff syllabus response:', response);
      
      if (!response.data) {
        console.error('No data received from server');
        throw new Error('No data received from server');
      }
      
      // Handle both array and paginated responses
      const syllabusData = response.data.results || response.data;
      console.log('Processed syllabus data:', syllabusData);
      
      if (!Array.isArray(syllabusData)) {
        console.error('Invalid syllabus data format:', syllabusData);
        throw new Error('Invalid data format received from server');
      }
      
      return syllabusData;
    } catch (error: any) {
      console.error('Error fetching staff syllabus:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to fetch syllabus');
      }
      throw error;
    }
  },

  async getStaffSubjects() {
    try {
      console.log('Fetching staff subject...');
      const response = await api.get('/syllabus/subjects/');
      console.log('Staff subject response:', response);
      
      if (!response.data) {
        console.error('No data received from server');
        throw new Error('No data received from server');
      }
      
      // Handle both array and paginated responses
      const subjectsData = response.data.results || response.data;
      console.log('Processed syllabus data:', subjectsData);
      
      if (!Array.isArray(subjectsData)) {
        console.error('Invalid syllabus data format:', subjectsData);
        throw new Error('Invalid data format received from server');
      }
      
      return subjectsData;
    } catch (error: any) {
      console.error('Error fetching staff syllabus:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to fetch syllabus');
      }
      throw error;
    }
  },


  async createSyllabus(data: Partial<StaffSyllabus>) {
    try {
      // Ensure required fields are present
      if (!data.title || !data.description || !data.category || !data.level || !data.duration) {
        throw new Error('Missing required fields: title, description, category, level, and duration are required');
      }

      const response = await api.post('/syllabus/staff/create/', data);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating syllabus:', error);
      throw error;
    }
  },

  async updateSyllabus(syllabusId: number, data: Partial<StaffSyllabus>) {
    try {
      const response = await api.patch(`/syllabus/staff/${syllabusId}/update/`, data);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating syllabus:', error);
      throw error;
    }
  },

  async deleteSyllabus(syllabusId: number) {
    try {
      await api.delete(`/syllabus/staff/${syllabusId}/delete/`);
    } catch (error) {
      console.error('Error deleting syllabus:', error);
      throw error;
    }
  },

  async getSyllabusAnalytics(syllabusId: number) {
    const response = await api.get(`/syllabus/staff/${syllabusId}/analytics/`);
    return response.data;
  },

  // Exams Management
  async getStaffExams() {
    const response = await api.get('/exams/staff/');
    return response.data;
  },

  async getStaffExam(examId: number) {
    const response = await api.get(`/exams/staff/${examId}/`);
    return response.data;
  },

  async createExam(data: Partial<StaffExam>) {
    try {
      console.log('Creating exam with data:', data);
      
      if (!data.subject) {
        throw new Error('Subject ID is required to create an exam');
      }
      
      const response = await api.post('/exams/create/', data);
      console.log('Exam creation response:', response);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating exam:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to create exam');
      }
      throw error;
    }
  },

  async updateExam(examId: number, data: Partial<StaffExam>) {
    try {
      const response = await api.patch(`/exams/staff/${examId}/update/`, data);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error updating exam:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to update exam');
      }
      throw error;
    }
  },

  async deleteExam(examId: number) {
    try {
      await api.delete(`/exams/staff/${examId}/delete/`);
    } catch (error: any) {
      console.error('Error deleting exam:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to delete exam');
      }
      throw error;
    }
  },

  // Exam Questions Management
  async getExamQuestions(examId: number) {
    try {
      const response = await api.get(`/exams/staff/${examId}/questions/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching exam questions:', error);
      return [];
    }
  },

  async createExamQuestion(examId: number, questionData: any) {
    try {
      const response = await api.post(`/exams/staff/${examId}/questions/`, questionData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating exam question:', error);
      throw error;
    }
  },

  async updateExamQuestion(_examId: number, questionId: number, questionData: any) {
    try {
      const response = await api.patch(`/exams/staff/questions/${questionId}/`, questionData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating exam question:', error);
      throw error;
    }
  },

  async deleteExamQuestion(_examId: number, questionId: number) {
    try {
      await api.delete(`/exams/staff/questions/${questionId}/`);
    } catch (error: any) {
      console.error('Error deleting exam question:', error);
      throw error;
    }
  },

  async getExamAnalytics(examId: number) {
    const response = await api.get(`/exams/staff/${examId}/analytics/`);
    return response.data;
  },

  // Students Management
  async getStudents() {
    const response = await api.get('/users/students/');
    return response.data;
  },

  async getEnrolledStudents(syllabusId: number) {
    const response = await api.get(`/syllabus/${syllabusId}/students/`);
    return response.data;
  },

  async getStudentProgress(studentId: number, syllabusId: number) {
    const response = await api.get(`/progress/students/${studentId}/syllabus/${syllabusId}/`);
    return response.data;
  },

  async getStudentExamResults(studentId: number, examId: number) {
    const response = await api.get(`/exams/${examId}/students/${studentId}/results/`);
    return response.data;
  },

  // Reports
  async generateSyllabusReport(syllabusId: number, startDate: string, endDate: string) {
    const response = await api.get(`/syllabus/${syllabusId}/reports/`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  async generateExamReport(examId: number) {
    const response = await api.get(`/exams/${examId}/reports/`);
    return response.data;
  },

  async generateStudentReport(studentId: number) {
    const response = await api.get(`/progress/students/${studentId}/reports/`);
    return response.data;
  },

  // Quiz Management
  async getQuizs() {
    try {
      const response = await api.get('/syllabus/staff/quiz/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching quizs:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to fetch quizs');
      }
      throw error;
    }
  },

  async getStaffQuiz(quizId: number) {
    try {
      const response = await api.get(`/syllabus/staff/quiz/${quizId}/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },

  async createQuiz(data: Partial<StaffQuiz>) {
    try {
      console.log('Creating quiz with data:', data);
      
      if (!data.syllabus) {
        throw new Error('Syllabus ID is required to create an quiz');
      }
      
      const response = await api.post(`/syllabus/staff/syllabus/${data.syllabus}/quizs/create/`, data);
      console.log('Quiz creation response:', response);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to create quiz');
      }
      throw error;
    }
  },

  async updateQuiz(quizId: string, data: Partial<StaffQuiz>) {
    try {
      const response = await api.patch(`/syllabus/staff/quiz/${quizId}/update/`, data);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error updating quiz:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to update quiz');
      }
      throw error;
    }
  },

  async deleteQuiz(quizId: string) {
    try {
      await api.delete(`/syllabus/staff/quiz/${quizId}/delete/`);
    } catch (error: any) {
      console.error('Error deleting quiz:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to delete quiz');
      }
      throw error;
    }
  },

  // Quiz Questions Management
  async getQuizQuestions(quizId: number) {
    try {
      const response = await api.get(`/syllabus/staff/quiz/${quizId}/questions/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  },

  async createQuizQuestion(quizId: number, questionData: any) {
    try {
      const response = await api.post(`/syllabus/staff/quiz/${quizId}/questions/`, questionData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating quiz question:', error);
      throw error;
    }
  },

  async updateQuizQuestion(_quizId: number, questionId: number, questionData: any) {
    try {
      const response = await api.patch(`/syllabus/staff/quiz-questions/${questionId}/`, questionData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating quiz question:', error);
      throw error;
    }
  },

  async deleteQuizQuestion(_quizId: number, questionId: number) {
    try {
      await api.delete(`/syllabus/staff/quiz-questions/${questionId}/`);
    } catch (error: any) {
      console.error('Error deleting quiz question:', error);
      throw error;
    }
  },

  async getQuizSubmissions(quizId: string) {
    const response = await api.get(`/syllabus/quizs/${quizId}/submissions/`);
    return response.data;
  },

  async gradeSubmission(quizId: string, submissionId: string, grade: number, feedback: string) {
    const response = await api.post(`/syllabus/quizs/${quizId}/submissions/${submissionId}/grade/`, {
      grade,
      feedback
    });
    return response.data;
  }
};

export default staffService; 