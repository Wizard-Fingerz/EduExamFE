import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  People,
  School,
  Assignment,
  Grade,
} from '@mui/icons-material';

export const AnalyticsDashboard: React.FC = () => {
  const performanceMetrics = [
    {
      title: 'Average Course Completion',
      value: '78%',
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      trend: '+5% vs last semester',
      progress: 78,
    },
    {
      title: 'Student Engagement Rate',
      value: '85%',
      icon: <People sx={{ fontSize: 40, color: 'success.main' }} />,
      trend: '+12% vs last month',
      progress: 85,
    },
    {
      title: 'Assignment Submission Rate',
      value: '92%',
      icon: <Assignment sx={{ fontSize: 40, color: 'info.main' }} />,
      trend: '+8% vs last week',
      progress: 92,
    },
    {
      title: 'Average Grade',
      value: 'B+',
      icon: <Grade sx={{ fontSize: 40, color: 'warning.main' }} />,
      trend: 'Stable',
      progress: 75,
    },
  ];

  const courseAnalytics = [
    { course: 'Computer Science', enrolled: 150, active: 142, completion: 85 },
    { course: 'Data Structures', enrolled: 120, active: 115, completion: 78 },
    { course: 'Web Development', enrolled: 200, active: 180, completion: 92 },
    { course: 'Machine Learning', enrolled: 80, active: 75, completion: 70 },
  ];

  const studentProgress = [
    { metric: 'Assignments Completed', value: 450, total: 500, percent: 90 },
    { metric: 'Average Quiz Score', value: 85, total: 100, percent: 85 },
    { metric: 'Discussion Participation', value: 120, total: 150, percent: 80 },
    { metric: 'Project Submissions', value: 28, total: 30, percent: 93 },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Analytics Dashboard</Typography>

      {/* Performance Metrics */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: 'repeat(4, 1fr)'
        },
        gap: 3,
        mb: 4
      }}>
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {metric.icon}
                  <Typography variant="h4">{metric.value}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {metric.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metric.trend}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={metric.progress}
                  sx={{ height: 8, borderRadius: 2 }}
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Course Analytics */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Course Analytics</Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}>
          {courseAnalytics.map((course, index) => (
            <Box key={index}>
              <Typography variant="subtitle1" gutterBottom>
                {course.course}
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Enrolled</Typography>
                  <Typography variant="body2">{course.enrolled}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Active</Typography>
                  <Typography variant="body2">{course.active}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Completion Rate: {course.completion}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course.completion}
                    sx={{ height: 6, borderRadius: 1 }}
                  />
                </Box>
              </Stack>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Student Progress */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Overall Student Progress</Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}>
          {studentProgress.map((progress, index) => (
            <Box key={index}>
              <Typography variant="subtitle2" gutterBottom>
                {progress.metric}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {progress.value} / {progress.total}
                </Typography>
                <Typography variant="body2" color="primary">
                  {progress.percent}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress.percent}
                sx={{ height: 6, borderRadius: 1 }}
              />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}; 