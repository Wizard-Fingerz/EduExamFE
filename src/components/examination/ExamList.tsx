import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Skeleton,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
  TrendingUp as DifficultyIcon,
  PlayArrow as StartIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import examService, { Exam } from '../../services/examService';

export const ExamList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [bookmarkedExams, setBookmarkedExams] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredExam, setHoveredExam] = useState<number | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await examService.getExams();
      setExams(data.results);
      setError(null);
    } catch (err) {
      setError('Failed to load exams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  console.log(exams);
  const filteredExams = (exams || [])?.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !subjectFilter || exam.course.toString() === subjectFilter;
    return matchesSearch && matchesSubject;
  });
  

  const toggleBookmark = (examId: number) => {
    setBookmarkedExams(prev => 
      prev.includes(examId) ? prev.filter(id => id !== examId) : [...prev, examId]
    );
  };

  const handleStartExam = async (examId: number) => {
    try {
      const attempt = await examService.startExam(examId);
      navigate(`/exam/${examId}`);
    } catch (err) {
      setError('Failed to start exam. Please try again.');
    }
  };

  return (
    <Box>
      <Fade in={!loading} timeout={1000}>
        <Stack spacing={4}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography 
              variant="h4" 
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Available Exams
            </Typography>
            <Tooltip title="Filter Options">
              <IconButton>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 2 }}
            />
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={subjectFilter}
                label="Subject"
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <MenuItem value="">All Subjects</MenuItem>
                {Array.from(new Set(exams.map(exam => exam.course))).map((courseId) => (
                  <MenuItem key={courseId} value={courseId}>Course {courseId}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {filteredExams.map((exam) => (
                <Zoom in key={exam.id} style={{ transitionDelay: '150ms' }}>
                  <Card
                    onMouseEnter={() => setHoveredExam(exam.id)}
                    onMouseLeave={() => setHoveredExam(null)}
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      transform: hoveredExam === exam.id ? 'scale(1.02)' : 'scale(1)',
                      '&:hover': {
                        boxShadow: theme.shadows[10],
                      },
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={1}>
                            <Chip
                              size="small"
                              label={`Course ${exam.course.title}`}
                              icon={<SchoolIcon />}
                              color="primary"
                            />
                            <Chip
                              size="small"
                              label={`${exam.course.passing_score}% to pass`}
                              icon={<DifficultyIcon />}
                              color="primary"
                            />
                          </Stack>
                          <IconButton 
                            onClick={() => toggleBookmark(exam.id)}
                            color="primary"
                          >
                            {bookmarkedExams.includes(exam.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                          </IconButton>
                        </Stack>

                        <Typography variant="h6" gutterBottom>{exam.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60 }}>
                          {exam.description}
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Chip
                            icon={<TimerIcon />}
                            label={`${exam.duration} min`}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>

                        <Button
                          variant="contained"
                          startIcon={<StartIcon />}
                          onClick={() => handleStartExam(exam.id)}
                          fullWidth
                        >
                          Start Exam
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Zoom>
              ))}
            </Box>
          )}
        </Stack>
      </Fade>
    </Box>
  );
};