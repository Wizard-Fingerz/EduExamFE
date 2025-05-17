import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';
import {
  Help as HelpIcon,
  AccessTime as TimeIcon,
  Lightbulb as HintIcon,
  VolumeUp as AudioIcon,
  Flag as FlagIcon,
  Image as ImageIcon,
  PlayArrow as VideoIcon,
} from '@mui/icons-material';
import type {
  ExamSession,
  QuestionAttempt,
} from '../../types/adaptive-learning';

interface ExamSessionProps {
  examSession: ExamSession;
  onAnswer: (attempt: QuestionAttempt) => void;
  onComplete: (session: ExamSession) => void;
  onRequestHelp: () => void;
}

export const ExamSessionComponent: React.FC<ExamSessionProps> = ({
  examSession,
  onAnswer,
  onRequestHelp,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>([]);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(3);
  const [showSupportMaterial, setShowSupportMaterial] = useState(false);
  const [currentSupportMaterial, setCurrentSupportMaterial] = useState<{
    type: string;
    url?: string;
    description: string;
  } | null>(null);

  const currentQuestion = examSession.questions[examSession.currentQuestionIndex];

  useEffect(() => {
    setTimeRemaining(examSession.timeAllowed * 60);
    setSelectedAnswer([]);
    setConfidenceLevel(3);
    setShowHint(false);
  }, [examSession.currentQuestionIndex, examSession.timeAllowed]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = () => {
    if (!currentQuestion) return;

    const attempt: QuestionAttempt = {
      timestamp: new Date().toISOString(),
      answer: selectedAnswer,
      isCorrect: Array.isArray(currentQuestion.content.correctAnswer)
        ? currentQuestion.content.correctAnswer.every((ans) => selectedAnswer.includes(ans))
        : selectedAnswer === currentQuestion.content.correctAnswer,
      timeSpent: examSession.timeAllowed * 60 - timeRemaining,
      confidenceLevel,
      needsHelp: showHint,
      hintUsed: showHint,
    };

    onAnswer(attempt);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSupportMaterialClick = (material: { type: string; url?: string; description: string }) => {
    setCurrentSupportMaterial(material);
    setShowSupportMaterial(true);
  };

  if (!currentQuestion) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Question {examSession.currentQuestionIndex + 1} of {examSession.questions.length}
        </Typography>
        <Chip
          icon={<TimeIcon />}
          label={formatTime(timeRemaining)}
          color={timeRemaining < 300 ? 'error' : 'default'}
        />
        <Tooltip title="Request help">
          <IconButton onClick={onRequestHelp} color="primary">
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Progress */}
      <LinearProgress
        variant="determinate"
        value={(examSession.currentQuestionIndex / examSession.questions.length) * 100}
        sx={{ mb: 3, height: 8, borderRadius: 4 }}
      />

      {/* Question Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            {/* Question Metadata */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                size="small"
                label={`Difficulty: ${currentQuestion.difficulty}`}
                color={currentQuestion.difficulty > 3 ? 'error' : 'primary'}
              />
              <Chip
                size="small"
                label={currentQuestion.metadata.topic}
                icon={<FlagIcon />}
              />
              <Chip
                size="small"
                label={currentQuestion.metadata.skillLevel}
                variant="outlined"
              />
            </Stack>

            {/* Question Text */}
            <Typography variant="body1">
              {currentQuestion.content.question}
            </Typography>

            {/* Question Content */}
            <Stack spacing={2}>
              {currentQuestion.type === 'multiple-choice' && (
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                >
                  {currentQuestion.content.options?.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'true-false' && (
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                >
                  <FormControlLabel value="True" control={<Radio />} label="True" />
                  <FormControlLabel value="False" control={<Radio />} label="False" />
                </RadioGroup>
              )}

              {currentQuestion.type === 'short-answer' && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Type your answer here..."
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
              )}
            </Stack>

            {/* Support Materials */}
            {currentQuestion.content.supportMaterial && (
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Stack spacing={2}>
                  <Typography variant="subtitle2">Additional Resources:</Typography>
                  <Stack direction="row" spacing={1}>
                    {currentQuestion.content.supportMaterial.map((material, index) => (
                      <Tooltip key={index} title={material.description}>
                        <IconButton
                          onClick={() => handleSupportMaterialClick(material)}
                          color="primary"
                        >
                          {material.type === 'video' && <VideoIcon />}
                          {material.type === 'audio' && <AudioIcon />}
                          {material.type === 'image' && <ImageIcon />}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            )}

            <Divider />

            {/* Confidence Rating */}
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                How confident are you about your answer?
              </Typography>
              <Rating
                value={confidenceLevel}
                onChange={(_, value) => setConfidenceLevel(value || 3)}
                max={5}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Actions */}
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<HintIcon />}
            variant="outlined"
            onClick={() => setShowHint(true)}
            disabled={showHint}
          >
            Need a Hint?
          </Button>
        </Stack>
        <Button
          variant="contained"
          onClick={handleAnswer}
          disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && !selectedAnswer.length)}
          size="large"
        >
          Submit Answer
        </Button>
      </Stack>

      {/* Hint Dialog */}
      <Dialog open={showHint} onClose={() => setShowHint(false)}>
        <DialogTitle>Hint</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {currentQuestion.content.hints.map((hint, index) => (
              <Typography key={index}>• {hint}</Typography>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHint(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Support Material Dialog */}
      <Dialog
        open={showSupportMaterial}
        onClose={() => setShowSupportMaterial(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Additional Resource</DialogTitle>
        <DialogContent>
          {currentSupportMaterial?.type === 'image' && (
            <Box
              component="img"
              src={currentSupportMaterial.url}
              alt={currentSupportMaterial.description}
              sx={{ width: '100%', height: 'auto' }}
            />
          )}
          {currentSupportMaterial?.type === 'video' && (
            <Box
              component="video"
              src={currentSupportMaterial.url}
              controls
              sx={{ width: '100%' }}
            />
          )}
          {currentSupportMaterial?.type === 'audio' && (
            <Box
              component="audio"
              src={currentSupportMaterial.url}
              controls
              sx={{ width: '100%' }}
            />
          )}
          <Typography sx={{ mt: 2 }}>
            {currentSupportMaterial?.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSupportMaterial(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 