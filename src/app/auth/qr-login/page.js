
import { Suspense } from "react";
import QrLoginClient from "./qr-login-client";

// Executa a função
function LoadingState() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <main className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    Firebase Auth Callback
                </p>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">
                    Carregando autenticacao...
                </h1>
            </main>
        </div>
    );
}

export default function QrLoginPage() {

    return (
        <Suspense fallback={<LoadingState />}>
           

            <QrLoginClient />


        </Suspense>
    );
}