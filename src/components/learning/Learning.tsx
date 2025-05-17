import React from 'react';
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

interface LearningMaterial {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz';
  duration: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
  subject: string;
}

const mockMaterials: LearningMaterial[] = [
  {
    id: 'math-1',
    title: 'Understanding Algebraic Expressions',
    type: 'video',
    duration: '15 mins',
    progress: 75,
    completed: false,
    lastAccessed: '2 hours ago',
    subject: 'Mathematics',
  },
  {
    id: 'physics-1',
    title: 'Newton\'s Laws of Motion',
    type: 'interactive',
    duration: '30 mins',
    progress: 40,
    completed: false,
    lastAccessed: '1 day ago',
    subject: 'Physics',
  },
  {
    id: 'english-1',
    title: 'Essay Writing Techniques',
    type: 'reading',
    duration: '20 mins',
    progress: 100,
    completed: true,
    lastAccessed: '3 days ago',
    subject: 'English',
  },
];

export const Learning: React.FC = () => {
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

            {/* Active Learning Section */}
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
                {mockMaterials.map((material) => (
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
                        value={75}
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
                          75%
                        </Typography>
                      </Box>
                    </Box>
                  )
                },
                {
                  icon: <AccessTimeIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
                  title: 'Time Spent',
                  content: (
                    <>
                      <Typography variant="h4" fontWeight="bold" color="secondary.main">12.5h</Typography>
                      <Typography variant="body2" color="text.secondary">This week</Typography>
                    </>
                  )
                },
                {
                  icon: <TrophyIcon sx={{ fontSize: 32, color: 'success.main' }} />,
                  title: 'Completed',
                  content: (
                    <>
                      <Typography variant="h4" fontWeight="bold" color="success.main">8</Typography>
                      <Typography variant="body2" color="text.secondary">Materials this month</Typography>
                    </>
                  )
                }
              ].map((stat, index) => (
                <Zoom in timeout={500 + (index * 100)} key={stat.title}>
                  <Paper
                    sx={{
                      p: 3,
                      width: { xs: '100%', sm: 'calc(33.33% - 16px)' },
                      borderRadius: 3,
                      background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      {stat.icon}
                      <Typography variant="h6" fontWeight="medium">{stat.title}</Typography>
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