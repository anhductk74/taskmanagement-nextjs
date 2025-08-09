# 🚀 Frontend Integration Guide - Task Management Backend

## 📋 Tổng quan hệ thống

Task Management Backend là một RESTful API được xây dựng bằng **Spring Boot 3.5.4** với **Java 21**, cung cấp đầy đủ các tính năng quản lý công việc, người dùng, và tổ chức.

### 🏗️ Tech Stack Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 21
- **Database**: MySQL 8.0+
- **Authentication**: JWT + Google OAuth2
- **Documentation**: Swagger/OpenAPI 3
- **Security**: Spring Security 6

## 🔐 Authentication & Authorization

### 1. **Authentication Methods**

#### **Traditional Login**
```javascript
// POST /api/auth/login
const loginUser = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: "user@example.com",
      password: "password123"
    })
  });
  
  const data = await response.json();
  // Response structure:
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900, // 15 minutes
    "tokenType": "Bearer",
    "userInfo": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatarUrl": "https://...",
      "isFirstLogin": false
    }
  }
};
```

#### **Google OAuth2 Login**
```javascript
// Step 1: Get Google Auth URL
const getGoogleAuthUrl = async () => {
  const response = await fetch('/api/auth/google/url');
  const data = await response.json();
  // Response: { "authUrl": "https://accounts.google.com/...", "state": "uuid" }
  window.location.href = data.authUrl;
};

// Step 2: Handle callback (automatic redirect)
// Backend sẽ redirect về frontend với tokens trong URL params
// http://localhost:3000/auth/callback?access_token=xxx&refresh_token=xxx&user_id=1&email=xxx

// Step 3: Extract tokens from URL
const handleGoogleCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const refreshToken = urlParams.get('refresh_token');
  const userId = urlParams.get('user_id');
  const email = urlParams.get('email');
  
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // Redirect to dashboard
  }
};
```

#### **Token Refresh**
```javascript
// POST /api/auth/refresh
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: refreshToken
    })
  });
  
  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};
```

### 2. **Authorization Headers**
```javascript
// Tất cả API calls cần header này
const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  // Handle token expiration
  if (response.status === 401) {
    await refreshToken();
    // Retry request
    return apiCall(url, options);
  }
  
  return response.json();
};
```

## 👥 User Management & Roles

### **Role System**
Backend sử dụng role-based access control với các roles sau:

```javascript
const USER_ROLES = {
  OWNER: 'OWNER',       // Toàn quyền hệ thống
  ADMIN: 'ADMIN',       // Quản trị viên
  PM: 'PM',            // Project Manager
  LEADER: 'LEADER',    // Team Leader  
  MEMBER: 'MEMBER'     // Thành viên thường
};

// Role hierarchy (từ cao xuống thấp)
// OWNER > ADMIN > PM > LEADER > MEMBER
```

### **User APIs**

#### **Get All Users** (Requires: OWNER/PM/LEADER)
```javascript
// GET /api/users
const getAllUsers = async () => {
  const users = await apiCall('/api/users');
  // Response: Array of UserResponseDto
  [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["MEMBER"],
      "organization": {
        "id": 1,
        "name": "Company ABC"
      },
      "createdAt": "2024-01-01T10:00:00",
      "deleted": false,
      "firstLogin": false
    }
  ]
};
```

#### **Create User** 
```javascript
// POST /api/users
const createUser = async (userData) => {
  const newUser = await apiCall('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      email: "newuser@example.com",
      password: "password123",
      firstName: "Jane",
      lastName: "Smith",
      roleIds: [1], // MEMBER role ID
      organizationId: 1
    })
  });
};
```

#### **Update User**
```javascript
// PUT /api/users/{id}
const updateUser = async (userId, updateData) => {
  const updatedUser = await apiCall(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      firstName: "Updated Name",
      lastName: "Updated Last",
      roleIds: [2] // Update roles
    })
  });
};
```

#### **Get User by Email**
```javascript
// GET /api/users/by-email?email=xxx
const getUserByEmail = async (email) => {
  const user = await apiCall(`/api/users/by-email?email=${email}`);
};
```

## 🏢 Organization Management

### **Auto-Organization Creation**
Backend tự động tạo organization dựa trên email domain:

```javascript
// Khi user đăng nhập với email: john@vku.udn.vn
// Backend sẽ:
// 1. Extract domain: vku.udn.vn
// 2. Tìm organization có emailDomain = "vku.udn.vn"
// 3. Nếu không có -> Tự động tạo "Vietnam Korea University"
// 4. Assign user vào organization đó

const EMAIL_DOMAIN_MAPPING = {
  'vku.udn.vn': 'Vietnam Korea University',
  'hust.edu.vn': 'Hanoi University of Science and Technology',
  'uit.edu.vn': 'University of Information Technology',
  'company.com': 'Company Organization'
};
```

### **Organization APIs**

#### **Get All Organizations**
```javascript
// GET /api/organizations
const getAllOrganizations = async () => {
  const orgs = await apiCall('/api/organizations');
  // Response:
  [
    {
      "id": 1,
      "name": "Vietnam Korea University",
      "emailDomain": "vku.udn.vn",
      "ownerId": 1,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
};
```

#### **Create Organization**
```javascript
// POST /api/organizations
const createOrganization = async (orgData) => {
  const newOrg = await apiCall('/api/organizations', {
    method: 'POST',
    body: JSON.stringify({
      name: "New Company",
      emailDomain: "newcompany.com",
      owner_id: 1
    })
  });
};
```

## 📋 Task Management

### **Task Status & Priority**
```javascript
const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS', 
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
};

const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};
```

### **Task APIs**

#### **Get All Tasks**
```javascript
// GET /api/tasks
const getAllTasks = async () => {
  const tasks = await apiCall('/api/tasks');
  // Response:
  [
    {
      "id": 1,
      "title": "Implement user authentication",
      "description": "Add JWT authentication to the system",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "deadline": "2024-01-15",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-02T14:30:00",
      "assignedToIds": [1, 2],
      "groupId": 1,
      "projectId": 1,
      "creatorId": 1,
      "checklists": [
        {
          "id": 1,
          "title": "Setup JWT library",
          "completed": true
        }
      ]
    }
  ]
};
```

#### **Create Task**
```javascript
// POST /api/tasks
const createTask = async (taskData) => {
  const newTask = await apiCall('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({
      title: "New Task",
      description: "Task description",
      status: "TODO",
      priority: "MEDIUM",
      deadline: "2024-02-01",
      assignedToIds: [1, 2],
      projectId: 1,
      groupId: 1
    })
  });
};
```

#### **Update Task**
```javascript
// PUT /api/tasks/{id}
const updateTask = async (taskId, updateData) => {
  const updatedTask = await apiCall(`/api/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: "Updated Task Title",
      status: "IN_PROGRESS",
      priority: "HIGH"
    })
  });
};
```

#### **Delete Task**
```javascript
// DELETE /api/tasks/{id}
const deleteTask = async (taskId) => {
  await apiCall(`/api/tasks/${taskId}`, {
    method: 'DELETE'
  });
  // Response: "Task deleted successfully."
};
```

## 📁 Project Management

### **Project Status**
```javascript
const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  ACTIVE: 'ACTIVE',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};
```

### **Project APIs**

#### **Get All Projects**
```javascript
// GET /api/projects
const getAllProjects = async () => {
  const projects = await apiCall('/api/projects');
  // Response: Array of ProjectResponseDto
};
```

#### **Create Project**
```javascript
// POST /api/projects
const createProject = async (projectData) => {
  const newProject = await apiCall('/api/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: "New Project",
      description: "Project description",
      status: "PLANNING",
      startDate: "2024-01-01",
      endDate: "2024-06-01",
      managerId: 1,
      teamIds: [1, 2]
    })
  });
};
```

## 👥 Team Management

### **Team APIs**

#### **Get All Teams**
```javascript
// GET /api/teams
const getAllTeams = async () => {
  const teams = await apiCall('/api/teams');
};
```

#### **Create Team**
```javascript
// POST /api/teams
const createTeam = async (teamData) => {
  const newTeam = await apiCall('/api/teams', {
    method: 'POST',
    body: JSON.stringify({
      name: "Development Team",
      description: "Frontend & Backend developers",
      leaderId: 1,
      memberIds: [2, 3, 4],
      projectId: 1
    })
  });
};
```

## ✅ Task Checklists

### **Checklist APIs**

#### **Get Task Checklists**
```javascript
// GET /api/task-checklists?taskId=1
const getTaskChecklists = async (taskId) => {
  const checklists = await apiCall(`/api/task-checklists?taskId=${taskId}`);
  // Response:
  [
    {
      "id": 1,
      "title": "Setup development environment",
      "completed": true,
      "taskId": 1,
      "createdAt": "2024-01-01T10:00:00"
    }
  ]
};
```

#### **Create Checklist Item**
```javascript
// POST /api/task-checklists
const createChecklistItem = async (checklistData) => {
  const newItem = await apiCall('/api/task-checklists', {
    method: 'POST',
    body: JSON.stringify({
      title: "New checklist item",
      completed: false,
      taskId: 1
    })
  });
};
```

#### **Update Checklist Item**
```javascript
// PUT /api/task-checklists/{id}
const updateChecklistItem = async (itemId, updateData) => {
  const updatedItem = await apiCall(`/api/task-checklists/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: "Updated item",
      completed: true
    })
  });
};
```

## 📎 File Attachments

### **Attachment APIs**

#### **Upload File**
```javascript
// POST /api/task-attachments
const uploadFile = async (taskId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('taskId', taskId);
  formData.append('description', 'File description');
  
  const response = await fetch('/api/task-attachments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData
  });
  
  return response.json();
};
```

#### **Get Task Attachments**
```javascript
// GET /api/task-attachments?taskId=1
const getTaskAttachments = async (taskId) => {
  const attachments = await apiCall(`/api/task-attachments?taskId=${taskId}`);
  // Response:
  [
    {
      "id": 1,
      "fileName": "document.pdf",
      "fileUrl": "https://storage.../document.pdf",
      "fileSize": 1024000,
      "mimeType": "application/pdf",
      "taskId": 1,
      "uploadedBy": 1,
      "uploadedAt": "2024-01-01T10:00:00"
    }
  ]
};
```

## 👤 User Profiles

### **Profile APIs**

#### **Get User Profile**
```javascript
// GET /api/userprofile/{userId}
const getUserProfile = async (userId) => {
  const profile = await apiCall(`/api/userprofile/${userId}`);
  // Response:
  {
    "id": 1,
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+84123456789",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-01",
    "avtUrl": "https://avatar.../user1.jpg",
    "status": "active"
  }
};
```

#### **Update Profile**
```javascript
// PUT /api/userprofile/{id}
const updateProfile = async (profileId, profileData) => {
  const updatedProfile = await apiCall(`/api/userprofile/${profileId}`, {
    method: 'PUT',
    body: JSON.stringify({
      firstName: "Updated Name",
      lastName: "Updated Last",
      phone: "+84987654321",
      address: "456 New St"
    })
  });
};
```

## 📊 Admin & Monitoring

### **Token Management** (Admin Only)

#### **Get Token Statistics**
```javascript
// GET /api/admin/tokens/stats (Requires ADMIN/OWNER role)
const getTokenStats = async () => {
  const stats = await apiCall('/api/admin/tokens/stats');
  // Response:
  {
    "totalTokens": 15420,
    "activeTokens": 8230,
    "expiredTokens": 5190,
    "revokedTokens": 2000
  }
};
```

#### **Manual Token Cleanup**
```javascript
// POST /api/admin/tokens/cleanup/expired (Requires ADMIN/OWNER role)
const cleanupTokens = async () => {
  const result = await apiCall('/api/admin/tokens/cleanup/expired', {
    method: 'POST'
  });
  // Response:
  {
    "status": "success",
    "message": "Expired tokens cleanup completed successfully"
  }
};
```

### **System Health Check**
```javascript
// GET /api/admin/tokens/health (Requires ADMIN/OWNER role)
const getSystemHealth = async () => {
  const health = await apiCall('/api/admin/tokens/health');
  // Response:
  {
    "status": "healthy", // healthy | warning | critical
    "totalTokens": 45230,
    "activeTokens": 38200,
    "activeRatio": "84.45%",
    "recommendations": "Token system is healthy"
  }
};
```

## 📅 Calendar Integration

### **Calendar APIs**

#### **Get Calendar Integrations**
```javascript
// GET /api/calendar-integrations
const getCalendarIntegrations = async () => {
  const integrations = await apiCall('/api/calendar-integrations');
};
```

#### **Create Calendar Integration**
```javascript
// POST /api/calendar-integrations
const createCalendarIntegration = async (integrationData) => {
  const newIntegration = await apiCall('/api/calendar-integrations', {
    method: 'POST',
    body: JSON.stringify({
      provider: "GOOGLE_CALENDAR",
      accessToken: "calendar_access_token",
      refreshToken: "calendar_refresh_token",
      userId: 1,
      settings: {
        syncTasks: true,
        syncDeadlines: true,
        calendarId: "primary"
      }
    })
  });
};
```

## 📝 Audit Logs

### **Audit Log APIs**

#### **Get Audit Logs** (Admin Only)
```javascript
// GET /api/audit-logs (Requires ADMIN/OWNER role)
const getAuditLogs = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const logs = await apiCall(`/api/audit-logs?${queryParams}`);
  // Response:
  [
    {
      "id": 1,
      "action": "USER_LOGIN",
      "entityType": "USER",
      "entityId": 1,
      "userId": 1,
      "details": "User logged in successfully",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-01-01T10:00:00"
    }
  ]
};
```

## 🔧 Error Handling

### **Standard Error Response**
```javascript
// Tất cả API errors đều có format này:
{
  "error": "VALIDATION_ERROR",
  "message": "Email is required",
  "details": {
    "field": "email",
    "code": "REQUIRED"
  },
  "timestamp": "2024-01-01T10:00:00",
  "path": "/api/users"
}
```

### **HTTP Status Codes**
```javascript
const HTTP_STATUS = {
  200: 'OK - Success',
  201: 'Created - Resource created successfully',
  400: 'Bad Request - Validation error',
  401: 'Unauthorized - Invalid or expired token',
  403: 'Forbidden - Insufficient permissions',
  404: 'Not Found - Resource not found',
  409: 'Conflict - Resource already exists',
  500: 'Internal Server Error - Server error'
};
```

### **Error Handling Pattern**
```javascript
const handleApiError = (error, response) => {
  switch (response.status) {
    case 400:
      // Validation errors - show field errors
      showValidationErrors(error.details);
      break;
    case 401:
      // Unauthorized - redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      break;
    case 403:
      // Forbidden - show permission error
      showError('You do not have permission to perform this action');
      break;
    case 404:
      // Not found - show not found message
      showError('Resource not found');
      break;
    case 500:
      // Server error - show generic error
      showError('An unexpected error occurred. Please try again later.');
      break;
    default:
      showError('An error occurred: ' + error.message);
  }
};
```

## 🚀 Frontend Implementation Examples

### **React Hook for API Calls**
```javascript
import { useState, useEffect } from 'react';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall(url, options);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Usage
const TaskList = () => {
  const { data: tasks, loading, error } = useApi('/api/tasks');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>
        </div>
      ))}
    </div>
  );
};
```

### **Vue.js Composition API**
```javascript
import { ref, onMounted } from 'vue';

export function useTasks() {
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchTasks = async () => {
    try {
      loading.value = true;
      tasks.value = await apiCall('/api/tasks');
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (taskData) => {
    const newTask = await apiCall('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
    tasks.value.push(newTask);
    return newTask;
  };

  onMounted(fetchTasks);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask
  };
}
```

### **Angular Service**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = '/api/tasks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl, { 
      headers: this.getHeaders() 
    });
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task, { 
      headers: this.getHeaders() 
    });
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task, { 
      headers: this.getHeaders() 
    });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }
}
```

## 🔍 Testing & Development

### **API Testing với Swagger**
```
http://localhost:8080/swagger-ui.html
```

### **Test API với cURL**
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get tasks
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create task
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "HIGH",
    "status": "TODO"
  }'
```

## 📞 Support & Documentation

### **Backend URLs**
- **API Base**: `http://localhost:8080/api`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Health Check**: `http://localhost:8080/actuator/health`

### **Environment Variables**
```bash
# Backend Configuration
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000

# Database
DB_URL=jdbc:mysql://localhost:3306/db_taskmanagement
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_TOKEN_EXPIRATION=900000

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **Common Issues & Solutions**

1. **CORS Issues**: Backend đã config CORS cho `http://localhost:3000`
2. **Token Expiration**: Implement auto-refresh mechanism
3. **File Upload**: Use FormData for file uploads
4. **Role Permissions**: Check user roles before showing UI elements

**🎉 Happy coding! Backend API đã sẵn sàng cho frontend integration.**