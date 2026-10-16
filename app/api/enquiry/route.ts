import nodemailer from "nodemailer";

// Receives the Broadsheet's Reply form (Classifieds, P. 09) and emails it to the studio inbox
// through the inbox's own Google Workspace account.

const FIELDS = ["name", "email", "company", "type", "budget", "timeline", "message"] as const;
type Enquiry = Record<(typeof FIELDS)[number], string>;

const MAX_LENGTH: Record<keyof Enquiry, number> = {
  name: 200,
  email: 320,
  company: 200,
  type: 100,
  budget: 100,
  timeline: 100,
  message: 5000,
};

function parse(body: unknown): Enquiry | string {
  if (!body || typeof body !== "object") return "Invalid request.";
  const src = body as Record<string, unknown>;
  const out = {} as Enquiry;
  for (const key of FIELDS) {
    const value = typeof src[key] === "string" ? (src[key] as string).trim() : "";
    if (value.length > MAX_LENGTH[key]) return "One of the fields is too long.";
    out[key] = value;
  }
  if (!out.name) return "Add your name.";
  if (!/^\S+@\S+\.\S+$/.test(out.email)) return "Add an email we can reply to.";
  if (!out.message) return "A sentence or two is enough.";
  return out;
}

export async function POST(request: Request) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error("enquiry: SMTP_USER / SMTP_PASS are not set");
    return Response.json({ error: "Enquiries are not set up yet." }, { status: 503 });
  }

  const enquiry = parse(await request.json().catch(() => null));
  if (typeof enquiry === "string") return Response.json({ error: enquiry }, { status: 400 });

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const text = [
    `Name:      ${enquiry.name}`,
    `Email:     ${enquiry.email}`,
    `Company:   ${enquiry.company || "—"}`,
    `Type:      ${enquiry.type || "—"}`,
    `Budget:    ${enquiry.budget || "—"}`,
    `Timeline:  ${enquiry.timeline || "—"}`,
    "",
    enquiry.message,
  ].join("\n");

  try {
    await transport.sendMail({
      from: { name: "Kora Kaagaz website", address: user },
      to: process.env.ENQUIRY_TO || user,
      replyTo: { name: enquiry.name, address: enquiry.email },
      subject: `Enquiry: ${enquiry.name}${enquiry.type ? ` — ${enquiry.type}` : ""}`,
      text,
    });
  } catch (err) {
    console.error("enquiry: send failed", err);
    return Response.json({ error: "Couldn't send right now." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
