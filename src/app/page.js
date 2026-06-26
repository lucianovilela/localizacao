"use client";

import { useMemo, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  const [uid, setUid] = useState("usuario-demo");
  const [authUrl, setAuthUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {

      setUid((prevUid) => {
        

        const randomNum = new Date();
        return `${randomNum}`;
      });
    }, 1000); 
    return () => clearInterval(interval); // Atualiza a cada 10 segundos
  }, []);

  const canGenerate = useMemo(() => uid.trim().length > 0, [uid]);

  async function generateQrAuthUrl(event) {
    event.preventDefault();

    if (!canGenerate || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid.trim() }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Falha ao gerar URL de autenticacao.");
      }

      setAuthUrl(payload.authUrl);
    } catch (requestError) {
      setAuthUrl("");
      setError(requestError.message || "Erro inesperado ao gerar QR Code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-100 via-white to-cyan-50 p-6">
      <main className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl backdrop-blur sm:p-10">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
            Firebase QR Login
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Gere um QR Code para autenticar o usuario
          </h1>
          <p className="mt-3 text-slate-600">
            Ao escanear o QR, o usuario abre uma URL assinada e conclui o login
            no Firebase automaticamente.
          </p>
        </header>

        <form className="grid gap-4 sm:grid-cols-[1fr_auto]" onSubmit={generateQrAuthUrl}>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            UID do usuario
            <input
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              value={uid}
              onChange={(event) => setUid(event.target.value)}
              placeholder="ex.: usuario-demo"
              maxLength={128}
            />
          </label>

          <button
            type="submit"
            disabled={!canGenerate || loading}
            className="h-11 self-end rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Gerando..." : "Gerar QR Code"}
          </button>
        </form>

        {error ? (
          <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {authUrl ? (
          <section className="mt-8 grid gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-[240px_1fr] sm:items-start">
            <div className="mx-auto rounded-2xl bg-white p-4 shadow">
              <QRCodeSVG value={authUrl} size={208} includeMargin />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                URL de autenticacao gerada
              </h2>
             
              <a
                href={authUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                Abrir URL de autenticacao
              </a>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
