import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  Mail as ContactIcon,
  AccessTime as TimeIcon,
  Psychology as AdaptiveIcon,
  Settings as TechnicalIcon,
} from '@mui/icons-material';

const faqs = [
  {
    category: 'Exam',
    questions: [
      {
        question: 'How does the adaptive difficulty work?',
        answer: 'The adaptive difficulty system adjusts question difficulty based on your performance. If you consistently answer questions correctly, the difficulty will gradually increase. If you struggle with questions, the system will provide easier questions and more support.',
      },
      {
        question: 'What happens if I lose internet connection during an exam?',
        answer: 'Don\'t worry! The system automatically saves your progress every time you answer a question. When you reconnect, you can continue from where you left off.',
      },
      {
        question: 'Can I go back to previous questions?',
        answer: 'To maintain the adaptive nature of the assessment, you cannot return to previous questions. Make sure to carefully consider your answers before moving forward.',
      },
    ],
  },
  {
    category: 'Learning',
    questions: [
      {
        question: 'How can I track my progress?',
        answer: 'You can view your progress in the Progress section, which shows detailed analytics of your performance across different subjects, including comprehension rates, accuracy, and areas for improvement.',
      },
      {
        question: 'What types of support are available while learning?',
        answer: 'We offer multiple forms of support including hints, step-by-step explanations, visual aids, and simplified content versions. You can customize these in your settings.',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        question: 'How do I change my accessibility settings?',
        answer: 'Go to Settings > Accessibility to customize options like extended time, larger text, high contrast mode, and screen reader support.',
      },
      {
        question: 'What browsers are supported?',
        answer: 'The platform works best on recent versions of Chrome, Firefox, Safari, and Edge. Make sure to keep your browser updated for the best experience.',
      },
    ],
  },
];

const guides = [
  {
    title: 'Getting Started Guide',
    description: 'Learn the basics of using the platform and customize your learning experience.',
    icon: <SchoolIcon />,
    type: 'Article',
  },
  {
    title: 'Understanding Adaptive Learning',
    description: 'Discover how our adaptive system personalizes your learning journey.',
    icon: <AdaptiveIcon />,
    type: 'Video',
  },
  {
    title: 'Exam Taking Tips',
    description: 'Best practices and strategies for taking adaptive exams.',
    icon: <TimeIcon />,
    type: 'Guide',
  },
  {
    title: 'Accessibility Features',
    description: 'Learn about all available accessibility features and how to use them.',
    icon: <TechnicalIcon />,
    type: 'Article',
  },
];

export const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        (!selectedCategory || category.category === selectedCategory) &&
        (!searchQuery || 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Stack spacing={4}>
        <Typography variant="h4" gutterBottom>
          Help Center
        </Typography>

        {/* Search and Filters */}
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={1}>
            {faqs.map(category => (
              <Chip
                key={category.category}
                label={category.category}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.category ? null : category.category
                )}
                color={selectedCategory === category.category ? 'primary' : 'default'}
              />
            ))}
          </Stack>
        </Stack>

        {/* Quick Help Guides */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Quick Help Guides
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3
          }}>
            {guides.map((guide, index) => (
              <Card key={index}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {guide.icon}
                      <Typography variant="subtitle1">
                        {guide.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {guide.description}
                    </Typography>
                    <Chip
                      size="small"
                      label={guide.type}
                      color={
                        guide.type === 'Video' ? 'error' :
                        guide.type === 'Article' ? 'primary' :
                        'default'
                      }
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* FAQs */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Frequently Asked Questions
          </Typography>
          {filteredFAQs.map((category) => (
            <Box key={category.category} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                {category.category}
              </Typography>
              {category.questions.map((faq, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}
        </Box>

        {/* Contact Support */}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ContactIcon color="primary" />
                <Typography variant="h6">Need More Help?</Typography>
              </Stack>
              <Typography variant="body1">
                Our support team is here to help you with any questions or issues you may have.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<ContactIcon />}
                  onClick={() => window.location.href = 'mailto:support@example.com'}
                >
                  Contact Support
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<VideoIcon />}
                >
                  Schedule Video Call
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}; 