# Hướng Dẫn Kiến Trúc TaskManager

## 📚 Mục Lục
- [Tổng Quan Dự Án](#tổng-quan-dự-án)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Kiến Trúc Component](#kiến-trúc-component)
- [Xác Thực & Phân Quyền](#xác-thực--phân-quyền)
- [Quản Lý State](#quản-lý-state)
- [Tích Hợp API](#tích-hợp-api)
- [Chiến Lược Testing](#chiến-lược-testing)
- [Quy Tắc Thực Hành](#quy-tắc-thực-hành)

## 🎯 Tổng Quan Dự Án

TaskManager là ứng dụng quản lý công việc lấy cảm hứng từ Asana, được xây dựng bằng các công nghệ web hiện đại. Dự án tuân theo nguyên tắc Atomic Design và kiến trúc dựa trên tính năng để đảm bảo khả năng mở rộng và bảo trì.

## 💻 Công Nghệ Sử Dụng

- **Framework:** Next.js 13+ (App Router)
- **Ngôn ngữ:** TypeScript
- **Style:** 
  - Tailwind CSS
  - Class Variance Authority (cva)
  - CSS Modules (tùy chọn)
- **Quản lý State:** 
  - React Query (Server State)
  - Context API (Global UI State)
  - Zustand (Complex UI State)
- **Xác thực:** 
  - NextAuth.js
  - JWT + HTTP-only Cookies
- **Quản lý Form:**
  - React Hook Form
  - Zod Validation
- **Testing:** 
  - Jest
  - React Testing Library
  - Cypress (E2E)
- **Tài liệu:** 
  - Storybook
  - TypeDoc (API docs)
- **Chất lượng code:**
  - ESLint
  - Prettier
  - Husky (Git Hooks)
  - TypeScript strict mode

## 📂 Cấu Trúc Dự Án

\`\`\`
src/
├── app/                              # Next.js 13+ App Router
│   ├── layout.tsx                    # Layout gốc (Public)
│   ├── page.tsx                      # Trang chủ
│   ├── (public)/                     # Routes công khai
│   │   ├── about/                    # Trang giới thiệu
│   │   └── contact/                  # Trang liên hệ
│   ├── (auth)/                       # Routes xác thực
│   │   ├── layout.tsx               # Layout xác thực
│   │   ├── login/                   # Đăng nhập
│   │   ├── register/                # Đăng ký
│   │   └── setup/                   # Thiết lập ban đầu
│   ├── dashboard/                    # Khu vực dashboard
│   │   ├── layout.tsx               # Layout chung dashboard
│   │   ├── page.tsx                 # Trang dashboard
│   │   ├── projects/                # Quản lý dự án
│   │   │   ├── page.tsx            # Danh sách dự án
│   │   │   └── [id]/               # Chi tiết dự án
│   │   ├── tasks/                  # Quản lý công việc
│   │   │   ├── page.tsx            # Tất cả công việc
│   │   │   └── [id]/              # Chi tiết công việc
│   │   ├── owner/                 # Trang dành cho Owner
│   │   ├── manager/               # Trang dành cho Manager
│   │   ├── leader/                # Trang dành cho Leader
│   │   └── member/                # Trang dành cho Member
│   └── api/                       # API Routes

├── components/                    # Components UI (Atomic Design)
│   ├── atoms/                    # Components cơ bản
│   │   ├── Button/              # Các loại nút
│   │   ├── Input/               # Các loại input
│   │   ├── Select/              # Components select
│   │   └── Icon/                # Hệ thống icon
│   ├── molecules/               # Components kết hợp
│   │   ├── TaskCard/           # Card công việc
│   │   ├── UserDropdown/       # Menu người dùng
│   │   └── FormGroup/          # Nhóm form
│   ├── organisms/              # Components phức tạp
│   │   ├── Header/            # Header chính
│   │   ├── Sidebar/           # Sidebar dashboard
│   │   └── TaskBoard/         # Bảng Kanban
│   └── templates/             # Layout trang

├── features/                  # Modules tính năng
│   ├── tasks/                # Quản lý công việc
│   │   ├── api/             # API công việc
│   │   ├── components/      # Components riêng
│   │   ├── hooks/          # Hooks riêng
│   │   └── utils/          # Tiện ích
│   ├── projects/           # Quản lý dự án
│   └── auth/               # Xác thực

├── lib/                    # Thư viện core
│   ├── api/               # Cấu hình API
│   ├── hooks/             # Hooks dùng chung
│   └── utils/             # Tiện ích dùng chung

├── types/                 # Định nghĩa kiểu dữ liệu
├── constants/             # Hằng số
├── styles/               # Style toàn cục
└── config/               # Cấu hình ứng dụng
\`\`\`

## 🎨 Kiến Trúc Component

### Mô Hình Atomic Design

1. **Atoms** (Components cơ bản)
   ```tsx
   // Button.tsx
   interface ButtonProps {
     variant: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
     children: React.ReactNode;
   }
   ```

2. **Molecules** (Nhóm atoms)
   ```tsx
   // TaskCard.tsx
   interface TaskCardProps {
     task: Task;
     onStatusChange: (status: TaskStatus) => void;
   }
   ```

3. **Organisms** (Components phức tạp)
   ```tsx
   // TaskBoard.tsx
   interface TaskBoardProps {
     projectId: string;
     layout: 'list' | 'board';
   }
   ```

### Tổ Chức Theo Tính Năng

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

## 👨‍💻 Hướng Dẫn Phát Triển

### 1. Quy Tắc Tạo Component

- Interface TypeScript rõ ràng
- Props được định kiểu đúng
- Xử lý lỗi đầy đủ
- Trạng thái loading
- Xử lý trạng thái lỗi

### 2. Tổ Chức Code

- Nhóm components liên quan
- Utils dùng chung trong lib/
- Code theo tính năng trong features/
- Đường dẫn import rõ ràng

### 3. Quản Lý State

```typescript
// Local State
const [isOpen, setIsOpen] = useState(false);

// Context State
const { tasks, dispatch } = useTaskContext();

// Server State
const { data: tasks } = useQuery('tasks', fetchTasks);
```

## ✅ Quy Tắc Thực Hành

### 1. Quy Tắc Component

- Đơn trách nhiệm
- Interface Props đầu tiên
- Xử lý lỗi
- Trạng thái loading
- Hỗ trợ accessibility

### 2. Tối Ưu Hiệu Năng

- Memoization component
- Sử dụng key hợp lý
- Tối ưu hình ảnh
- Code splitting

### 3. Chiến Lược Testing

- Unit Tests cho Utils
- Tests cho Component
- Integration Tests
- E2E Tests cho luồng chính

## 🚀 Quy Trình Phát Triển

1. Tạo nhánh tính năng
2. Triển khai thay đổi
3. Viết tests
4. Cập nhật tài liệu
5. Tạo Pull Request

## 🔍 Quy Trình Review Code

1. Chất Lượng Code
   - Kiểu TypeScript
   - Xử lý lỗi
   - Hiệu năng
   - Testing

2. Tài Liệu
   - Tài liệu component
   - Tài liệu hàm
   - Giải thích logic phức tạp

3. Thực Hành Tốt
   - Nguyên tắc Atomic Design
   - Tổ chức tính năng
   - Quản lý state
   - Error boundaries

Tham khảo: https://medium.com/@janelle.wg/atomic-design-pattern-how-to-structure-your-react-application-2bb4d9ca5f97
