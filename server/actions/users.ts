"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createUserSchema, updateUserSchema } from "@/lib/validations";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import type { UserDTO, DashboardStats, ApiResponse, PaginatedResponse } from "@/types";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.SUPER_ADMIN) {
    throw new Error("Forbidden: admin access required");
  }
  return session;
}

export async function getUsers(
  page = 1,
  pageSize = 10,
  search?: string
): Promise<PaginatedResponse<UserDTO>> {
  await auth(); // require authentication

  const skip = (page - 1) * pageSize;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    db.user.count({ where }),
  ]);

  return {
    data: users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getUserById(id: string): Promise<ApiResponse<UserDTO>> {
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { data: user };
  } catch {
    return { error: "Failed to fetch user" };
  }
}

export async function createUser(
  values: z.infer<typeof createUserSchema>
): Promise<ApiResponse<UserDTO>> {
  await requireAdmin();

  const validated = createUserSchema.safeParse(values);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { name, email, password, role } = validated.data;

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "A user with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath("/dashboard/users");
    return { data: user, message: "User created successfully" };
  } catch {
    return { error: "Failed to create user" };
  }
}

export async function updateUser(
  id: string,
  values: z.infer<typeof updateUserSchema>
): Promise<ApiResponse<UserDTO>> {
  await requireAdmin();

  const validated = updateUserSchema.safeParse(values);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    if (validated.data.email) {
      const existingUser = await db.user.findFirst({
        where: { email: validated.data.email, NOT: { id } },
      });
      if (existingUser) {
        return { error: "Email already in use by another user" };
      }
    }

    const user = await db.user.update({
      where: { id },
      data: validated.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
    return { data: user, message: "User updated successfully" };
  } catch {
    return { error: "Failed to update user" };
  }
}

export async function deleteUser(id: string): Promise<ApiResponse> {
  const session = await requireAdmin();

  if (session.user.id === id) {
    return { error: "You cannot delete your own account" };
  }

  try {
    await db.user.delete({ where: { id } });
    revalidatePath("/dashboard/users");
    return { message: "User deleted successfully" };
  } catch {
    return { error: "Failed to delete user" };
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalUsers, activeUsers, adminUsers, newUsersThisMonth] =
    await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.user.count({ where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } } }),
      db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

  return {
    totalUsers,
    activeUsers,
    adminUsers,
    newUsersThisMonth,
  };
}
