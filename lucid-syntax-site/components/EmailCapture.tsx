'use client';

import { useId, useState } from 'react';

export function EmailCapture() {
  const inputId = useId();
  const statusId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Try again.');
        return;
      }
      setStatus('success');
      setMessage("You're on the list. Watch your inbox.");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3" noValidate>
      <label htmlFor={inputId} className="font-body text-xs uppercase tracking-widest2 text-bone-500">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={statusId}
          className="w-full border border-bone-100/30 bg-transparent px-4 py-3 font-body text-bone-50 placeholder:text-bone-500 focus:border-crimson-400"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 border border-bone-50 bg-bone-50 px-6 py-3 font-body text-sm font-semibold uppercase tracking-widest text-ink-950 transition-colors duration-300 ease-decay hover:bg-crimson-500 hover:text-bone-50 disabled:opacity-50"
        >
          {status === 'loading' ? 'Joining…' : 'Join'}
        </button>
      </div>
      <p id={statusId} role="status" aria-live="polite" className="font-body text-sm text-bone-400">
        {status === 'success' && <span className="text-bone-100">{message}</span>}
        {status === 'error' && <span className="text-crimson-300">{message}</span>}
      </p>
    </form>
  );
}
