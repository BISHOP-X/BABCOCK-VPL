/**
 * Supabase API service — real backend replacing mockApi.ts.
 * Same exported function signatures so pages don't need to change.
 *
 * Phase 2 — BABCOCK VPL
 */

import { supabase } from '@/lib/supabase';
import type {
  User,
  Course,
  Assignment,
  Submission,
  Grade,
  CourseWithLecturer,
  EnrollmentWithCourse,
  AssignmentWithStatus,
  SubmissionWithDetails,
  CourseStats,
  ProgrammingLanguage,
} from '@/types';

// ========== Auth ==========

export async function loginUser(
  email: string,
  password: string,
  _role?: 'student' | 'lecturer',
): Promise<User | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return profile as User | null;
}

export async function signupUser(
  email: string,
  password: string,
  fullName: string,
  role: 'student' | 'lecturer',
  extra?: { matric_number?: string; staff_id?: string; level?: string; department?: string },
): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        matric_number: extra?.matric_number,
        staff_id: extra?.staff_id,
        level: extra?.level,
        department: extra?.department ?? 'Computer Science',
      },
    },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Signup failed — no user returned');

  // The trigger creates the profile row automatically.
  // Small delay to let trigger execute, then fetch.
  await new Promise((r) => setTimeout(r, 500));

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return profile as User;
}

// ========== Users ==========

export async function getUserById(id: string): Promise<User | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
  return (data as User) ?? null;
}

// ========== Courses ==========

export async function getAllCourses(): Promise<CourseWithLecturer[]> {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*, lecturer:profiles!courses_lecturer_id_fkey(*)')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (courses ?? []) as CourseWithLecturer[];
}

export async function getCourseById(id: string): Promise<CourseWithLecturer | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*, lecturer:profiles!courses_lecturer_id_fkey(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as CourseWithLecturer;
}

export async function getCoursesByLecturer(lecturerId: string): Promise<CourseWithLecturer[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*, lecturer:profiles!courses_lecturer_id_fkey(*)')
    .eq('lecturer_id', lecturerId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as CourseWithLecturer[];
}

export async function createCourse(
  course: Omit<Course, 'id' | 'created_at'>,
): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Course;
}

// ========== Enrollments ==========

export async function getEnrollmentsForStudent(
  studentId: string,
): Promise<EnrollmentWithCourse[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(
        *,
        lecturer:profiles!courses_lecturer_id_fkey(*)
      )
    `)
    .eq('student_id', studentId)
    .eq('status', 'active');

  if (error) throw new Error(error.message);
  return (data ?? []) as EnrollmentWithCourse[];
}

export async function getStudentsForCourse(courseId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('student:profiles!enrollments_student_id_fkey(*)')
    .eq('course_id', courseId);

  if (error) throw new Error(error.message);
  return (data ?? []).map((d: any) => d.student) as User[];
}

// ========== Assignments ==========

export async function getAssignmentsForCourse(courseId: string): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('course_id', courseId)
    .order('week_number', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Assignment[];
}

export async function getAssignmentsWithStatus(
  courseId: string,
  studentId: string,
): Promise<AssignmentWithStatus[]> {
  // Get all assignments for the course
  const { data: assignments, error: aErr } = await supabase
    .from('assignments')
    .select('*')
    .eq('course_id', courseId)
    .order('week_number', { ascending: true });

  if (aErr) throw new Error(aErr.message);
  if (!assignments || assignments.length === 0) return [];

  // Get all submissions for this student in these assignments
  const assignmentIds = assignments.map((a: any) => a.id);
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('student_id', studentId)
    .in('assignment_id', assignmentIds);

  // Get grades for those submissions
  const submissionIds = (submissions ?? []).map((s: any) => s.id);
  const { data: grades } = submissionIds.length > 0
    ? await supabase.from('grades').select('*').in('submission_id', submissionIds)
    : { data: [] };

  return assignments.map((a: any) => {
    const submission = (submissions ?? []).find(
      (s: any) => s.assignment_id === a.id,
    );
    const grade = submission
      ? (grades ?? []).find((g: any) => g.submission_id === submission.id)
      : undefined;

    let status: AssignmentWithStatus['status'] = 'not-started';
    if (grade) status = 'graded';
    else if (submission) status = 'submitted';
    else if (new Date(a.due_date) < new Date()) status = 'overdue';

    return { ...a, status, submission, grade } as AssignmentWithStatus;
  });
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Assignment;
}

export async function createAssignment(
  assignment: Omit<Assignment, 'id' | 'created_at'>,
): Promise<Assignment> {
  const { data, error } = await supabase
    .from('assignments')
    .insert(assignment)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Assignment;
}

// ========== Submissions ==========

export async function getSubmissionsForAssignment(
  assignmentId: string,
): Promise<SubmissionWithDetails[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      student:profiles!submissions_student_id_fkey(*),
      assignment:assignments!submissions_assignment_id_fkey(*)
    `)
    .eq('assignment_id', assignmentId);

  if (error) throw new Error(error.message);

  // Attach grades
  const submissionIds = (data ?? []).map((s: any) => s.id);
  const { data: grades } = submissionIds.length > 0
    ? await supabase.from('grades').select('*').in('submission_id', submissionIds)
    : { data: [] };

  return (data ?? []).map((s: any) => ({
    ...s,
    grade: (grades ?? []).find((g: any) => g.submission_id === s.id),
  })) as SubmissionWithDetails[];
}

export async function getSubmissionByStudentAndAssignment(
  studentId: string,
  assignmentId: string,
): Promise<Submission | null> {
  const { data } = await supabase
    .from('submissions')
    .select('*')
    .eq('student_id', studentId)
    .eq('assignment_id', assignmentId)
    .maybeSingle();

  return (data as Submission) ?? null;
}

export async function getSubmissionById(id: string): Promise<SubmissionWithDetails | null> {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      student:profiles!submissions_student_id_fkey(*),
      assignment:assignments!submissions_assignment_id_fkey(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;

  // Attach grade if exists
  const { data: grade } = await supabase
    .from('grades')
    .select('*')
    .eq('submission_id', id)
    .maybeSingle();

  return { ...data, grade: grade ?? undefined } as SubmissionWithDetails;
}

export async function submitCode(
  assignmentId: string,
  studentId: string,
  code: string,
  language: string,
  output: string,
): Promise<Submission> {
  // Upsert: if student already submitted for this assignment, update it
  const { data, error } = await supabase
    .from('submissions')
    .upsert(
      {
        assignment_id: assignmentId,
        student_id: studentId,
        code,
        language,
        output,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: 'assignment_id,student_id' },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Submission;
}

// ========== Grades ==========

export async function getGradesForStudent(
  studentId: string,
): Promise<(Grade & { submission: Submission; assignment: Assignment })[]> {
  // Get all student's submissions
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('student_id', studentId);

  if (!submissions || submissions.length === 0) return [];

  const submissionIds = submissions.map((s: any) => s.id);
  const assignmentIds = [...new Set(submissions.map((s: any) => s.assignment_id))];

  // Get grades + assignments
  const [gradesRes, assignmentsRes] = await Promise.all([
    supabase.from('grades').select('*').in('submission_id', submissionIds),
    supabase.from('assignments').select('*').in('id', assignmentIds),
  ]);

  return (gradesRes.data ?? [])
    .map((grade: any) => {
      const submission = submissions.find((s: any) => s.id === grade.submission_id);
      const assignment = (assignmentsRes.data ?? []).find(
        (a: any) => a.id === submission?.assignment_id,
      );
      if (!submission || !assignment) return null;
      return { ...grade, submission, assignment };
    })
    .filter(Boolean) as (Grade & { submission: Submission; assignment: Assignment })[];
}

export async function gradeSubmission(
  submissionId: string,
  score: number,
  feedback: string,
  graderId: string,
): Promise<Grade> {
  const { data, error } = await supabase
    .from('grades')
    .upsert(
      {
        submission_id: submissionId,
        score,
        feedback,
        graded_by: graderId,
        graded_at: new Date().toISOString(),
      },
      { onConflict: 'submission_id' },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Grade;
}

// ========== Course Stats ==========

export async function getCourseStats(courseId: string): Promise<CourseStats> {
  // Parallel queries
  const [enrollRes, assignRes] = await Promise.all([
    supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', courseId),
    supabase
      .from('assignments')
      .select('id')
      .eq('course_id', courseId),
  ]);

  const totalStudents = enrollRes.count ?? 0;
  const assignmentIds = (assignRes.data ?? []).map((a: any) => a.id);
  const totalAssignments = assignmentIds.length;

  if (totalAssignments === 0) {
    return { total_students: totalStudents, total_assignments: 0, total_submissions: 0, average_score: 0 };
  }

  const { data: submissions } = await supabase
    .from('submissions')
    .select('id')
    .in('assignment_id', assignmentIds);

  const totalSubmissions = (submissions ?? []).length;
  const submissionIds = (submissions ?? []).map((s: any) => s.id);

  if (submissionIds.length === 0) {
    return { total_students: totalStudents, total_assignments: totalAssignments, total_submissions: 0, average_score: 0 };
  }

  const { data: grades } = await supabase
    .from('grades')
    .select('score')
    .in('submission_id', submissionIds);

  const avgScore =
    grades && grades.length > 0
      ? grades.reduce((sum: number, g: any) => sum + g.score, 0) / grades.length
      : 0;

  return {
    total_students: totalStudents,
    total_assignments: totalAssignments,
    total_submissions: totalSubmissions,
    average_score: Math.round(avgScore * 10) / 10,
  };
}
