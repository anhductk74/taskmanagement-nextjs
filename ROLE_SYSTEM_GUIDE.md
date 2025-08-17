# 🔐 Role-Based Access Control (RBAC) System Guide

## Tổng quan hệ thống

Hệ thống RBAC được thiết kế để quản lý quyền truy cập chặt chẽ dựa trên role từ backend. Backend trả về JWT với role trong payload, frontend parse và render UI tương ứng.

## 📋 Backend Integration

<<<<<<< HEAD
### JWT Token Structure
```json
{
  "roles": ["OWNER"],
  "userId": 22,
  "email": "user@gmail.com",
  "sub": "user@gmail.com",
  "iat": 1754840552,
  "exp": 1754841452
=======
### 1. **Truy cập Role Demo**
```
<<<<<<< HEAD
http://localhost:3000/role-demo
=======
http://localhost:3001/role-demo
>>>>>>> origin/anhduc
```

### 2. **Sử dụng DevRoleSwitcher**
- Component xuất hiện ở góc bottom-right trong development mode
- Click để mở panel chuyển đổi role
- Test ngay lập tức các permission khác nhau

### 3. **Import và sử dụng**
```tsx
import { usePermissions } from '@/hooks/usePermissions';
import { RoleGuard } from '@/components/auth/RoleGuard';
```

## 🏗️ **Architecture**

### **Role Hierarchy (Level System)**
```
Admin (100)           - Full system access
├── Owner (90)        - Organization management
├── Project Manager (70) - Project & team management  
├── Leader (50)       - Team leadership
└── Member (10)       - Basic task access
```

### **Permission System**
```typescript
// Resource-based permissions
RESOURCES: users, projects, tasks, teams, reports, settings, billing, portfolios, goals
ACTIONS: create, read, update, delete, manage, assign, approve, export, invite
```

## 🚀 **Usage Examples**

### **1. Component Guards**
```tsx
// Role-based rendering
<RoleGuard roles="admin" fallback={<div>Access Denied</div>}>
  <AdminPanel />
</RoleGuard>

// Minimum role level
<RoleGuard minimumRole="project_manager">
  <ManagementDashboard />
</RoleGuard>

// Permission-based
<RoleGuard resource="projects" action="create">
  <CreateProjectButton />
</RoleGuard>

// Multiple roles
<RoleGuard roles={['admin', 'owner']}>
  <ExecutiveDashboard />
</RoleGuard>
```

### **2. Convenience Components**
```tsx
import { AdminOnly, OwnerOnly, ManagerAndAbove, CanCreateProjects } from '@/components/auth/RoleGuard';

<AdminOnly>
  <AdminTools />
</AdminOnly>

<ManagerAndAbove>
  <ProjectManagement />
</ManagerAndAbove>

<CanCreateProjects>
  <CreateButton />
</CanCreateProjects>
```

### **3. Hook Usage**
```tsx
function MyComponent() {
  const { user, role, can, is } = usePermissions();

  // Permission checks
  if (can.createProjects) {
    // Show create project UI
  }

  // Role checks
  if (is.admin || is.owner) {
    // Show admin features
  }

  // Minimum role check
  if (is.atLeastProjectManager) {
    // Show management features
  }
>>>>>>> d1d89456fef6613b064af36789695f7d8f213495
}
```

### Role Hierarchy (Từ thấp đến cao)
```
GUEST (10) < MEMBER (30) < LEADER (50) < PM (70) < OWNER (80) < ADMIN (90) < SUPER_ADMIN (100)
```

## 🏗️ Cấu trúc hệ thống

### 1. AuthProvider (`src/providers/AuthProvider.tsx`)
- Đọc role từ cookie `userRole` 
- Parse thành UserWithRole object
- Cung cấp context cho toàn app

### 2. RBAC Utilities (`src/utils/rbac.ts`)
- `normalizeRole()`: Convert backend role string → UserRole enum
- `hasPermission()`: Kiểm tra permission
- `canAccessRoute()`: Kiểm tra quyền truy cập route
- `RBACHelper`: Class helper với các method tiện lợi

### 3. RBAC Hooks (`src/hooks/useRBAC.ts`)
- `useRBAC()`: Hook chính để sử dụng trong components
- `usePermission()`: Kiểm tra permission cụ thể
- `useRole()`: Kiểm tra role cụ thể

### 4. RBAC Guards (`src/components/guards/RBACGuard.tsx`)
- `RBACGuard`: Guard tổng quát
- `OwnerGuard`: Chỉ cho Owner+
- `AdminGuard`: Chỉ cho Admin+
- `ManagerGuard`: Chỉ cho PM+

## 🎯 Sidebar Rendering Logic

### Navigation Config (`src/config/rbac-navigation.ts`)

```typescript
// Cấu trúc navigation item với RBAC
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  // RBAC properties
  allowedRoles?: UserRole[];          // Danh sách roles được phép
  requiredPermissions?: Permission[];  // Permissions cần thiết
  minimumRole?: UserRole;             // Role tối thiểu
}
```

### PrivateSidebar Rendering (`src/layouts/private/components/PrivateSidebar.tsx`)

```typescript
const rbac = useRBAC();

// 1. Lấy navigation sections dựa trên role
const navigationSections = useMemo(() => {
  const baseSections = getVisibleNavigationSections(rbac.user);
  
  // Cập nhật với dynamic data
  return baseSections.map(section => {
    // Update task count, projects list, etc.
    return section;
  });
}, [rbac.user, projects, taskStats]);

// 2. Render với guards
<RBACGuard
  roles={item.allowedRoles}
  minimumRole={item.minimumRole}
  permissions={item.requiredPermissions}
  showFallback={false}
>
  <NavigationItem {...item} />
</RBACGuard>
```

## 📝 Role-specific Navigation Items

### OWNER Role có quyền truy cập:

```typescript
// Main Navigation (Tất cả users)
✅ Home
✅ My Tasks  
✅ Inbox

// Owner-specific sections
✅ Portfolios (PM+)
✅ Goals (Leader+)  
✅ Projects (All users, filtered by role)
✅ Reporting (PM+)
✅ Teams (Leader+)
✅ Administration (Owner+)
✅ Owner Panel (Owner only)

// Quick actions
✅ Create Project
✅ Create Team  
✅ Invite Users

// Footer
✅ Billing/Upgrade links
✅ Role indicator with Crown icon
```

<<<<<<< HEAD
### Navigation filtering logic:
=======
<<<<<<< HEAD
## 📋 **Sidebar Menu Structure by Role**
>>>>>>> d1d89456fef6613b064af36789695f7d8f213495

```typescript
export function getVisibleNavigationSections(user: UserWithRole | null): NavigationSection[] {
  return RBAC_NAVIGATION_SECTIONS.filter(section => {
    // Check section level permissions
    if (section.allowedRoles && !canAccessRoute(user, section.allowedRoles)) {
      return false;
    }
    
    if (section.minimumRole && !canAccessRoute(user, [section.minimumRole])) {
      return false;
    }
    
    // Filter items trong section
    const visibleItems = section.items.filter(item => {
      // Check item permissions
      return canAccessItem(user, item);
    });
    
    return visibleItems.length > 0;
  });
}
```

## 🐛 Debug & Troubleshooting

### 1. Kiểm tra Backend JWT
```bash
# Trong browser dev tools
# Application → Cookies → localhost → access_token
# Copy token và decode tại jwt.io
```

### 2. Debug Frontend Role Parsing
```typescript
// Sử dụng debug page
http://localhost:3000/debug-rbac

// Hoặc console debug
const rbac = useRBAC();
rbac.debug(); // In ra thông tin chi tiết
```

### 3. Common Issues và Solutions

#### Issue: Sidebar không hiển thị Owner sections
**Nguyên nhân:** Role không được parse đúng từ JWT
**Solution:**
```typescript
// Check OAuth callback đã decode JWT chưa
const jwtPayload = decodeJWT(finalToken);
const backendRole = jwtPayload?.roles?.[0]; // "OWNER"

// Check RBAC mapping
const normalizedRole = normalizeRole(backendRole); // UserRole.OWNER
```

#### Issue: Các guards không hoạt động
**Nguyên nhân:** Role mapping không đúng
**Solution:**
```typescript
// Update LEGACY_ROLE_MAPPING
export const LEGACY_ROLE_MAPPING = {
  'OWNER': UserRole.OWNER,  // Backend trả về uppercase
  'owner': UserRole.OWNER,  // Support lowercase
  // ... other mappings
};
```

#### Issue: Navigation items không render
**Nguyên nhân:** Icon components không đúng format
**Solution:**
```typescript
// Sử dụng React.createElement
icon: React.createElement(Crown, { size: 20, className: "text-gray-300" })

// Thay vì function reference
icon: Crown // ❌ Sẽ gây lỗi "Objects are not valid as React child"
```

## 🔄 Development Workflow

### 1. Test Role System
```bash
# 1. Login với OAuth
# 2. Check JWT payload trong dev tools
# 3. Verify role trong cookie userRole
# 4. Visit debug page để check parsing
http://localhost:3000/debug-rbac
```

### 2. Add New Role
```typescript
// 1. Add to UserRole enum (src/constants/auth.ts)
export enum UserRole {
  NEW_ROLE = 'NEW_ROLE',
}

// 2. Add permissions (src/constants/auth.ts)
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.NEW_ROLE]: [Permission.SOME_PERMISSION],
};

// 3. Add to hierarchy (src/utils/rbac.ts)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.NEW_ROLE]: 60,
};

// 4. Add to navigation (src/config/rbac-navigation.ts)
allowedRoles: [UserRole.NEW_ROLE],
```

### 3. Add New Permission
```typescript
// 1. Add to Permission enum
export enum Permission {
  NEW_PERMISSION = 'NEW_PERMISSION',
}

// 2. Assign to roles
[UserRole.OWNER]: [Permission.NEW_PERMISSION],

// 3. Use in guards
<RBACGuard permissions={[Permission.NEW_PERMISSION]}>
  Content
</RBACGuard>
```

## 📊 Current OWNER Role Expected Behavior

### ✅ Sidebar sections OWNER nên thấy:
```
📊 Home
✅ My Task
📥 Inbox
📈 Insights
  ├── 🎯 Goals (toàn org)
  ├── 📈 Reports (toàn org)
  └── 💼 Portfolios (toàn org)
📁 Projects (toàn org)
  ├── Project A
  ├── Project B
  └── Project C...
⚙️ Managements
  ├── 📁 Project Management
  ├── 👥 Team Management
  └── 👤 User Management
```

**Chi tiết các sections:**
1. **Main**: Home, My Task, Inbox (always visible)
2. **Insights**: Goals (toàn org), Reports (toàn org), Portfolios (toàn org)  
3. **Projects (toàn org)**: Dynamic list of all projects + Create project button
4. **Managements**: Project Management, Team Management, User Management
5. **Footer**: Crown icon, role indicator, upgrade links (for OWNER)

### ✅ Permissions OWNER nên có:
- MANAGE_WORKSPACE ✅
- MANAGE_USERS ✅  
- CREATE_PROJECT ✅
- MANAGE_TEAM ✅
- VIEW_REPORTS ✅
- MANAGE_BILLING ✅
- INVITE_USERS ✅
- DELETE_PROJECT ✅

### 🔧 Debug Steps for OWNER Role

1. **Check JWT Decode:**
   ```javascript
   // In browser console after login
   const token = document.cookie.split('access_token=')[1]?.split(';')[0];
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log('JWT Role:', payload.roles[0]); // Should be "OWNER"
   ```

2. **Check Cookie Storage:**
   ```javascript
   // Check userRole cookie
   const userRole = document.cookie.split('userRole=')[1]?.split(';')[0];
   console.log('Cookie Role:', decodeURIComponent(userRole)); // Should be "OWNER"
   ```

3. **Check Frontend Parsing:**
   ```javascript
   // In React component
   const rbac = useRBAC();
   console.log('Frontend Role:', rbac.role); // Should be "OWNER"  
   console.log('Is Owner:', rbac.isOwner); // Should be true
   ```

<<<<<<< HEAD
4. **Check Sidebar Sections:**
   ```javascript
   // Should show 8+ navigation sections
   const sections = getVisibleNavigationSections(rbac.user);
   console.log('Visible sections:', sections.length); // Should be 8+
   console.log('Section IDs:', sections.map(s => s.id));
   ```
=======
=======
>>>>>>> origin/anhduc
## 📊 **Permission Matrix**
>>>>>>> d1d89456fef6613b064af36789695f7d8f213495

## 🎯 Expected Result cho OWNER

Khi user login với OWNER role từ backend, sidebar sẽ hiển thị **đầy đủ các sections** với:
- Crown icon ở footer  
- Upgrade/billing links
- All navigation items có permission
- Quick action buttons (Create project, Create team, Invite users)
- Role indicator hiển thị "Owner"

<<<<<<< HEAD
Nếu không đúng, check theo debug steps ở trên! 🔍
=======
### **Role-based Navigation**
```tsx
import { RoleBasedNavigation } from '@/components/layout/RoleBasedNavigation';

// Automatically shows/hides menu items based on permissions
<RoleBasedNavigation />
```

### **Role-based Buttons**
```tsx
import { RoleBasedButtons } from '@/components/examples/RoleBasedButtons';

// Buttons automatically enable/disable based on permissions
<RoleBasedButtons />
```

### **Role Display Utils**
```tsx
import { getRoleDisplayName, getRoleColor, getRoleIcon } from '@/utils/roleUtils';

const roleName = getRoleDisplayName('project_manager'); // "Project Manager"
const roleColor = getRoleColor('admin'); // "#dc2626"
const roleIcon = getRoleIcon('leader'); // "👥"
```

## 🔧 **Development Workflow**

### **1. Test Different Roles**
1. Go to `/role-demo`
2. Use DevRoleSwitcher to change roles
3. See how UI changes instantly
4. Test all permission combinations

### **2. Add New Permissions**
```typescript
// 1. Add to RESOURCES or ACTIONS in src/types/roles.ts
export const RESOURCES = {
  // ... existing
  NEW_RESOURCE: 'new_resource',
} as const;

// 2. Add to role configs
admin: {
  permissions: [
    // ... existing
    {
      resource: RESOURCES.NEW_RESOURCE,
      actions: [ACTIONS.MANAGE]
    }
  ]
}

// 3. Add to usePermissions hook
const can = useMemo(() => ({
  // ... existing
  manageNewResource: hasPermission(RESOURCES.NEW_RESOURCE, ACTIONS.MANAGE),
}), [hasPermission]);
```

### **3. Create New Role Guards**
```tsx
// Create convenience component
export const CanManageNewResource: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <RoleGuard resource="new_resource" action="manage">
    {children}
  </RoleGuard>
);
```

## 🚀 **Production Migration**

### **When Backend is Ready**
```typescript
// 1. Replace MockAuthProvider with real AuthProvider
<AuthProvider> // Instead of MockAuthProvider
  <App />
</AuthProvider>

// 2. Update usePermissions hook
const { user } = useAuthContext(); // Instead of useMockAuth()

// 3. All role guards and permissions work the same!
// No changes needed to components using RoleGuard, usePermissions, etc.
```

### **API Integration**
```typescript
// Real auth service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // Should return { user: UserWithRole, token: string }
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data; // Should return UserWithRole
  }
};
```

## 📝 **Best Practices**

### **1. Use Semantic Guards**
```tsx
// ✅ Good - Clear intent
<CanCreateProjects>
  <CreateButton />
</CanCreateProjects>

// ❌ Avoid - Hard to understand
<RoleGuard resource="projects" action="create">
  <CreateButton />
</RoleGuard>
```

### **2. Provide Fallbacks**
```tsx
// ✅ Good - User knows why they can't see content
<RoleGuard roles="admin" fallback={<div>Admin access required</div>}>
  <AdminPanel />
</RoleGuard>

// ❌ Avoid - Content just disappears
<RoleGuard roles="admin">
  <AdminPanel />
</RoleGuard>
```

### **3. Use Minimum Role When Possible**
```tsx
// ✅ Good - Scales with role hierarchy
<RoleGuard minimumRole="project_manager">
  <ManagementTools />
</RoleGuard>

// ❌ Avoid - Need to update when adding roles
<RoleGuard roles={['admin', 'owner', 'project_manager']}>
  <ManagementTools />
</RoleGuard>
```

## 🎉 **Features**

✅ **5-tier role hierarchy** with level-based permissions  
✅ **Resource-action permission system** for granular control  
✅ **Mock authentication** for frontend development  
✅ **DevRoleSwitcher** for instant role testing  
✅ **Type-safe** with full TypeScript support  
✅ **React components** for easy integration  
✅ **Route protection** with automatic redirects  
✅ **Utility functions** for role management  
✅ **Production-ready** architecture  
✅ **Zero backend dependency** for development  

<<<<<<< HEAD
## 🚨 **Recent Changes & Important Notes**

### **⚠️ Removed Features (Tách riêng quản lý)**
- **Billing** - Đã xóa khỏi sidebar, sẽ quản lý riêng
- **Organization Settings** - Đã xóa khỏi sidebar, sẽ quản lý riêng  
- **Profile & Settings** - Đã xóa khỏi sidebar, sẽ xử lý qua user menu

### **🔧 Current Implementation Status**
- **Reports Link**: `/reporting` (NOT `/reports`)
- **Project Management**: Available for Owner AND PM roles
- **Projects Section**: Dynamic loading with role-based filtering
- **Teams Section**: Member & Leader can view teams they participate in

### **📝 Development Notes for New Team Members**

#### **1. Adding New Menu Items**
```tsx
// 1. Add to src/config/navigation.tsx
{
  id: "new-feature",
  label: "New Feature", 
  href: "/new-feature",
  icon: <Icon />,
  permission: "custom_permission", // Optional
}

// 2. Add permission to src/layouts/private/components/PrivateSidebar.tsx
...(is.owner ? ["custom_permission"] : []),

// 3. Create page at src/app/new-feature/page.tsx
```

#### **2. Role-based Project Filtering**
```tsx
// Current logic in PrivateSidebar.tsx:
// Member: project.status === 'active' (participate in)
// Leader: project.status === 'active' (team projects)  
// PM: project.status === 'active' || 'completed' (manage)
// Owner: All projects (no filter)

// TODO: Update Project model to include:
// - members: User[] 
// - managerId: string
// - teamId: string
```

#### **3. Navigation Architecture**
```
src/config/navigation.tsx          // Menu structure & permissions
src/layouts/private/components/    // Sidebar implementation
  ├── PrivateSidebar.tsx          // Main sidebar with role logic
src/hooks/usePermissions.ts        // Permission checking
```

#### **4. Testing Roles**
```bash
# 1. Enable DevMode in src/app/layout.tsx
<MockAuthProvider enableDevMode={true}>

# 2. Use DevRoleSwitcher (bottom-right corner)
# 3. Or visit http://localhost:3001/role-demo
```

### **🎯 TODO for Production**
- [ ] Update Project model with members/managerId/teamId
- [ ] Implement proper role-based project filtering
- [ ] Create Billing management interface (separate)
- [ ] Create Organization Settings interface (separate)
- [ ] Implement user menu for Profile & Settings
- [ ] Replace MockAuthProvider with real authentication

=======
>>>>>>> origin/anhduc
## 🔗 **Key Files**

- `src/types/roles.ts` - Role definitions and permissions
- `src/hooks/usePermissions.ts` - Permission management hook
- `src/components/auth/RoleGuard.tsx` - Component-level guards
- `src/components/auth/ProtectedRoute.tsx` - Route-level protection
- `src/providers/MockAuthProvider.tsx` - Mock authentication
- `src/components/dev/DevRoleSwitcher.tsx` - Development role switcher
- `src/utils/roleUtils.ts` - Role utility functions
- `src/app/(dashboard)/role-demo/page.tsx` - Demo page
<<<<<<< HEAD
- `src/config/navigation.tsx` - **Sidebar menu structure**
- `src/layouts/private/components/PrivateSidebar.tsx` - **Sidebar implementation**
=======
>>>>>>> origin/anhduc

**Ready to use! 🚀 Visit `/role-demo` to see it in action!**
>>>>>>> d1d89456fef6613b064af36789695f7d8f213495
