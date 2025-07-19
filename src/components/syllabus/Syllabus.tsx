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
  // Quiz as QuizIcon,
  // Timer as TimerIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkFilledIcon,
  // Share as ShareIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import syllabuservice from '../../services/syllabusService';
import { Syllabus as SyllabusType } from '../../types';

export const Syllabus: React.FC = () => {
  // const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  console.log('Current user:', currentUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedSyllabus, setBookmarkedSyllabus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [syllabus, setSyllabus] = useState<SyllabusType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSyllabus();
  }, [searchTerm, selectedCategory]);

  const loadSyllabus = async () => {
    try {
      setLoading(true);
      const params: { search?: string; category?: string } = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      
      const data = await syllabuservice.getSyllabus(params);
      setSyllabus(data.results);
      setError(null);
    } catch (err) {
      setError('Failed to load syllabus. Please try again later.');
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

  const toggleBookmark = (syllabusId: string) => {
    setBookmarkedSyllabus(prev =>
      prev.includes(syllabusId)
        ? prev.filter(id => id !== syllabusId)
        : [...prev, syllabusId]
    );
  };

  const handleEnroll = async (syllabusId: string) => {
    try {
      await syllabuservice.enrollInSyllabus(Number(syllabusId));
      // Refresh syllabus after enrollment
      loadSyllabus();
    } catch (err) {
      setError('Failed to enroll in syllabus. Please try again.');
    }
  };

  // const handleUnenroll = async (syllabusId: string) => {
  //   try {
  //     await syllabuservice.unenrollFromSyllabus(Number(syllabusId));
  //     // Refresh syllabus after unenrollment
  //     loadSyllabus();
  //   } catch (err) {
  //     setError('Failed to unenroll from syllabus. Please try again.');
  //   }
  // };

  const sortedSyllabus = [...syllabus].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        // Fallback: sort by id as string
        return b.id.localeCompare(a.id);
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
              placeholder="Search syllabus..."
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
              {sortedSyllabus.map((syllabus) => (
                <Zoom in timeout={500} key={syllabus.id}>
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
                            {syllabus.title}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => toggleBookmark(syllabus.id)}
                          >
                            {bookmarkedSyllabus.includes(syllabus.id) ? (
                              <BookmarkFilledIcon color="primary" />
                            ) : (
                              <BookmarkIcon />
                            )}
                          </IconButton>
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          {syllabus.description}
                        </Typography>

                        <Box>
                          <Chip
                            label={syllabus.category.name}
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
                              {syllabus.instructor.firstName} {syllabus.instructor.lastName}
                            </Typography>
                          </Box>
                        </Stack>

                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => handleEnroll(syllabus.id)}
                        >
                          Enroll Now
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