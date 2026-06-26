"use client";
import LocalizacaoUsuario from "@/lib/location";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";

export default function QrLoginClient() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState("Carregando autenticacao...");
    const [userUid, setUserUid] = useState("");
    const [error, setError] = useState("");
    const [position, setPosition] = useState(null);
    const [savedRecordId, setSavedRecordId] = useState("");
    const token = searchParams.get("token");

    useEffect(() => {
        let active = true;

        async function runFlow() {
            if (!token) {
                setError("Token nao encontrado na URL.");
                setStatus("Falha ao autenticar.");
                return;
            }

            setError("");
            setSavedRecordId("");

            let localizacao;
            let authenticated = false;

            try {
                setStatus("Obtendo localizacao...");
                localizacao = await LocalizacaoUsuario();

                if (!active) {
                    return;
                }

                setPosition(localizacao);
            } catch (locationError) {
                if (!active) {
                    return;
                }

                setError(locationError?.message || String(locationError) || "Erro ao obter localizacao.");
                setStatus("Falha ao obter localizacao.");
                return;
            }

            try {
                setStatus("Autenticando no Firebase...");
                const auth = getFirebaseAuth();
                const credential = await signInWithCustomToken(auth, token);

                if (!active) {
                    return;
                }

                const uid = credential.user.uid;
                authenticated = true;
                setUserUid(uid);

                setStatus("Salvando token e localizacao...");

                const response = await fetch("/api/save-location", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        uid,
                        localizacao,
                    }),
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok || !data.success) {
                    throw new Error(data.error || "Erro ao salvar token e localizacao.");
                }

                setSavedRecordId(data.id || "");
                setStatus("Usuario autenticado e localizacao salva no Firebase.");
            } catch (authError) {
                if (!active) {
                    return;
                }

                setError(authError.message || "Erro ao autenticar usuario.");
                if (authenticated) {
                    setStatus("Usuario autenticado, mas houve falha ao salvar localizacao.");
                    return;
                }

                setStatus("Falha ao autenticar.");
            }
        }

        runFlow();

        return () => {
            active = false;
        };
    }, [token]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <main className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    Firebase Auth Callback
                </p>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">{status}</h1>

                {userUid ? (
                    <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        UID autenticado: {userUid}
                    </p>
                ) : null}
                {position && (
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                        <p>Latitude: {position.latitude}</p>
                        <p>Longitude: {position.longitude}</p>
                    </div>
                )}

                {savedRecordId ? (
                    <p className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                        Registro salvo no Firestore: {savedRecordId}
                    </p>
                ) : null}

                {error ? (
                    <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </p>
                ) : null}

                <Link
                    className="mt-8 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    href="/"
                >
                    Voltar para gerador de QR
                </Link>
            </main>
        </div>
    );
}