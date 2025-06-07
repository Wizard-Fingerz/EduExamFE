import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  // LinearProgress,
  IconButton,
  // Tooltip,
  Container,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  Button,
  Fade,
  Zoom,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  // PlayCircleOutline as PlayIcon,
  Book as BookIcon,
  // Assignment as AssignmentIcon,
  // Timer as TimerIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkFilledIcon,
  // Share as ShareIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import courseService, { Course } from '../../services/courseService';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Courses: React.FC = () => {
  // const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedCourses, setBookmarkedCourses] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, [searchTerm, selectedCategory]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const params: { search?: string; category?: string } = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      
      const data = await courseService.getCourses(params);
      setCourses(data.results);
      setError(null);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setFilterAnchorEl(null);
  };

  const handleSortClose = (sort?: 'popular' | 'newest' | 'rating') => {
    if (sort) {
      setSortBy(sort);
    }
    setSortAnchorEl(null);
  };

  const toggleBookmark = (courseId: number) => {
    setBookmarkedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleEnroll = async (courseId: number) => {
    try {
      await courseService.enrollInCourse(courseId);
      // Refresh courses after enrollment
      loadCourses();
    } catch (err) {
      setError('Failed to enroll in course. Please try again.');
    }
  };

  const handleUnenroll = async (courseId: number) => {
    try {
      await courseService.unenrollFromCourse(courseId);
      // Refresh courses after unenrollment
      loadCourses();
    } catch (err) {
      setError('Failed to unenroll from course. Please try again.');
    }
  };

  const isEnrolled = (course: Course) => {
    return course.students?.some(student => student.id === currentUser?.id) || false;
  };

  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'rating':
        // Since we don't have ratings in our API yet, we'll sort by ID as a fallback
        return b.id - a.id;
      case 'popular':
      default:
        // Since we don't have enrollment count in our API yet, we'll sort by ID as a fallback
        return b.id - a.id;
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
                <MenuItem onClick={() => handleFilterClose('all')}>All Categories</MenuItem>
                <MenuItem onClick={() => handleFilterClose('mathematics')}>Mathematics</MenuItem>
                <MenuItem onClick={() => handleFilterClose('science')}>Science</MenuItem>
                <MenuItem onClick={() => handleFilterClose('language')}>Language</MenuItem>
                <MenuItem onClick={() => handleFilterClose('programming')}>Programming</MenuItem>
              </Menu>
            </Stack>
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
              {sortedCourses.map((course) => (
                <Zoom in timeout={500} key={course.id}>
                  <Card 
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {course.title}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => toggleBookmark(course.id)}
                          >
                            {bookmarkedCourses.includes(course.id) ? (
                              <BookmarkFilledIcon color="primary" />
                            ) : (
                              <BookmarkIcon />
                            )}
                          </IconButton>
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          {course.description}
                        </Typography>

                        <Box>
                          <Chip
                            label={course.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>

                        <Divider />

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BookIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                              {course.instructor.first_name} {course.instructor.last_name}
                            </Typography>
                          </Box>
                        </Stack>

                        <Button
                          variant={isEnrolled(course) ? "outlined" : "contained"}
                          color={isEnrolled(course) ? "error" : "primary"}
                          fullWidth
                          onClick={() => isEnrolled(course) ? handleUnenroll(course.id) : handleEnroll(course.id)}
                        >
                          {isEnrolled(course) ? "Unenroll" : "Enroll Now"}
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