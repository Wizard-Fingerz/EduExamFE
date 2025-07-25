import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import staffService from '../../services/staffService';

interface Question {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  points: number;
  order: number;
  choices?: Choice[];
}

interface Choice {
  id: number;
  choice_text: string;
  is_correct: boolean;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  syllabus: any;
}

export const QuizQuestionsManagement: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionForm, setQuestionForm] = useState<{
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
    points: number;
    order: number;
    choices: { choice_text: string; is_correct: boolean }[];
  }>({
    question_text: '',
    question_type: 'multiple_choice',
    points: 1,
    order: 1,
    choices: [
      { choice_text: '', is_correct: false },
      { choice_text: '', is_correct: false },
      { choice_text: '', is_correct: false },
      { choice_text: '', is_correct: false },
    ],
  });

  useEffect(() => {
    if (quizId) {
      fetchQuizAndQuestions();
    }
  }, [quizId]);

  const fetchQuizAndQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const [quizData, questionsData] = await Promise.all([
        staffService.getStaffQuiz(parseInt(quizId!)),
        staffService.getQuizQuestions(parseInt(quizId!))
      ]);

      setQuiz(quizData);
      
      // Ensure questions is always an array
      if (Array.isArray(questionsData)) {
        setQuestions(questionsData);
      } else if (questionsData && questionsData.results && Array.isArray(questionsData.results)) {
        setQuestions(questionsData.results);
      } else {
        console.warn('Unexpected questions data format:', questionsData);
        setQuestions([]);
      }
    } catch (err) {
      console.error('Error fetching quiz and questions:', err);
      setError('Failed to load quiz and questions. Please try again later.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      order: (Array.isArray(questions) ? questions.length : 0) + 1,
      choices: [
        { choice_text: '', is_correct: false },
        { choice_text: '', is_correct: false },
        { choice_text: '', is_correct: false },
        { choice_text: '', is_correct: false },
      ],
    });
    setOpenQuestionDialog(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      question_text: question.question_text,
      question_type: question.question_type,
      points: question.points,
      order: question.order,
      choices: question.choices || [
        { choice_text: '', is_correct: false },
        { choice_text: '', is_correct: false },
        { choice_text: '', is_correct: false },
        { choice_text: '', is_correct: false },
      ],
    });
    setOpenQuestionDialog(true);
  };

  const handleSaveQuestion = async () => {
    try {
      // Filter out empty choices for multiple choice questions
      let processedForm = { ...questionForm };
      
      if (questionForm.question_type === 'multiple_choice') {
        // Filter out choices with empty text
        const filteredChoices = questionForm.choices.filter(choice => 
          choice.choice_text && choice.choice_text.trim() !== ''
        );
        
        // Ensure at least 2 choices for multiple choice questions
        if (filteredChoices.length < 2) {
          setError('Multiple choice questions must have at least 2 choices.');
          return;
        }
        
        // Ensure exactly one correct answer
        const correctChoices = filteredChoices.filter(choice => choice.is_correct);
        if (correctChoices.length !== 1) {
          setError('Multiple choice questions must have exactly one correct answer.');
          return;
        }
        
        processedForm.choices = filteredChoices;
      }
      
      if (editingQuestion) {
        const updatedQuestion = await staffService.updateQuizQuestion(
          parseInt(quizId!),
          editingQuestion.id,
          processedForm
        );
        setQuestions(questions.map(q => q.id === editingQuestion.id ? updatedQuestion : q));
      } else {
        const newQuestion = await staffService.createQuizQuestion(
          parseInt(quizId!),
          processedForm
        );
        setQuestions([...questions, newQuestion]);
      }
      setOpenQuestionDialog(false);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('Error saving question:', err);
      if (err.response?.data) {
        // Handle backend validation errors
        const errorData = err.response.data;
        if (errorData.choices) {
          setError('Please fill in all choice text fields.');
        } else {
          setError(err.response.data.detail || 'Failed to save question. Please try again.');
        }
      } else {
        setError('Failed to save question. Please try again.');
      }
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await staffService.deleteQuizQuestion(parseInt(quizId!), questionId);
        setQuestions(questions.filter(q => q.id !== questionId));
      } catch (err) {
        console.error('Error deleting question:', err);
        setError('Failed to delete question. Please try again.');
      }
    }
  };

  const updateChoice = (index: number, field: keyof Choice, value: any) => {
    const newChoices = [...questionForm.choices];
    newChoices[index] = { ...newChoices[index], [field]: value };
    setQuestionForm({ ...questionForm, choices: newChoices });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
   
    <Box sx={{ py: 4,  px: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate('/staff/quiz')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {quiz?.title} - Questions Management
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">
          Questions ({Array.isArray(questions) ? questions.length : 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
      </Stack>

      <Stack spacing={2}>
        {Array.isArray(questions) && questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                      <Typography variant="h6">
                        Question {index + 1}
                      </Typography>
                      <Chip label={question.question_type.replace('_', ' ')} size="small" />
                      <Chip label={`${question.points} points`} size="small" color="primary" />
                    </Stack>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {question.question_text}
                    </Typography>
                    {question.question_type === 'multiple_choice' && question.choices && question.choices.length > 0 && (
                      <Stack spacing={1}>
                        {question.choices.map((choice, choiceIndex) => (
                          <Typography
                            key={choiceIndex}
                            variant="body2"
                            sx={{
                              pl: 2,
                              color: choice.is_correct ? 'success.main' : 'text.primary',
                              fontWeight: choice.is_correct ? 'bold' : 'normal',
                            }}
                          >
                            {String.fromCharCode(65 + choiceIndex)}. {choice.choice_text}
                            {choice.is_correct && ' ✓'}
                          </Typography>
                        ))}
                      </Stack>
                    )}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleEditQuestion(question)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteQuestion(question.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Question Dialog */}
      <Dialog
        open={openQuestionDialog}
        onClose={() => setOpenQuestionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Add Question'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Question Text"
              value={questionForm.question_text}
              onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={questionForm.question_type}
                  label="Question Type"
                  onChange={(e) => setQuestionForm({ ...questionForm, question_type: e.target.value as any })}
                >
                  <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                  <MenuItem value="true_false">True/False</MenuItem>
                  <MenuItem value="short_answer">Short Answer</MenuItem>
                  <MenuItem value="essay">Essay</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Points"
                type="number"
                value={questionForm.points}
                onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}
                sx={{ minWidth: 120 }}
              />

              <TextField
                label="Order"
                type="number"
                value={questionForm.order}
                onChange={(e) => setQuestionForm({ ...questionForm, order: parseInt(e.target.value) })}
                sx={{ minWidth: 120 }}
              />
            </Stack>

            {questionForm.question_type === 'multiple_choice' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Choices
                </Typography>
                <Stack spacing={2}>
                  {questionForm.choices.map((choice, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="center">
                      <TextField
                        label={`Choice ${index + 1}`}
                        value={choice.choice_text}
                        onChange={(e) => updateChoice(index, 'choice_text', e.target.value)}
                        fullWidth
                      />
                      <FormControl>
                        <InputLabel>Correct</InputLabel>
                        <Select
                          value={choice.is_correct ? "true" : "false"}
                          label="Correct"
                          onChange={(e) => updateChoice(index, 'is_correct', e.target.value === "true")}
                          sx={{ minWidth: 100 }}
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQuestionDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveQuestion} variant="contained">
            {editingQuestion ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 