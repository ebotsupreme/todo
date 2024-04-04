"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  date: z.string(),
});

const CreateTodo = FormSchema.omit({
  id: true,
  date: true,
  status: true,
  userId: true,
});

export async function createTodo(formData: FormData) {
  const { title, description } = CreateTodo.parse({
    title: formData.get("title"),
    description: formData.get("description"),
  });
  const date = new Date().toISOString().split("T")[0];
  // TODO: Update userId once auth is complete
  const userId = "test123";
  const status = "incomplete";
  console.log("sending... ", title);
  await sql`
    INSERT INTO todos (user_id, title, description, status, date)
    VALUES (${userId}, ${title}, ${description}, ${status}, ${date})
    `;
  console.log("sent...");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}