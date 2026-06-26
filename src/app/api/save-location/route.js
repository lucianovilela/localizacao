import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebaseAdmin";

function normalizeToken(token) {
  if (typeof token !== "string") {
    throw new Error("Token invalido.");
  }

  const normalized = token.trim();

  if (!normalized || normalized.length > 4096) {
    throw new Error("Token deve ter entre 1 e 4096 caracteres.");
  }

  return normalized;
}

function normalizeUid(uid) {
  if (uid === undefined || uid === null || uid === "") {
    return null;
  }

  if (typeof uid !== "string") {
    throw new Error("UID invalido.");
  }

  const normalized = uid.trim();

  if (!normalized || normalized.length > 128) {
    throw new Error("UID deve ter entre 1 e 128 caracteres.");
  }

  return normalized;
}

function normalizeLocation(location) {
  if (!location || typeof location !== "object") {
    throw new Error("Localizacao invalida.");
  }

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Latitude invalida. Use um valor entre -90 e 90.");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Longitude invalida. Use um valor entre -180 e 180.");
  }

  return {
    latitude,
    longitude,
  };
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = normalizeToken(body.token);
    const uid = normalizeUid(body.uid);
    const location = normalizeLocation(body.localizacao);

    const payload = {
      token,
      uid,
      localizacao: location,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await getAdminFirestore().collection("user_locations").add(payload);

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error?.message || "Nao foi possivel salvar os dados no Firebase.";
    const status =
      message.includes("invalido") || message.includes("deve ter") || message.includes("Use um valor")
        ? 400
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status },
    );
  }
}