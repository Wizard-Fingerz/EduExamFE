import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { DataTable } from './common/DataTable';
import staffService from '../../services/staffService';

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
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      // Note: You'll need to add this method to staffService
      const data = await staffService.getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAdd = async (newAssignment: Omit<Assignment, 'id' | 'submissionCount' | 'averageScore'>) => {
    try {
      // Note: You'll need to add this method to staffService
      const createdAssignment = await staffService.createAssignment(newAssignment);
      setAssignments([...assignments, createdAssignment]);
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError('Failed to create assignment. Please try again.');
    }
  };

  const handleEdit = async (editedAssignment: Assignment) => {
    try {
      // Note: You'll need to add this method to staffService
      const updatedAssignment = await staffService.updateAssignment(editedAssignment.id, editedAssignment);
      setAssignments(assignments.map((assignment) => 
        assignment.id === editedAssignment.id ? updatedAssignment : assignment
      ));
    } catch (err) {
      console.error('Error updating assignment:', err);
      setError('Failed to update assignment. Please try again.');
    }
  };

  const handleDelete = async (assignmentToDelete: Assignment) => {
    try {
      // Note: You'll need to add this method to staffService
      await staffService.deleteAssignment(assignmentToDelete.id);
      setAssignments(assignments.filter((assignment) => assignment.id !== assignmentToDelete.id));
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setError('Failed to delete assignment. Please try again.');
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
        Assignment Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

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