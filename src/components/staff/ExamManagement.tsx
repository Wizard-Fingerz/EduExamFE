import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataTable } from './common/DataTable';
import staffService, { StaffExam, StaffSubject } from '../../services/staffService';
import examService from '../../services/examService';


export const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<StaffExam[]>([]);
  const [subjects, setSubjects] = useState<StaffSubject[]>([]);
  const [examTypes, setExamTypes] = useState<StaffSubject[]>([]);
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
      
      const [examsResponse, subjectsResponse, examTypeResponse] = await Promise.all([
        staffService.getStaffExams(),
        staffService.getStaffSubjects(),
        examService.fetchAllExamTypes()
      ]);
      
      console.log('Exams response:', examsResponse);
      console.log('Subjects response:', subjectsResponse);
      
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
      
      // Handle subjects data
      const subjectsData = Array.isArray(subjectsResponse) ? subjectsResponse : (subjectsResponse as any)?.results;
      if (Array.isArray(subjectsData)) {
        console.log('Setting subjects:', subjectsData);
        setSubjects(subjectsData);
      } else {
        console.error('Invalid subjects data format:', subjectsData);
        setSubjects([]);
      }




      
      // Handle subjects data
      const examTypesData = Array.isArray(examTypeResponse) ? examTypeResponse : (examTypeResponse as any)?.results;
      if (Array.isArray(examTypesData)) {
        console.log('Setting exam type:', examTypesData);
        setExamTypes(examTypesData);
      } else {
        console.error('Invalid subjects data format:', subjectsData);
        setExamTypes([]);
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
      id: 'subject', 
      label: 'Subject', 
      minWidth: 130,
      format: (value: any) => {
        if (typeof value === 'object' && value?.name) return value.name;
        if (typeof value === 'number') {
          const subj = subjects.find(s => s.id === value);
          return subj ? subj.name : 'N/A';
        }
        return 'N/A';
      }
    },
    {
      id: 'examination_type',
      label: 'Examination Type',
      minWidth: 100,
      align: 'right' as const,
      format: (value: any) => {
        if (typeof value === 'object' && value?.name) return value.name;
        if (typeof value === 'number') {
          const type = examTypes.find(t => t.id === value);
          return type ? type.name : value;
        }
        return value;
      }
    },
    {
      id: 'year',
      label: 'Year',
      minWidth: 100,
      align: 'right' as const,
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
      id: 'subject', 
      label: 'Subject', 
      type: 'select',
      options: subjects.map(subject => ({
        value: subject.id,
        label: subject.name
      }))
    },
    { 
      id: 'examination_type', 
      label: 'Exam Type', 
      type: 'select',
      options: examTypes.map(type => ({
        value: type.id,
        label: type.name
      }))
    },
    { id: 'year', label: 'Year', type: 'number' },
    { id: 'duration', label: 'Duration (minutes)', type: 'number' },
    { id: 'total_marks', label: 'Total Marks', type: 'number' },
    { id: 'passing_marks', label: 'Passing Marks', type: 'number' },
    { id: 'start_time', label: 'Start Time', type: 'datetime-local' },
    { id: 'end_time', label: 'End Time', type: 'datetime-local' },
    { id: 'is_published', label: 'Published', type: 'checkbox' },
  ];

  console.log('Form fields with subjects:', formFields);
  console.log('Available subjects:', subjects);

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
   
    <Box sx={{ py: 4,  px: 2 }}>
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