"use server";

import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { registerSchema, loginSchema } from "@/lib/validations";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function loginAction(
  values: z.infer<typeof loginSchema>
): Promise<{ success?: boolean; error?: string }> {
  const validated = loginSchema.safeParse(values);

  if (!validated.success) {
    return { error: "Invalid credentials" };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        case "AccountNotLinked":
          return { error: "Account not linked. Try a different sign-in method." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }

    // Re-throw redirect errors
    throw error;
  }
}

export async function registerAction(
  values: z.infer<typeof registerSchema>
): Promise<{ success?: boolean; error?: string }> {
  const validated = registerSchema.safeParse(values);

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { name, email, password } = validated.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Auto sign-in after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created but sign-in failed. Please log in." };
    }
    console.error("Registration error:", error);
    return { error: "Failed to create account. Please try again." };
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
