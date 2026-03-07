import { Role } from "@prisma/client";

export type { Role };

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  newUsersThisMonth: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}

export type NavItem = {
  title: string;
  href: string;
  icon: string;
  badge?: number;
};
