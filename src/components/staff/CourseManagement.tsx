import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataTable } from './common/DataTable';

interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  credits: number;
  capacity: number;
  startDate: string;
  status: string;
}

export const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction to Computer Science',
      code: 'CS101',
      instructor: 'Dr. Smith',
      credits: 3,
      capacity: 50,
      startDate: '2024-03-01',
      status: 'Active',
    },
    // Add more sample data as needed
  ]);

  const columns = [
    { id: 'title', label: 'Title', minWidth: 200 },
    { id: 'code', label: 'Course Code', minWidth: 100 },
    { id: 'instructor', label: 'Instructor', minWidth: 150 },
    {
      id: 'credits',
      label: 'Credits',
      minWidth: 100,
      align: 'right' as const,
    },
    {
      id: 'capacity',
      label: 'Capacity',
      minWidth: 100,
      align: 'right' as const,
    },
    { id: 'startDate', label: 'Start Date', minWidth: 130 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  const formFields = [
    { id: 'title', label: 'Course Title' },
    { id: 'code', label: 'Course Code' },
    { id: 'instructor', label: 'Instructor Name' },
    { id: 'credits', label: 'Credits', type: 'number' },
    { id: 'capacity', label: 'Student Capacity', type: 'number' },
    { id: 'startDate', label: 'Start Date', type: 'date' },
    { id: 'status', label: 'Status' },
  ];

  const handleAdd = (newCourse: Omit<Course, 'id'>) => {
    const course: Course = {
      ...newCourse,
      id: Date.now().toString(), // Generate a unique ID
    };
    setCourses([...courses, course]);
  };

  const handleEdit = (editedCourse: Course) => {
    setCourses(courses.map((course) => 
      course.id === editedCourse.id ? editedCourse : course
    ));
  };

  const handleDelete = (courseToDelete: Course) => {
    setCourses(courses.filter((course) => course.id !== courseToDelete.id));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Course Management
      </Typography>

      <DataTable
        columns={columns}
        data={courses}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={formFields}
      />
    </Box>
  );
}; 