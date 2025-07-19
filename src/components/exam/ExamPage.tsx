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
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import examService, {  Question } from '../../services/examService';

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
  const [answers, setAnswers] = useState<(number | string)[]>([]);
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
            question_type: string;
            choices: Array<{ choice_text: string; is_correct: boolean }>;
          }) => ({
            id: q.id,
            text: q.question_text,
            question_type: q.question_type,
            options: q.choices?.map((choice) => choice.choice_text) || [],
            correctAnswer: q.choices?.findIndex((choice) => choice.is_correct),
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

  const handleAnswerChange = (questionIndex: number, answer: number | string) => {
    const newAnswers = [...answers];
    if (typeof answer === 'number') {
      newAnswers[questionIndex] = answer;
    } else {
      newAnswers[questionIndex] = answer;
    }
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
    setSubmitting(true);
    
    try {
      setError(null);

      if (!examData || !attemptId) {
        throw new Error('Exam data or attempt ID is missing');
      }

      // Convert answers to the format expected by the API
      const formattedAnswers = answers.map((answer, index) => {
        const question = examData.questions[index];
        if (answer === -1) return null; // Skip unanswered questions

        return {
          question: question.id,
          answer_text: question.question_type === 'short_answer' ? answer : question.options?.[answer as number] ?? ''
        };
      }).filter((answer): answer is { question: number, answer_text: string } => answer !== null);

      if (formattedAnswers.length === 0) {
        throw new Error('Please answer at least one question before submitting');
      }

      // Submit the exam
      const result = await examService.submitExam(
        attemptId,
        formattedAnswers.map(ans => ({
          question: ans.question,
          answer_text: ans.answer_text,
          answer: ans.answer_text // Use answer_text as answer to satisfy type
        }))
      );
      console.log('Exam submission result:', result);
      if (!result || typeof result.score === 'undefined') {
        setError('Submission failed: Invalid response from server.');
        setSubmitting(false);
        return;
      }
      // Navigate to results page
      navigate(`/exam/result/${examData.id}`, { 
        state: { 
          score: result.score,
          totalQuestions: result.totalQuestions,
          passingScore: result.passingScore,
          attemptId: result.attemptId,
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

  return (
    <Container maxWidth="md">
      <Fade in timeout={800}>
        <Box sx={{ py: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Question {currentQuestion + 1} of {examData?.totalQuestions}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon color="primary" />
                <Typography variant="h6" color="primary">
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6">
                  {examData?.questions[currentQuestion].text}
                </Typography>

                {(() => {
                  const q = examData?.questions[currentQuestion];
                  if (!q) return null;
                  switch (q.question_type) {
                    case 'multiple_choice':
                      return (
                        <FormControl component="fieldset">
                          <RadioGroup
                            value={answers[currentQuestion]}
                            onChange={(e) => handleAnswerChange(currentQuestion, parseInt(e.target.value))}
                          >
                            {(q.options || []).map((option, index) => (
                              <FormControlLabel
                                key={index}
                                value={index}
                                control={<Radio />}
                                label={option}
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  '&:hover': {
                                    bgcolor: 'action.hover',
                                  },
                                }}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      );
                    case 'true_false':
                      return (
                        <FormControl component="fieldset">
                          <RadioGroup
                            value={answers[currentQuestion]}
                            onChange={(e) => handleAnswerChange(currentQuestion, parseInt(e.target.value))}
                          >
                            <FormControlLabel value={0} control={<Radio />} label="True" />
                            <FormControlLabel value={1} control={<Radio />} label="False" />
                          </RadioGroup>
                        </FormControl>
                      );
                    case 'short_answer':
                      return (
                        <FormControl fullWidth>
                          <textarea
                            value={answers[currentQuestion] === -1 ? '' : answers[currentQuestion]}
                            onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                            style={{ width: '100%', padding: 8, fontSize: 16, minHeight: 80 }}
                          />
                        </FormControl>
                      );
                    // Add more cases for other types if needed
                    default:
                      return <Typography color="error">Unknown question type</Typography>;
                  }
                })()}
              </Stack>
            </CardContent>
          </Card>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 3,
            gap: 2
          }}>
            <Button
              variant="outlined"
              startIcon={<PrevIcon />}
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion === (examData?.totalQuestions || 0) - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitExam}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Submitting...
                  </>
                ) : (
                  'Submit Exam'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<NextIcon />}
                onClick={handleNextQuestion}
              >
                Next
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" gutterBottom>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((currentQuestion + 1) / (examData?.totalQuestions || 1)) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}; 