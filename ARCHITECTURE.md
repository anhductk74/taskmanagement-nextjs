# TaskManager - Architecture Guide

## 📚 Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Authentication & Authorization](#authentication--authorization)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Testing Strategy](#testing-strategy)
- [Best Practices](#best-practices)

## 🎯 Project Overview

TaskManager is a task management application inspired by Asana, built with modern web technologies. The project follows Atomic Design principles and feature-based architecture to ensure scalability and maintainability.

## 💻 Technology Stack

- **Framework:** Next.js 13+ (App Router)
- **Language:** TypeScript
- **Styling:** 
  - Tailwind CSS
  - Class Variance Authority (cva)
  - CSS Modules (optional)
- **State Management:** 
  - React Query (Server State)
  - Context API (Global UI State)
  - Zustand (Complex UI State)
- **Authentication:** 
  - NextAuth.js
  - JWT + HTTP-only Cookies
- **Form Management:**
  - React Hook Form
  - Zod Validation
- **Testing:** 
  - Jest
  - React Testing Library
  - Cypress (E2E)
- **Documentation:** 
  - Storybook
  - TypeDoc (API docs)
- **Code Quality:**
  - ESLint
  - Prettier
  - Husky (Git Hooks)
  - TypeScript strict mode

## 📂 Project Structure

```
src/
├── app/                              # Next.js 13+ App Router
│   ├── layout.tsx                    # Root layout (Public)
│   ├── page.tsx                      # Landing page
│   ├── (public)/                     # Public routes
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── (auth)/                       # Authentication routes
│   │   ├── layout.tsx               # Auth layout
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── setup/                   # Initial setup after registration
│   │       └── page.tsx
│   ├── dashboard/                    # Main dashboard area
│   │   ├── layout.tsx               # Dashboard shared layout
│   │   ├── page.tsx                 # Dashboard home
│   │   ├── loading.tsx              # Loading UI
│   │   ├── error.tsx                # Error handling
│   │   ├── projects/                # Projects management
│   │   │   ├── page.tsx            # Projects list
│   │   │   ├── [id]/               # Single project view
│   │   │   │   ├── page.tsx
│   │   │   │   ├── tasks/
│   │   │   │   ├── members/
│   │   │   │   └── settings/
│   │   │   └── new/                # Create new project
│   │   ├── tasks/                  # Tasks management
│   │   │   ├── page.tsx            # All tasks
│   │   │   ├── [id]/              # Single task view
│   │   │   │   ├── page.tsx
│   │   │   │   └── comments/
│   │   │   ├── assigned/          # Tasks assigned to me
│   │   │   └── created/           # Tasks created by me
│   │   ├── owner/                 # Owner specific pages
│   │   │   ├── layout.tsx
│   │   │   ├── report-summary/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── manager/               # Manager specific pages
│   │   │   ├── layout.tsx
│   │   │   └── team-overview/
│   │   │       └── page.tsx
│   │   ├── leader/                # Team leader pages
│   │   │   ├── layout.tsx
│   │   │   └── task-distribution/
│   │   │       └── page.tsx
│   │   └── member/                # Team member pages
│   │       ├── layout.tsx
│   │       └── my-tasks/
│   │           └── page.tsx
│   └── api/                       # API Routes
│       ├── auth/                  # Auth endpoints
│       │   ├── [...nextauth]/
│       │   ├── register/
│       │   └── verify/
│       ├── projects/             # Project endpoints
│       │   ├── route.ts         # GET, POST /api/projects
│       │   └── [id]/
│       │       ├── route.ts     # GET, PUT, DELETE /api/projects/[id]
│       │       ├── members/
│       │       └── tasks/
│       ├── tasks/               # Task endpoints
│       │   ├── route.ts        # GET, POST /api/tasks
│       │   └── [id]/
│       │       ├── route.ts    # GET, PUT, DELETE /api/tasks/[id]
│       │       └── comments/
│       └── users/              # User endpoints
│           ├── route.ts
│           └── [id]/
│
├── components/                    # UI Components (Atomic Design)
│   ├── atoms/                    # Basic UI elements
│   │   ├── Button/              # Button variations
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   ├── Input/               # Input elements
│   │   │   ├── TextInput/
│   │   │   ├── SearchInput/
│   │   │   └── DateInput/
│   │   ├── Select/              # Select components
│   │   │   ├── Select.tsx
│   │   │   └── MultiSelect.tsx
│   │   ├── Avatar/             # User avatars
│   │   │   ├── Avatar.tsx
│   │   │   └── AvatarGroup.tsx
│   │   └── Icon/               # Icon system
│   │       ├── icons/
│   │       └── Icon.tsx
│   │
│   ├── molecules/              # Composite components
│   │   ├── TaskCard/          # Task display
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskStatus.tsx
│   │   │   └── TaskPriority.tsx
│   │   ├── UserDropdown/      # User menu
│   │   │   ├── UserDropdown.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── SearchBar/         # Search functionality
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── FormGroup/         # Form elements
│   │   │   ├── FormGroup.tsx
│   │   │   ├── FormLabel.tsx
│   │   │   └── FormError.tsx
│   │   └── Modals/           # Modal dialogs
│   │       ├── ConfirmModal.tsx
│   │       └── FormModal.tsx
│   │
│   ├── organisms/            # Complex components
│   │   ├── Header/          # Main header
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── UserNav.tsx
│   │   ├── Sidebar/         # Dashboard sidebar
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarItem.tsx
│   │   │   └── SidebarSection.tsx
│   │   ├── TaskBoard/       # Kanban board
│   │   │   ├── TaskBoard.tsx
│   │   │   ├── TaskColumn.tsx
│   │   │   └── TaskDragDrop.tsx
│   │   └── ProjectList/     # Project management
│   │       ├── ProjectList.tsx
│   │       ├── ProjectCard.tsx
│   │       └── ProjectFilters.tsx
│   │
│   └── templates/           # Page layouts
│       ├── DashboardLayout/ # Main app layout
│       │   ├── DashboardLayout.tsx
│       │   └── DashboardHeader.tsx
│       ├── AuthLayout/      # Auth pages layout
│       │   ├── AuthLayout.tsx
│       │   └── AuthHeader.tsx
│       └── ErrorLayout/     # Error pages
│           ├── ErrorLayout.tsx
│           └── ErrorMessage.tsx
│
├── features/                     # Feature modules
│   ├── tasks/                     # Task management
│   │   ├── api/                   # Task API functions
│   │   │   ├── createTask.ts
│   │   │   ├── updateTask.ts
│   │   │   └── deleteTask.ts
│   │   ├── components/            # Task-specific components
│   │   │   ├── TaskForm/
│   │   │   ├── TaskFilters/
│   │   │   └── TaskComments/
│   │   ├── hooks/                # Task-specific hooks
│   │   │   ├── useTask.ts
│   │   │   ├── useTaskList.ts
│   │   │   └── useTaskActions.ts
│   │   ├── store/                # Task state management
│   │   │   ├── taskStore.ts
│   │   │   └── taskSelectors.ts
│   │   ├── types/                # Task type definitions
│   │   │   └── task.types.ts
│   │   └── utils/                # Task utilities
│   │       ├── taskHelpers.ts
│   │       └── taskValidation.ts
│   │
│   ├── projects/                 # Project management
│   │   ├── api/                  # Project API
│   │   │   ├── createProject.ts
│   │   │   └── projectMembers.ts
│   │   ├── components/           # Project components
│   │   │   ├── ProjectForm/
│   │   │   └── ProjectMembers/
│   │   ├── hooks/               # Project hooks
│   │   │   ├── useProject.ts
│   │   │   └── useProjectMembers.ts
│   │   ├── store/               # Project state
│   │   │   └── projectStore.ts
│   │   └── types/               # Project types
│   │       └── project.types.ts
│   │
│   └── auth/                    # Authentication
│       ├── api/                 # Auth API calls
│       │   ├── login.ts
│       │   ├── register.ts
│       │   └── verify.ts
│       ├── components/          # Auth components
│       │   ├── LoginForm/
│       │   └── RegisterForm/
│       ├── hooks/              # Auth hooks
│       │   ├── useAuth.ts
│       │   └── usePermissions.ts
│       ├── store/              # Auth state
│       │   └── authStore.ts
│       └── utils/              # Auth utilities
│           ├── jwt.ts
│           └── validation.ts
│
├── lib/                          # Core utilities
│   ├── api/                       # API infrastructure
│   │   ├── client/               # API client setup
│   │   │   ├── axios.ts         # Axios instance
│   │   │   └── fetch.ts         # Fetch wrapper
│   │   ├── middleware/          # API middlewares
│   │   │   ├── auth.ts
│   │   │   └── error.ts
│   │   └── endpoints.ts         # API endpoints
│   │
│   ├── hooks/                    # Shared hooks
│   │   ├── common/              # Common hooks
│   │   │   ├── useDisclosure.ts
│   │   │   ├── usePagination.ts
│   │   │   └── useDebounce.ts
│   │   ├── form/               # Form hooks
│   │   │   ├── useForm.ts
│   │   │   └── useFieldArray.ts
│   │   └── ui/                 # UI hooks
│   │       ├── useMediaQuery.ts
│   │       └── useLocalStorage.ts
│   │
│   ├── utils/                   # Helper functions
│   │   ├── date/               # Date utilities
│   │   │   ├── format.ts
│   │   │   └── timezone.ts
│   │   ├── validation/         # Validation utils
│   │   │   ├── schemas.ts
│   │   │   └── rules.ts
│   │   └── format/             # Formatting utils
│   │       ├── number.ts
│   │       └── string.ts
│   │
│   └── config/                 # App configuration
│       ├── auth.config.ts
│       ├── api.config.ts
│       └── theme.config.ts
│
├── types/                         # TypeScript types
│   ├── api/                       # API types
│   │   ├── requests.ts           # Request types
│   │   └── responses.ts          # Response types
│   ├── models/                   # Domain models
│   │   ├── user.types.ts
│   │   ├── task.types.ts
│   │   └── project.types.ts
│   └── common/                   # Shared types
│       ├── form.types.ts
│       └── ui.types.ts
│
├── constants/                    # Application constants
│   ├── api.constants.ts         # API related
│   ├── routes.constants.ts      # Route paths
│   ├── validation.constants.ts  # Validation rules
│   └── ui.constants.ts          # UI constants
│
├── styles/                      # Global styles
│   ├── globals.css             # Global CSS
│   ├── themes/                 # Theme files
│   │   ├── light.ts
│   │   └── dark.ts
│   └── components/            # Component styles
│       └── custom/
│
└── config/                     # Configuration
    ├── app.config.ts          # App settings
    ├── auth.config.ts         # Auth config
    ├── api.config.ts          # API config
    └── theme.config.ts        # Theme config
```

## 🎨 Component Architecture

### Atomic Design Pattern

1. **Atoms** (Basic building blocks)
   ```tsx
   // Button.tsx
   interface ButtonProps {
     variant: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
     children: React.ReactNode;
   }
   ```

2. **Molecules** (Groups of atoms)
   ```tsx
   // TaskCard.tsx
   interface TaskCardProps {
     task: Task;
     onStatusChange: (status: TaskStatus) => void;
   }
   ```

3. **Organisms** (Complex components)
   ```tsx
   // TaskBoard.tsx
   interface TaskBoardProps {
     projectId: string;
     layout: 'list' | 'board';
   }
   ```

### Feature-based Organization

```typescript
// features/tasks/api/taskApi.ts
export const taskApi = {
  getTasks: () => axios.get('/api/tasks'),
  createTask: (data: CreateTaskDTO) => axios.post('/api/tasks', data),
};

// features/tasks/hooks/useTask.ts
export const useTask = (taskId: string) => {
  return useQuery(['task', taskId], () => taskApi.getTask(taskId));
};
```

## 👨‍💻 Development Guidelines

### 1. Component Creation Rules

- Clear TypeScript interfaces
- Proper prop types
- Error boundaries when needed
- Loading states
- Error states

### 2. Code Organization

- Group related components
- Shared utils in lib/
- Feature-specific code in features/
- Clear import paths

### 3. State Management

```typescript
// Local State
const [isOpen, setIsOpen] = useState(false);

// Context State
const { tasks, dispatch } = useTaskContext();

// Server State
const { data: tasks } = useQuery('tasks', fetchTasks);
```

### 4. Routing Structure

```typescript
// app/(routes)/(auth)/login/page.tsx
export default function LoginPage() {
  // Implementation
}

// app/(routes)/(admin)/dashboard/page.tsx
export default function DashboardPage() {
  // Implementation
}
```

## ✅ Best Practices

### 1. Component Best Practices

- Single Responsibility
- Props Interface First
- Error Handling
- Loading States
- Accessibility

### 2. Performance Considerations

- Component Memoization
- Proper Key Usage
- Image Optimization
- Code Splitting

### 3. Testing Strategy

- Unit Tests for Utils
- Component Tests
- Integration Tests
- E2E Tests for Flows

### 4. Code Style

```typescript
// Good
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export const UserProfile = ({ user, onUpdate }: UserProfileProps) => {
  // Implementation
};

// Bad
export const UserProfile = (props: any) => {
  // Implementation
};
```

## 🚀 Development Workflow

1. Create Feature Branch
2. Implement Changes
3. Write Tests
4. Update Documentation
5. Create Pull Request

## 📝 Documentation Requirements

1. Component Documentation
   ```typescript
   /**
    * Button component with different variants and sizes.
    * @param variant - The style variant of the button
    * @param size - The size of the button
    * @param children - The content of the button
    */
   ```

2. Feature Documentation
   - Purpose
   - Components
   - Data Flow
   - API Integration

## 🔍 Code Review Guidelines

1. Code Quality
   - TypeScript types
   - Error handling
   - Performance
   - Testing

2. Documentation
   - Component docs
   - Function docs
   - Complex logic explanation

3. Best Practices
   - Atomic Design principles
   - Feature organization
   - State management
   - Error boundaries

## 🤝 Team Collaboration

1. Branch Strategy
   - feature/
   - bugfix/
   - hotfix/

2. PR Template
   - Description
   - Changes
   - Testing
   - Screenshots

3. Code Review Process
   - Technical review
   - UX review
   - Testing verification

## 🎯 Development Process

1. Task Assignment
2. Feature Branch Creation
3. Implementation
4. Testing
5. Documentation
6. Code Review
7. Merge


Reference: https://medium.com/@janelle.wg/atomic-design-pattern-how-to-structure-your-react-application-2bb4d9ca5f97
