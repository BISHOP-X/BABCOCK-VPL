import type { Course } from '@/types';

export const mockCourses: Course[] = [
  {
    id: 'crs-cs101',
    title: 'Introduction to Python Programming',
    code: 'CS101',
    language: 'python',
    description: 'A beginner-level course covering Python fundamentals including variables, data types, control flow, functions, and basic data structures.',
    semester: '2025/2026 - First Semester',
    lecturer_id: 'lec-001',
    created_at: '2025-08-15T08:00:00Z',
  },
  {
    id: 'crs-cs202',
    title: 'Advanced Java Programming',
    code: 'CS202',
    language: 'java',
    description: 'An intermediate course on Java covering object-oriented patterns, exception handling, generics, collections, and multithreading.',
    semester: '2025/2026 - First Semester',
    lecturer_id: 'lec-001',
    created_at: '2025-08-15T08:00:00Z',
  },
  {
    id: 'crs-cs303',
    title: 'System Programming in C++',
    code: 'CS303',
    language: 'cpp',
    description: 'An advanced course covering C++ systems programming including memory management, pointers, file I/O, and low-level data structures.',
    semester: '2025/2026 - First Semester',
    lecturer_id: 'lec-002',
    created_at: '2025-08-15T08:00:00Z',
  },
];
