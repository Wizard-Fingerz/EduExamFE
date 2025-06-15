import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import staffService, { StaffDashboardStats, Staff } from '../../services/staffService';

export const StaffDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StaffDashboardStats | null>(null);
  const [staffProfile, setStaffProfile] = useState<Staff | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsData, profileData] = await Promise.all([
          staffService.getDashboardStats(),
          staffService.getStaffProfile()
        ]);
        setStats(statsData);
        setStaffProfile(profileData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <SchoolIcon sx={{ fontSize: 40 }} color="primary" />
          <Typography variant="h4" fontWeight="bold">
            Welcome, {staffProfile?.first_name} {staffProfile?.last_name}
          </Typography>
        </Stack>

        <Alert severity="info" sx={{ mb: 4 }}>
          Your username is: {staffProfile?.username}
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon color="primary" />
                  <Typography variant="h6" color="text.secondary">
                    Total Students
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats?.total_students || 0}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon color="primary" />
                  <Typography variant="h6" color="text.secondary">
                    Total Courses
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats?.total_courses || 0}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimerIcon color="primary" />
                  <Typography variant="h6" color="text.secondary">
                    Active Exams
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats?.active_exams || 0}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon color="primary" />
                  <Typography variant="h6" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  ${stats?.total_revenue?.toLocaleString() || 0}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Enrollments
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {stats?.recent_enrollments || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New enrollments in the last 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Average Course Rating
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <StarIcon color="warning" />
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.average_course_rating?.toFixed(1) || 0}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Based on student feedback
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};