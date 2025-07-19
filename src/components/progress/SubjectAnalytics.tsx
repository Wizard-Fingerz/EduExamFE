import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  LinearProgress,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SubjectAnalyticsProps {
  subject: {
    subject: string;
    progress: number;
    score: number;
    examsCompleted: number;
    timeSpent: string;
    strengths: string[];
    areasToImprove: string[];
    syllabusId: number;
  };
  onClose: () => void;
}

export const SubjectAnalytics: React.FC<SubjectAnalyticsProps> = ({ subject, onClose }) => {
  // Mock data for performance trend - replace with real data from API
  const performanceData = [
    { date: 'Week 1', score: 65 },
    { date: 'Week 2', score: 72 },
    { date: 'Week 3', score: 78 },
    { date: 'Week 4', score: 85 },
    { date: 'Week 5', score: 82 },
  ];

  console.log(onClose);
  // Handle close action

  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{subject.subject}</Typography>
            <Chip
              label={`${subject.score}% Overall Score`}
              color={subject.score >= 80 ? 'success' : 'primary'}
            />
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Performance Trend
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2196f3"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Learning Progress
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Syllabus Progress
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
                    <Stack direction="row" spacing={2}>
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          Time Spent
                        </Typography>
                        <Typography variant="h6">{subject.timeSpent}</Typography>
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          Exams Completed
                        </Typography>
                        <Typography variant="h6">{subject.examsCompleted}</Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Learning Insights
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Strong Areas"
                        secondary={
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                            {subject.strengths.map((strength) => (
                              <Chip
                                key={strength}
                                label={strength}
                                color="success"
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            ))}
                          </Stack>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Areas to Improve"
                        secondary={
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                            {subject.areasToImprove.map((area) => (
                              <Chip
                                key={area}
                                label={area}
                                color="warning"
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            ))}
                          </Stack>
                        }
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
}; 