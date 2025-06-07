import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Button,
  Chip,
  Tooltip,
  CircularProgress,
  Container,
  Fade,
  Zoom,
  Divider,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  School as SchoolIcon,
  Book as BookIcon,
  CheckCircle as CheckIcon,
  Timer as TimerIcon,
  Flag as FlagIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import progressService from '../../services/progressService';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

interface LearningMaterial {
  id: number;
  title: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz';
  duration: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
  subject: string;
  courseId: number;
  lessonId: number;
}

export const Learning: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [learningStats, setLearningStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterial[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const navigate = useNavigate();
  // const { user } = useAuth();

  console.log(recentActivity)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch learning journey stats
        const stats = await progressService.getLearningJourneyStats();
        setLearningStats(stats);

        // Fetch recent activity
        const activity = await progressService.getRecentActivity();
        setRecentActivity(activity);

        // Fetch enrolled courses progress
        const coursesProgress = await progressService.getAllCourseProgress();
        setEnrolledCourses(coursesProgress);
        
        if (!Array.isArray(coursesProgress) || coursesProgress.length === 0) {
          setLearningMaterials([]);
          return;
        }

        // Transform enrolled courses into learning materials
        const materials: LearningMaterial[] = [];
        
        for (const course of coursesProgress) {
          try {
            if (!course?.course?.id) {
              console.warn('Skipping invalid course data:', course);
              continue;
            }

            const courseOverview = await progressService.getCourseProgressOverview(course.course.id);
            
            // Get the last accessed lesson
            if (courseOverview.last_accessed_lesson) {
              const lessonProgress = await progressService.getLessonProgress(courseOverview.last_accessed_lesson.id);
              
              materials.push({
                id: courseOverview.last_accessed_lesson.id,
                title: courseOverview.last_accessed_lesson.title,
                type: courseOverview.last_accessed_lesson.type || 'video',
                duration: courseOverview.last_accessed_lesson.duration || '30 mins',
                progress: lessonProgress.time_spent ? 
                  Math.min(100, Math.round((lessonProgress.time_spent / (30 * 60)) * 100)) : 0,
                completed: lessonProgress.is_completed,
                lastAccessed: new Date(lessonProgress.updated_at).toLocaleDateString(),
                subject: course.course.title,
                courseId: course.course.id,
                lessonId: courseOverview.last_accessed_lesson.id,
              });
            } else {
              // If no last accessed lesson, create a default entry for the course
              materials.push({
                id: course.course.id,
                title: course.course.title,
                type: 'video',
                duration: '30 mins',
                progress: 0,
                completed: false,
                lastAccessed: new Date(course.last_accessed).toLocaleDateString(),
                subject: course.course.title,
                courseId: course.course.id,
                lessonId: 0, // This will be updated when the user starts the course
              });
            }
          } catch (courseError) {
            console.error(`Error processing course ${course.course?.id}:`, courseError);
            // Continue with other courses even if one fails
          }
        }
        
        setLearningMaterials(materials);
      } catch (error) {
        console.error('Error fetching learning data:', error);
        setError('Failed to load your enrolled courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleContinueLearning = (courseId: number, lessonId: number) => {
    navigate(`/course/${courseId}/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={400} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Fade in timeout={800}>
        <Box sx={{ py: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <SchoolIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h4" fontWeight="bold">
              My Learning Journey
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {enrolledCourses.length === 0 && !error ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              You haven't enrolled in any courses yet. Visit the Courses page to start learning!
            </Alert>
          ) : (
            // Active Learning Section
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 2,
                background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <BookIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" fontWeight="bold">Continue Learning</Typography>
              </Stack>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {learningMaterials.map((material) => (
                  <Zoom in timeout={500} key={material.id}>
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.33% - 16px)' } }}>
                      <Card
                        sx={{
                          height: '100%',
                          bgcolor: material.completed ? 'action.hover' : 'background.paper',
                          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: (theme) => theme.shadows[8],
                          },
                          borderRadius: 2,
                        }}
                      >
                        <CardContent>
                          <Stack spacing={2.5}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Chip
                                size="small"
                                label={material.type}
                                color="primary"
                                sx={{
                                  borderRadius: '8px',
                                  textTransform: 'capitalize',
                                  fontWeight: 500
                                }}
                              />
                              {material.completed && (
                                <Tooltip title="Completed">
                                  <CheckIcon sx={{ color: 'success.main' }} />
                                </Tooltip>
                              )}
                            </Stack>

                            <Typography variant="h6" sx={{ fontWeight: 'medium', lineHeight: 1.4 }}>
                              {material.title}
                            </Typography>

                            <Stack direction="row" spacing={3} alignItems="center">
                              <Stack direction="row" spacing={1} alignItems="center">
                                <TimerIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {material.duration}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <FlagIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {material.subject}
                                </Typography>
                              </Stack>
                            </Stack>

                            <Box>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 1 }}
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  Progress
                                </Typography>
                                <Typography variant="body2" color="primary">
                                  {material.progress}%
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={material.progress}
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
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                Last accessed {material.lastAccessed}
                              </Typography>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<PlayIcon />}
                                disabled={material.completed}
                                onClick={() => handleContinueLearning(material.courseId, material.lessonId)}
                                sx={{
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  boxShadow: 'none',
                                  '&:hover': {
                                    boxShadow: 'none',
                                  }
                                }}
                              >
                                Continue
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Box>
                  </Zoom>
                ))}
              </Box>
            </Paper>
          )}

          {/* Learning Stats */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {[
              {
                icon: <TrendingUpIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
                title: 'Total Progress',
                content: (
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={learningStats?.progress_percentage || 0}
                      size={100}
                      thickness={4}
                      sx={{ color: 'primary.main' }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {learningStats?.progress_percentage || 0}%
                      </Typography>
                    </Box>
                  </Box>
                ),
              },
              {
                icon: <AccessTimeIcon sx={{ fontSize: 32, color: 'success.main' }} />,
                title: 'Time Spent Learning',
                content: (
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    {learningStats?.total_time_spent || '0:00:00'}
                  </Typography>
                ),
              },
              {
                icon: <TrophyIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
                title: 'Average Score',
                content: (
                  <Typography variant="h5" fontWeight="bold" color="warning.main">
                    {learningStats?.average_exam_score || 0}%
                  </Typography>
                ),
              },
            ].map((stat, index) => (
              <Zoom in timeout={500} key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    flex: 1,
                    minWidth: 250,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack spacing={2} alignItems="center">
                    {stat.icon}
                    <Typography variant="h6" fontWeight="medium" align="center">
                      {stat.title}
                    </Typography>
                    {stat.content}
                  </Stack>
                </Paper>
              </Zoom>
            ))}
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};