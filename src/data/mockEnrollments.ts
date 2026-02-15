import type { Enrollment } from '@/types';

export const mockEnrollments: Enrollment[] = [
  // Alex Chen — enrolled in all 5 courses (300 level)
  { id: 'enr-001', student_id: 'stu-001', course_id: 'crs-cs101', status: 'active', enrolled_at: '2025-09-05T08:00:00Z' },
  { id: 'enr-002', student_id: 'stu-001', course_id: 'crs-cs202', status: 'active', enrolled_at: '2025-09-05T08:00:00Z' },
  { id: 'enr-003', student_id: 'stu-001', course_id: 'crs-cs303', status: 'active', enrolled_at: '2025-09-05T08:00:00Z' },
  { id: 'enr-013', student_id: 'stu-001', course_id: 'crs-web101', status: 'active', enrolled_at: '2025-09-05T08:00:00Z' },
  { id: 'enr-017', student_id: 'stu-001', course_id: 'crs-php501', status: 'active', enrolled_at: '2025-09-05T08:00:00Z' },

  // Emma Wilson — enrolled in Python, Java & Web Design (200 level)
  { id: 'enr-004', student_id: 'stu-002', course_id: 'crs-cs101', status: 'active', enrolled_at: '2025-09-05T08:00:00Z' },
  { id: 'enr-005', student_id: 'stu-002', course_id: 'crs-cs202', status: 'active', enrolled_at: '2025-09-05T08:00:00Z' },
  { id: 'enr-014', student_id: 'stu-002', course_id: 'crs-web101', status: 'active', enrolled_at: '2025-09-05T08:00:00Z' },

  // Liam Johnson — enrolled in Python, Java & Web Design (200 level)
  { id: 'enr-006', student_id: 'stu-003', course_id: 'crs-cs101', status: 'active', enrolled_at: '2025-09-06T08:00:00Z' },
  { id: 'enr-007', student_id: 'stu-003', course_id: 'crs-cs202', status: 'active', enrolled_at: '2025-09-06T08:00:00Z' },
  { id: 'enr-015', student_id: 'stu-003', course_id: 'crs-web101', status: 'active', enrolled_at: '2025-09-06T08:00:00Z' },

  // Noah Brown — enrolled in Python & C++ (400 level)
  { id: 'enr-008', student_id: 'stu-004', course_id: 'crs-cs101', status: 'active', enrolled_at: '2025-09-06T08:00:00Z' },
  { id: 'enr-009', student_id: 'stu-004', course_id: 'crs-cs303', status: 'active', enrolled_at: '2025-09-06T08:00:00Z' },

  // Olivia Davis — enrolled in Java (300 level)
  { id: 'enr-010', student_id: 'stu-005', course_id: 'crs-cs202', status: 'active', enrolled_at: '2025-09-07T08:00:00Z' },

  // William Miller — enrolled in Python, C++ & PHP (500 level)
  { id: 'enr-011', student_id: 'stu-006', course_id: 'crs-cs101', status: 'active', enrolled_at: '2025-09-07T08:00:00Z' },
  { id: 'enr-012', student_id: 'stu-006', course_id: 'crs-cs303', status: 'active', enrolled_at: '2025-09-07T08:00:00Z' },
  { id: 'enr-016', student_id: 'stu-006', course_id: 'crs-php501', status: 'active', enrolled_at: '2025-09-07T08:00:00Z' },
];
