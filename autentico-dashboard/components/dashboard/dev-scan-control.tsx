"use client";

import { useState } from "react";
import { LoaderCircle, Play } from "lucide-react";

const scanEndpoint = "/api/dev/create-lunatech-demo-scan";

type ScanResult = {
  status: number | null;
  scanId: string | null;
  responsesSaved: number | null;
  simulated: boolean;
  error: string | null;
};

type ScanResponse = {
  scan?: { id?: string };
  responsesSaved?: number;
  simulated?: boolean;
  error?: string;
};

export function DevScanControl() {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  async function createTestScan() {
    setIsCreating(true);
    setResult(null);

    try {
      const response = await fetch(scanEndpoint, { method: "POST" });
      const body = (await response.json().catch(() => ({}))) as ScanResponse;

      setResult({
        status: response.status,
        scanId: body.scan?.id ?? null,
        responsesSaved: body.responsesSaved ?? null,
        simulated: body.simulated ?? true,
        error: response.ok ? null : body.error ?? "The request failed.",
      });
    } catch {
      setResult({
        status: null,
        scanId: null,
        responsesSaved: null,
        simulated: true,
        error: "Could not reach the scan endpoint.",
      });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section
      aria-label="Temporary development control"
      className="flex flex-col gap-3 rounded-md border border-dashed border-brand-yellow/30 bg-brand-yellow/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-yellow">
          Development only · Simulated responses
        </p>
        <p className="mt-1 text-[11px] text-brand-muted">
          Saves 5 simulated, non-live responses for LunaTech.
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <button
          type="button"
          onClick={createTestScan}
          disabled={isCreating}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-brand-yellow bg-brand-yellow px-3 py-2 text-xs font-medium text-brand-ink transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? (
            <LoaderCircle className="animate-spin" size={14} />
          ) : (
            <Play size={13} />
          )}
          {isCreating ? "Creating demo scan..." : "Create Demo Scan"}
        </button>
        {result && (
          <div
            aria-live="polite"
            className="max-w-full text-left text-[10px] text-brand-cream/80 sm:text-right"
          >
            <p>HTTP status: {result.status ?? "No response"}</p>
            <p className="break-all">Scan ID: {result.scanId ?? "Not created"}</p>
            <p>
              Simulated responses saved: {result.responsesSaved ?? "Not reported"}
            </p>
            <p>Live AI output: No</p>
            {result.error && (
              <p className="mt-1 max-w-md text-brand-red">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
