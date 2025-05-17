import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataTable } from './common/DataTable';

interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  totalPoints: number;
  status: 'Draft' | 'Published' | 'Closed';
  submissionCount: number;
  averageScore: number;
}

export const AssignmentManagement: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Programming Basics Assignment',
      courseId: 'CS101',
      courseName: 'Introduction to Computer Science',
      dueDate: '2024-03-20',
      totalPoints: 100,
      status: 'Published',
      submissionCount: 45,
      averageScore: 85.5,
    },
    {
      id: '2',
      title: 'Data Structures Project',
      courseId: 'CS201',
      courseName: 'Data Structures and Algorithms',
      dueDate: '2024-04-01',
      totalPoints: 150,
      status: 'Draft',
      submissionCount: 0,
      averageScore: 0,
    },
  ]);

  const columns = [
    { id: 'title', label: 'Assignment Title', minWidth: 200 },
    { id: 'courseName', label: 'Course', minWidth: 200 },
    { id: 'dueDate', label: 'Due Date', minWidth: 120 },
    {
      id: 'totalPoints',
      label: 'Points',
      minWidth: 100,
      align: 'right' as const,
    },
    { id: 'status', label: 'Status', minWidth: 100 },
    {
      id: 'submissionCount',
      label: 'Submissions',
      minWidth: 100,
      align: 'right' as const,
    },
    {
      id: 'averageScore',
      label: 'Avg. Score',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number) => value.toFixed(1),
    },
  ];

  const formFields = [
    { id: 'title', label: 'Assignment Title' },
    { id: 'courseId', label: 'Course ID' },
    { id: 'courseName', label: 'Course Name' },
    { id: 'dueDate', label: 'Due Date', type: 'date' },
    { id: 'totalPoints', label: 'Total Points', type: 'number' },
    { id: 'status', label: 'Status' },
  ];

  const handleAdd = (newAssignment: Omit<Assignment, 'id' | 'submissionCount' | 'averageScore'>) => {
    const assignment: Assignment = {
      ...newAssignment,
      id: Date.now().toString(),
      submissionCount: 0,
      averageScore: 0,
    };
    setAssignments([...assignments, assignment]);
  };

  const handleEdit = (editedAssignment: Assignment) => {
    setAssignments(assignments.map((assignment) => 
      assignment.id === editedAssignment.id ? editedAssignment : assignment
    ));
  };

  const handleDelete = (assignmentToDelete: Assignment) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== assignmentToDelete.id));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Assignment Management
      </Typography>

      <DataTable
        columns={columns}
        data={assignments}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={formFields}
      />
    </Box>
  );
}; 