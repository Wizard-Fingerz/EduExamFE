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
  total_courses: number;
  total_exams: number;
  active_exams: number;
  recent_enrollments: number;
  average_course_rating: number;
  total_revenue: number;
}

export interface StaffCourse {
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

export interface StaffExam {
  id: number;
  title: string;
  description: string;
  course: StaffCourse;
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

export interface StaffAssignment {
  id: number;
  title: string;
  description: string;
  course: StaffCourse;
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

  // Courses Management
  async getStaffCourses() {
    try {
      console.log('Fetching staff courses...');
      const response = await api.get('/courses/staff/');
      console.log('Staff courses response:', response);
      
      if (!response.data) {
        console.error('No data received from server');
        throw new Error('No data received from server');
      }
      
      // Handle both array and paginated responses
      const coursesData = response.data.results || response.data;
      console.log('Processed courses data:', coursesData);
      
      if (!Array.isArray(coursesData)) {
        console.error('Invalid courses data format:', coursesData);
        throw new Error('Invalid data format received from server');
      }
      
      return coursesData;
    } catch (error: any) {
      console.error('Error fetching staff courses:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to fetch courses');
      }
      throw error;
    }
  },

  async createCourse(data: Partial<StaffCourse>) {
    try {
      // Ensure required fields are present
      if (!data.title || !data.description || !data.category || !data.level || !data.duration) {
        throw new Error('Missing required fields: title, description, category, level, and duration are required');
      }

      const response = await api.post('/courses/staff/create/', data);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  async updateCourse(courseId: number, data: Partial<StaffCourse>) {
    try {
      const response = await api.patch(`/courses/staff/${courseId}/update/`, data);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  async deleteCourse(courseId: number) {
    try {
      await api.delete(`/courses/staff/${courseId}/delete/`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  async getCourseAnalytics(courseId: number) {
    const response = await api.get(`/courses/staff/${courseId}/analytics/`);
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
      
      if (!data.course) {
        throw new Error('Course ID is required to create an exam');
      }
      
      const response = await api.post(`/exams/staff/courses/${data.course}/exams/create/`, data);
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

  async getEnrolledStudents(courseId: number) {
    const response = await api.get(`/courses/${courseId}/students/`);
    return response.data;
  },

  async getStudentProgress(studentId: number, courseId: number) {
    const response = await api.get(`/progress/students/${studentId}/courses/${courseId}/`);
    return response.data;
  },

  async getStudentExamResults(studentId: number, examId: number) {
    const response = await api.get(`/exams/${examId}/students/${studentId}/results/`);
    return response.data;
  },

  // Reports
  async generateCourseReport(courseId: number, startDate: string, endDate: string) {
    const response = await api.get(`/courses/${courseId}/reports/`, {
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

  // Assignment Management
  async getAssignments() {
    try {
      const response = await api.get('/courses/staff/assignments/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to fetch assignments');
      }
      throw error;
    }
  },

  async getStaffAssignment(assignmentId: number) {
    try {
      const response = await api.get(`/courses/staff/assignments/${assignmentId}/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  },

  async createAssignment(data: Partial<StaffAssignment>) {
    try {
      console.log('Creating assignment with data:', data);
      
      if (!data.course) {
        throw new Error('Course ID is required to create an assignment');
      }
      
      const response = await api.post(`/courses/staff/courses/${data.course}/assignments/create/`, data);
      console.log('Assignment creation response:', response);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to create assignment');
      }
      throw error;
    }
  },

  async updateAssignment(assignmentId: string, data: Partial<StaffAssignment>) {
    try {
      const response = await api.patch(`/courses/staff/assignments/${assignmentId}/update/`, data);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to update assignment');
      }
      throw error;
    }
  },

  async deleteAssignment(assignmentId: string) {
    try {
      await api.delete(`/courses/staff/assignments/${assignmentId}/delete/`);
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to delete assignment');
      }
      throw error;
    }
  },

  // Assignment Questions Management
  async getAssignmentQuestions(assignmentId: number) {
    try {
      const response = await api.get(`/courses/staff/assignments/${assignmentId}/questions/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching assignment questions:', error);
      return [];
    }
  },

  async createAssignmentQuestion(assignmentId: number, questionData: any) {
    try {
      const response = await api.post(`/courses/staff/assignments/${assignmentId}/questions/`, questionData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating assignment question:', error);
      throw error;
    }
  },

  async updateAssignmentQuestion(_assignmentId: number, questionId: number, questionData: any) {
    try {
      const response = await api.patch(`/courses/staff/assignment-questions/${questionId}/`, questionData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating assignment question:', error);
      throw error;
    }
  },

  async deleteAssignmentQuestion(_assignmentId: number, questionId: number) {
    try {
      await api.delete(`/courses/staff/assignment-questions/${questionId}/`);
    } catch (error: any) {
      console.error('Error deleting assignment question:', error);
      throw error;
    }
  },

  async getAssignmentSubmissions(assignmentId: string) {
    const response = await api.get(`/courses/assignments/${assignmentId}/submissions/`);
    return response.data;
  },

  async gradeSubmission(assignmentId: string, submissionId: string, grade: number, feedback: string) {
    const response = await api.post(`/courses/assignments/${assignmentId}/submissions/${submissionId}/grade/`, {
      grade,
      feedback
    });
    return response.data;
  }
};

export default staffService; 