import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Container,
  Fade,
  Zoom,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ExamInfo {
  title: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  instructions: string[];
}

export const StartExam: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This would typically come from your API
  const examInfo: ExamInfo = {
    title: "Final Assessment",
    duration: 60,
    totalQuestions: 50,
    passingScore: 70,
    instructions: [
      "You will have 60 minutes to complete the exam",
      "The exam consists of 50 multiple-choice questions",
      "Each question carries equal marks",
      "You must score at least 70% to pass",
      "You cannot leave the exam page once started",
      "Ensure you have a stable internet connection",
      "Do not refresh the page during the exam",
    ],
  };

  const handleStartExam = async () => {
    try {
      setLoading(true);
      // Here you would typically make an API call to initialize the exam
      // For now, we'll just navigate to the exam page
      navigate('/exam/start');
    } catch (err) {
      setError('Failed to start exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Fade in timeout={800}>
        <Box sx={{ py: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <SchoolIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h4" fontWeight="bold">
              {examInfo.title}
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Zoom in timeout={500}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Exam Information
                    </Typography>
                    <Stack direction="row" spacing={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimerIcon sx={{ mr: 1 }} color="primary" />
                        <Typography>
                          Duration: {examInfo.duration} minutes
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AssignmentIcon sx={{ mr: 1 }} color="primary" />
                        <Typography>
                          Questions: {examInfo.totalQuestions}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Instructions
                    </Typography>
                    <Stack spacing={1}>
                      {examInfo.instructions.map((instruction, index) => (
                        <Typography key={index} variant="body2">
                          • {instruction}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleStartExam}
                      disabled={loading}
                      sx={{ minWidth: 200 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Start Exam'
                      )}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Zoom>
        </Box>
      </Fade>
    </Container>
  );
}; 