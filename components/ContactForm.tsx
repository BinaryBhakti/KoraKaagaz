"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { config } from "@/lib/config";
import { BUDGETS, PROJECT_TYPES, TIMELINES } from "@/lib/content";

type Fields = Record<"name" | "email" | "company" | "type" | "budget" | "timeline" | "message", string>;
type Errs = Partial<Record<keyof Fields, string>>;
const KEYS: (keyof Fields)[] = ["name", "email", "company", "type", "budget", "timeline", "message"];

function validate(d: Fields): Errs {
  const errs: Errs = {};
  if (!d.name.trim()) errs.name = "Please tell us your name.";
  if (!d.email.trim()) errs.email = "We need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) errs.email = "That email doesn’t look right.";
  if (!d.type) errs.type = "Pick the closest project type.";
  if (d.message.trim().length < 10) errs.message = "A sentence or two is plenty.";
  return errs;
}

const control =
  "w-full rounded-none border-0 border-b border-[rgba(250,248,243,.45)] bg-transparent py-2.5 text-[17px] text-paper outline-none transition-[border-color] duration-300 focus:border-periwinkle focus:shadow-[0_1px_0_#8AA8FF]";
const select = `${control} cursor-pointer appearance-none`;
const opt = "text-ink";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold tracking-[.18em] uppercase">{label}</span>
      {children}
      {error && <span role="alert" className="text-[13px] text-error"><span className="glyph">✕</span> {error}</span>}
    </label>
  );
}

export function ContactForm() {
  const [errs, setErrs] = useState<Errs>({});
  const [statusMsg, setStatusMsg] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const d = Object.fromEntries(KEYS.map((k) => [k, String(fd.get(k) || "")])) as Fields;
    const found = validate(d);
    setErrs(found);
    setStatusMsg("");
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const { formEndpoint: endpoint, studioEmail: email } = config;
    if (endpoint) {
      setSending(true);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...d, source: "korakaagaz.co" }),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatusMsg(`Thank you — your note is with the studio. We’ll reply to ${d.email}.`);
      } catch {
        setStatusMsg("Something went wrong sending your enquiry. Please try again" + (email ? `, or email ${email}.` : "."));
      } finally {
        setSending(false);
      }
      return;
    }
    if (email) {
      const body = `Name: ${d.name}\nEmail: ${d.email}\nCompany: ${d.company}\nType: ${d.type}\nBudget: ${d.budget || "Not sure yet"}\nTimeline: ${d.timeline || "Flexible"}\n\n${d.message}`;
      location.href = `mailto:${email}?subject=${encodeURIComponent("Project enquiry — " + (d.company || d.name))}&body=${encodeURIComponent(body)}`;
      setStatusMsg("Your email app should open with the enquiry filled in — just press send.");
      return;
    }
    setStatusMsg("Enquiries aren’t connected yet. The studio still needs to set a form endpoint or contact email — nothing has been sent.");
  }

  return (
    <form
      data-reveal=""
      noValidate
      onSubmit={submit}
      aria-label="Project enquiry"
      className="flex flex-col gap-[30px] border border-[rgba(138,168,255,.25)] bg-[rgba(7,26,67,.6)] p-[clamp(24px,3vw,40px)] backdrop-blur-[14px]"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-7">
        <Field label="Name *" error={errs.name}>
          <input name="name" autoComplete="name" aria-invalid={!!errs.name} className={control} />
        </Field>
        <Field label="Work email *" error={errs.email}>
          <input name="email" type="email" autoComplete="email" aria-invalid={!!errs.email} className={control} />
        </Field>
        <Field label="Company or brand">
          <input name="company" autoComplete="organization" className={control} />
        </Field>
        <Field label="Project type *" error={errs.type}>
          <select name="type" defaultValue="" aria-invalid={!!errs.type} className={select}>
            <option value="" disabled className={opt}>Select one ↓</option>
            {PROJECT_TYPES.map((t) => <option key={t} className={opt}>{t}</option>)}
          </select>
        </Field>
        <Field label="Estimated budget">
          <select name="budget" defaultValue="" className={select}>
            <option value="" className={opt}>Not sure yet ↓</option>
            {BUDGETS.map((t) => <option key={t} className={opt}>{t}</option>)}
          </select>
        </Field>
        <Field label="Expected timeline">
          <select name="timeline" defaultValue="" className={select}>
            <option value="" className={opt}>Flexible ↓</option>
            {TIMELINES.map((t) => <option key={t} className={opt}>{t}</option>)}
          </select>
        </Field>
      </div>
      <Field label="What are you thinking about? *" error={errs.message}>
        <textarea name="message" rows={4} aria-invalid={!!errs.message} className={`${control} resize-y leading-normal`} />
      </Field>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-5">
        <button
          type="submit"
          disabled={sending}
          className="btn-shimmer flex min-h-14 cursor-pointer items-center gap-3.5 rounded-[3px] border-0 px-7 text-xs font-semibold tracking-[.14em] uppercase shadow-[0_16px_40px_-16px_rgba(6,75,255,.9)] hover:shadow-[0_20px_50px_-14px_rgba(6,75,255,1)]"
        >
          {sending ? "Sending…" : "Send enquiry"} <span aria-hidden="true" className="glyph">→</span>
        </button>
        <span className="text-xs text-mist">* Required</span>
      </div>
      {statusMsg && <p role="status" className="m-0 border border-[rgba(250,248,243,.5)] px-[18px] py-4 text-sm leading-normal">{statusMsg}</p>}
    </form>
  );
}
