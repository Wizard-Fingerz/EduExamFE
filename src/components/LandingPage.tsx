import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Typography, Paper, Grid, AppBar, Toolbar, CircularProgress, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import examService from '../services/examService';

const features = [
  {
    icon: <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />, 
    title: 'Track Your Progress',
    description: 'Monitor your learning journey and see your strengths and areas to improve.'
  },
  {
    icon: <AssessmentIcon color="secondary" sx={{ fontSize: 40 }} />, 
    title: 'Adaptive Exams',
    description: 'Take smart, adaptive exams tailored to your learning needs.'
  },
  {
    icon: <EmojiEventsIcon color="success" sx={{ fontSize: 40 }} />, 
    title: 'Achieve Excellence',
    description: 'Set goals, earn achievements, and reach your academic potential.'
  },
];

const testimonials = [
  {
    name: 'Jane Doe',
    quote: 'EduExam helped me boost my scores and confidence. The adaptive exams are a game changer!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5
  },
  {
    name: 'John Smith',
    quote: 'The analytics and progress tracking kept me motivated. I recommend EduExam to all my friends.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5
  },
  {
    name: 'Aisha Bello',
    quote: 'I love how easy it is to use and how much I learned. The best edtech platform I have tried!',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 5
  },
];

const partners = [
  'WAEC', 'NECO', 'JAMB', 'SAT', 'TOEFL', 'IELTS', 'IGCSE', 'NABTEB', 'GCE'
];

const faqs = [
  {
    question: 'What is EduExam?',
    answer: 'EduExam is a smart, adaptive learning and exam platform designed to help you prepare, practice, and excel in your exams.'
  },
  {
    question: 'How do I get started?',
    answer: 'Simply sign up for a free account, choose your exam type, and start practicing with adaptive exams.'
  },
  {
    question: 'Is EduExam free?',
    answer: 'EduExam offers both free and premium features. You can start for free and upgrade for advanced analytics and more.'
  },
  {
    question: 'Can I track my progress?',
    answer: 'Yes! EduExam provides detailed analytics and progress tracking so you can see your strengths and areas to improve.'
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [examTypes, setExamTypes] = useState<{ id: number; name: string }[]>([]);
  const [loadingExamTypes, setLoadingExamTypes] = useState(false);

  useEffect(() => {
    const fetchExamTypes = async () => {
      setLoadingExamTypes(true);
      try {
        const data = await examService.fetchAllExamTypes();
        setExamTypes(data.results || data);
      } catch {
        setExamTypes([]);
      } finally {
        setLoadingExamTypes(false);
      }
    };
    fetchExamTypes();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
      {/* AppBar/Nav */}
      <AppBar position="static" color="inherit" elevation={1} sx={{ mb: 0 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SchoolIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ letterSpacing: 1 }}>
              EduExam
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button color="primary" onClick={() => navigate('/login')}>Login</Button>
            <Button color="primary" variant="outlined" onClick={() => navigate('/register')}>Sign Up</Button>
            <Button color="primary" onClick={() => navigate('/help')}>Help</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <SchoolIcon sx={{ fontSize: 64, mb: 1 }} />
            <Typography variant="h2" fontWeight={800}>
              Welcome to EduExam
            </Typography>
            <Typography variant="h5" color="primary.contrastText" sx={{ opacity: 0.9 }}>
              The smart way to prepare, learn, and excel in your exams.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="outlined" color="inherit" size="large" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Partner/Recognition Bar */}
      <Box sx={{ bgcolor: 'grey.100', py: 2 }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" flexWrap="wrap">
            {partners.map((partner, idx) => (
              <Typography key={idx} variant="subtitle2" color="primary" sx={{ fontWeight: 700, opacity: 0.7, mx: 2 }}>
                {partner}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Exam Types Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
          Explore Our Exam Types
        </Typography>
        {loadingExamTypes ? (
          <Stack alignItems="center" py={4}><CircularProgress /></Stack>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {examTypes.map((type) => (
              <Grid item key={type.id} xs={6} sm={4} md={2}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'primary.50', fontWeight: 600 }}>
                  <Typography variant="subtitle1" color="primary.main" fontWeight={700}>{type.name}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
          Why Choose EduExam?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3, height: '100%' }}>
                {feature.icon}
                <Typography variant="h6" fontWeight={700} mt={2} mb={1}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
            What Our Learners Say
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {testimonials.map((t, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3, textAlign: 'center', height: '100%' }}>
                  <Avatar src={t.avatar} alt={t.name} sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }} />
                  <Typography variant="body1" fontStyle="italic" mb={2}>
                    "{t.quote}"
                  </Typography>
                  <Stack direction="row" spacing={0.5} justifyContent="center" mb={1}>
                    {[...Array(t.rating)].map((_, i) => (
                      <StarIcon key={i} color="warning" fontSize="small" />
                    ))}
                  </Stack>
                  <Typography variant="subtitle2" color="primary" fontWeight={700}>{t.name}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
            How It Works
          </Typography>
          <Stack spacing={4} alignItems="center">
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, maxWidth: 700 }}>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>1. Create an Account</Typography>
                <Typography variant="body1" color="text.secondary">Sign up and personalize your learning journey.</Typography>
                <Typography variant="h6" fontWeight={600}>2. Take Adaptive Exams</Typography>
                <Typography variant="body1" color="text.secondary">Practice with smart, tailored exams and get instant feedback.</Typography>
                <Typography variant="h6" fontWeight={600}>3. Track Your Progress</Typography>
                <Typography variant="body1" color="text.secondary">See your strengths, improve your weaknesses, and celebrate your achievements.</Typography>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Secondary CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h4" fontWeight={800}>
              Ready to Start Your Success Journey?
            </Typography>
            <Typography variant="h6" color="primary.contrastText" sx={{ opacity: 0.9 }}>
              Join thousands of learners who trust EduExam for their exam preparation.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/register')}>
                Get Started
              </Button>
              <Button variant="outlined" color="inherit" size="large" onClick={() => navigate('/login')}>
                Login
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
          Frequently Asked Questions
        </Typography>
        <Stack spacing={2}>
          {faqs.map((faq, idx) => (
            <Accordion key={idx}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={700}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'grey.100', py: 4, mt: 'auto' }}>
        <Container maxWidth="md">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="body2">&copy; {new Date().getFullYear()} EduExam. All rights reserved.</Typography>
            <Stack direction="row" spacing={2}>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Sign Up</Button>
              <Button color="inherit" onClick={() => navigate('/help')}>Help</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}; 