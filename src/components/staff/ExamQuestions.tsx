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
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  marks: number;
  order: number;
  choices?: Choice[];
}

interface Choice {
  id: number;
  choice_text: string;
  is_correct: boolean;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  course: any;
}

export const ExamQuestions: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionForm, setQuestionForm] = useState<{
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer';
    marks: number;
    order: number;
    choices: Choice[];
  }>({
    question_text: '',
    question_type: 'multiple_choice',
    marks: 1,
    order: 1,
    choices: [
      {
        choice_text: '', is_correct: false,
        id: 0
      },
      {
        choice_text: '', is_correct: false,
        id: 0
      },
      {
        choice_text: '', is_correct: false,
        id: 0
      },
      {
        choice_text: '', is_correct: false,
        id: 0
      },
    ],
  });

  useEffect(() => {
    if (examId) {
      fetchExamAndQuestions();
    }
  }, [examId]);

  const fetchExamAndQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const [examData, questionsData] = await Promise.all([
        staffService.getStaffExam(parseInt(examId!)),
        staffService.getExamQuestions(parseInt(examId!))
      ]);

      setExam(examData);
      setQuestions(questionsData);
    } catch (err) {
      console.error('Error fetching exam and questions:', err);
      setError('Failed to load exam and questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      question_text: '',
      question_type: 'multiple_choice',
      marks: 1,
      order: questions.length + 1,
      choices: [
        {
          choice_text: '', is_correct: false,
          id: 0
        },
        {
          choice_text: '', is_correct: false,
          id: 0
        },
        {
          choice_text: '', is_correct: false,
          id: 0
        },
        {
          choice_text: '', is_correct: false,
          id: 0
        },
      ],
    });
    setOpenQuestionDialog(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      question_text: question.question_text,
      question_type: question.question_type,
      marks: question.marks,
      order: question.order,
      choices: question.choices || [
        { choice_text: '', is_correct: false, id: 0 },
        { choice_text: '', is_correct: false, id: 0 },
        { choice_text: '', is_correct: false, id: 0 },
        { choice_text: '', is_correct: false, id: 0 },
      ],
    });
    setOpenQuestionDialog(true);
  };

  const handleSaveQuestion = async () => {
    try {
      if (editingQuestion) {
        const updatedQuestion = await staffService.updateExamQuestion(
          parseInt(examId!),
          editingQuestion.id,
          questionForm
        );
        setQuestions(questions.map(q => q.id === editingQuestion.id ? updatedQuestion : q));
      } else {
        const newQuestion = await staffService.createExamQuestion(
          parseInt(examId!),
          questionForm
        );
        setQuestions([...questions, newQuestion]);
      }
      setOpenQuestionDialog(false);
    } catch (err) {
      console.error('Error saving question:', err);
      setError('Failed to save question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await staffService.deleteExamQuestion(parseInt(examId!), questionId);
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
        <IconButton onClick={() => navigate('/staff/exams')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {exam?.title} - Questions Management
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">
          Questions ({questions.length})
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
        {questions.map((question, index) => (
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
                      <Chip label={`${question.marks} marks`} size="small" color="primary" />
                    </Stack>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {question.question_text}
                    </Typography>
                    {question.choices && question.choices.length > 0 && (
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
                </Select>
              </FormControl>

              <TextField
                label="Marks"
                type="number"
                value={questionForm.marks}
                onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) })}
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
                          value={choice.is_correct}
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