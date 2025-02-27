"use client"

import { useActionState } from "react";
import {register} from "../../../actions/auth";

export default function Login() {

  const [state, action, isPendig] = useActionState(register, undefined);

  return (
    <div className="container w-1/2">
      <h1 className="title">Login</h1>

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" />
          {state?.errors?.email && <p className="error">{state.errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
          {state?.errors?.password && (
            <div className="error">
              <p>Password must:</p>
              <ul className="list-disc list-inside ml-4">
                {state.errors.password.map(err => (
                <li key={err}>{err}</li> 
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex items-end gap-4">
          <button disabled={isPendig} className="btn-primary">{isPendig ? "Loading...": "Register"}</button>
        </div>
      </form>
    </div>
  )}