import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import examService, { Exam } from '../../services/examService';
import progressService, { CourseProgress } from '../../services/progressService';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Container,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkFilledIcon,
} from '@mui/icons-material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bookmarkedExams, setBookmarkedExams] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  console.log(selectedFilter);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [learningProgress, setLearningProgress] = useState<CourseProgress[]>([]);
  const [stats, setStats] = useState({
    upcomingExams: 0,
    completedExams: 0,
    averageScore: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch upcoming exams
      const exams = await examService.getExams();
      // const exams = exams.results
      const upcoming = exams.results.filter((exam: Exam) => new Date(exam.start_time) > new Date());
      setUpcomingExams(upcoming);

      // Fetch course progress
      const progress = await Promise.all(
        exams.results.map((exam: Exam) => progressService.getCourseProgress(exam.subject.id))
      );
      setLearningProgress(progress);

      // Calculate stats
      const completedExams = exams.results.filter((exam: Exam) => 
        progress.some(p => p.course === exam.course && p.progress_percentage === 100)
      ).length;

      const averageScore = progress.reduce((acc, curr) => acc + curr.progress_percentage, 0) / progress.length;

      setStats({
        upcomingExams: upcoming.length,
        completedExams,
        averageScore: Math.round(averageScore)
      });

    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const toggleBookmark = (examId: string) => {
    setBookmarkedExams(prev => 
      prev.includes(examId) 
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (filter?: string) => {
    if (filter) {
      setSelectedFilter(filter);
    }
    setAnchorEl(null);
  };

  // Prepare data for charts
  const progressByCourse = learningProgress.map((progress) => ({
    name: progress.course.title,
    Progress: progress.progress_percentage,
  }));

  const examDistribution = [
    { name: 'Upcoming', value: stats.upcomingExams },
    { name: 'Completed', value: stats.completedExams },
  ];

  // Simulate exam performance over time (replace with real data if available)
  const examPerformance = learningProgress.map((progress, idx) => ({
    name: progress.course.title,
    Score: progress.progress_percentage,
    idx,
  }));

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Welcome Section */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
                Welcome back, {user?.first_name}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Continue your learning journey. You have {stats.upcomingExams} upcoming exams that need attention.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Refresh Dashboard">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter View">
                <IconButton onClick={handleFilterClick}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        <Alert severity="info" sx={{ mb: 3 }}>
          Your username is: {user?.username}
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleFilterClose()}
        >
          <MenuItem onClick={() => handleFilterClose('all')}>All Subjects</MenuItem>
          <MenuItem onClick={() => handleFilterClose('math')}>Mathematics</MenuItem>
          <MenuItem onClick={() => handleFilterClose('science')}>Science</MenuItem>
          <MenuItem onClick={() => handleFilterClose('english')}>English</MenuItem>
        </Menu>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Paper sx={{ flex: 1, minWidth: 220, p: 3, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TimerIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h6">{stats.upcomingExams}</Typography>
                <Typography variant="body2" color="text.secondary">Upcoming Exams</Typography>
              </Box>
            </Stack>
          </Paper>
          <Paper sx={{ flex: 1, minWidth: 220, p: 3, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h6">{stats.completedExams}</Typography>
                <Typography variant="body2" color="text.secondary">Completed Exams</Typography>
              </Box>
            </Stack>
          </Paper>
          <Paper sx={{ flex: 1, minWidth: 220, p: 3, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h6">{stats.averageScore}%</Typography>
                <Typography variant="body2" color="text.secondary">Average Score</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Analytics Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4, mb: 4 }}>
          {/* Progress by Course Bar Chart */}
          <Paper sx={{ p: 3, borderRadius: 2, minHeight: 320 }}>
            <Typography variant="h6" gutterBottom>Progress by Course</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressByCourse} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="Progress" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
          {/* Exam Distribution Pie Chart */}
          <Paper sx={{ p: 3, borderRadius: 2, minHeight: 320 }}>
            <Typography variant="h6" gutterBottom>Exam Distribution</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={examDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {examDistribution.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Exam Performance Line Chart */}
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2, minHeight: 320 }}>
            <Typography variant="h6" gutterBottom>Exam Performance Over Time</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={examPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="Score" stroke="#A020F0" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Upcoming Exams List */}
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Upcoming Exams</Typography>
            {loading ? (
              <Stack spacing={2}>
                {[1, 2].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={100} />
                ))}
              </Stack>
            ) : (
              <Stack spacing={2}>
                {upcomingExams.map((exam) => (
                  <Card key={`exam-${exam.id}`} variant="outlined" sx={{ borderRadius: 2, transition: 'all 0.2s', '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' } }}>
                    <CardContent>
                      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                        <AssessmentIcon color="primary" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} mb={{ xs: 1, sm: 0 }}>
                            <Typography variant="subtitle1">{exam.title}</Typography>
                            <Chip size="small" label={exam.duration} color="primary" variant="outlined" />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {exam.subject.name} • Due in {new Date(exam.start_time).toLocaleDateString()} • Duration: {exam.duration} minutes
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' }, mt: { xs: 1, sm: 0 } }}>
                          <Tooltip title={bookmarkedExams.includes(exam.id.toString()) ? "Remove Bookmark" : "Bookmark Exam"}>
                            <IconButton size="small" onClick={() => toggleBookmark(exam.id.toString())}>
                              {bookmarkedExams.includes(exam.id.toString()) ? <BookmarkFilledIcon color="primary" /> : <BookmarkIcon />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Start Exam">
                            <IconButton color="primary" onClick={() => navigate(`/exam/${exam.id}`)}>
                              <ArrowForwardIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/exams')} sx={{ alignSelf: 'flex-start' }} fullWidth={isMobile}>
                  View All Exams
                </Button>
              </Stack>
            )}
          </Paper>
        </Box>

        {/* Learning Progress List */}
        <Box>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Learning Progress</Typography>
            {loading ? (
              <Stack spacing={4}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={60} />
                ))}
              </Stack>
            ) : (
              <Stack spacing={4}>
                {learningProgress.map((progress) => (
                  <Box key={`progress-${progress.id}`}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 1 }} spacing={1}>
                      <Typography variant="body2">{progress.course.title}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={`${progress.progress_percentage}%`} size="small" color={progress.progress_percentage >= 80 ? 'success' : 'primary'} />
                      </Stack>
                    </Stack>
                    <LinearProgress variant="determinate" value={progress.progress_percentage} sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { transition: 'transform 0.5s ease-in-out' } }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Last activity: {new Date(progress.last_accessed).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};