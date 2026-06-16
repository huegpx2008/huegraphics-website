"use client";

import { FormEvent, useState } from "react";

type AdminLoginFormProps = {
  nextPath: string;
  isConfigured: boolean;
};

export function AdminLoginForm({
  nextPath,
  isConfigured,
}: AdminLoginFormProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, nextPath }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        redirectTo?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Unable to sign in.");
      }

      window.location.assign(payload.redirectTo || "/admin");
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Unable to sign in.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitLogin} className="mt-8 grid gap-5">
      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-[#7591ad]">
          Admin password
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          disabled={!isConfigured || isSubmitting}
          className="h-12 rounded-md border border-white/15 bg-[#091626] px-4 text-base font-semibold text-white outline-none transition focus:border-[#2f91e6]"
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-[#ef7777]/45 bg-[#3b1118] px-4 py-3 text-sm font-bold text-[#ffd4d4]"
        >
          {error}
        </p>
      ) : null}

      {!isConfigured ? (
        <p
          role="alert"
          className="rounded-md border border-[#efc76e]/45 bg-[#33260c] px-4 py-3 text-sm font-bold leading-6 text-[#ffe5a6]"
        >
          Admin access is not configured. Add ADMIN_UPLOAD_PASSWORD to the
          server environment and restart the app.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!isConfigured || isSubmitting}
        className="h-12 rounded-md bg-[#247fc9] px-5 text-sm font-black uppercase text-white transition hover:bg-[#3195e8] disabled:cursor-not-allowed disabled:bg-[#42566b]"
      >
        {isSubmitting ? "Signing in..." : "Open admin"}
      </button>
    </form>
  );
}
