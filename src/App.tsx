import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import CourseDetail from "./pages/CourseDetail";
import VirtualLab from "./pages/VirtualLab";
import SubmissionView from "./pages/SubmissionView";
import LecturerDashboard from "./pages/LecturerDashboard";
import LecturerCourseManagement from "./pages/LecturerCourseManagement";
import CreateCourse from "./pages/CreateCourse";
import CreateAssignment from "./pages/CreateAssignment";
import CodeReview from "./pages/CodeReview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected: Students */}
            <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/courses/:courseId" element={<ProtectedRoute allowedRole="student"><CourseDetail /></ProtectedRoute>} />
            <Route path="/student/submission/:submissionId" element={<ProtectedRoute allowedRole="student"><SubmissionView /></ProtectedRoute>} />
            <Route path="/lab/:courseId/:assignmentId" element={<ProtectedRoute allowedRole="student"><VirtualLab /></ProtectedRoute>} />

            {/* Protected: Lecturers */}
            <Route path="/lecturer" element={<ProtectedRoute allowedRole="lecturer"><LecturerDashboard /></ProtectedRoute>} />
            <Route path="/lecturer/courses/:courseId" element={<ProtectedRoute allowedRole="lecturer"><LecturerCourseManagement /></ProtectedRoute>} />
            <Route path="/lecturer/create-course" element={<ProtectedRoute allowedRole="lecturer"><CreateCourse /></ProtectedRoute>} />
            <Route path="/lecturer/create-assignment/:courseId" element={<ProtectedRoute allowedRole="lecturer"><CreateAssignment /></ProtectedRoute>} />
            <Route path="/lecturer/review/:submissionId" element={<ProtectedRoute allowedRole="lecturer"><CodeReview /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
</QueryClientProvider>
);

export default App;
