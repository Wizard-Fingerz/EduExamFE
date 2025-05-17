import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataTable } from './common/DataTable';

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalMarks: number;
  startDate: string;
  status: string;
}

export const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Midterm Examination',
      subject: 'Mathematics',
      duration: 120,
      totalMarks: 100,
      startDate: '2024-03-15',
      status: 'Scheduled',
    },
    // Add more sample data as needed
  ]);

  const columns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'subject', label: 'Subject', minWidth: 130 },
    {
      id: 'duration',
      label: 'Duration (mins)',
      minWidth: 100,
      align: 'right' as const,
    },
    {
      id: 'totalMarks',
      label: 'Total Marks',
      minWidth: 100,
      align: 'right' as const,
    },
    { id: 'startDate', label: 'Start Date', minWidth: 130 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  const formFields = [
    { id: 'title', label: 'Title' },
    { id: 'subject', label: 'Subject' },
    { id: 'duration', label: 'Duration (minutes)', type: 'number' },
    { id: 'totalMarks', label: 'Total Marks', type: 'number' },
    { id: 'startDate', label: 'Start Date', type: 'date' },
    { id: 'status', label: 'Status' },
  ];

  const handleAdd = (newExam: Omit<Exam, 'id'>) => {
    const exam: Exam = {
      ...newExam,
      id: Date.now().toString(), // Generate a unique ID
    };
    setExams([...exams, exam]);
  };

  const handleEdit = (editedExam: Exam) => {
    setExams(exams.map((exam) => 
      exam.id === editedExam.id ? editedExam : exam
    ));
  };

  const handleDelete = (examToDelete: Exam) => {
    setExams(exams.filter((exam) => exam.id !== examToDelete.id));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Exam Management
      </Typography>

      <DataTable
        columns={columns}
        data={exams}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={formFields}
      />
    </Box>
  );
}; 