import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataTable } from './common/DataTable';
import staffService, { StaffQuiz, StaffSyllabus } from '../../services/staffService';

export const QuizManagement: React.FC = () => {
  const [quizs, setQuizs] = useState<StaffQuiz[]>([]);
  const [syllabus, setSyllabus] = useState<StaffSyllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizs();
  }, []);

  const fetchQuizs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [quizsData, syllabusData] = await Promise.all([
        staffService.getQuizs(),
        staffService.getStaffSyllabus()
      ]);
      
      // Ensure quizs is always an array
      if (Array.isArray(quizsData)) {
        setQuizs(quizsData);
      } else if (quizsData && quizsData.results && Array.isArray(quizsData.results)) {
        setQuizs(quizsData.results);
      } else {
        console.warn('Unexpected quizs data format:', quizsData);
        setQuizs([]);
      }
      
      setSyllabus(syllabusData);
    } catch (err) {
      console.error('Error fetching quizs:', err);
      setError('Failed to load quizs. Please try again later.');
      setQuizs([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'title', label: 'Quiz Title', minWidth: 200 },
    { id: 'syllabus', label: 'Syllabus', minWidth: 200, format: (value: any) => value?.title || 'N/A' },
    { id: 'due_date', label: 'Due Date', minWidth: 120, format: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    {
      id: 'total_points',
      label: 'Points',
      minWidth: 100,
      align: 'right' as const,
    },
    { id: 'is_published', label: 'Status', minWidth: 100, format: (value: boolean) => value ? 'Published' : 'Draft' },
    {
      id: 'submission_count',
      label: 'Submissions',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number) => value != null ? value : 0,
    },
    {
      id: 'average_score',
      label: 'Avg. Score',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number) => value != null ? value.toFixed(1) : 'N/A',
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
    { id: 'title', label: 'Quiz Title' },
    { 
      id: 'syllabus', 
      label: 'Syllabus', 
      type: 'select',
      options: syllabus.map(syllabus => ({ value: syllabus.id, label: syllabus.title }))
    },
    { id: 'description', label: 'Description', multiline: true },
    { id: 'due_date', label: 'Due Date', type: 'datetime-local' },
    { id: 'total_points', label: 'Total Points', type: 'number' },
    { id: 'is_published', label: 'Published', type: 'checkbox' },
  ];

  const handleAdd = async (newQuiz: Partial<StaffQuiz>) => {
    try {
      setError(null);
      const createdQuiz = await staffService.createQuiz(newQuiz);
      if (createdQuiz) {
        setQuizs(prevQuizs => [...prevQuizs, createdQuiz]);
      } else {
        throw new Error('No quiz data received from server');
      }
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError('Failed to create quiz. Please try again.');
    }
  };

  const handleEdit = async (editedQuiz: StaffQuiz) => {
    try {
      setError(null);
      const updatedQuiz = await staffService.updateQuiz(editedQuiz.id.toString(), editedQuiz);
      if (updatedQuiz) {
        setQuizs(quizs.map((quiz) => 
          quiz.id === editedQuiz.id ? updatedQuiz : quiz
        ));
      } else {
        throw new Error('No quiz data received from server');
      }
    } catch (err) {
      console.error('Error updating quiz:', err);
      setError('Failed to update quiz. Please try again.');
    }
  };

  const handleDelete = async (quizToDelete: StaffQuiz) => {
    try {
      setError(null);
      await staffService.deleteQuiz(quizToDelete.id.toString());
      setQuizs(quizs.filter((quiz) => quiz.id !== quizToDelete.id));
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz. Please try again.');
    }
  };

  const handleManageQuestions = async (quiz: StaffQuiz) => {
    try {
      // Fetch the latest quiz data with questions if not already available
      if (!quiz.questions || quiz.questions.length === 0) {
        const quizQuestions = await staffService.getQuizQuestions(quiz.id);
        const updatedQuiz = { ...quiz, questions: quizQuestions };
        // Update the quiz in the local state
        setQuizs(quizs.map(a => a.id === quiz.id ? updatedQuiz : a));
      }
      navigate(`/staff/quiz/${quiz.id}/questions`);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      // Still navigate even if questions fetch fails
      navigate(`/staff/quiz/${quiz.id}/questions`);
    }
  };

  const refreshQuizQuestions = async () => {
    try {
      setLoading(true);
      const updatedQuizs = await Promise.all(
        quizs.map(async (quiz) => {
          try {
            const questions = await staffService.getQuizQuestions(quiz.id);
            return { ...quiz, questions };
          } catch (error) {
            console.error(`Error fetching questions for quiz ${quiz.id}:`, error);
            return { ...quiz, questions: [] };
          }
        })
      );
      setQuizs(updatedQuizs);
    } catch (error) {
      console.error('Error refreshing quiz questions:', error);
      setError('Failed to refresh quiz questions. Please try again.');
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
    
    <Box sx={{ py: 4,  px: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Quiz Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshQuizQuestions}
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
        data={quizs}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={formFields}
      />
    </Box>
  );
}; 