import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { DataTable } from './common/DataTable';
import staffService, { StaffExam, StaffCourse } from '../../services/staffService';

export const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<StaffExam[]>([]);
  const [courses, setCourses] = useState<StaffCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching exam management data...');
      
      const [examsResponse, coursesResponse] = await Promise.all([
        staffService.getStaffExams(),
        staffService.getStaffCourses()
      ]);
      
      console.log('Exams response:', examsResponse);
      console.log('Courses response:', coursesResponse);
      
      // Handle exams data
      const examsData = examsResponse.results || examsResponse;
      if (Array.isArray(examsData)) {
        setExams(examsData);
      } else {
        console.error('Invalid exams data format:', examsData);
        setExams([]);
      }
      
      // Handle courses data
      const coursesData = Array.isArray(coursesResponse) ? coursesResponse : (coursesResponse as any)?.results;
      if (Array.isArray(coursesData)) {
        console.log('Setting courses:', coursesData);
        setCourses(coursesData);
      } else {
        console.error('Invalid courses data format:', coursesData);
        setCourses([]);
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { 
      id: 'course', 
      label: 'Course', 
      minWidth: 130,
      format: (value: any) => value?.title || 'N/A'
    },
    {
      id: 'duration',
      label: 'Duration (mins)',
      minWidth: 100,
      align: 'right' as const,
    },
    {
      id: 'total_marks',
      label: 'Total Marks',
      minWidth: 100,
      align: 'right' as const,
    },
    { id: 'start_time', label: 'Start Time', minWidth: 130 },
    { 
      id: 'is_published', 
      label: 'Status', 
      minWidth: 100,
      format: (value: boolean) => value ? 'Published' : 'Draft'
    },
  ];

  const formFields = [
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description', type: 'multiline' },
    { 
      id: 'course', 
      label: 'Course', 
      type: 'select',
      options: courses.map(course => ({
        value: course.id,
        label: course.title
      }))
    },
    { id: 'duration', label: 'Duration (minutes)', type: 'number' },
    { id: 'total_marks', label: 'Total Marks', type: 'number' },
    { id: 'passing_marks', label: 'Passing Marks', type: 'number' },
    { id: 'start_time', label: 'Start Time', type: 'datetime-local' },
    { id: 'end_time', label: 'End Time', type: 'datetime-local' },
    { id: 'is_published', label: 'Published', type: 'checkbox' },
  ];

  console.log('Form fields with courses:', formFields);
  console.log('Available courses:', courses);

  const handleAdd = async (newExam: Partial<StaffExam>) => {
    try {
      console.log('handleAdd called with data:', newExam);
      
      const examData = {
        ...newExam,
        is_published: Boolean(newExam.is_published)
      };
      
      console.log('Processed exam data being sent to backend:', examData);
      
      const createdExam = await staffService.createExam(examData);
      console.log('Created exam response:', createdExam);
      
      setExams([...exams, createdExam]);
    } catch (err) {
      console.error('Error creating exam:', err);
      setError('Failed to create exam. Please try again.');
    }
  };

  const handleEdit = async (editedExam: StaffExam) => {
    try {
      const examData = {
        ...editedExam,
        is_published: Boolean(editedExam.is_published)
      };
      const updatedExam = await staffService.updateExam(editedExam.id, examData);
      setExams(exams.map((exam) => 
        exam.id === editedExam.id ? updatedExam : exam
      ));
    } catch (err) {
      console.error('Error updating exam:', err);
      setError('Failed to update exam. Please try again.');
    }
  };

  const handleDelete = async (examToDelete: StaffExam) => {
    try {
      await staffService.deleteExam(examToDelete.id);
      setExams(exams.filter((exam) => exam.id !== examToDelete.id));
    } catch (err) {
      console.error('Error deleting exam:', err);
      setError('Failed to delete exam. Please try again.');
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
        Exam Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={exams}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={formFields.map(field => ({
          ...field,
          multiline: field.type === 'multiline'
        }))}
      />
    </Box>
  );
}; 