import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Container,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  Button,
  Fade,
  Zoom,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  PlayCircleOutline as PlayIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkFilledIcon,
  Share as ShareIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  materials: number;
  instructor: string;
  rating: number;
  enrolled: number;
  thumbnail: string;
}

const mockCourses: Course[] = [
  {
    id: 'math-fundamentals',
    title: 'Mathematics Fundamentals',
    description: 'Master core concepts in algebra, geometry, and arithmetic through interactive lessons and real-world applications',
    progress: 45,
    duration: '8 weeks',
    level: 'Beginner',
    topics: ['Algebra', 'Geometry', 'Arithmetic', 'Problem Solving'],
    materials: 24,
    instructor: 'Dr. Sarah Matthews',
    rating: 4.8,
    enrolled: 1250,
    thumbnail: 'math-thumbnail.jpg'
  },
  {
    id: 'physics-basics',
    title: 'Introduction to Physics',
    description: 'Explore the fascinating world of physics through hands-on experiments and comprehensive theoretical foundations',
    progress: 30,
    duration: '10 weeks',
    level: 'Intermediate',
    topics: ['Mechanics', 'Energy', 'Forces', 'Waves'],
    materials: 32,
    instructor: 'Prof. James Wilson',
    rating: 4.6,
    enrolled: 980,
    thumbnail: 'physics-thumbnail.jpg'
  },
  {
    id: 'english-composition',
    title: 'English Composition',
    description: 'Develop professional writing skills with focus on grammar, style, and effective communication',
    progress: 65,
    duration: '6 weeks',
    level: 'Beginner',
    topics: ['Grammar', 'Writing', 'Comprehension', 'Style'],
    materials: 18,
    instructor: 'Emma Thompson',
    rating: 4.9,
    enrolled: 1500,
    thumbnail: 'english-thumbnail.jpg'
  },
];

export const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (level?: string) => {
    if (level) {
      setSelectedLevel(level);
    }
    setFilterAnchorEl(null);
  };

  const handleSortClose = (sort?: 'popular' | 'newest' | 'rating') => {
    if (sort) {
      setSortBy(sort);
    }
    setSortAnchorEl(null);
  };

  const toggleBookmark = (courseId: string) => {
    setBookmarkedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel.toLowerCase();
    return matchesSearch && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.enrolled - a.enrolled;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        // Since we don't have a date field in our mock data, we'll use the ID as a proxy
        // In a real application, you would sort by createdAt or similar field
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  return (
    <Container maxWidth="xl">
      <Fade in timeout={800}>
        <Box sx={{ py: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <SchoolIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h4" fontWeight="bold">
              Your Learning Journey
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
              placeholder="Search courses..."
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

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={handleSortClick}
              >
                Sort By
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleFilterClick}
              >
                Filter
              </Button>

              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => handleSortClose()}
              >
                <MenuItem onClick={() => handleSortClose('popular')}>
                  Most Popular
                </MenuItem>
                <MenuItem onClick={() => handleSortClose('rating')}>
                  Highest Rated
                </MenuItem>
                <MenuItem onClick={() => handleSortClose('newest')}>
                  Newest First
                </MenuItem>
              </Menu>

              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={() => handleFilterClose()}
              >
                <MenuItem onClick={() => handleFilterClose('all')}>All Levels</MenuItem>
                <MenuItem onClick={() => handleFilterClose('beginner')}>Beginner</MenuItem>
                <MenuItem onClick={() => handleFilterClose('intermediate')}>Intermediate</MenuItem>
                <MenuItem onClick={() => handleFilterClose('advanced')}>Advanced</MenuItem>
              </Menu>
            </Stack>
          </Stack>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 3
          }}>
            {sortedCourses.map((course) => (
              <Zoom in timeout={500} key={course.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: (theme) => theme.shadows[8],
                    },
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Box 
                    sx={{ 
                      height: 160, 
                      bgcolor: 'primary.main',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BookIcon sx={{ fontSize: 60, color: 'white', opacity: 0.8 }} />
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8 
                      }}
                    >
                      <Tooltip title="Share Course">
                        <IconButton size="small" sx={{ color: 'white' }}>
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={bookmarkedCourses.includes(course.id) ? "Remove Bookmark" : "Bookmark Course"}>
                        <IconButton 
                          size="small" 
                          sx={{ color: 'white' }}
                          onClick={() => toggleBookmark(course.id)}
                        >
                          {bookmarkedCourses.includes(course.id) ? <BookmarkFilledIcon /> : <BookmarkIcon />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack spacing={2}>
                      <Stack spacing={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {course.instructor}
                        </Typography>
                      </Stack>

                      <Typography color="text.secondary" variant="body2">
                        {course.description}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip 
                          size="small" 
                          label={course.level}
                          color={
                            course.level === 'Advanced' 
                              ? 'error' 
                              : course.level === 'Intermediate' 
                              ? 'warning' 
                              : 'success'
                          }
                        />
                        <Chip
                          size="small"
                          icon={<TimerIcon />}
                          label={course.duration}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          icon={<AssignmentIcon />}
                          label={`${course.materials} materials`}
                          variant="outlined"
                        />
                      </Stack>

                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            Course Progress
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {course.progress}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'action.hover',
                          }}
                        />
                      </Box>

                      <Divider />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            ⭐ {course.rating}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            👥 {course.enrolled}
                          </Typography>
                        </Stack>
                        <Button
                          variant="contained"
                          startIcon={<PlayIcon />}
                          size="small"
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                          }}
                        >
                          Continue
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};