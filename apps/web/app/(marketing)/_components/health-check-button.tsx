"use client";

import { useState } from "react";

type HealthData = {
  ok: boolean;
  db: string;
  commit: string;
  timestamp: string;
  error?: string;
};

export function HealthCheckButton() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const json = (await res.json()) as HealthData;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={loading}>
        {loading ? "Checking..." : "Health check"}
      </button>
      {data !== null && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
