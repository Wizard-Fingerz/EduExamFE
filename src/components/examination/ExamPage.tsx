import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Container,
} from '@mui/material';
import { AdaptiveExamContainer } from './AdaptiveExamContainer';

// Mock exam metadata for initialization
const mockExamData = {
  'math-101': {
    id: 'math-101',
    title: 'Algebra Fundamentals',
    subject: 'Mathematics',
    topic: 'Algebra',
    description: 'Basic algebraic concepts including equations, inequalities, and functions',
    duration: 45,
    initialDifficulty: 2,
  },
  'physics-101': {
    id: 'physics-101',
    title: 'Mechanics Basics',
    subject: 'Physics',
    topic: 'Mechanics',
    description: 'Introduction to forces, motion, and energy concepts',
    duration: 60,
    initialDifficulty: 3,
  },
};

export const ExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [showStartDialog, setShowStartDialog] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [examData, setExamData] = useState<typeof mockExamData[keyof typeof mockExamData] | null>(null);

  useEffect(() => {
    if (!examId || !mockExamData[examId as keyof typeof mockExamData]) {
      navigate('/exams');
      return;
    }
    setExamData(mockExamData[examId as keyof typeof mockExamData]);
  }, [examId, navigate]);

  const handleStartExam = () => {
    setShowStartDialog(false);
    setExamStarted(true);
  };

  const handleExitExam = () => {
    navigate('/exams');
  };

  if (!examData) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {!examStarted ? (
        <Dialog 
          open={showStartDialog} 
          onClose={() => navigate('/exams')}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5">{examData.title}</Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <Typography variant="body1" color="text.secondary">
                {examData.description}
              </Typography>

              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">
                    Subject: {examData.subject}
                  </Typography>
                  <Typography variant="subtitle2">
                    Topic: {examData.topic}
                  </Typography>
                  <Typography variant="subtitle2">
                    Duration: {examData.duration} minutes
                  </Typography>
                </Stack>
              </Box>

              <Typography variant="h6">Important Instructions:</Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <li>
                  <Typography>
                    This is an adaptive exam - questions will adjust to your performance
                  </Typography>
                </li>
                <li>
                  <Typography>
                    You can take breaks if needed - your progress will be saved
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Help and hints are available for each question
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Read each question carefully before answering
                  </Typography>
                </li>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Remember: This is an adaptive learning experience designed to help you improve.
                  Don't worry if questions become more challenging - that's part of the process!
                </Typography>
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleExitExam}
              variant="outlined"
              color="inherit"
            >
              Exit
            </Button>
            <Button 
              onClick={handleStartExam} 
              variant="contained"
              color="primary"
            >
              Start Exam
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <AdaptiveExamContainer
          studentId="mock-student-id"
          subjectId={examData.subject.toLowerCase()}
          topicId={examData.topic.toLowerCase()}
          initialDifficulty={examData.initialDifficulty}
        />
      )}
    </Box>
    </Container>
  );
};