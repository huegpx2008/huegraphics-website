"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type TurnstileApi = {
  remove(widgetId: string): void;
  render(
    container: HTMLElement,
    options: {
      action: string;
      appearance: "interaction-only";
      callback(token: string): void;
      "error-callback"(): void;
      "expired-callback"(): void;
      "refresh-expired": "auto";
      "response-field": false;
      sitekey: string;
      theme: "light";
    },
  ): string;
  reset(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type SpamProtectionFieldsHandle = {
  reset(): void;
};

type SpamProtectionFieldsProps = {
  action: "contact" | "quote";
};

const turnstileScriptId = "cloudflare-turnstile-script";
let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstile() {
  if (window.turnstile) {
    return Promise.resolve();
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      turnstileScriptId,
    ) as HTMLScriptElement | null;
    const script = existingScript || document.createElement("script");

    const handleLoad = () => resolve();
    const handleError = () => {
      turnstileScriptPromise = null;
      reject(new Error("Turnstile failed to load"));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.id = turnstileScriptId;
      script.async = true;
      script.defer = true;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      document.head.appendChild(script);
    }
  });

  return turnstileScriptPromise;
}

export const SpamProtectionFields = forwardRef<
  SpamProtectionFieldsHandle,
  SpamProtectionFieldsProps
>(function SpamProtectionFields({ action }, ref) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [startedAt, setStartedAt] = useState("");
  const [token, setToken] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);

  const reset = useCallback(() => {
    setToken("");

    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  useEffect(() => {
    setStartedAt(String(Date.now()));

    const form = containerRef.current?.closest("form");
    const handleFormReset = () => setStartedAt(String(Date.now()));

    form?.addEventListener("reset", handleFormReset);
    return () => form?.removeEventListener("reset", handleFormReset);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!siteKey || !containerRef.current) {
      setLoadFailed(true);
      return;
    }

    loadTurnstile()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          action,
          appearance: "interaction-only",
          callback: (value) => setToken(value),
          "error-callback": () => setToken(""),
          "expired-callback": () => setToken(""),
          "refresh-expired": "auto",
          "response-field": false,
          sitekey: siteKey,
          theme: "light",
        });
      })
      .catch(() => {
        if (!cancelled) {
          setLoadFailed(true);
        }
      });

    return () => {
      cancelled = true;

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, siteKey]);

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor={`${action}-company-website`}>Company website</label>
        <input
          id={`${action}-company-website`}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <input name="form_started_at" type="hidden" value={startedAt} readOnly />
      <input name="turnstileToken" type="hidden" value={token} readOnly />
      <div className="mt-4 min-h-px" ref={containerRef} />
      {loadFailed ? (
        <p className="mt-2 text-xs text-red-800" role="status">
          Verification is temporarily unavailable. Please refresh and try again.
        </p>
      ) : null}
    </>
  );
});
