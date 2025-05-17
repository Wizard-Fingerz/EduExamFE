import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { ExamSessionComponent } from './ExamSession';
import type {
  ExamSession,
  QuestionAttempt,
  AdaptiveSettings,
  PerformanceMetrics,
  AdaptiveQuestion,
} from '../../types/adaptive-learning';

// Mock questions database
const mockQuestions: AdaptiveQuestion[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    difficulty: 2,
    content: {
      question: 'What is the primary function of photosynthesis in plants?',
      options: [
        'To produce oxygen only',
        'To convert light energy into chemical energy',
        'To absorb water from soil',
        'To release carbon dioxide'
      ],
      correctAnswer: 'To convert light energy into chemical energy',
      hints: [
        'Think about what plants need to grow',
        'Consider the role of sunlight in plant growth'
      ],
      explanation: 'Photosynthesis is the process by which plants convert light energy into chemical energy that can be used to fuel the organism\'s activities.',
      supportMaterial: [
        {
          type: 'image',
          url: '/assets/photosynthesis-diagram.png',
          description: 'Diagram showing the photosynthesis process'
        }
      ]
    },
    metadata: {
      topic: 'Biology',
      subtopic: 'Plant Processes',
      learningObjective: 'Understanding photosynthesis',
      skillLevel: 'basic'
    }
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    difficulty: 3,
    content: {
      question: 'Which of the following best describes the relationship between temperature and gas solubility in water?',
      options: [
        'As temperature increases, gas solubility increases',
        'As temperature increases, gas solubility decreases',
        'Temperature has no effect on gas solubility',
        'Gas solubility is only affected by pressure'
      ],
      correctAnswer: 'As temperature increases, gas solubility decreases',
      hints: [
        'Think about what happens to carbonated drinks when they warm up',
        'Consider the movement of gas molecules at different temperatures'
      ],
      explanation: 'As temperature increases, the kinetic energy of gas molecules increases, making them more likely to escape from the liquid, thus decreasing solubility.',
      supportMaterial: [
        {
          type: 'video',
          url: '/assets/gas-solubility.mp4',
          description: 'Video demonstration of temperature effects on gas solubility'
        }
      ]
    },
    metadata: {
      topic: 'Chemistry',
      subtopic: 'Gas Laws',
      learningObjective: 'Understanding gas solubility',
      skillLevel: 'intermediate'
    }
  },
  {
    id: 'q3',
    type: 'true-false',
    difficulty: 1,
    content: {
      question: 'The Earth rotates from East to West.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      hints: [
        'Think about where the sun rises and sets',
        'Consider the direction of day/night progression'
      ],
      explanation: 'The Earth rotates from West to East, which is why the Sun appears to rise in the East and set in the West.',
    },
    metadata: {
      topic: 'Geography',
      subtopic: 'Earth\'s Movements',
      learningObjective: 'Understanding Earth\'s rotation',
      skillLevel: 'basic'
    }
  }
];

interface AdaptiveExamContainerProps {
  studentId: string;
  subjectId: string;
  topicId: string;
  initialDifficulty?: number;
}

export const AdaptiveExamContainer: React.FC<AdaptiveExamContainerProps> = ({
  studentId,
  subjectId,
  topicId,
  initialDifficulty = 2,
}) => {
  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize exam session with adaptive settings
  useEffect(() => {
    const initializeExam = async () => {
      try {
        const mockExamSession: ExamSession = {
          id: `session-${Date.now()}`,
          studentId,
          subjectId,
          topicId,
          status: 'in-progress',
          startTime: new Date().toISOString(),
          timeAllowed: 45,
          questions: mockQuestions,
          currentQuestionIndex: 0,
          adaptiveSettings: {
            difficultyLevel: initialDifficulty,
            pacePreference: 'slow',
            requiresAdditionalSupport: false,
            preferredContentTypes: ['video', 'interactive'],
            accommodations: [
              { type: 'extendedTime', enabled: true },
              { type: 'visualAids', enabled: true },
              { type: 'simplifiedLanguage', enabled: true },
            ],
          },
          performance: {
            comprehensionRate: 0,
            completionTime: 0,
            attemptsCount: 0,
            accuracyRate: 0,
            confidenceLevel: 3,
          },
        };

        setExamSession(mockExamSession);
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize exam session');
        setLoading(false);
      }
    };

    initializeExam();
  }, [studentId, subjectId, topicId, initialDifficulty]);

  const adjustDifficulty = (performance: PerformanceMetrics): number => {
    const {
      comprehensionRate,
      accuracyRate,
      confidenceLevel,
      attemptsCount,
    } = performance;

    // Weighted scoring for difficulty adjustment
    const weights = {
      comprehension: 0.3,
      accuracy: 0.3,
      confidence: 0.2,
      attempts: 0.2,
    };

    const normalizedAttempts = Math.max(0, 1 - (attemptsCount - 1) * 0.2);
    const performanceScore =
      comprehensionRate * weights.comprehension +
      accuracyRate * weights.accuracy +
      (confidenceLevel / 5 * 100) * weights.confidence +
      normalizedAttempts * 100 * weights.attempts;

    // Determine new difficulty level (1-5)
    if (performanceScore >= 90) return Math.min(5, (examSession?.adaptiveSettings.difficultyLevel || 2) + 0.5);
    if (performanceScore >= 75) return examSession?.adaptiveSettings.difficultyLevel || 2;
    if (performanceScore >= 60) return Math.max(1, (examSession?.adaptiveSettings.difficultyLevel || 2) - 0.3);
    return Math.max(1, (examSession?.adaptiveSettings.difficultyLevel || 2) - 0.5);
  };

  const handleAnswer = async (attempt: QuestionAttempt) => {
    if (!examSession) return;

    try {
      // Update performance metrics
      const updatedPerformance: PerformanceMetrics = {
        ...examSession.performance,
        attemptsCount: examSession.performance.attemptsCount + 1,
        accuracyRate: (
          (examSession.performance.accuracyRate * examSession.performance.attemptsCount +
            (attempt.isCorrect ? 100 : 0)) /
          (examSession.performance.attemptsCount + 1)
        ),
        confidenceLevel: attempt.confidenceLevel,
        comprehensionRate: attempt.isCorrect ? 
          Math.min(100, examSession.performance.comprehensionRate + 10) : 
          Math.max(0, examSession.performance.comprehensionRate - 5),
        completionTime: examSession.performance.completionTime + attempt.timeSpent,
      };

      // Adjust difficulty based on performance
      const newDifficulty = adjustDifficulty(updatedPerformance);

      // Update adaptive settings
      const updatedSettings: AdaptiveSettings = {
        ...examSession.adaptiveSettings,
        difficultyLevel: newDifficulty,
        requiresAdditionalSupport: attempt.needsHelp || newDifficulty < 2,
        pacePreference: attempt.timeSpent > 120 ? 'slow' : attempt.timeSpent < 60 ? 'fast' : 'medium',
      };

      // Provide feedback based on performance
      if (!attempt.isCorrect && attempt.needsHelp) {
        setFeedback("Don't worry! Take your time and use the available hints if needed.");
      } else if (attempt.isCorrect && attempt.confidenceLevel > 4) {
        setFeedback("Excellent work! You're showing great understanding of the topic.");
      } else if (attempt.isCorrect) {
        setFeedback("Good job! Keep building your confidence.");
      }

      // Update exam session
      setExamSession({
        ...examSession,
        performance: updatedPerformance,
        adaptiveSettings: updatedSettings,
        currentQuestionIndex: examSession.currentQuestionIndex + 1,
        status: examSession.currentQuestionIndex + 1 >= examSession.questions.length ? 'completed' : 'in-progress',
      });
    } catch (err) {
      setError('Failed to process answer');
    }
  };

  const handleRequestHelp = () => {
    if (!examSession) return;

    setExamSession({
      ...examSession,
      adaptiveSettings: {
        ...examSession.adaptiveSettings,
        requiresAdditionalSupport: true,
        accommodations: [
          ...examSession.adaptiveSettings.accommodations,
          { type: 'stepByStep', enabled: true },
          { type: 'visualAids', enabled: true },
        ],
      },
    });

    setFeedback("I'll provide more detailed explanations and visual aids to help you understand better.");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (!examSession) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        Failed to load exam session
      </Alert>
    );
  }

  if (examSession.status === 'completed') {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="success">
          <AlertTitle>Exam Completed!</AlertTitle>
          <Typography>
            Final Score: {examSession.performance.accuracyRate.toFixed(1)}%
          </Typography>
          <Typography>
            Time Spent: {Math.round(examSession.performance.completionTime / 60)} minutes
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <ExamSessionComponent
        examSession={examSession}
        onAnswer={handleAnswer}
        onComplete={setExamSession}
        onRequestHelp={handleRequestHelp}
      />
      <Snackbar
        open={!!feedback}
        autoHideDuration={6000}
        onClose={() => setFeedback(null)}
        message={feedback}
      />
    </Box>
  );
}; 