import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataTable } from './common/DataTable';
import staffService, { StaffExam, StaffCourse } from '../../services/staffService';

export const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<StaffExam[]>([]);
  const [courses, setCourses] = useState<StaffCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        // Ensure each exam has a questions property (even if empty)
        const processedExams = examsData.map(exam => ({
          ...exam,
          questions: exam.questions || []
        }));
        setExams(processedExams);
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
    {
      id: 'questions',
      label: 'Questions',
      minWidth: 120,
      align: 'center' as const,
      format: (_value: any, row: any) => {
        const questionCount = row.questions?.length || 0;
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleManageQuestions(row)}
            sx={{ minWidth: 100 }}
          >
            Manage ({questionCount})
          </Button>
        );
      }
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

  const handleManageQuestions = async (exam: StaffExam) => {
    try {
      // Fetch the latest exam data with questions if not already available
      if (!exam.questions || exam.questions.length === 0) {
        const examQuestions = await staffService.getExamQuestions(exam.id);
        const updatedExam = { ...exam, questions: examQuestions };
        // Update the exam in the local state
        setExams(exams.map(e => e.id === exam.id ? updatedExam : e));
      }
      navigate(`/staff/exams/${exam.id}/questions`);
    } catch (error) {
      console.error('Error fetching exam questions:', error);
      // Still navigate even if questions fetch fails
      navigate(`/staff/exams/${exam.id}/questions`);
    }
  };

  const refreshExamQuestions = async () => {
    try {
      setLoading(true);
      const updatedExams = await Promise.all(
        exams.map(async (exam) => {
          try {
            const questions = await staffService.getExamQuestions(exam.id);
            return { ...exam, questions };
          } catch (error) {
            console.error(`Error fetching questions for exam ${exam.id}:`, error);
            return { ...exam, questions: [] };
          }
        })
      );
      setExams(updatedExams);
    } catch (error) {
      console.error('Error refreshing exam questions:', error);
      setError('Failed to refresh exam questions. Please try again.');
    } finally {
      setLoading(false);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Exam Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshExamQuestions}
          disabled={loading}
        >
          Refresh Questions
        </Button>
      </Box>

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