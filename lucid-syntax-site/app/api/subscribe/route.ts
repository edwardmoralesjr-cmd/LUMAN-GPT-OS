import { NextResponse } from 'next/server';

// TODO: confirm — wire this to a real email service provider (Mailchimp,
// ConvertKit, Beehiiv, etc.) before launch. This stub validates the
// payload and returns success without persisting or sending anything, so
// the front-end form has a real endpoint to call during development.
export async function POST(request: Request) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
