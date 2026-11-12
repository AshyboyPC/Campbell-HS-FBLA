"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Request = { id: string; name: string; email: string; replacesLogin: boolean; replacesEmail: boolean };

export function AccountMatchRequests({ requests }: { requests: Request[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState("");
  const [linked, setLinked] = useState<string[]>([]);

  async function link(id: string) {
    setSaving(id);
    setMessage("");
    try {
      const response = await fetch(`/api/points/account-matches/${id}`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The account could not be linked.");
      setLinked(current => [...current, id]);
      setMessage("Personal email linked to the existing member record.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The account could not be linked.");
    } finally {
      setSaving("");
    }
  }

  if (!requests.length && !message) return null;
  return <section className="portal-followup-panel">
    <h2>Personal email requests</h2>
    <p>Verify the member’s identity before linking their personal email to the roster.</p>
    {requests.filter(request => !linked.includes(request.id)).map(request => (
      <div className="portal-inline-actions" key={request.id}>
        <span>{request.name} · {request.email}{request.replacesLogin ? " (replaces the current login)" : request.replacesEmail ? " (updates the saved email)" : ""}</span>
        <button type="button" disabled={Boolean(saving)} onClick={() => link(request.id)}>
          {saving === request.id ? "Linking…" : request.replacesLogin ? "Verify and replace login" : "Verify and link"}
        </button>
      </div>
    ))}
    {message && <p role="status">{message}</p>}
  </section>;
}
