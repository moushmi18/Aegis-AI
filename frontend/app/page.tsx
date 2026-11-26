"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return `${new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Calcutta",
  }).format(date)} (Asia/Calcutta)`;
}

function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message && err.message !== "Failed to fetch") {
    return err.message;
  }
  return "Cannot reach the backend. Start the FastAPI server on port 8000 and try again.";
}

async function requestHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/api/v1/health`, {
    signal,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Health check failed with HTTP ${response.status}`);
  }
  return (await response.json()) as HealthResponse;
}

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await requestHealth(controller.signal);
        setHealth(data);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted || (err instanceof DOMException && err.name === "AbortError")) {
          return;
        }
        setHealth(null);
        setError(errorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await requestHealth();
      setHealth(data);
    } catch (err) {
      setHealth(null);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const online = Boolean(health) && !error && !loading;

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_55%)]" />
      <header className="relative z-10 border-b border-cyan-400/15">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-cyan-300">AEGIS AI</p>
            <p className="mt-1 text-sm text-slate-400">
              Autonomous Enterprise Intelligence &amp; Governance System
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              loading
                ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                : online
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : "border-rose-400/40 bg-rose-400/10 text-rose-300"
            }`}
          >
            {loading ? "Checking backend" : online ? "Backend online" : "Backend offline"}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
          Day 1 milestone
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Enterprise agent platform skeleton
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
          This landing page reads live status from the FastAPI health endpoint. No
          sample metrics are shown. When the backend is running, you should see
          the service version, environment, and the timestamp returned by the API.
        </p>

        <section className="mt-10 rounded-2xl border border-cyan-400/20 bg-slate-900/60 p-6 shadow-[0_0_40px_rgba(8,47,73,0.45)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">Backend health</h2>
            <button
              type="button"
              onClick={() => void handleRefresh()}
              className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/10"
            >
              Refresh
            </button>
          </div>
          <p className="mt-2 font-mono text-xs text-slate-500">
            GET {API_URL}/api/v1/health
          </p>

          {loading && (
            <p className="mt-6 text-sm text-amber-200">Contacting the AEGIS AI backend...</p>
          )}

          {error && !loading && (
            <div className="mt-6 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4">
              <p className="text-sm font-medium text-rose-200">Unable to load health status</p>
              <p className="mt-1 text-sm text-rose-100/80">{error}</p>
            </div>
          )}

          {health && !loading && !error && (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <dt className="text-xs uppercase tracking-wider text-slate-400">Status</dt>
                <dd className="mt-1 text-lg font-medium text-emerald-300">{health.status}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <dt className="text-xs uppercase tracking-wider text-slate-400">Service</dt>
                <dd className="mt-1 text-lg font-medium text-white">{health.service}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <dt className="text-xs uppercase tracking-wider text-slate-400">Version</dt>
                <dd className="mt-1 font-mono text-lg text-cyan-200">{health.version}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <dt className="text-xs uppercase tracking-wider text-slate-400">Environment</dt>
                <dd className="mt-1 text-lg font-medium text-white">{health.environment}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-wider text-slate-400">Timestamp</dt>
                <dd className="mt-1 font-mono text-sm text-cyan-100">
                  {formatTimestamp(health.timestamp)}
                </dd>
                <dd className="mt-1 font-mono text-xs text-slate-500">{health.timestamp}</dd>
              </div>
            </dl>
          )}
        </section>
      </main>
    </div>
  );
}
