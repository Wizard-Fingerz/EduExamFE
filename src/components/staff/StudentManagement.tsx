import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { DataTable } from './common/DataTable';
import staffService from '../../services/staffService';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  enrollmentDate: string;
  program: string;
  status: string;
  gpa: number;
}

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'studentId', label: 'Student ID', minWidth: 100 },
    { id: 'program', label: 'Program', minWidth: 150 },
    {
      id: 'gpa',
      label: 'GPA',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number) => value.toFixed(2),
    },
    { id: 'enrollmentDate', label: 'Enrollment Date', minWidth: 130 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  const formFields = [
    { id: 'name', label: 'Full Name' },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'studentId', label: 'Student ID' },
    { id: 'program', label: 'Program' },
    { id: 'gpa', label: 'GPA', type: 'number' },
    { id: 'enrollmentDate', label: 'Enrollment Date', type: 'date' },
    { id: 'status', label: 'Status' },
  ];

  const handleAdd = (newStudent: Omit<Student, 'id'>) => {
    const student: Student = {
      ...newStudent,
      id: Date.now().toString(), // Generate a unique ID
    };
    setStudents([...students, student]);
  };

  const handleEdit = (editedStudent: Student) => {
    setStudents(students.map((student) => 
      student.id === editedStudent.id ? editedStudent : student
    ));
  };

  const handleDelete = (studentToDelete: Student) => {
    setStudents(students.filter((student) => student.id !== studentToDelete.id));
  };

  useEffect(() => {
    // Fetch students from the backend
    staffService.getStudents()
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Student Management
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <DataTable
          columns={columns}
          data={students}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addFormFields={formFields}
        />
      )}
    </Box>
  );
}; 