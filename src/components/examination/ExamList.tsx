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

interface Exam {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  questions: number;
  available: boolean;
  prerequisites?: string[];
  thumbnail?: string;
  completionRate?: number;
}

const mockExams: Exam[] = [
  {
    id: 'math-101',
    title: 'Algebra Fundamentals',
    subject: 'Mathematics',
    description: 'Basic algebraic concepts including equations, inequalities, and functions',
    duration: 45,
    difficulty: 2,
    questions: 20,
    available: true,
    prerequisites: ['Basic Arithmetic'],
    thumbnail: '/assets/math-thumbnail.jpg',
    completionRate: 85,
  },
  {
    id: 'physics-101',
    title: 'Mechanics Basics',
    subject: 'Physics',
    description: 'Introduction to forces, motion, and energy concepts',
    duration: 60,
    difficulty: 3,
    questions: 25,
    available: true,
    prerequisites: ['Basic Mathematics'],
    thumbnail: '/assets/physics-thumbnail.jpg',
    completionRate: 72,
  },
  // ... other exams
];

export const ExamList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<number | ''>('');
  const [bookmarkedExams, setBookmarkedExams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredExam, setHoveredExam] = useState<string | null>(null);

  const subjects = Array.from(new Set(mockExams.map(exam => exam.subject)));
  const difficulties = [1, 2, 3, 4, 5];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredExams = mockExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !subjectFilter || exam.subject === subjectFilter;
    const matchesDifficulty = !difficultyFilter || exam.difficulty === difficultyFilter;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'success';
    if (difficulty <= 3) return 'primary';
    return 'error';
  };

  const toggleBookmark = (examId: string) => {
    setBookmarkedExams(prev => 
      prev.includes(examId) ? prev.filter(id => id !== examId) : [...prev, examId]
    );
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
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                label="Difficulty"
                onChange={(e) => setDifficultyFilter(Number(e.target.value) || '')}
              >
                <MenuItem value="">All Levels</MenuItem>
                {difficulties.map((level) => (
                  <MenuItem key={level} value={level}>Level {level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {loading ? (
              Array.from(new Array(4)).map((_, index) => (
                <Skeleton 
                  key={index}
                  variant="rectangular" 
                  height={300}
                  sx={{ borderRadius: 2 }}
                />
              ))
            ) : (
              filteredExams.map((exam) => (
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
                              label={exam.subject}
                              icon={<SchoolIcon />}
                              color="primary"
                            />
                            <Chip
                              size="small"
                              label={`Level ${exam.difficulty}`}
                              icon={<DifficultyIcon />}
                              color={getDifficultyColor(exam.difficulty)}
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
                          <Chip
                            label={`${exam.questions} questions`}
                            size="small"
                            variant="outlined"
                          />
                          {exam.completionRate && (
                            <Tooltip title="Completion rate by other students">
                              <Chip
                                label={`${exam.completionRate}% completion`}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </Tooltip>
                          )}
                        </Stack>

                        {exam.prerequisites && (
                          <Stack spacing={1}>
                            <Typography variant="caption" color="text.secondary">
                              Prerequisites:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {exam.prerequisites.map((prereq) => (
                                <Chip
                                  key={prereq}
                                  label={prereq}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mb: 1 }}
                                />
                              ))}
                            </Stack>
                          </Stack>
                        )}

                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<StartIcon />}
                          onClick={() => navigate(`/exam/${exam.id}`)}
                          disabled={!exam.available}
                          sx={{
                            mt: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.02)',
                            },
                          }}
                        >
                          Start Exam
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Zoom>
              ))
            )}
          </Box>
        </Stack>
      </Fade>
    </Box>
  );
};