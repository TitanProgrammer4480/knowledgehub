"use server"

import { RegisterFormSchema } from "@/lib/rules";

export async function register(sate, formData) {

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
    console.log(validateFields);
}