"use server"

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { getCollection } from "@/lib/db";
import { RegisterFormSchema } from "@/lib/rules";
import { createSession } from "@/lib/sessions";

export async function register(state, formData) {

    const validateFields = RegisterFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if(!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
        };
    }

    const {email, password} = validateFields.data;
    const userCollection = await getCollection("users");
    if(!userCollection) return { errors: { email: "Server error!" } };

    const existingUser = await userCollection.findOne({ email });
    if(existingUser) return { errors: { email: "Email already exist in our database!" } };

    const hashedPassword = await bcrypt.hash(password, 10);

    const results = await userCollection.insertOne({ email, hashedPassword });

    await createSession(results.insertedId.toString());

    redirect("/dashboard");
}