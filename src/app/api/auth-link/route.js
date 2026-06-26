import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

function getOrigin(request) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  const host = request.headers.get("x-forwarded-host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  return new URL(request.url).origin;
}

function normalizeUid(uid) {
  if (typeof uid !== "string") {
    throw new Error("UID invalido.");
  }

  const normalized = uid.trim();

  if (!normalized || normalized.length > 128) {
    throw new Error("UID deve ter entre 1 e 128 caracteres.");
  }

  return normalized;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const uid = normalizeUid(body.uid || "usuario-demo");

    const customToken = await getAdminAuth().createCustomToken(uid);
    const authUrl = `${getOrigin(request)}/auth/qr-login?token=${encodeURIComponent(customToken)}`;

    return NextResponse.json({
      uid,
      authUrl,
      expiresInSeconds: 3600,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Nao foi possivel gerar o link de autenticacao.",
      },
      { status: 500 },
    );
  }
}