"use server"

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { getCollection } from "@/lib/db";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/rules";
import { createSession } from "@/lib/sessions";
import { cookies } from "next/headers";

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

    const results = await userCollection.insertOne({ email, password: hashedPassword });

    await createSession(results.insertedId.toString());

    redirect("/dashboard");
}

export async function login(state, formData) {

    const validateFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    });

    if(!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            email: formData.get("email")
        };
    }

    const {email, password} = validateFields.data;

    const userCollection = await getCollection("users");
    if(!userCollection) return { errors: { email: "Server error!" } };

    const existingUser = await userCollection.findOne({email});
    if(!existingUser) return { errors: { email: "Invalid credentials" } };

    const matchedPassword = await bcrypt.compare(password, existingUser.password);
    if(!matchedPassword) return { errors: { email: "Invalid credentials" } };

    await createSession(existingUser._id.toString());

    redirect("/dashboard");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/");
}