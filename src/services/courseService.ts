import api from './api';

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
  students?: any[];
}

export interface Module {
  id: number;
  title: string;
  description: string;
  course: number;
  order: number;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  module: number;
  order: number;
  duration: number;
}

const courseService = {
  async getCourses(params?: { search?: string; category?: string }) {
    const response = await api.get('/courses/', { params });
    return response.data;
  },

  async getCourse(id: number) {
    const response = await api.get(`/courses/${id}/`);
    return response.data;
  },

  async createCourse(data: Partial<Course>) {
    const response = await api.post('/courses/create/', data);
    return response.data;
  },

  async updateCourse(id: number, data: Partial<Course>) {
    const response = await api.patch(`/courses/${id}/update/`, data);
    return response.data;
  },

  async deleteCourse(id: number) {
    await api.delete(`/courses/${id}/delete/`);
  },

  async enrollInCourse(id: number) {
    const response = await api.post(`/courses/${id}/enroll/`);
    return response.data;
  },

  async unenrollFromCourse(id: number) {
    const response = await api.delete(`/courses/${id}/enroll/`);
    return response.data;
  },

  async getModules(courseId: number) {
    const response = await api.get(`/courses/${courseId}/modules/`);
    return response.data;
  },

  async getModule(id: number) {
    const response = await api.get(`/courses/modules/${id}/`);
    return response.data;
  },

  async getLessons(moduleId: number) {
    const response = await api.get(`/courses/modules/${moduleId}/lessons/`);
    return response.data;
  },

  async getLesson(id: number) {
    const response = await api.get(`/courses/lessons/${id}/`);
    return response.data;
  },
};

export default courseService; 