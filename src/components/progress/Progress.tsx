import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  LinearProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

interface SubjectProgress {
  subject: string;
  progress: number;
  score: number;
  examsCompleted: number;
  timeSpent: string;
  strengths: string[];
  areasToImprove: string[];
}

const mockProgress: SubjectProgress[] = [
  {
    subject: 'Mathematics',
    progress: 75,
    score: 82,
    examsCompleted: 8,
    timeSpent: '24h 30m',
    strengths: ['Algebra', 'Geometry', 'Basic Arithmetic'],
    areasToImprove: ['Calculus', 'Trigonometry'],
  },
  {
    subject: 'Physics',
    progress: 60,
    score: 78,
    examsCompleted: 5,
    timeSpent: '18h 45m',
    strengths: ['Mechanics', 'Energy'],
    areasToImprove: ['Waves', 'Electricity'],
  },
  {
    subject: 'English',
    progress: 85,
    score: 90,
    examsCompleted: 6,
    timeSpent: '20h 15m',
    strengths: ['Grammar', 'Comprehension', 'Writing'],
    areasToImprove: ['Advanced Vocabulary'],
  },
];

export const Progress: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Learning Progress
      </Typography>

      {/* Overall Stats */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }} useFlexGap flexWrap="wrap">
        <Box flex={1} minWidth={240}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TrendingUpIcon color="primary" />
                <Typography variant="h6">Overall Progress</Typography>
              </Stack>
              <Typography variant="h4">73%</Typography>
              <Typography variant="body2" color="text.secondary">
                Across all subjects
              </Typography>
            </Stack>
          </Paper>
        </Box>
        <Box flex={1} minWidth={240}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TimelineIcon color="primary" />
                <Typography variant="h6">Average Score</Typography>
              </Stack>
              <Typography variant="h4">83%</Typography>
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
              <Typography variant="h4">19</Typography>
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
              <Typography variant="h4">63h</Typography>
              <Typography variant="body2" color="text.secondary">
                Total learning time
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Stack>

      {/* Subject Progress */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Progress by Subject
      </Typography>

      <Stack spacing={3}>
        {mockProgress.map((subject) => (
          <Card key={subject.subject}>
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
                    </Stack>
                  </Box>
                  <Box flex={1}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Areas to Improve</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
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
    </Box>
  );
};