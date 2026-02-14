/**
 * Mock API service — mirrors future Supabase API calls.
 * Every function returns a Promise to match real async behaviour.
 * Swap this file for real Supabase queries in Phase 2.
 */

import type {
  User,
  Course,
  Enrollment,
  Assignment,
  Submission,
  Grade,
  CourseWithLecturer,
  EnrollmentWithCourse,
  AssignmentWithStatus,
  SubmissionWithDetails,
  CourseStats,
} from '@/types';

import {
  mockUsers,
  mockStudents,
  mockLecturers,
  mockCourses,
  mockEnrollments,
  mockAssignments,
  mockSubmissions,
  mockGrades,
} from '@/data';

// ---------- helpers ----------
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

const findUser = (id: string) => mockUsers.find((u) => u.id === id);
const findCourse = (id: string) => mockCourses.find((c) => c.id === id);

// ---------- Auth ----------
export async function loginUser(email: string, _password: string): Promise<User | null> {
  await delay();
  // Demo mode: try exact match first, otherwise return first student
  const exact = mockUsers.find((u) => u.email === email);
  if (exact) return exact;
  // Any email containing 'lec' or 'prof' → lecturer, otherwise → student
  const isLecturer = /lec|prof|staff/i.test(email);
  return isLecturer ? mockLecturers[0] : mockStudents[0];
}

export async function signupUser(
  email: string,
  _password: string,
  fullName: string,
  role: 'student' | 'lecturer',
): Promise<User> {
  await delay();
  const newUser: User = {
    id: `usr-${Date.now()}`,
    email,
    full_name: fullName,
    role,
    department: 'Computer Science',
    avatar_url: '',
    created_at: new Date().toISOString(),
  };
  return newUser;
}

// ---------- Users ----------
export async function getUserById(id: string): Promise<User | null> {
  await delay();
  return findUser(id) ?? null;
}

// ---------- Courses ----------
export async function getAllCourses(): Promise<CourseWithLecturer[]> {
  await delay();
  return mockCourses.map((c) => ({
    ...c,
    lecturer: findUser(c.lecturer_id) as User,
  }));
}

export async function getCourseById(id: string): Promise<CourseWithLecturer | null> {
  await delay();
  const course = findCourse(id);
  if (!course) return null;
  return { ...course, lecturer: findUser(course.lecturer_id) as User };
}

export async function getCoursesByLecturer(lecturerId: string): Promise<CourseWithLecturer[]> {
  await delay();
  return mockCourses
    .filter((c) => c.lecturer_id === lecturerId)
    .map((c) => ({ ...c, lecturer: findUser(c.lecturer_id) as User }));
}

// ---------- Enrollments ----------
export async function getEnrollmentsForStudent(
  studentId: string,
): Promise<EnrollmentWithCourse[]> {
  await delay();
  return mockEnrollments
    .filter((e) => e.student_id === studentId)
    .map((e) => {
      const course = findCourse(e.course_id)!;
      return {
        ...e,
        course: { ...course, lecturer: findUser(course.lecturer_id) as User },
      };
    });
}

export async function getStudentsForCourse(courseId: string): Promise<User[]> {
  await delay();
  const studentIds = mockEnrollments
    .filter((e) => e.course_id === courseId)
    .map((e) => e.student_id);
  return mockStudents.filter((s) => studentIds.includes(s.id));
}

// ---------- Assignments ----------
export async function getAssignmentsForCourse(courseId: string): Promise<Assignment[]> {
  await delay();
  return mockAssignments.filter((a) => a.course_id === courseId);
}

export async function getAssignmentsWithStatus(
  courseId: string,
  studentId: string,
): Promise<AssignmentWithStatus[]> {
  await delay();
  const assignments = mockAssignments.filter((a) => a.course_id === courseId);
  return assignments.map((a) => {
    const submission = mockSubmissions.find(
      (s) => s.assignment_id === a.id && s.student_id === studentId,
    );
    const grade = submission
      ? mockGrades.find((g) => g.submission_id === submission.id)
      : undefined;

    let status: AssignmentWithStatus['status'] = 'not-started';
    if (grade) status = 'graded';
    else if (submission) status = 'submitted';
    else if (new Date(a.due_date) < new Date()) status = 'overdue';
    else status = 'not-started';

    return { ...a, status, submission, grade };
  });
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  await delay();
  return mockAssignments.find((a) => a.id === id) ?? null;
}

// ---------- Submissions ----------
export async function getSubmissionsForAssignment(
  assignmentId: string,
): Promise<SubmissionWithDetails[]> {
  await delay();
  return mockSubmissions
    .filter((s) => s.assignment_id === assignmentId)
    .map((s) => {
      const student = findUser(s.student_id) as User;
      const assignment = mockAssignments.find((a) => a.id === s.assignment_id)!;
      const grade = mockGrades.find((g) => g.submission_id === s.id);
      return { ...s, student, assignment, grade };
    });
}

export async function getSubmissionByStudentAndAssignment(
  studentId: string,
  assignmentId: string,
): Promise<Submission | null> {
  await delay();
  return (
    mockSubmissions.find(
      (s) => s.student_id === studentId && s.assignment_id === assignmentId,
    ) ?? null
  );
}

export async function getSubmissionById(id: string): Promise<SubmissionWithDetails | null> {
  await delay();
  const sub = mockSubmissions.find((s) => s.id === id);
  if (!sub) return null;
  const student = findUser(sub.student_id) as User;
  const assignment = mockAssignments.find((a) => a.id === sub.assignment_id)!;
  const grade = mockGrades.find((g) => g.submission_id === sub.id);
  return { ...sub, student, assignment, grade };
}

export async function submitCode(
  assignmentId: string,
  studentId: string,
  code: string,
  language: string,
  output: string,
): Promise<Submission> {
  await delay();
  const submission: Submission = {
    id: `sub-${Date.now()}`,
    assignment_id: assignmentId,
    student_id: studentId,
    code,
    language: language as Submission['language'],
    output,
    submitted_at: new Date().toISOString(),
  };
  return submission;
}

// ---------- Grades ----------
export async function getGradesForStudent(
  studentId: string,
): Promise<(Grade & { submission: Submission; assignment: Assignment })[]> {
  await delay();
  const studentSubs = mockSubmissions.filter((s) => s.student_id === studentId);
  return studentSubs
    .map((sub) => {
      const grade = mockGrades.find((g) => g.submission_id === sub.id);
      if (!grade) return null;
      const assignment = mockAssignments.find((a) => a.id === sub.assignment_id)!;
      return { ...grade, submission: sub, assignment };
    })
    .filter(Boolean) as (Grade & { submission: Submission; assignment: Assignment })[];
}

export async function gradeSubmission(
  submissionId: string,
  score: number,
  feedback: string,
  graderId: string,
): Promise<Grade> {
  await delay();
  const grade: Grade = {
    id: `grd-${Date.now()}`,
    submission_id: submissionId,
    score,
    feedback,
    graded_by: graderId,
    graded_at: new Date().toISOString(),
  };
  return grade;
}

// ---------- Course Stats (Lecturer Dashboard) ----------
export async function getCourseStats(courseId: string): Promise<CourseStats> {
  await delay();
  const enrolled = mockEnrollments.filter((e) => e.course_id === courseId).length;
  const assignments = mockAssignments.filter((a) => a.course_id === courseId);
  const assignmentIds = assignments.map((a) => a.id);
  const submissions = mockSubmissions.filter((s) =>
    assignmentIds.includes(s.assignment_id),
  );
  const submissionIds = submissions.map((s) => s.id);
  const grades = mockGrades.filter((g) => submissionIds.includes(g.submission_id));
  const avgScore =
    grades.length > 0
      ? grades.reduce((sum, g) => sum + g.score, 0) / grades.length
      : 0;

  return {
    total_students: enrolled,
    total_assignments: assignments.length,
    total_submissions: submissions.length,
    average_score: Math.round(avgScore * 10) / 10,
  };
}
