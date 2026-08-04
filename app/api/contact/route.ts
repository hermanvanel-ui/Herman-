import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const result = contactFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Données invalides.", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    await sendContactNotification(result.data);
  } catch (error) {
    console.error("[api/contact] Échec de l'envoi de l'email", error);
    return NextResponse.json({ error: "Échec de l'envoi. Merci de réessayer." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
