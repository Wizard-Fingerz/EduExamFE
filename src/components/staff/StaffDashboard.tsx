import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

export const StaffDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      icon: <PeopleIcon />,
      trend: '+12%',
      isPositive: true,
    },
    {
      title: 'Active Exams',
      value: '15',
      icon: <AssessmentIcon />,
      trend: '+3',
      isPositive: true,
    },
    {
      title: 'Active Courses',
      value: '8',
      icon: <SchoolIcon />,
      trend: '-1',
      isPositive: false,
    },
  ];

  const recentActivity = [
    {
      title: 'New Exam Submissions',
      value: '45',
      progress: 75,
    },
    {
      title: 'Course Completion Rate',
      value: '68%',
      progress: 68,
    },
    {
      title: 'Student Engagement',
      value: '82%',
      progress: 82,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Welcome back, Staff!</Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(33.33% - 24px)' } }}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                      {stat.isPositive ? (
                        <TrendingUpIcon color="success" fontSize="small" />
                      ) : (
                        <TrendingDownIcon color="error" fontSize="small" />
                      )}
                      <Typography
                        variant="body2"
                        color={stat.isPositive ? 'success.main' : 'error.main'}
                      >
                        {stat.trend}
                      </Typography>
                    </Stack>
                  </Box>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}

        {/* Recent Activity */}
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {recentActivity.map((activity, index) => (
                <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.33% - 16px)' } }}>
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1">{activity.title}</Typography>
                      <Typography variant="h6">{activity.value}</Typography>
                    </Stack>
                    <Tooltip title={`${activity.progress}%`}>
                      <LinearProgress
                        variant="determinate"
                        value={activity.progress}
                        sx={{ height: 8, borderRadius: 2 }}
                      />
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};