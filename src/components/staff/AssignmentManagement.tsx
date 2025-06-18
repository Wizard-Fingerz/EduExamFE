import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataTable } from './common/DataTable';
import staffService, { StaffAssignment, StaffCourse } from '../../services/staffService';

export const AssignmentManagement: React.FC = () => {
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [courses, setCourses] = useState<StaffCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [assignmentsData, coursesData] = await Promise.all([
        staffService.getAssignments(),
        staffService.getStaffCourses()
      ]);
      
      // Ensure assignments is always an array
      if (Array.isArray(assignmentsData)) {
        setAssignments(assignmentsData);
      } else if (assignmentsData && assignmentsData.results && Array.isArray(assignmentsData.results)) {
        setAssignments(assignmentsData.results);
      } else {
        console.warn('Unexpected assignments data format:', assignmentsData);
        setAssignments([]);
      }
      
      setCourses(coursesData);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments. Please try again later.');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'title', label: 'Assignment Title', minWidth: 200 },
    { id: 'course', label: 'Course', minWidth: 200, format: (value: any) => value?.title || 'N/A' },
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
    { id: 'title', label: 'Assignment Title' },
    { 
      id: 'course', 
      label: 'Course', 
      type: 'select',
      options: courses.map(course => ({ value: course.id, label: course.title }))
    },
    { id: 'description', label: 'Description', multiline: true },
    { id: 'due_date', label: 'Due Date', type: 'datetime-local' },
    { id: 'total_points', label: 'Total Points', type: 'number' },
    { id: 'is_published', label: 'Published', type: 'checkbox' },
  ];

  const handleAdd = async (newAssignment: Partial<StaffAssignment>) => {
    try {
      setError(null);
      const createdAssignment = await staffService.createAssignment(newAssignment);
      if (createdAssignment) {
        setAssignments(prevAssignments => [...prevAssignments, createdAssignment]);
      } else {
        throw new Error('No assignment data received from server');
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError('Failed to create assignment. Please try again.');
    }
  };

  const handleEdit = async (editedAssignment: StaffAssignment) => {
    try {
      setError(null);
      const updatedAssignment = await staffService.updateAssignment(editedAssignment.id.toString(), editedAssignment);
      if (updatedAssignment) {
        setAssignments(assignments.map((assignment) => 
          assignment.id === editedAssignment.id ? updatedAssignment : assignment
        ));
      } else {
        throw new Error('No assignment data received from server');
      }
    } catch (err) {
      console.error('Error updating assignment:', err);
      setError('Failed to update assignment. Please try again.');
    }
  };

  const handleDelete = async (assignmentToDelete: StaffAssignment) => {
    try {
      setError(null);
      await staffService.deleteAssignment(assignmentToDelete.id.toString());
      setAssignments(assignments.filter((assignment) => assignment.id !== assignmentToDelete.id));
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setError('Failed to delete assignment. Please try again.');
    }
  };

  const handleManageQuestions = async (assignment: StaffAssignment) => {
    try {
      // Fetch the latest assignment data with questions if not already available
      if (!assignment.questions || assignment.questions.length === 0) {
        const assignmentQuestions = await staffService.getAssignmentQuestions(assignment.id);
        const updatedAssignment = { ...assignment, questions: assignmentQuestions };
        // Update the assignment in the local state
        setAssignments(assignments.map(a => a.id === assignment.id ? updatedAssignment : a));
      }
      navigate(`/staff/assignments/${assignment.id}/questions`);
    } catch (error) {
      console.error('Error fetching assignment questions:', error);
      // Still navigate even if questions fetch fails
      navigate(`/staff/assignments/${assignment.id}/questions`);
    }
  };

  const refreshAssignmentQuestions = async () => {
    try {
      setLoading(true);
      const updatedAssignments = await Promise.all(
        assignments.map(async (assignment) => {
          try {
            const questions = await staffService.getAssignmentQuestions(assignment.id);
            return { ...assignment, questions };
          } catch (error) {
            console.error(`Error fetching questions for assignment ${assignment.id}:`, error);
            return { ...assignment, questions: [] };
          }
        })
      );
      setAssignments(updatedAssignments);
    } catch (error) {
      console.error('Error refreshing assignment questions:', error);
      setError('Failed to refresh assignment questions. Please try again.');
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
          Assignment Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshAssignmentQuestions}
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
        data={assignments}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={formFields}
      />
    </Box>
  );
}; 