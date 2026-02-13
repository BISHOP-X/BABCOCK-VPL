# Virtual Programming Lab (VPL)

A modern, web-based virtual programming laboratory designed for educational institutions. This platform provides an interactive environment for students to learn and practice programming while giving lecturers powerful tools to manage courses, create assignments, and track student progress.

## Overview

Virtual Programming Lab enables students to write, compile, and execute code directly in their browser without any local setup. The platform supports multiple programming languages including Python, Java, and C++, making it an ideal solution for computer science education.

## Features

- **Interactive Code Editor**: Browser-based IDE with syntax highlighting and auto-completion
- **Multi-Language Support**: Python, Java, and C++ compilation and execution
- **Student Dashboard**: Access courses, submit assignments, and track progress
- **Lecturer Dashboard**: Create courses, manage assignments, and monitor student analytics
- **Real-time Compilation**: Instant feedback on code execution
- **Progress Analytics**: Comprehensive insights into student performance
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

This project is built with modern web technologies:

- **React 18.3** - UI library for building interactive user interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **React Router** - Client-side routing
- **Recharts** - Data visualization for analytics

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd HOD_VLAB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   
   Open your browser and navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
HOD_VLAB/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and media files
│   ├── components/  # Reusable UI components
│   │   └── ui/      # shadcn/ui components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions
│   ├── pages/       # Application pages/routes
│   ├── test/        # Test files
│   ├── App.tsx      # Root component
│   └── main.tsx     # Application entry point
├── package.json     # Project dependencies
└── vite.config.ts   # Vite configuration
```

## MCP (Model Context Protocol) Configuration

This project includes MCP server configurations for enhanced AI capabilities in VS Code with GitHub Copilot:

### Configured MCP Servers

1. **Context-7** - Semantic search and context management using Upstash Vector Database
2. **Supabase** - Database integration and queries
3. **Critical Thinking** - Enhanced reasoning capabilities using Upstash Redis

### Setup Instructions

1. **Copy the environment template**
   ```bash
   cp .env.example .env
   ```

2. **Configure your credentials** in `.env`:
   - Get Upstash credentials from [upstash.com](https://upstash.com/)
   - Get Supabase credentials from [supabase.com](https://supabase.com/)

3. **The MCP servers are configured** in [.vscode/mcp.json](.vscode/mcp.json)

4. **Manage MCP servers** in VS Code:
   - Open Extensions view (`Ctrl+Shift+X`)
   - View MCP servers section
   - Or run: `MCP: List Servers` from Command Palette

### Using MCP Tools

Once configured, the MCP servers provide specialized tools in GitHub Copilot's agent mode:
- Semantic search across your codebase
- Database scaffolding and queries
- Enhanced problem-solving capabilities

## Usage

### For Students

1. Navigate to the Student Dashboard
2. Browse available courses (Python, Java, C++)
3. Access the Virtual Lab to write and execute code
4. Submit assignments and track your progress

### For Lecturers

1. Access the Lecturer Dashboard
2. Create and manage programming courses
3. Assign coding exercises to students
4. Monitor student progress through analytics
5. Review and grade submissions

## Deployment

### Build for Production

```bash
npm run build
```

The optimized production build will be generated in the `dist/` directory.

### Deploy to Hosting Platform

You can deploy the built application to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

## Configuration

Configuration files are located in the root directory:

- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.js` - ESLint rules

## Contributing

We welcome contributions to improve the Virtual Programming Lab!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow TypeScript best practices
- Use ESLint configuration for code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or feature requests:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

## Acknowledgments

Built with modern web technologies and best practices to provide a seamless educational experience for programming students and instructors.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
