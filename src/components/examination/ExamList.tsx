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
  Container,
  Divider,
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
  // FilterList as FilterIcon,
} from '@mui/icons-material';
import examService, { Exam } from '../../services/examService';

export const ExamList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [bookmarkedExams, setBookmarkedExams] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredExam, setHoveredExam] = useState<number | null>(null);
  console.log(hoveredExam);
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

  // Get unique courses with titles for filter
  const uniqueCourses = Array.from(
    exams.reduce((acc, exam) => acc.set(exam.subject.id, exam.subject.name), new Map()),
    ([id, title]) => ({ id, title })
  );

  const filteredExams = (exams || [])?.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !subjectFilter || exam.course.id.toString() === subjectFilter;
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
      console.log(attempt)
      navigate(`/exam/${examId}`);
    } catch (err) {
      setError('Failed to start exam. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl">
      <Fade in timeout={800}>
        <Box sx={{ py: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <SchoolIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h4" fontWeight="bold">
              Available Exams
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 4 }}
            alignItems="center"
            justifyContent="space-between"
          >
            <TextField
              placeholder="Search exams..."
              variant="outlined"
              size="small"
              fullWidth
              sx={{ maxWidth: 500 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={subjectFilter}
                label="Subject"
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <MenuItem value="">All Subjects</MenuItem>
                {uniqueCourses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
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
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 3
            }}>
              {filteredExams.map((exam) => (
                <Zoom in timeout={500} key={exam.id}>
                  <Card
                    onMouseEnter={() => setHoveredExam(exam.id)}
                    onMouseLeave={() => setHoveredExam(null)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      },
                    }}
                  > 
                  <CardContent>
                  <Stack spacing={2}>
                    
                    {/* Header with title and bookmark */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight={600}>
                        {exam.title}
                      </Typography>
                      <IconButton size="small" onClick={() => toggleBookmark(exam.id)}>
                        {bookmarkedExams.includes(exam.id) ? (
                          <BookmarkIcon color="primary" />
                        ) : (
                          <BookmarkBorderIcon />
                        )}
                      </IconButton>
                    </Box>
              
                    {/* Subject Tag */}
                    <Chip
                      label={exam.subject.name}
                      size="small"
                      color="primary"
                      variant="filled"
                      sx={{ width: 'fit-content' }}
                    />
              
                    {/* Description */}
                    <Typography variant="body2" color="text.secondary">
                      {exam.description}
                    </Typography>
              
                    <Divider />
              
                    {/* Meta Information */}
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimerIcon fontSize="small" color="action" />
                        <Typography variant="caption">{exam.duration} min</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DifficultyIcon fontSize="small" color="action" />
                        <Typography variant="caption">{exam.passing_marks}% to pass</Typography>
                      </Box>
                    </Stack>
              
                    {/* Call to Action */}
                    <Button
                      variant="contained"
                      startIcon={<StartIcon />}
                      onClick={() => handleStartExam(exam.id)}
                      fullWidth
                      sx={{ mt: 2, borderRadius: 2 }}
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
        </Box>
      </Fade>
    </Container>
  );
};