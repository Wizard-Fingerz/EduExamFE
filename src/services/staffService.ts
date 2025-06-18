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
}

export interface StaffAssignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  totalPoints: number;
  status: 'Draft' | 'Published' | 'Closed';
  submissionCount: number;
  averageScore: number;
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
    const response = await api.patch(`/exams/staff/${examId}/update/`, data);
    return response.data;
  },

  async deleteExam(examId: number) {
    await api.delete(`/exams/staff/${examId}/delete/`);
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
    const response = await api.get('/courses/assignments/');
    return response.data;
  },

  async createAssignment(data: Partial<StaffAssignment>) {
    const response = await api.post('/courses/assignments/create/', data);
    return response.data;
  },

  async updateAssignment(assignmentId: string, data: Partial<StaffAssignment>) {
    const response = await api.patch(`/courses/assignments/${assignmentId}/update/`, data);
    return response.data;
  },

  async deleteAssignment(assignmentId: string) {
    await api.delete(`/courses/assignments/${assignmentId}/delete/`);
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