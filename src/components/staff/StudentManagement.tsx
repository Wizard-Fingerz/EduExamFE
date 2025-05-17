import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataTable } from './common/DataTable';

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
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      studentId: 'STU001',
      enrollmentDate: '2024-01-15',
      program: 'Computer Science',
      status: 'Active',
      gpa: 3.8,
    },
    // Add more sample data as needed
  ]);

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

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Student Management
      </Typography>

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