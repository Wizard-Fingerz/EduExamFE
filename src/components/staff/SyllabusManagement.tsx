import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { DataTable } from './common/DataTable';
import staffService, { StaffSyllabus, StaffSubject } from '../../services/staffService';

export const SyllabusManagement: React.FC = () => {
  const [syllabus, setSyllabus] = useState<StaffSyllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<StaffSubject[]>([]);

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching syllabus...');

      const [subjectResponse, syllabusResponse] = await Promise.all([
        staffService.getStaffSubjects(),
        staffService.getStaffSyllabus()
      ]);

      // Handle exams data
      const examsData = subjectResponse;
      if (Array.isArray(examsData)) {
        // Ensure each exam has a questions property (even if empty)
        const processedExams = examsData.map(exam => ({
          ...exam,
          questions: exam.questions || []
        }));
        setSubjects(processedExams);
      } else {
        console.error('Invalid exams data format:', examsData);
        setSubjects([]);
      }
      
      // Handle syllabus data
      const syllabusData = Array.isArray(syllabusResponse) ? syllabusResponse : (syllabusResponse as any)?.results;
      if (Array.isArray(syllabusData)) {
        console.log('Setting syllabus:', syllabusData);
        setSyllabus(syllabusData);
      } else {
        console.error('Invalid syllabus data format:', syllabusData);
        setSyllabus([]);
      }

    } catch (err) {
      console.error('Error fetching syllabus:', err);
      setError('Failed to load syllabus. Please try again later.');
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
    { id: 'title', label: 'Syllabus Title' },
    { id: 'description', label: 'Description', multiline: true },
    { 
      id: 'category', 
      label: 'Category', 
      type: 'select',
      options: subjects.map(subject => ({
        value: subject.id,
        label: subject.name
      }))
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

  const handleAdd = async (newSyllabus: Partial<StaffSyllabus>) => {
    try {
      setError(null);
      const createdSyllabus = await staffService.createSyllabus(newSyllabus);
      if (createdSyllabus) {
        setSyllabus(prevSyllabus => [...prevSyllabus, createdSyllabus]);
      } else {
        throw new Error('No syllabus data received from server');
      }
    } catch (err) {
      console.error('Error creating syllabus:', err);
      setError('Failed to create syllabus. Please try again.');
    }
  };

  const handleEdit = async (editedSyllabus: StaffSyllabus) => {
    try {
      setError(null);
      const updatedSyllabus = await staffService.updateSyllabus(editedSyllabus.id, editedSyllabus);
      if (updatedSyllabus) {
        setSyllabus(syllabus.map((syllabus) => 
          syllabus.id === editedSyllabus.id ? updatedSyllabus : syllabus
        ));
      } else {
        throw new Error('No syllabus data received from server');
      }
    } catch (err) {
      console.error('Error updating syllabus:', err);
      setError('Failed to update syllabus. Please try again.');
    }
  };

  const handleDelete = async (syllabusToDelete: StaffSyllabus) => {
    try {
      setError(null);
      await staffService.deleteSyllabus(syllabusToDelete.id);
      setSyllabus(syllabus.filter((syllabus) => syllabus.id !== syllabusToDelete.id));
    } catch (err) {
      console.error('Error deleting syllabus:', err);
      setError('Failed to delete syllabus. Please try again.');
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
      <Typography variant="h4" sx={{ mb: 4 }}>
        Syllabus Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={syllabus}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={formFields}
      />
    </Box>
  );
}; 