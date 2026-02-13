

# Project Handoff Context: Virtual Programming Laboratory (VPL) MVP

## 1. Project Overview & Origin

The Virtual Programming Laboratory (VPL) is a web-based educational platform designed for computer science students to write, execute, and submit code directly in their browsers, and for lecturers to review, evaluate, and grade these submissions.

The project was commissioned by a university Head of Department (HOD Sola Maitanmi). The initial request was vague (a "visual laboratory like W3Schools"), which the HOD later expanded into a massive, enterprise-scale design document encompassing VM orchestration, networking simulations (like Cisco Packet Tracer), and AI GPU clusters.

**Crucial Pivot:** We successfully negotiated the scope down. The HOD agreed that the massive design document is the long-term "destination," but authorized starting with a strictly scoped Minimum Viable Product (MVP) focused purely on the core programming and assessment loop.

**Development Philosophy:** The guiding principle for this build is to prioritize a functional MVP that actually works and serves users immediately. We are avoiding over-engineering or going all-in on hypothetical features without initial user traction.

---

## 2. The Agreed MVP Scope (Phase 1)

This phase focuses exclusively on a "CodePen for Classrooms" experience, targeting specific programming languages (Python, Java, C/C++) mapped to weekly university courses.

### 2.1 Core User Workflows

**The Student Flow:**

1. Logs into the platform.
2. Views enrolled courses (e.g., HCI, Intro to Java) and the current weekly practical assignments.
3. Opens the in-browser IDE to write code for the assignment.
4. Clicks "Run" to compile/execute the code and views the terminal output.
5. Clicks "Submit" to send an immutable snapshot of the code, the output result, and a timestamp to the lecturer.
6. Views grades and feedback on past submissions.

**The Lecturer (Instructor) Flow:**

1. Logs into the platform.
2. Creates and manages "Courses" and the weekly tasks within them.
3. Enrolls students into courses.
4. **The "Graduated" Clause:** Dis-enrolls or archives students once they have completed a course to remove their access to that specific lab environment.
5. Accesses a dashboard to view student submissions for their assigned courses.
6. Evaluates the code/output, assigns a score, and provides text feedback.

### 2.2 Technical Stack & Implementation Details

* **Frontend:** React, TypeScript, Tailwind CSS. (Note: The UI is currently being generated via Lovable using an image-forward, premium, and cinematic design prompt).
* **In-Browser IDE:** Expected to use `@monaco-editor/react` (the engine behind VS Code) to provide syntax highlighting and a professional coding interface.
* **Backend & Database:** Supabase (PostgreSQL). Handling Authentication, relational data storage, and Row Level Security (RLS) to ensure data privacy between students and different lecturers.
* **Code Execution Engine:** A third-party compilation API (e.g., Judge0 or Piston API) triggered securely via Supabase Edge Functions. This avoids the overhead of building custom Docker container orchestration for V1.

---

## 3. Strictly OUT OF SCOPE (Do Not Build for MVP)

To prevent feature creep, the following elements from the HOD's original design document are strictly off-limits for Phase 1:

* Virtual Machine (VM) provisioning (Windows/Linux instances).
* Networking hardware simulations (e.g., GNS3, Cisco Packet Tracer).
* Cybersecurity penetration testing sandboxes.
* AI/GPU cloud instances for heavy machine learning training.
* Complex CI/CD DevOps pipelines.
* Real-time collaborative coding (Google Docs style).

---

## 4. Current Project State & Immediate Next Steps

1. **Frontend:** A highly specific prompt has been formulated to generate the frontend via Lovable, ensuring a premium, visually striking user interface.
2. **Backend:** The exact database schema (Supabase tables for Profiles, Courses, Enrollments, Assignments, Submissions, and Grades) and the Edge Function logic for the code compilation API integration are the immediate next development priorities.

---

