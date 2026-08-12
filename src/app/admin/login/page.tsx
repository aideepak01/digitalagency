"use client";

import * as React from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, LockKeyhole } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { login, type LoginState } from "./actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, { error: "" });

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-white">
          <LockKeyhole className="size-5" />
        </span>
        <h1 className="text-xl font-semibold text-foreground">Admin sign in</h1>
        <p className="text-sm text-muted-foreground">Manage site content and view submissions.</p>
      </div>

      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 rounded-full bg-gradient-brand text-white hover:opacity-90"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      {/* useSearchParams needs a Suspense boundary during prerender. */}
      <React.Suspense fallback={null}>
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
