import type { RouteObject } from 'react-router-dom';
import { Login } from '../components/auth/Login';
import { Register } from '../components/auth/Register';
import { ForgotPassword } from '../components/auth/ForgotPassword';
import { Dashboard } from '../components/dashboard/Dashboard';
import { ExamList } from '../components/examination/ExamList';
import { ExamPage } from '../components/exam/ExamPage';
import { Courses } from '../components/courses/Courses';
import { Learning } from '../components/learning/Learning';
import { Progress } from '../components/progress/Progress';
import { Settings } from '../components/settings/Settings';
import { HelpCenter } from '../components/help/HelpCenter';
import { MainLayout } from '../components/layout/MainLayout';
import { StaffLayout } from '../components/layout/StaffLayout';
import { StaffDashboard } from '../components/staff/StaffDashboard';
import { ExamManagement } from '../components/staff/ExamManagement';
import { CourseManagement } from '../components/staff/CourseManagement';
import { StudentManagement } from '../components/staff/StudentManagement';
import { AssignmentManagement } from '../components/staff/AssignmentManagement';
import { AnalyticsDashboard } from '../components/staff/AnalyticsDashboard';
import { AuthLayout } from '../components/auth/AuthLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Helper component for role-based redirect
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  return user?.user_type === 'student' ? 
    <Navigate to="/dashboard" replace /> : 
    <Navigate to="/staff-dashboard" replace />;
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
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
];

// Student routes
const studentRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/exams',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ExamList />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/exam/:examId',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ExamPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/courses',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Courses />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/learning',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Learning />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/progress',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Progress />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Settings />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/help',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <HelpCenter />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
];

// Staff routes
const staffRoutes: RouteObject[] = [
  {
    path: '/staff-dashboard',
    element: (
      <ProtectedRoute>
        <StaffLayout>
          <StaffDashboard />
        </StaffLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/exams',
    element: (
      <ProtectedRoute>
        <StaffLayout>
          <ExamManagement />
        </StaffLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/courses',
    element: (
      <ProtectedRoute>
        <StaffLayout>
          <CourseManagement />
        </StaffLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/students',
    element: (
      <ProtectedRoute>
        <StaffLayout>
          <StudentManagement />
        </StaffLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/assignments',
    element: (
      <ProtectedRoute>
        <StaffLayout>
          <AssignmentManagement />
        </StaffLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/analytics',
    element: (
      <ProtectedRoute>
        <StaffLayout>
          <AnalyticsDashboard />
        </StaffLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/settings',
    element: (
      <ProtectedRoute>
        <StaffLayout>
          <Settings />
        </StaffLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/help',
    element: (
      <ProtectedRoute>
        <StaffLayout>
          <HelpCenter />
        </StaffLayout>
      </ProtectedRoute>
    ),
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