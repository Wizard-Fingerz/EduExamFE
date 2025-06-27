import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import progressService from '../../services/progressService';
import { SubjectAnalytics } from './SubjectAnalytics';

interface SubjectProgress {
  subject: string;
  progress: number;
  score: number;
  examsCompleted: number;
  timeSpent: string;
  strengths: string[];
  areasToImprove: string[];
  courseId: number;
}

type SortOption = 'progress' | 'score' | 'exams' | 'time';
type SortOrder = 'asc' | 'desc';

export const Progress: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallStats, setOverallStats] = useState<any>(null);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('progress');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedSubject, setSelectedSubject] = useState<SubjectProgress | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch overall learning stats
      const stats = await progressService.getLearningJourneyStats();
      setOverallStats(stats);

      // Fetch course progress
      const coursesProgress = await progressService.getAllCourseProgress();
      
      if (!Array.isArray(coursesProgress)) {
        console.error('Invalid course progress data format:', coursesProgress);
        setError('Invalid data format received from server');
        return;
      }

      const subjectProgressData: SubjectProgress[] = [];

      for (const course of coursesProgress) {
        try {
          if (!course || !course.course) {
            console.warn('Skipping invalid course data:', course);
            continue;
          }

          // Fetch exam progress for this course
          const examProgress = await progressService.getExamProgress(course.course.id);
          const examScores = Array.isArray(examProgress) 
            ? examProgress.map(exam => exam.best_score || 0)
            : [];

          // Calculate strengths and areas to improve
          const strengths = examScores
            .filter(score => score >= 80)
            .map((_, index) => `Topic ${index + 1}`);

          const areasToImprove = examScores
            .filter(score => score < 70)
            .map((_, index) => `Topic ${index + 1}`);

          subjectProgressData.push({
            subject: course.course.title,
            progress: course.progress_percentage || 0,
            score: examScores.length > 0 
              ? Math.round(examScores.reduce((a, b) => a + b, 0) / examScores.length) 
              : 0,
            examsCompleted: examScores.length,
            timeSpent: '0h 0m', // This will be updated when we have time tracking
            strengths,
            areasToImprove,
            courseId: course.course.id
          });
        } catch (courseError) {
          console.error(`Error processing course ${course.course?.id}:`, courseError);
          // Continue with other courses even if one fails
        }
      }

      setSubjectProgress(subjectProgressData);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setError('Failed to load progress data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedSubjects = subjectProgress
    .filter(subject => 
      subject.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'progress':
          return (a.progress - b.progress) * multiplier;
        case 'score':
          return (a.score - b.score) * multiplier;
        case 'exams':
          return (a.examsCompleted - b.examsCompleted) * multiplier;
        case 'time':
          // Convert time strings to minutes for comparison
          const timeA = convertTimeToMinutes(a.timeSpent);
          const timeB = convertTimeToMinutes(b.timeSpent);
          return (timeA - timeB) * multiplier;
        default:
          return 0;
      }
    });

  const convertTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split('h').map(part => 
      parseInt(part.replace(/[^0-9]/g, ''), 10) || 0
    );
    return hours * 60 + minutes;
  };

  const handleSubjectClick = (subject: SubjectProgress) => {
    setSelectedSubject(subject);
    setShowAnalytics(true);
  };

  if (loading) {
    return (
  
      <Box sx={{ py: 4,  px: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
          <TrendingUpIcon sx={{ fontSize: 40 }} color="primary" />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Learning Progress
          </Typography>
        </Stack>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={200} />
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
   
      <Box sx={{ py: 4,  px: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">Learning Progress</Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchProgressData} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
   
    <Box sx={{ py: 4,  px: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
        <TrendingUpIcon sx={{ fontSize: 40 }} color="primary" />
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Learning Progress
        </Typography>
      </Stack>

      {/* Overall Stats */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }} useFlexGap flexWrap="wrap">
        <Box flex={1} minWidth={240}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TimelineIcon color="primary" />
                <Typography variant="h6">Average Score</Typography>
              </Stack>
              <Typography variant="h4">{overallStats?.average_exam_score || 0}%</Typography>
              <Typography variant="body2" color="text.secondary">
                In completed exams
              </Typography>
            </Stack>
          </Paper>
        </Box>
        <Box flex={1} minWidth={240}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AssessmentIcon color="primary" />
                <Typography variant="h6">Exams Completed</Typography>
              </Stack>
              <Typography variant="h4">{overallStats?.total_exams || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total assessments
              </Typography>
            </Stack>
          </Paper>
        </Box>
        <Box flex={1} minWidth={240}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SchoolIcon color="primary" />
                <Typography variant="h6">Time Invested</Typography>
              </Stack>
              <Typography variant="h4">{overallStats?.total_time_spent || '0h'}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total learning time
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Stack>

      {/* Filters and Search */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SortIcon />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="progress">Sort by Progress</MenuItem>
          <MenuItem value="score">Sort by Score</MenuItem>
          <MenuItem value="exams">Sort by Exams</MenuItem>
          <MenuItem value="time">Sort by Time</MenuItem>
        </TextField>
      </Stack>

      {/* Subject Progress */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Progress by Subject
      </Typography>

      <Stack spacing={3}>
        {filteredAndSortedSubjects.map((subject) => (
          <Card 
            key={subject.subject}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[4],
              },
            }}
            onClick={() => handleSubjectClick(subject)}
          >
            <CardContent>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">{subject.subject}</Typography>
                  <Chip
                    label={`${subject.score}% Score`}
                    color={subject.score >= 80 ? 'success' : 'primary'}
                  />
                </Stack>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Overall Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subject.progress}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={subject.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Box flex={1}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Strengths</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {subject.strengths.length > 0 ? (
                          subject.strengths.map((strength) => (
                            <Chip
                              key={strength}
                              label={strength}
                              color="success"
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No strengths identified yet
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Box>
                  <Box flex={1}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Areas to Improve</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {subject.areasToImprove.length > 0 ? (
                          subject.areasToImprove.map((area) => (
                            <Chip
                              key={area}
                              label={area}
                              color="warning"
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No areas identified for improvement
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={3}
                  divider={
                    <Box
                      sx={{
                        borderLeft: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  }
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Exams Completed
                    </Typography>
                    <Typography variant="h6">{subject.examsCompleted}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Time Spent
                    </Typography>
                    <Typography variant="h6">{subject.timeSpent}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Subject Analytics Dialog */}
      <Dialog
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedSubject && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">{selectedSubject.subject} Analytics</Typography>
                <IconButton onClick={() => setShowAnalytics(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <SubjectAnalytics
                subject={selectedSubject}
                onClose={() => setShowAnalytics(false)}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};