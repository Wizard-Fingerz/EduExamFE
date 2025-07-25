import type { RouteObject } from 'react-router-dom';
import { Login } from '../components/auth/Login';
import { Register } from '../components/auth/Register';
import { ForgotPassword } from '../components/auth/ForgotPassword';
import { Dashboard } from '../components/dashboard/Dashboard';
import { ExamList } from '../components/examination/ExamList';
import { ExamPage } from '../components/exam/ExamPage';
// import { Syllabus } from '../components/syllabus/Syllabus';
import { Learning } from '../components/learning/Learning';
import { Progress } from '../components/progress/Progress';
import { Settings } from '../components/settings/Settings';
import { HelpCenter } from '../components/help/HelpCenter';
import { MainLayout } from '../components/layout/MainLayout';
import { StaffLayout } from '../components/layout/StaffLayout';
import { StaffDashboard } from '../components/staff/StaffDashboard';
import { ExamManagement } from '../components/staff/ExamManagement';
import { ExamQuestionsManagement } from '../components/staff/ExamQuestionsManagement';
// import { QuizManagement } from '../components/staff/QuizManagement';
// import { QuizQuestionsManagement } from '../components/staff/QuizQuestionsManagement';
// import { SyllabusManagement } from '../components/staff/SyllabusManagement';
import { StudentManagement } from '../components/staff/StudentManagement';
import { AnalyticsDashboard } from '../components/staff/AnalyticsDashboard';
import { AuthLayout } from '../components/auth/AuthLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProfileSetup } from '../components/auth/ProfileSetup';
import { LandingPage } from '../components/LandingPage';
import { QuizManagement } from '../components/staff/QuizManagement';
import { QuizQuestionsManagement } from '../components/staff/QuizQuestionsManagement';
import { Syllabus } from '../components/syllabus/Syllabus';
import { SyllabusManagement } from '../components/staff/SyllabusManagement';

// Helper component for role-based redirect
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  return user?.user_type === 'student' ? 
    <Navigate to="/dashboard" replace /> : 
    <Navigate to="/staff/dashboard" replace />;
};

// Public routes that don't require authentication
export const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
  },
  {
    path: '/',
    element: (
      <LandingPage />
    ),
  },
  {
    path: '/profile-setup',
    element: (
      <AuthLayout>
        <ProfileSetup />
      </AuthLayout>
    ),
  },
];

// Student routes
const studentRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'exams', element: <ExamList /> },
      { path: 'exam/:examId', element: <ExamPage /> },
      { path: 'syllabus', element: <Syllabus /> },
      { path: 'learning', element: <Learning /> },
      { path: 'progress', element: <Progress /> },
      { path: 'settings', element: <Settings /> },
      { path: 'help', element: <HelpCenter /> },
    ],
  },
];

// Staff routes
const staffRoutes: RouteObject[] = [
  {
    path: '/staff',
    element: (
      <ProtectedRoute>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <StaffDashboard /> },
      { path: 'exams', element: <ExamManagement /> },
      { path: 'exams/:examId/questions', element: <ExamQuestionsManagement /> },
      { path: 'quiz', element: <QuizManagement /> },
      { path: 'quiz/:quizId/questions', element: <QuizQuestionsManagement /> },
      { path: 'syllabus', element: <SyllabusManagement /> },
      { path: 'students', element: <StudentManagement /> },
      { path: 'analytics', element: <AnalyticsDashboard /> },
      { path: 'settings', element: <Settings /> },
      { path: 'help', element: <HelpCenter /> },
    ],
  },
];

// Protected routes that require authentication
export const protectedRoutes: RouteObject[] = [
  // Redirect root to appropriate dashboard based on role
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RoleBasedRedirect />
      </ProtectedRoute>
    ),
  },
  ...studentRoutes,
  ...staffRoutes,
]; 