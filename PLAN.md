# BABCOCK Virtual Programming Lab (VPL) — Development Plan

## Philosophy

> **UI-First, Backend-Second. MVP at every step.**
> Phase 1 (complete) built every screen, every interaction, every user flow with realistic mock data. Phase 2 replaces the mock layer with a real Supabase backend — one migration at a time, always keeping the app working. Ship small, verify, repeat.

---

## Phase 1: Frontend UI ✅ COMPLETE

All Phase 1 work was completed and pushed. Summary of what was built:

- [x] **1.1** Landing page cleanup — removed off-point text, VPL branding
- [x] **1.2** Auth pages — Login (with role toggle), Signup, Forgot Password, ProtectedRoute, AuthContext
- [x] **1.3** Student features — Dashboard, CourseDetail, SubmissionView, grades display
- [x] **1.4** Virtual Lab — Monaco Editor, 8 programming languages, Run/Submit, Notes tab, mobile tabs
- [x] **1.5** Lecturer features — Dashboard, CourseManagement, CreateCourse, CreateAssignment, CodeReview
- [x] **1.6** Shared components — Navbar (role-aware), theme system (light/dark), toast notifications
- [x] **1.7** Mock data layer — Types (1:1 Supabase mapping), 6 mock data files, mockApi.ts (20+ functions), localStorage persistence with DATA_VERSION
- [x] **1.8** Route map — All 14 pages wired, role-based guards active
- [x] **HOD feedback** — Web Design course, PHP course, C language, student levels, browser notepad
- [x] **Documentation** — README, PLAN.md, copilot-instructions.md, MCP servers configured

**14 pages:** Index, Login, Signup, ForgotPassword, StudentDashboard, CourseDetail, VirtualLab, SubmissionView, LecturerDashboard, LecturerCourseManagement, CreateCourse, CreateAssignment, CodeReview, NotFound

**6 courses:** CS101 (Python), CS202 (Java), CS303 (C++), CS201 (C), WEB101 (HTML), PHP501 (PHP)

**21 assignments** across all courses | **6 mock users** (4 students + 2 lecturers)

---

## Phase 2: Supabase Backend Integration (CURRENT PHASE)

> **MVP approach:** Replace mock data with real Supabase tables. One migration at a time. Keep the app working after every step. No big-bang rewrites.

### Architecture Overview

```
Frontend (React)  →  supabaseApi.ts  →  Supabase (Postgres + Auth + RLS)
     ↓                                        ↓
  Monaco Editor  →  Edge Function  →  Judge0/Piston (code execution)
```

**Key principle:** `mockApi.ts` has 20+ async functions. We create `supabaseApi.ts` with the same function signatures and swap the import. Pages don't change.

---

### 2.1 — Database Schema (Migrations)

Apply these via `mcp_supabase_apply_migration` in order. Each migration is verified with a SELECT before moving on.

#### Migration 1: Core Tables

```sql
-- profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'lecturer')),
  matric_number TEXT,
  staff_id TEXT,
  level TEXT CHECK (level IN ('100', '200', '300', '400', '500', 'phd')),
  department TEXT NOT NULL DEFAULT 'Computer Science',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL CHECK (language IN ('python', 'java', 'cpp', 'c', 'html', 'css', 'javascript', 'php')),
  description TEXT NOT NULL DEFAULT '',
  semester TEXT NOT NULL DEFAULT '2025/2026 - First Semester',
  lecturer_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- enrollments
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);
```

#### Migration 2: Assignments & Submissions

```sql
-- assignments
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  week_number INTEGER NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]',
  expected_output TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- submissions
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  output TEXT NOT NULL DEFAULT '',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- grades
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE UNIQUE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback TEXT NOT NULL DEFAULT '',
  graded_by UUID NOT NULL REFERENCES public.profiles(id),
  graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### Migration 3: Row Level Security

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, update only their own
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses: anyone can read, lecturers can create/update their own
CREATE POLICY "Anyone can read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Lecturers can create courses" ON public.courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'lecturer')
);
CREATE POLICY "Lecturers can update own courses" ON public.courses FOR UPDATE USING (lecturer_id = auth.uid());

-- Enrollments: students see their own, lecturers see their courses' enrollments
CREATE POLICY "Students see own enrollments" ON public.enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Lecturers see course enrollments" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND lecturer_id = auth.uid())
);
CREATE POLICY "Students can enroll themselves" ON public.enrollments FOR INSERT WITH CHECK (student_id = auth.uid());

-- Assignments: readable by enrolled students + course lecturer
CREATE POLICY "Anyone can read assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Lecturers can create assignments" ON public.assignments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND lecturer_id = auth.uid())
);
CREATE POLICY "Lecturers can update own assignments" ON public.assignments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND lecturer_id = auth.uid())
);

-- Submissions: students see own, lecturers see their courses
CREATE POLICY "Students see own submissions" ON public.submissions FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Lecturers see course submissions" ON public.submissions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.courses c ON c.id = a.course_id
    WHERE a.id = assignment_id AND c.lecturer_id = auth.uid()
  )
);
CREATE POLICY "Students can submit" ON public.submissions FOR INSERT WITH CHECK (student_id = auth.uid());

-- Grades: students see own, lecturers manage
CREATE POLICY "Students see own grades" ON public.grades FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.submissions WHERE id = submission_id AND student_id = auth.uid())
);
CREATE POLICY "Lecturers see grades for their courses" ON public.grades FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.submissions s
    JOIN public.assignments a ON a.id = s.assignment_id
    JOIN public.courses c ON c.id = a.course_id
    WHERE s.id = submission_id AND c.lecturer_id = auth.uid()
  )
);
CREATE POLICY "Lecturers can grade" ON public.grades FOR INSERT WITH CHECK (graded_by = auth.uid());
CREATE POLICY "Lecturers can update grades" ON public.grades FOR UPDATE USING (graded_by = auth.uid());
```

#### Migration 4: Profile Trigger (auto-create on signup)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, matric_number, staff_id, level, department)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'matric_number',
    NEW.raw_user_meta_data->>'staff_id',
    NEW.raw_user_meta_data->>'level',
    COALESCE(NEW.raw_user_meta_data->>'department', 'Computer Science')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 2.2 — Supabase Client Setup

- [ ] Install `@supabase/supabase-js`
- [ ] Create `src/lib/supabase.ts` — Supabase client using env vars
- [ ] Create `src/services/supabaseApi.ts` — same function signatures as `mockApi.ts`
- [ ] Swap import in each page from `mockApi` → `supabaseApi` (or use an abstraction layer)

---

### 2.3 — Auth Integration

- [ ] Replace `AuthContext.tsx` mock auth with Supabase Auth
- [ ] Login page → `supabase.auth.signInWithPassword()`
- [ ] Signup page → `supabase.auth.signUp()` with metadata (role, name, matric, etc.)
- [ ] Session listener → `supabase.auth.onAuthStateChange()`
- [ ] Forgot Password → `supabase.auth.resetPasswordForEmail()`
- [ ] Profile loaded from `profiles` table after auth state resolves
- [ ] Seed 2-3 demo accounts (student + lecturer) for testing

---

### 2.4 — Data Integration (Page by Page)

Replace each `mockApi` function with a Supabase query. Test after each:

| Function | Supabase Query | Priority |
|---|---|---|
| `loginUser` / `signupUser` | Supabase Auth | P0 |
| `getUserById` | `profiles` SELECT | P0 |
| `getAllCourses` | `courses` SELECT + join profiles | P0 |
| `getCourseById` | `courses` SELECT by id | P0 |
| `getCoursesByLecturer` | `courses` WHERE lecturer_id | P0 |
| `createCourse` | `courses` INSERT | P1 |
| `getEnrollmentsForStudent` | `enrollments` + join courses + profiles | P0 |
| `getStudentsForCourse` | `enrollments` + join profiles WHERE course_id | P1 |
| `getAssignmentsForCourse` | `assignments` WHERE course_id | P0 |
| `getAssignmentsWithStatus` | `assignments` + left join submissions + grades | P0 |
| `getAssignmentById` | `assignments` SELECT by id | P0 |
| `createAssignment` | `assignments` INSERT | P1 |
| `getSubmissionsForAssignment` | `submissions` + join profiles WHERE assignment_id | P1 |
| `getSubmissionByStudentAndAssignment` | `submissions` WHERE student_id AND assignment_id | P1 |
| `getSubmissionById` | `submissions` + joins | P1 |
| `submitCode` | `submissions` UPSERT | P1 |
| `getGradesForStudent` | `grades` + join submissions + assignments | P1 |
| `gradeSubmission` | `grades` INSERT/UPDATE | P2 |
| `getCourseStats` | Aggregate query | P2 |

---

### 2.5 — Code Execution Engine (Stretch)

- [ ] Set up Supabase Edge Function as proxy to Judge0 or Piston API
- [ ] Wire "Run Code" button to real compilation
- [ ] Support: Python, Java, C, C++ (minimum), HTML/CSS/JS/PHP (stretch)
- [ ] "Submit" creates immutable record in `submissions` table

---

### 2.6 — Phase 2 Build Order (Revised after Architecture Audit)

**Completed:**
```
✅ Step 1:  Apply Migration 1 (profiles, courses, enrollments)
✅ Step 2:  Apply Migration 2 (assignments, submissions, grades)
✅ Step 3:  Apply Migration 3 (RLS policies — 20 policies across 6 tables)
✅ Step 4:  Apply Migration 4 (profile trigger — handle_new_user)
✅ Step 5:  Install @supabase/supabase-js, create src/lib/supabase.ts client
✅ Step 6:  Create supabaseApi.ts (451 lines, 20+ functions, same signatures as mockApi)
✅ Step 7:  Seed demo data (8 users, 6 courses, 19 enrollments, 21 assignments, 6 submissions, 6 grades)
✅ Step 8:  Disable email confirmation (mailer_autoconfirm = true via Management API)
```

**Remaining — Execute in this exact order:**
```
Step 9:  Rewrite AuthContext.tsx for Supabase Auth
         - Replace mock loginUser/signupUser with supabase.auth calls
         - Add supabase.auth.onAuthStateChange() as single source of truth
         - Remove manual localStorage user persistence (SDK handles sessions)
         - logout must call supabase.auth.signOut()
         - Forward Signup.tsx extra fields (matric_number, staff_id, level, department)
         - Fetch profile from profiles table after auth resolves

Step 10: Update Login.tsx
         - Remove "Demo Mode" hint (real auth now)
         - Remove role toggle selector (role stored in profile, not chosen at login)
         - Add demo credentials hint for seed users instead (email + password Test1234!)

Step 11: Update Signup.tsx
         - Ensure full_name, role, department are forwarded as metadata
         - Add matric_number field for students, staff_id for lecturers
         - Add student level selector (100-500, phd) for students
         - Accounts auto-confirm immediately (no email flow needed)

Step 12: Swap all 9 mockApi imports → supabaseApi
         Files to change (all are import-path-only swaps):
         - src/pages/StudentDashboard.tsx
         - src/pages/CourseDetail.tsx
         - src/pages/VirtualLab.tsx
         - src/pages/SubmissionView.tsx
         - src/pages/LecturerDashboard.tsx
         - src/pages/LecturerCourseManagement.tsx
         - src/pages/CreateCourse.tsx
         - src/pages/CreateAssignment.tsx
         - src/pages/CodeReview.tsx

Step 13: Add error handling to all data-loading pages
         - Wrap every useEffect data load in try/catch
         - Add error state + user-facing error UI to 7 pages that lack it
         - Pages already covered: CreateCourse, CreateAssignment (have try/catch)

Step 14: Fix langMap gaps in SubmissionView.tsx and CodeReview.tsx
         - Add c, html, css, javascript, php to their local langMap objects
         - Currently only map python, java, cpp — 5 languages missing

Step 15: Test full student flow
         - Login with seed student (alex.chen@babcock.edu.ng / Test1234!)
         - Dashboard shows enrolled courses
         - Course detail shows assignments with correct status
         - VirtualLab opens, code submits successfully
         - Submission view renders

Step 16: Test full lecturer flow
         - Login with seed lecturer (dr.adebayo@babcock.edu.ng / Test1234!)
         - Dashboard shows created courses with stats
         - Create new course works (RLS allows it)
         - Create new assignment works
         - Code review + grading works

Step 17: Cleanup
         - Delete src/services/mockApi.ts
         - Delete src/data/*.ts mock data files (6 files)
         - Remove all mock data imports
         - Remove localStorage DATA_VERSION / persistence layer
         - Remove unused mockApi exports (getAllCourses, getUserById — only used by supabaseApi now)

Step 18: Code execution Edge Function (stretch)
         - Deploy Supabase Edge Function as proxy to Judge0 or Piston API
         - Replace handleRun mock in VirtualLab.tsx with real compilation
         - Support: Python, Java, C, C++ (minimum), HTML/CSS/JS/PHP (stretch)
```

---

### 2.7 — Architecture Audit Findings (for reference)

**Schema ↔ Types alignment:** 100% — all 6 tables match TypeScript interfaces exactly.

**API compatibility:** supabaseApi.ts has identical function signatures to mockApi.ts — designed as drop-in replacement.

**FK constraint names verified:** `courses_lecturer_id_fkey`, `enrollments_student_id_fkey`, `submissions_student_id_fkey`, `submissions_assignment_id_fkey` — all match the `!fkey_name` JOIN syntax in supabaseApi.ts.

**Critical dependency:** Auth swap (Step 9) MUST happen first. All RLS write policies use `auth.uid()` — without a real Supabase session, every INSERT/UPDATE/UPSERT will be denied.

**Known gaps to address in Phase 3:**
- No enrollment UI (students can't browse/join courses — seed data only for now)
- React Query is set up (`QueryClientProvider` in App.tsx) but unused — all pages use manual useState+useEffect
- VirtualLab "Run Code" produces fake output (Phase 3 Edge Function)
- No forgot-password integration with Supabase `resetPasswordForEmail()`

---

## Phase 3: Polish & Deployment (AFTER Phase 2)

- [ ] Student enrollment UI (browse courses, enroll by code/link)
- [ ] Forgot password → `supabase.auth.resetPasswordForEmail()`
- [ ] Migrate pages to React Query (useQuery/useMutation) for caching + refetch
- [ ] Code execution Edge Function (Judge0/Piston proxy)
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] User acceptance testing with HOD
- [ ] Custom domain setup

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Editor | Monaco Editor (CDN) |
| Backend | Supabase (Postgres + Auth + Edge Functions + RLS) |
| Code Exec | Judge0 or Piston (via Edge Function proxy) — Phase 3 |
| Hosting | Vercel (auto-deploy from main) |
| Version Control | Git → GitHub (`BISHOP-X/BABCOCK-VPL`) |

---

## Supabase Project Details

| Key | Value |
|---|---|
| Project Ref | `ckrzdghuipfkdifafmqz` |
| API URL | `https://ckrzdghuipfkdifafmqz.supabase.co` |
| Anon Key | In `.env` as `VITE_SUPABASE_PUBLISHABLE_KEY` |
| Email Confirmation | **Disabled** (`mailer_autoconfirm = true`) |
| Tables | 6 — profiles, courses, enrollments, assignments, submissions, grades |
| RLS Policies | 20 — all CRUD paths covered |
| Seed Data | 8 users, 6 courses, 19 enrollments, 21 assignments, 6 submissions, 6 grades |
| All passwords | `Test1234!` |
| MCP | Connected and tested via `.vscode/mcp.json` |

---

*Last updated: February 16, 2026*
