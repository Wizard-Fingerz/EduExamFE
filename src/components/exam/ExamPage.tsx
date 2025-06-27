import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Container,
  Fade,
//   Zoom,
  Divider,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
//   FormLabel,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  ArrowBack,
  Save as SaveIcon,
  Check as SubmitIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import examService, { Answer, Question } from '../../services/examService';

interface ExamData {
  id: number;
  title: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  questions: Question[];
}

export const ExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
//   const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [examStarted, setExamStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!examId) {
          throw new Error('Exam ID is missing');
        }

        // Fetch exam details
        const exam = await examService.getExam(parseInt(examId));
        
        // No need to fetch questions separately as they are included in the exam object
        const examData: ExamData = {
          id: exam.id,
          title: exam.title,
          duration: parseInt(exam.duration.split(':')[0]) * 60 + parseInt(exam.duration.split(':')[1]), // Convert HH:MM to minutes
          totalQuestions: exam.questions.length,
          passingScore: exam.passing_marks,
          questions: exam.questions.map((q: { 
            id: number;
            question_text: string;
            choices: Array<{ choice_text: string; is_correct: boolean }>;
          }) => ({
            id: q.id,
            text: q.question_text,
            options: q.choices.map((choice) => choice.choice_text),
            correctAnswer: q.choices.findIndex((choice) => choice.is_correct)
          }))
        };

        setExamData(examData);
        setTimeLeft(examData.duration * 60);
        setAnswers(new Array(examData.totalQuestions).fill(-1));
      } catch (err) {
        console.error('Error fetching exam data:', err);
        setError('Failed to load exam data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (examStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const handleStartExam = async () => {
    try {
      if (!examData) return;
      
      // Start the exam attempt
      const attempt = await examService.startExam(examData.id);
      setAttemptId(attempt.id);
      setExamStarted(true);
    } catch (err) {
      console.error('Error starting exam:', err);
      setError('Failed to start exam. Please try again.');
    }
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (examData?.totalQuestions || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (submitting) return; // Prevent multiple submissions
    
    try {
      setSubmitting(true);
      setError(null);

      if (!examData || !attemptId) {
        throw new Error('Exam data or attempt ID is missing');
      }

      // Convert answers to the format expected by the API
      const formattedAnswers: Answer[] = answers.map((answer, index) => {
        const question = examData.questions[index];
        if (answer === -1) return null; // Skip unanswered questions
        
        return {
          question: question.id,
          answer: question.options?.[answer] ?? '' // Handle undefined options safely
        };
      }).filter((answer): answer is Answer => answer !== null); // Remove null answers

      if (formattedAnswers.length === 0) {
        throw new Error('Please answer at least one question before submitting');
      }

      // Submit the exam
      const result = await examService.submitExam(attemptId, formattedAnswers);
      
      // Navigate to results page
      navigate(`/exam/result/${examData.id}`, { 
        state: { 
          score: result.score,
          totalQuestions: examData.totalQuestions,
          passingScore: examData.passingScore,
          attemptId: attemptId,
          answers: formattedAnswers
        }
      });
    } catch (err) {
      console.error('Error submitting exam:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!examStarted) {
    return (
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Box sx={{ py: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <SchoolIcon sx={{ fontSize: 40 }} color="primary" />
              <Typography variant="h4" fontWeight="bold">
                {examData?.title}
              </Typography>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

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
                          Duration: {examData?.duration} minutes
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AssignmentIcon sx={{ mr: 1 }} color="primary" />
                        <Typography>
                          Questions: {examData?.totalQuestions}
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
                      <Typography variant="body2">
                        • You will have {examData?.duration} minutes to complete the exam
                      </Typography>
                      <Typography variant="body2">
                        • The exam consists of {examData?.totalQuestions} multiple-choice questions
                      </Typography>
                      <Typography variant="body2">
                        • Each question carries equal marks
                      </Typography>
                      <Typography variant="body2">
                        • You must score at least {examData?.passingScore}% to pass
                      </Typography>
                      <Typography variant="body2">
                        • You cannot leave the exam page once started
                      </Typography>
                      <Typography variant="body2">
                        • Ensure you have a stable internet connection
                      </Typography>
                      <Typography variant="body2">
                        • Do not refresh the page during the exam
                      </Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleStartExam}
                      sx={{ minWidth: 200 }}
                    >
                      Start Exam
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>
    );
  }

  const currentQ = examData?.questions[currentQuestion];
  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Button variant="text" color="primary" sx={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate(-1)}>
          <ArrowBack sx={{ mr: 1 }} />
          <Typography variant="body1">Back</Typography>
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="success" startIcon={<SubmitIcon />} onClick={handleSubmitExam} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </Button>
          <Button variant="contained" color="success" startIcon={<SaveIcon />}>Save & Exit</Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 3, gap: { xs: 3, md: 0 } }}>
        {/* Left: Question Area */}
        <Box sx={{ width: { xs: '100%', md: '50vw' }, bgcolor: 'white', p: { xs: 1, sm: 3 }, borderRadius: 2, boxShadow: 3, mx: 'auto', mb: { xs: 3, md: 0 } }}>
          <Typography variant="h4">{examData?.title}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Question {currentQuestion + 1} / {examData?.totalQuestions}</Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          <Typography variant="h6" sx={{ mb: 2 }}>{currentQ?.text}</Typography>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={answers[currentQuestion]}
              onChange={(e) => handleAnswerChange(currentQuestion, parseInt(e.target.value))}
            >
              {currentQ?.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={option}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: answers[currentQuestion] === index ? 'primary.50' : 'background.paper',
                    boxShadow: answers[currentQuestion] === index ? 2 : 0,
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color="success" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
              Previous
            </Button>
            <Button variant="contained" color="success" onClick={handleNextQuestion} disabled={currentQuestion === (examData?.totalQuestions || 0) - 1}>
              Next
            </Button>
          </Box>
          {/* Question Navigation Grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mt: 5 }}>
            {examData?.questions.map((q, idx) => (
              <Button
                key={q.id}
                variant={answers[idx] !== -1 ? 'contained' : 'outlined'}
                color={currentQuestion === idx ? 'primary' : answers[idx] !== -1 ? 'success' : 'secondary'}
                sx={{ m: 0.5, minWidth: 40, minHeight: 40, borderRadius: '50%' }}
                onClick={() => setCurrentQuestion(idx)}
              >
                {idx + 1}
              </Button>
            ))}
          </Box>
        </Box>
        {/* Right: Sidebar */}
        <Box sx={{ pl: { xs: 0, md: 2 }, width: { xs: '100%', md: 'auto' }, minWidth: 220 }}>
          <Paper sx={{ p: 3, mb: 3, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>Time Left</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <TimerIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" color="primary" fontWeight={700}>{formatTime(timeLeft)}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={((timeLeft / ((examData?.duration || 1) * 60)) * 100)} sx={{ height: 8, borderRadius: 4 }} />
          </Paper>
          {/* Calculator placeholder */}
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">Calculator</Typography>
            <Typography variant="caption" color="text.secondary">(Coming soon)</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}; 