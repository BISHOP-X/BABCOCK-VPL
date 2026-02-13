import type { Grade } from '@/types';

export const mockGrades: Grade[] = [
  // Alex Chen — Python Week 1
  {
    id: 'grd-001',
    submission_id: 'sub-001',
    score: 95,
    feedback: 'Excellent work! Clean code, proper use of f-strings, and all variables correctly typed. Minor suggestion: add comments explaining each data type.',
    graded_by: 'lec-001',
    graded_at: '2026-02-07T10:00:00Z',
  },
  // Alex Chen — Python Week 2
  {
    id: 'grd-002',
    submission_id: 'sub-002',
    score: 88,
    feedback: 'Good implementation of conditionals. The logic is correct and handles all grade boundaries. Consider adding input validation for scores outside 0-100 range.',
    graded_by: 'lec-001',
    graded_at: '2026-02-13T09:00:00Z',
  },
  // Emma Wilson — Python Week 1
  {
    id: 'grd-003',
    submission_id: 'sub-003',
    score: 98,
    feedback: 'Outstanding! All tasks completed correctly. Very clean and readable code. The use of print() with comma separation is perfectly valid.',
    graded_by: 'lec-001',
    graded_at: '2026-02-07T10:30:00Z',
  },
  // Liam Johnson — Python Week 1
  {
    id: 'grd-004',
    submission_id: 'sub-004',
    score: 85,
    feedback: 'Good job overall. All required variables declared and printed correctly. The variable naming (my_age, my_name) works but standard Python convention prefers simpler names.',
    graded_by: 'lec-001',
    graded_at: '2026-02-07T11:00:00Z',
  },
  // Emma Wilson — Java Week 1
  {
    id: 'grd-005',
    submission_id: 'sub-005',
    score: 92,
    feedback: 'Excellent Java implementation. Good use of constructor, proper toString() override. Consider adding getters/setters for encapsulation practice.',
    graded_by: 'lec-001',
    graded_at: '2026-02-08T14:00:00Z',
  },
  // William Miller — Python Week 1
  {
    id: 'grd-006',
    submission_id: 'sub-006',
    score: 78,
    feedback: 'Solid work. All tasks completed. F-strings used correctly. Would improve with more descriptive variable naming and comments.',
    graded_by: 'lec-001',
    graded_at: '2026-02-08T15:00:00Z',
  },
];
