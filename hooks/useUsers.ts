"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserDTO, PaginatedResponse, UpdateUserFormValues } from "@/types";

const USERS_KEY = "users";

async function fetchUsers(
  page = 1,
  pageSize = 10,
  search?: string
): Promise<PaginatedResponse<UserDTO>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(search ? { search } : {}),
  });

  const res = await fetch(`/api/users?${params}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error ?? "Failed to fetch users");
  }
  return res.json();
}

async function fetchUserById(id: string): Promise<UserDTO> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error ?? "Failed to fetch user");
  }
  return res.json();
}

async function updateUserRequest(
  id: string,
  data: UpdateUserFormValues
): Promise<UserDTO> {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error ?? "Failed to update user");
  }
  return res.json();
}

async function deleteUserRequest(id: string): Promise<void> {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error ?? "Failed to delete user");
  }
}

export function useUsers(page = 1, pageSize = 10, search?: string) {
  return useQuery({
    queryKey: [USERS_KEY, { page, pageSize, search }],
    queryFn: () => fetchUsers(page, pageSize, search),
    placeholderData: (prev) => prev,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserFormValues }) =>
      updateUserRequest(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      queryClient.setQueryData([USERS_KEY, updatedUser.id], updatedUser);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}
