import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { DataTable } from './common/DataTable';
import staffService, { StaffCourse } from '../../services/staffService';

export const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<StaffCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching courses...');
      const response = await staffService.getStaffCourses();
      console.log('Received response:', response);
      
      // Check if response has results property (pagination) or is direct array
      const coursesData = response.results || response;
      console.log('Processed courses data:', coursesData);
      
      if (Array.isArray(coursesData)) {
        console.log('Setting courses:', coursesData);
        setCourses(coursesData);
      } else {
        console.error('Invalid courses data format:', coursesData);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'title', label: 'Title', minWidth: 200 },
    { id: 'description', label: 'Description', minWidth: 200 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'level', label: 'Level', minWidth: 120 },
    { id: 'duration', label: 'Duration (hrs)', minWidth: 100, align: 'right' as const },
    { id: 'price', label: 'Price', minWidth: 100, align: 'right' as const },
    { id: 'enrollment_count', label: 'Enrollments', minWidth: 100, align: 'right' as const },
    { id: 'average_rating', label: 'Rating', minWidth: 50, align: 'right' as const },
    { id: 'is_published', label: 'Status', minWidth: 50 },
  ];

  const formFields = [
    { id: 'title', label: 'Course Title' },
    { id: 'description', label: 'Description', multiline: true },
    { 
      id: 'category', 
      label: 'Category', 
      type: 'select',
      options: [
        { value: 'mathematics', label: 'Mathematics' },
        { value: 'science', label: 'Science' },
        { value: 'language', label: 'Language' },
        { value: 'programming', label: 'Programming' }
      ]
    },
    { 
      id: 'level', 
      label: 'Level', 
      type: 'select',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
      ]
    },
    { id: 'duration', label: 'Duration (hours)', type: 'number' },
    { id: 'price', label: 'Price', type: 'number' },
    { id: 'passing_score', label: 'Passing Score', type: 'number' },
    { id: 'is_published', label: 'Published', type: 'checkbox' },
  ];

  const handleAdd = async (newCourse: Partial<StaffCourse>) => {
    try {
      setError(null);
      const createdCourse = await staffService.createCourse(newCourse);
      if (createdCourse) {
        setCourses(prevCourses => [...prevCourses, createdCourse]);
      } else {
        throw new Error('No course data received from server');
      }
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Failed to create course. Please try again.');
    }
  };

  const handleEdit = async (editedCourse: StaffCourse) => {
    try {
      setError(null);
      const updatedCourse = await staffService.updateCourse(editedCourse.id, editedCourse);
      if (updatedCourse) {
        setCourses(courses.map((course) => 
          course.id === editedCourse.id ? updatedCourse : course
        ));
      } else {
        throw new Error('No course data received from server');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course. Please try again.');
    }
  };

  const handleDelete = async (courseToDelete: StaffCourse) => {
    try {
      setError(null);
      await staffService.deleteCourse(courseToDelete.id);
      setCourses(courses.filter((course) => course.id !== courseToDelete.id));
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Course Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={courses}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={formFields}
      />
    </Box>
  );
}; 