
export type UserProfile = {
  id: number;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'inactive';
  User: User;
}

export type User = {
  id: number;
  email: string;
  password: string;
  firstLogin: boolean;
  delete: boolean;
  organizationId: number;
  createdAt: string; 
  updatedAt: string; 
};

export type UserRegister = {
  email: string;
  password: string;
  roleIds: Array<number>;
}

export type Role = {
  id: number;
  name: string;
}

