# BABCOCK Virtual Programming Lab (VPL)

> **A modern, cloud-based virtual programming laboratory for educational institutions**

A fully-featured web-based IDE and course management system that enables students to write, compile, and submit code directly in their browser while providing lecturers with comprehensive tools for course creation, assignment management, and student progress tracking.

**🌐 Live Demo:** [https://babcock-vpl.vercel.app/](https://babcock-vpl.vercel.app/)  
**📦 Repository:** [https://github.com/BISHOP-X/BABCOCK-VPL](https://github.com/BISHOP-X/BABCOCK-VPL)

---

## 🎯 Project Objective

Build a complete Virtual Programming Lab platform that eliminates the need for local development environment setup, enabling students to learn programming through an accessible browser-based IDE while giving lecturers powerful administrative and analytics capabilities.

**Current Status:** ✅ **Phase 1 Complete** — Full UI implementation with mock data and localStorage persistence. Frontend-ready for backend integration.

---

## ✨ Key Features

### For Students
- **📝 Browser-Based IDE** - Write and run code without any local setup using Monaco Editor
- **🎨 Multi-Language Support** - Python, Java, C++, C, HTML/CSS/JavaScript, and PHP
- **📊 Course Dashboard** - View enrolled courses, track assignment progress, and monitor grades
- **🔔 Assignment Tracking** - See due dates, submission status, and completion percentages
- **📓 Integrated Scratchpad** - Take notes directly in the VirtualLab IDE
- **🌙 Dark/Light Theme** - Seamless theme switching across the entire platform
- **📱 Mobile Responsive** - Full mobile support with optimized tab-based layout

### For Lecturers
- **🎓 Course Management** - Create courses for 8 programming languages with rich descriptions
- **📋 Assignment Creation** - Build weekly coding assignments with tasks and expected outputs
- **👥 Student Analytics** - Monitor enrollment, submission rates, and performance metrics
- **✅ Code Review & Grading** - Review student submissions with side-by-side code viewing
- **📈 Progress Tracking** - See real-time course statistics and student completion rates
- **🔐 Role-Based Access** - Secure lecturer-only routes for management features

### System Features
- **🔐 Authentication System** - Login/signup with role-based routing (Student/Lecturer)
- **💾 LocalStorage Persistence** - All created courses and assignments persist across sessions
- **🔄 Data Versioning** - Automatic data migration when mock data structure changes
- **🎯 Smart Routing** - Protected routes with automatic role-based redirection
- **⚡ Fast Performance** - Built with Vite for instant hot module replacement
- **🎨 Modern UI** - Powered by shadcn/ui components and Tailwind CSS

---

## 🗂️ Current Course Catalog

| Course Code | Title | Language | Assignments |
|------------|-------|----------|-------------|
| **CS101** | Introduction to Python Programming | Python | 4 weekly labs |
| **CS202** | Advanced Java Programming | Java | 3 weekly labs |
| **CS303** | System Programming in C++ | C++ | 2 weekly labs |
| **CS201** | Introduction to C Programming | C | 4 weekly labs |
| **WEB101** | Web Design Fundamentals | HTML/CSS/JS | 4 weekly labs |
| **PHP501** | Server-Side Development with PHP | PHP (LAMP/WAMP) | 4 weekly labs |

**Total:** 6 courses across 8 programming languages with 21 hands-on assignments

---

## 🏗️ Tech Stack

### Frontend
- **React 18.3** - Component-based UI library
- **TypeScript** - Type-safe JavaScript with full type coverage
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **React Router v7** - Client-side routing with protected routes

### Code Editor
- **Monaco Editor** - VS Code's editor (via CDN)
- **Syntax Highlighting** - Full language support for all 8 languages
- **Theme Integration** - Auto-switching between light/dark themes

### State Management
- **React Context API** - Global auth and theme state
- **LocalStorage API** - Client-side data persistence with versioning

### Development Tools
- **ESLint** - Code quality and consistency
- **Vitest** - Unit testing framework
- **TypeScript Compiler** - Type checking and compilation
- **Console Ninja** - Enhanced debugging in VS Code

---

## 📊 Project Status

### ✅ Completed Features

#### Phase 1.1: Landing Page & Navigation
- ✅ Hero section with theme toggle
- ✅ Feature cards (IDE, Compilation, Analytics)
- ✅ Responsive navigation bar
- ✅ Light/Dark theme system with persistence

#### Phase 1.2: Authentication System
- ✅ Login page with role selector
- ✅ Signup page with student/lecturer fields
- ✅ Forgot password page
- ✅ Protected routes with role-based guards
- ✅ AuthContext for global state
- ✅ Automatic redirection based on role

#### Phase 1.3: Student Features
- ✅ Student Dashboard with course cards
- ✅ Course Detail page with assignment list
- ✅ Assignment status tracking (Not Started/Submitted/Graded)
- ✅ VirtualLab IDE with Monaco Editor
- ✅ Code submission with localStorage persistence
- ✅ Submission history viewer
- ✅ Student level badges (100-500, PhD)
- ✅ Grade and feedback display

#### Phase 1.4: Lecturer Features
- ✅ Lecturer Dashboard with course overview
- ✅ Course creation form with all 8 languages
- ✅ Assignment creation with weekly scheduler
- ✅ Course management page (students, assignments, analytics)
- ✅ Code review interface with grading
- ✅ Student submission list with filtering
- ✅ Course statistics and analytics

#### Phase 1.5: VirtualLab IDE
- ✅ Monaco Editor integration (CDN loader)
- ✅ 8 language support (Python, Java, C++, C, HTML, CSS, JS, PHP)
- ✅ Starter code templates for all languages
- ✅ Mock code execution with output panel
- ✅ Assignment instructions panel
- ✅ Integrated notes/scratchpad
- ✅ Mobile-optimized tab layout
- ✅ File name mapping (.py, .java, .cpp, .c, .html, .php, etc.)
- ✅ Theme-aware editor (light/dark sync)

#### Data Layer
- ✅ Complete TypeScript type system
- ✅ Mock API with 20+ functions
- ✅ LocalStorage persistence layer
- ✅ Data versioning system
- ✅ 6 users (students + lecturers)
- ✅ 6 courses across 8 languages
- ✅ 21 assignments with full task details
- ✅ Mock submissions and grades
- ✅ Course enrollment system

---

### 🚧 Phase 2 — Backend Integration (Current)

#### MVP Backend (In Progress)
- ⏳ Supabase database tables (profiles, courses, enrollments, assignments, submissions, grades)
- ⏳ Row Level Security (RLS) policies
- ⏳ Supabase Auth (email/password signup + login)
- ⏳ Profile auto-creation via database trigger
- ⏳ Replace mockApi.ts with supabaseApi.ts
- ⏳ Seed demo data (courses, assignments, users)

#### Code Execution Engine
- ⏳ Supabase Edge Function proxy to Judge0 or Piston API
- ⏳ Real compilation for Python, Java, C, C++
- ⏳ Output capture and error handling

#### Stretch Goals (Post-MVP)
- ⏳ Real-time subscriptions for live submission updates
- ⏳ Student enrollment by course code
- ⏳ Email notifications
- ⏳ Advanced analytics dashboard
- ⏳ Bulk grading interface

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher (or **yarn**/**pnpm**)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/BISHOP-X/BABCOCK-VPL.git
cd BABCOCK-VPL

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:8080
```

### Demo Credentials

**Student Account:**
- Email: `alex.chen@babcock.edu.ng`
- Password: `password` (any password works in demo mode)
- Role: Student

**Lecturer Account:**
- Email: `anderson@babcock.edu.ng`
- Password: `password` (any password works in demo mode)
- Role: Lecturer

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload (port 8080) |
| `npm run build` | Build optimized production bundle |
| `npm run build:dev` | Build with development configuration |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm test` | Run test suite with Vitest |
| `npm run test:watch` | Run tests in watch mode |

---

## 📂 Project Structure

```
BABCOCK-VPL/
├── .vscode/              # VS Code workspace settings & MCP config
├── public/               # Static assets
│   └── favicon.ico
├── src/
│   ├── assets/           # Images, fonts, media files
│   │   ├── hero-image.jpg
│   │   └── feature-*.jpg
│   ├── components/       # Reusable React components
│   │   ├── ui/           # shadcn/ui components (40+ components)
│   │   ├── Navbar.tsx    # Main navigation
│   │   └── ProtectedRoute.tsx  # Route guards
│   ├── context/          # React Context providers
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── ThemeContext.tsx    # Dark/light theme
│   ├── data/             # Mock data layer
│   │   ├── mockUsers.ts         # 6 demo users
│   │   ├── mockCourses.ts       # 6 courses
│   │   ├── mockAssignments.ts   # 21 assignments
│   │   ├── mockEnrollments.ts   # Student enrollments
│   │   ├── mockSubmissions.ts   # Code submissions
│   │   ├── mockGrades.ts        # Grades & feedback
│   │   └── index.ts             # Data exports
│   ├── hooks/            # Custom React hooks
│   │   ├── use-mobile.tsx       # Mobile detection
│   │   └── use-toast.ts         # Toast notifications
│   ├── lib/              # Utility functions
│   │   └── utils.ts             # Class merging, etc.
│   ├── pages/            # Route pages (14 pages)
│   │   ├── Index.tsx            # Landing page
│   │   ├── Login.tsx            # Login page
│   │   ├── Signup.tsx           # Signup page
│   │   ├── ForgotPassword.tsx   # Password reset
│   │   ├── StudentDashboard.tsx # Student home
│   │   ├── CourseDetail.tsx     # Course assignments
│   │   ├── VirtualLab.tsx       # Monaco IDE
│   │   ├── SubmissionView.tsx   # View submission
│   │   ├── LecturerDashboard.tsx # Lecturer home
│   │   ├── LecturerCourseManagement.tsx  # Course admin
│   │   ├── CreateCourse.tsx     # New course form
│   │   ├── CreateAssignment.tsx # New assignment form
│   │   ├── CodeReview.tsx       # Grade submission
│   │   └── NotFound.tsx         # 404 page
│   ├── services/         # API layer
│   │   └── mockApi.ts           # 20+ mock API functions
│   ├── types/            # TypeScript definitions
│   │   └── index.ts             # All type interfaces
│   ├── App.tsx           # Root component & routing
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles & Tailwind
├── .gitignore
├── eslint.config.js
├── package.json
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── PLAN.md              # Detailed development roadmap
```

---

## 🎨 Design System

### Color Palette
- **Primary:** Indigo/Purple gradient
- **Background:** Dynamic (white in light, dark gray in dark mode)
- **Foreground:** Adaptive text colors
- **Accents:** Language-specific colors (Python=Yellow, Java=Orange, C++=Blue, etc.)

### Language Color Coding
| Language | Badge Color |
|----------|-------------|
| Python | Yellow/Gold |
| Java | Orange |
| C++ | Blue |
| C | Indigo |
| HTML | Red |
| CSS | Light Blue |
| JavaScript | Yellow |
| PHP | Purple |

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration, path aliases |
| `tailwind.config.ts` | Tailwind theme customization, dark mode |
| `tsconfig.json` | TypeScript compiler options |
| `eslint.config.js` | ESLint rules for code quality |
| `.vscode/mcp.json` | MCP server configuration for GitHub Copilot |

---

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

### Contribution Workflow

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes with meaningful commits
5. **Test** thoroughly (run `npm run lint` and `npm test`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request with a clear description

### Coding Standards
- ✅ Follow TypeScript best practices
- ✅ Use ESLint configuration (run `npm run lint`)
- ✅ Write meaningful commit messages (use conventional commits)
- ✅ Add JSDoc comments for complex functions
- ✅ Test all new features before submitting PR
- ✅ Update documentation for new features

---

## 🚀 Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Output will be in the dist/ directory
# Total bundle size: ~463 KB (minified)
# CSS bundle: ~78 KB (minified)
```

### Deployment Platforms

**Current Deployment:** Vercel (auto-deploys from `main` branch)

**Supported Platforms:**
- ✅ Vercel (recommended - zero config)
- ✅ Netlify
- ✅ GitHub Pages
- ✅ AWS S3 + CloudFront
- ✅ Azure Static Web Apps
- ✅ Any static hosting service

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Check code quality
npm run lint
```

**Test Coverage:** Tests are located in `src/test/` directory

---

## 📝 Notable Implementation Details

### LocalStorage Persistence
The app uses a sophisticated localStorage system with automatic data versioning:
- `DATA_VERSION` constant triggers automatic data migration
- All courses, assignments, submissions, and grades persist across sessions
- When mock data changes, users automatically get updated seed data

### Monaco Editor Integration
- Loaded via CDN for smaller bundle size
- Automatic theme synchronization with app theme
- Language-specific file extensions (.py, .java, .cpp, .c, .html, .php)
- Custom starter code templates for each language

### Responsive Design Strategy
- **Desktop:** Multi-panel layout (Instructions | Editor | Output)
- **Mobile:** Tab-based layout (Tasks, Code, Output, Notes)
- Breakpoint: `768px` (Tailwind's `md:` prefix)

---

## 📚 Documentation

- **Development Plan:** See [PLAN.md](PLAN.md) for detailed roadmap
- **Type Definitions:** All types in [src/types/index.ts](src/types/index.ts)
- **API Functions:** Mock API documented in [src/services/mockApi.ts](src/services/mockApi.ts)
- **Component Library:** shadcn/ui docs at [ui.shadcn.com](https://ui.shadcn.com/)

---

## 🎯 Project Goals

### Short-Term (Phase 2)
- Supabase backend integration
- Real code execution engine
- Production authentication system
- Database migration from localStorage

### Long-Term (Phase 3+)
- Real-time collaboration features
- Advanced analytics and reporting
- Mobile app (React Native)
- API for third-party integrations
- Multi-institution support
- LMS integration (Canvas, Moodle, Blackboard)

---

## ⚙️ MCP Server Configuration

This project includes Model Context Protocol (MCP) servers for enhanced AI-assisted development in VS Code:

### Configured Servers
1. **Supabase MCP** - Database queries, migrations, TypeScript types, logs
2. **Context7 MCP** - Live documentation for React, TypeScript, Tailwind CSS
3. **Sequential Thinking MCP** - Enhanced reasoning for complex tasks
4. **Chrome DevTools MCP** - Browser inspection, screenshots, console/network monitoring

**Setup:** See [.vscode/mcp.json](.vscode/mcp.json) for configuration

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Babcock University** - Project sponsorship and requirements
- **shadcn/ui** - Beautiful component primitives
- **Monaco Editor** - World-class code editor
- **Vercel** - Deployment platform
- **React Team** - React 18 and ecosystem
- **Tailwind Labs** - Tailwind CSS framework

---

## 📞 Support & Contact

**Deployment:** [https://babcock-vpl.vercel.app/](https://babcock-vpl.vercel.app/)  
**Repository:** [https://github.com/BISHOP-X/BABCOCK-VPL](https://github.com/BISHOP-X/BABCOCK-VPL)  
**Issues:** [GitHub Issues](https://github.com/BISHOP-X/BABCOCK-VPL/issues)

---

**Version:** 1.0.0-beta  
**Last Updated:** February 16, 2026  
**Status:** ✅ Phase 1 Complete — Ready for Backend Integration
