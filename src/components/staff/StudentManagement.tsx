import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { DataTable } from './common/DataTable';
import staffService from '../../services/staffService';

interface Student {
  id: number;
  name: string;
  email: string;
  studentId: string;
  enrollmentDate: string;
  program: string;
  status: string;
  gpa: number;
  totalCourses?: number;
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
      minWidth: 50,
      align: 'right' as const,
      format: (value: number) => value.toFixed(2),
    },
    { id: 'enrollmentDate', label: 'Enrollment Date', minWidth: 130, format: (value: string) => new Date(value).toLocaleDateString() },
    { id: 'status', label: 'Status', minWidth: 100 },
    {
      id: 'totalCourses',
      label: 'Courses',
      minWidth: 50,
      align: 'right' as const,
      format: (value: number) => value || 0,
    },
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getStudents();
      
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setStudents(data);
      } else if (data && data.results && Array.isArray(data.results)) {
        setStudents(data.results);
      } else {
        console.warn('Unexpected students data format:', data);
        setStudents([]);
      }
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newStudent: Omit<Student, 'id'>) => {
    try {
      setError(null);
      // For now, we'll just add to local state since we don't have a create student API
      const student: Student = {
        ...newStudent,
        id: Date.now(), // Generate a unique ID
      };
      setStudents([...students, student]);
    } catch (err: any) {
      console.error('Error adding student:', err);
      setError('Failed to add student. Please try again.');
    }
  };

  const handleEdit = async (editedStudent: Student) => {
    try {
      setError(null);
      // For now, we'll just update local state since we don't have an update student API
      setStudents(students.map((student) => 
        student.id === editedStudent.id ? editedStudent : student
      ));
    } catch (err: any) {
      console.error('Error updating student:', err);
      setError('Failed to update student. Please try again.');
    }
  };

  const handleDelete = async (studentToDelete: Student) => {
    try {
      setError(null);
      // For now, we'll just remove from local state since we don't have a delete student API
      setStudents(students.filter((student) => student.id !== studentToDelete.id));
    } catch (err: any) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student. Please try again.');
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
        Student Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={students}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={formFields}
      />
    </Box>
  );
}; 