// ==========================================
// VPL Type Definitions
// Maps 1:1 to future Supabase tables
// ==========================================

export type UserRole = 'student' | 'lecturer';

export type AssignmentStatus = 'not_started' | 'not-started' | 'in_progress' | 'submitted' | 'graded' | 'overdue';

export type EnrollmentStatus = 'active' | 'archived';

export type ProgrammingLanguage = 'python' | 'java' | 'cpp';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  matric_number?: string;    // students only
  staff_id?: string;         // lecturers only
  department: string;
  avatar_url?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;              // e.g., "CS101"
  language: ProgrammingLanguage;
  description: string;
  semester: string;          // e.g., "2025/2026 - First Semester"
  lecturer_id: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  week_number: number;
  due_date: string;
  tasks: AssignmentTask[];
  expected_output?: string;
  created_at: string;
}

export interface AssignmentTask {
  id: string;
  description: string;
  hint?: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  code: string;
  language: ProgrammingLanguage;
  output: string;
  submitted_at: string;
}

export interface Grade {
  id: string;
  submission_id: string;
  score: number;             // 0-100
  feedback: string;
  graded_by: string;         // lecturer user id
  graded_at: string;
}

// ==========================================
// Derived / Joined types for UI convenience
// ==========================================

export interface CourseWithLecturer extends Course {
  lecturer: User;
}

export interface EnrollmentWithCourse extends Enrollment {
  course: CourseWithLecturer;
}

export interface AssignmentWithStatus extends Assignment {
  status: AssignmentStatus;
  submission?: Submission;
  grade?: Grade;
}

export interface SubmissionWithDetails extends Submission {
  assignment: Assignment;
  student: User;
  grade?: Grade;
}

export interface CourseStats {
  total_students: number;
  total_assignments: number;
  total_submissions: number;
  average_score: number;
}

// ==========================================
// Auth types
// ==========================================

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: UserRole;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  matric_number?: string;
  staff_id?: string;
  department?: string;
}
