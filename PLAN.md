# BABCOCK Virtual Programming Lab (VPL) — Development Plan

## Philosophy

> **UI-First, Backend-Second.**
> Complete every screen, every interaction, every user flow in the frontend with realistic mock data and proper component architecture. Only after the UI is bulletproof do we wire up Supabase, Auth, and the code execution engine. This ensures the HOD sees a polished product at every stage, and we never build backend for screens that don't exist yet.

---

## Phase 1: UI Completion & Alignment (CURRENT PHASE)

Everything below must be built, fixed, or aligned before any backend work begins.

---

### 1.1 — Fix Off-Point Content (Landing Page Cleanup)

**Problem:** The landing page overpromises features that are out of scope for MVP.

| What | Fix |
|---|---|
| "Automated plagiarism detection" text | Replace with "Assignment submission tracking and grade management" |
| "Isolated secure containers" text | Replace with "Cloud-based code compilation for Python, Java, and C++" |
| "v2.0 System Online" badge | Change to "VPL System Online" or "Beta" — drop the version number |
| "Deep Analytics" feature card description | Rewrite to focus on submission tracking, grading overview, and class progress — not advanced code analysis |
| "Code quality metrics" text | Replace with "Submission history and performance tracking" |

**Files:** `src/pages/Index.tsx`

---

### 1.2 — Authentication Pages (Login, Signup, Role Selection)

**Problem:** No auth screens exist. Student is hardcoded as "Alex Chen", lecturer as "Prof. Anderson". Anyone can access any route.

**Build:**

- [ ] **`/login` — Login Page**
  - Email + password fields
  - "Login" button
  - Link to signup
  - Clean, cinematic design matching existing theme
  - Role indicator after login (student vs lecturer) — redirects accordingly

- [ ] **`/signup` — Signup Page**
  - Full name, email, password, confirm password
  - Role selector: Student or Lecturer
  - For students: Matric number field
  - For lecturers: Staff ID / department field
  - "Create Account" button
  - Link back to login

- [ ] **`/forgot-password` — Forgot Password Page**
  - Email field + "Send Reset Link" button
  - Confirmation message UI

- [ ] **Role-based route guards (UI only for now)**
  - Create a `ProtectedRoute` wrapper component
  - If "not logged in" (mock state), redirect to `/login`
  - If student tries `/lecturer`, redirect to `/student`
  - If lecturer tries `/student`, redirect to `/lecturer`
  - Use React Context or Zustand for mock auth state

**Files to create:**
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/pages/ForgotPassword.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/context/AuthContext.tsx` (mock auth state)

**Update:** `src/App.tsx` — add new routes, wrap dashboard routes with `ProtectedRoute`

---

### 1.3 — Student Dashboard Overhaul

**Problem:** Current dashboard shows courses with progress bars but has no view for past submissions, grades, or feedback. The entire student workflow stops at "click course card → go to lab."

**Build:**

- [ ] **Enrolled courses list** (keep existing, but make data-driven via mock)
  - Each course card shows: course name, lecturer name, language, weekly assignment title, due date
  - Click → navigates to either the assignment list or directly to the lab

- [ ] **`/student/courses/:courseId` — Course Detail Page**
  - Course header (title, lecturer, language icon)
  - Weekly assignment list (Week 1, Week 2, etc.)
  - Each assignment row shows: title, status (Not Started / In Progress / Submitted / Graded), due date, grade if graded
  - Click an assignment → opens the Virtual Lab for that assignment
  - Past submissions section: shows submitted code snapshot (read-only), output, timestamp, grade, lecturer feedback

- [ ] **Grades & Feedback Tab/Section**
  - Summary of all graded assignments across all courses
  - Table: Course → Assignment → Grade → Feedback preview
  - Click to expand full feedback

- [ ] **Student Profile Header**
  - Replace hardcoded "Alex Chen" with dynamic mock user
  - Show: name, matric number, department, enrolled courses count
  - Avatar placeholder

**Files to create:**
- `src/pages/CourseDetail.tsx` (student view)
- `src/pages/SubmissionView.tsx` (read-only view of a past submission)

**Update:** `src/pages/StudentDashboard.tsx`, `src/App.tsx`

---

### 1.4 — Virtual Lab (Code Editor) Overhaul

**Problem:** The current "editor" is a `contentEditable` div with fake syntax highlighting. There's no real code editing, no Submit button, no language switching. This is the core of the entire product.

**Build:**

- [ ] **Replace contentEditable with Monaco Editor**
  - Install `@monaco-editor/react`
  - Full syntax highlighting for Python, Java, C/C++
  - Line numbers, bracket matching, autocomplete
  - Dark theme matching VPL aesthetic
  - Language auto-detected from course/assignment context

- [ ] **Language selector dropdown**
  - Show current language (Python/Java/C++)
  - Locked to the assignment's language (not free-choice for MVP)

- [ ] **Instructions panel (left sidebar) — improve**
  - Already exists but needs structure: Assignment title, description, task breakdown, expected output examples
  - Mark tasks as complete (UI only)

- [ ] **"Run Code" button — keep but clarify it's mock for now**
  - Show realistic mock output based on language
  - Simulated "compiling..." → "running..." → output sequence with loading states
  - Error output simulation (syntax error example)

- [ ] **"Submit" button — NEW, CRITICAL**
  - Prominent button alongside Run
  - Confirmation dialog: "Submit your code? This creates an immutable snapshot that will be sent to your lecturer."
  - On confirm: show success toast with timestamp
  - After submission: code becomes read-only with a "Submitted" badge
  - Mock: store submission in local state

- [ ] **File tabs (stretch)**
  - For now, single file per assignment is fine
  - Tab shows filename (e.g., `main.py`, `Solution.java`)

- [ ] **Terminal panel improvements**
  - Clear terminal button
  - Timestamp on each output line
  - Differentiate stdout (white), stderr (red), system messages (blue)

**Files to update:** `src/pages/VirtualLab.tsx`
**Packages to install:** `@monaco-editor/react`

---

### 1.5 — Lecturer Dashboard Overhaul

**Problem:** Current dashboard is a single flat view with one hardcoded course's submissions table. Lecturers need to manage multiple courses, create assignments, review code, and provide grades + feedback.

**Build:**

- [ ] **Multi-course view**
  - Lecturer sees all their courses as cards/list
  - Each course shows: title, language, student count, latest assignment, submission rate
  - Click course → course management view

- [ ] **`/lecturer/courses/:courseId` — Course Management Page**
  - Course header with stats
  - **Assignments tab:** List of weekly assignments with create/edit UI
  - **Students tab:** Enrolled students list with enrollment management
  - **Submissions tab:** All submissions for this course, filterable by assignment/student

- [ ] **Create Assignment Modal/Page**
  - Title, description, language (auto from course), due date picker
  - Task breakdown (add multiple task items)
  - Expected output (optional)
  - "Publish Assignment" button

- [ ] **Create Course Modal/Page**
  - Course title, language (Python/Java/C++), description, semester
  - "Create Course" button

- [ ] **Student Enrollment Management**
  - Add students to course (search by name/matric)
  - Remove/archive students ("Graduated Clause" from CONTEXT.md)
  - Bulk enrollment option

- [ ] **`/lecturer/review/:submissionId` — Code Review Page**
  - Student's submitted code in read-only Monaco Editor
  - Terminal output panel showing their execution result
  - Submission metadata: student name, timestamp, assignment title
  - **Grading panel:**
    - Score input (0-100)
    - Feedback text area (rich text or plain)
    - "Submit Grade" button
  - Navigation: Previous/Next submission buttons

- [ ] **Lecturer Profile Header**
  - Replace hardcoded "Prof. Anderson" with dynamic mock user
  - Show: name, staff ID, department, courses count

**Files to create:**
- `src/pages/LecturerCourseManagement.tsx`
- `src/pages/CreateAssignment.tsx` (or modal component)
- `src/pages/CreateCourse.tsx` (or modal component)
- `src/pages/CodeReview.tsx`
- `src/components/EnrollmentManager.tsx`

**Update:** `src/pages/LecturerDashboard.tsx`, `src/App.tsx`

---

### 1.6 — Shared Components & Layout

**Build:**

- [ ] **Shared navigation component**
  - Consistent nav bar across all pages
  - Dynamic based on role (student nav vs lecturer nav)
  - Mobile hamburger menu
  - Logout button (mock: clears auth state, redirects to `/login`)

- [ ] **Breadcrumb navigation**
  - Dashboard → Course → Assignment → Lab
  - Helps users understand where they are

- [ ] **Loading states**
  - Skeleton screens for dashboards
  - Spinner for code execution
  - Progress indicators for submission

- [ ] **Empty states**
  - "No courses enrolled" for students
  - "No assignments yet" for courses
  - "No submissions received" for lecturers

- [ ] **Error states**
  - 404 page (already exists, improve it)
  - "Access denied" for wrong role
  - "Session expired" prompt

- [ ] **Toast notifications system**
  - Already have Sonner/Toaster installed
  - Define consistent toast patterns: success, error, info, warning

**Files to create:**
- `src/components/Navbar.tsx`
- `src/components/Breadcrumbs.tsx`
- `src/components/LoadingSkeleton.tsx`
- `src/components/EmptyState.tsx`

---

### 1.7 — Mock Data Architecture

**Problem:** All data is currently inline hardcoded in components. Before backend, we need a clean mock data layer that mirrors the eventual Supabase schema.

**Build:**

- [ ] **Mock data files matching Supabase schema**
  - `src/data/mockUsers.ts` — students and lecturers with roles
  - `src/data/mockCourses.ts` — courses with language, lecturer, semester
  - `src/data/mockEnrollments.ts` — student-course relationships
  - `src/data/mockAssignments.ts` — weekly tasks per course
  - `src/data/mockSubmissions.ts` — code snapshots with output, timestamps
  - `src/data/mockGrades.ts` — scores and feedback

- [ ] **Mock data service layer**
  - `src/services/mockApi.ts` — functions like `getCourses()`, `getSubmissions()`, `submitCode()`, `gradeSubmission()`
  - Simulate async behavior with `setTimeout` or `Promise.resolve`
  - When we switch to Supabase, we only need to swap this one file

- [ ] **Type definitions**
  - `src/types/index.ts` — TypeScript interfaces for User, Course, Enrollment, Assignment, Submission, Grade
  - These types will map 1:1 to Supabase tables later

**Files to create:**
- `src/types/index.ts`
- `src/data/mockUsers.ts`
- `src/data/mockCourses.ts`
- `src/data/mockEnrollments.ts`
- `src/data/mockAssignments.ts`
- `src/data/mockSubmissions.ts`
- `src/data/mockGrades.ts`
- `src/services/mockApi.ts`

---

### 1.8 — Route Map (Final)

After Phase 1 is complete, the full route structure should be:

```
/                           → Landing page
/login                      → Login page
/signup                     → Signup page
/forgot-password            → Password reset page

/student                    → Student dashboard (courses overview)
/student/courses/:courseId  → Course detail (assignments list, grades)
/student/submission/:id     → View past submission (read-only)

/lab/:courseId/:assignmentId → Virtual Lab (Monaco editor + terminal)

/lecturer                   → Lecturer dashboard (courses overview)
/lecturer/courses/:courseId → Course management (assignments, students, submissions)
/lecturer/create-course     → Create new course
/lecturer/review/:submissionId → Code review + grading page
```

---

## Phase 2: Backend Integration (AFTER Phase 1)

> Do NOT start this until every screen in Phase 1 is built and polished.

### 2.1 — Supabase Setup
- [ ] Create Supabase project
- [ ] Design and create database tables:
  - `profiles` (id, email, full_name, role, matric_number, staff_id, department, avatar_url)
  - `courses` (id, title, language, description, semester, lecturer_id, created_at)
  - `enrollments` (id, student_id, course_id, status [active/archived], enrolled_at)
  - `assignments` (id, course_id, title, description, week_number, due_date, expected_output, created_at)
  - `submissions` (id, assignment_id, student_id, code, language, output, submitted_at)
  - `grades` (id, submission_id, score, feedback, graded_by, graded_at)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Enable Supabase Auth (email/password)

### 2.2 — Auth Integration
- [ ] Replace mock auth context with Supabase Auth
- [ ] Login/Signup pages → real Supabase calls
- [ ] Session management, role-based redirects
- [ ] Profile creation on signup (trigger or client-side)

### 2.3 — Data Integration
- [ ] Replace `src/services/mockApi.ts` with `src/services/supabaseApi.ts`
- [ ] Wire all pages to real data via React Query
- [ ] Real-time subscriptions for submission status (optional stretch)

### 2.4 — Code Execution Engine
- [ ] Set up Supabase Edge Function as proxy
- [ ] Integrate Judge0 API (or Piston API) for Python, Java, C/C++
- [ ] Wire "Run Code" button to actual compilation
- [ ] Wire "Submit" button to create immutable submission record

---

## Phase 3: Polish & Deployment (AFTER Phase 2)

- [ ] Error handling across all API calls
- [ ] Loading/error states for real async operations
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Custom domain setup
- [ ] User acceptance testing with HOD

---

## Task Priority Order (Phase 1)

This is the exact build sequence:

```
1.  Create TypeScript types (src/types/index.ts)
2.  Create mock data files (src/data/*.ts)
3.  Create mock API service (src/services/mockApi.ts)
4.  Create auth context with mock state (src/context/AuthContext.tsx)
5.  Fix landing page off-point text (src/pages/Index.tsx)
6.  Build Login page (src/pages/Login.tsx)
7.  Build Signup page (src/pages/Signup.tsx)
8.  Build ForgotPassword page (src/pages/ForgotPassword.tsx)
9.  Build ProtectedRoute component (src/components/ProtectedRoute.tsx)
10. Build shared Navbar component (src/components/Navbar.tsx)
11. Install Monaco Editor (@monaco-editor/react)
12. Rebuild Virtual Lab with Monaco Editor (src/pages/VirtualLab.tsx)
13. Add Submit button + confirmation flow to Virtual Lab
14. Build Course Detail page - student view (src/pages/CourseDetail.tsx)
15. Update Student Dashboard to use mock API (src/pages/StudentDashboard.tsx)
16. Build Submission View page (src/pages/SubmissionView.tsx)
17. Build Lecturer Course Management page (src/pages/LecturerCourseManagement.tsx)
18. Build Create Course modal/page (src/pages/CreateCourse.tsx)
19. Build Create Assignment modal/page (src/pages/CreateAssignment.tsx)
20. Build Code Review + Grading page (src/pages/CodeReview.tsx)
21. Build Enrollment Manager component (src/components/EnrollmentManager.tsx)
22. Update Lecturer Dashboard to use mock API (src/pages/LecturerDashboard.tsx)
23. Build empty states, loading skeletons, breadcrumbs
24. Update all routes in App.tsx
25. Full UI walkthrough — test every flow end-to-end
26. Commit, push, demo to HOD
```

---

## Files Summary (New + Modified)

### New Files (~20)
```
src/types/index.ts
src/data/mockUsers.ts
src/data/mockCourses.ts
src/data/mockEnrollments.ts
src/data/mockAssignments.ts
src/data/mockSubmissions.ts
src/data/mockGrades.ts
src/services/mockApi.ts
src/context/AuthContext.tsx
src/pages/Login.tsx
src/pages/Signup.tsx
src/pages/ForgotPassword.tsx
src/pages/CourseDetail.tsx
src/pages/SubmissionView.tsx
src/pages/LecturerCourseManagement.tsx
src/pages/CreateCourse.tsx
src/pages/CreateAssignment.tsx
src/pages/CodeReview.tsx
src/components/ProtectedRoute.tsx
src/components/Navbar.tsx
src/components/Breadcrumbs.tsx
src/components/LoadingSkeleton.tsx
src/components/EmptyState.tsx
src/components/EnrollmentManager.tsx
```

### Modified Files (~6)
```
src/App.tsx (routes, auth provider)
src/pages/Index.tsx (fix off-point text)
src/pages/StudentDashboard.tsx (mock data, layout)
src/pages/LecturerDashboard.tsx (mock data, multi-course)
src/pages/VirtualLab.tsx (Monaco, Submit button)
package.json (@monaco-editor/react)
```

---

## Estimated Effort

| Section | Effort |
|---|---|
| 1.1 Fix landing page text | ~30 min |
| 1.2 Auth pages (Login, Signup, Forgot, Guards) | ~3-4 hours |
| 1.3 Student Dashboard overhaul | ~3-4 hours |
| 1.4 Virtual Lab (Monaco + Submit) | ~3-4 hours |
| 1.5 Lecturer Dashboard overhaul | ~5-6 hours |
| 1.6 Shared components | ~2-3 hours |
| 1.7 Mock data + types + service layer | ~2-3 hours |
| 1.8 Route wiring + testing | ~1-2 hours |
| **Phase 1 Total** | **~20-26 hours** |

---

*Last updated: February 13, 2026*
