import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bookmarkedExams, setBookmarkedExams] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const upcomingExams = [
    {
      id: 'math-101',
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      date: '2024-03-25',
      timeLeft: '2 days',
      difficulty: 'Medium',
      duration: '2 hours',
    },
    {
      id: 'science-101',
      title: 'Basic Physics',
      subject: 'Science',
      date: '2024-03-27',
      timeLeft: '4 days',
      difficulty: 'Hard',
      duration: '3 hours',
    },
  ];

  const learningProgress = [
    { subject: 'Mathematics', progress: 65, trend: '+5%', lastActivity: '2 days ago' },
    { subject: 'Science', progress: 45, trend: '+2%', lastActivity: '1 day ago' },
    { subject: 'English', progress: 80, trend: '+8%', lastActivity: '3 days ago' },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => setLoading(false), 1000);
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
                Welcome back, John!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Continue your learning journey. You have upcoming exams that need attention.
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

        <Box sx={{ 
          display: 'grid',
          gap: { xs: 2, sm: 3, md: 4 },
          gridTemplateColumns: {
            xs: '1fr',
            md: '300px 1fr',
            lg: '300px 1fr 300px'
          }
        }}>
          {/* Quick Stats */}
          <Box>
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Paper 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <TimerIcon color="primary" sx={{ fontSize: { xs: 32, sm: 40 } }} />
                  <Box>
                    <Typography variant="h6">2</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upcoming Exams
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <AssessmentIcon color="primary" sx={{ fontSize: { xs: 32, sm: 40 } }} />
                  <Box>
                    <Typography variant="h6">15</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Exams
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <TrendingUpIcon color="primary" sx={{ fontSize: { xs: 32, sm: 40 } }} />
                  <Box>
                    <Typography variant="h6">75%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>

          {/* Main Content */}
          <Box>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, height: '100%' }}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', sm: 'center' }} 
                mb={2}
                spacing={1}
              >
                <Typography variant="h6">
                  Upcoming Exams
                </Typography>
                <Chip 
                  label={`Filter: ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}`}
                  onDelete={() => setSelectedFilter('all')}
                  color="primary"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </Stack>
              <Stack spacing={2}>
                {upcomingExams.map((exam) => (
                  <Card 
                    key={exam.id} 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent>
                      <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        alignItems={{ xs: 'flex-start', sm: 'center' }} 
                        spacing={2}
                      >
                        <AssessmentIcon color="primary" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            alignItems={{ xs: 'flex-start', sm: 'center' }} 
                            spacing={1}
                            mb={{ xs: 1, sm: 0 }}
                          >
                            <Typography variant="subtitle1">{exam.title}</Typography>
                            <Chip size="small" label={exam.difficulty} color="primary" variant="outlined" />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {exam.subject} • Due in {exam.timeLeft} • Duration: {exam.duration}
                          </Typography>
                        </Box>
                        <Stack 
                          direction="row" 
                          spacing={1}
                          sx={{ 
                            width: { xs: '100%', sm: 'auto' },
                            justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                            mt: { xs: 1, sm: 0 }
                          }}
                        >
                          <Tooltip title={bookmarkedExams.includes(exam.id) ? "Remove Bookmark" : "Bookmark Exam"}>
                            <IconButton 
                              size="small"
                              onClick={() => toggleBookmark(exam.id)}
                            >
                              {bookmarkedExams.includes(exam.id) ? <BookmarkFilledIcon color="primary" /> : <BookmarkIcon />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Start Exam">
                            <IconButton 
                              color="primary"
                              onClick={() => navigate(`/exam/${exam.id}`)}
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
                <Button 
                  variant="outlined" 
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/exams')}
                  sx={{ alignSelf: 'flex-start' }}
                  fullWidth={isMobile}
                >
                  View All Exams
                </Button>
              </Stack>
            </Paper>
          </Box>

          {/* Progress Overview */}
          <Box>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Learning Progress
              </Typography>
              <Stack spacing={4}>
                {learningProgress.map((subject) => (
                  <Box key={subject.subject}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      sx={{ mb: 1 }}
                      spacing={1}
                    >
                      <Typography variant="body2">{subject.subject}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip 
                          label={subject.trend} 
                          size="small" 
                          color={subject.trend.startsWith('+') ? 'success' : 'error'}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {subject.progress}%
                        </Typography>
                      </Stack>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={subject.progress}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          transition: 'transform 0.5s ease-in-out'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Last activity: {subject.lastActivity}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};