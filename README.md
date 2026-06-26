## Firebase QR Login

Aplicacao Next.js que gera um QR Code com uma URL de autenticacao Firebase.

Fluxo:

1. A tela inicial chama `POST /api/auth-link` com um UID.
2. O backend usa Firebase Admin para criar um `customToken`.
3. A URL `/auth/qr-login?token=...` e transformada em QR Code.
4. Ao abrir a URL, a pagina de callback autentica o usuario com `signInWithCustomToken`.

## Variaveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# URL base da aplicacao (opcional em dev; recomendada em producao)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase client (SDK Web)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (service account)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Como executar

```bash
npm install
npm run dev
```

Acesse http://localhost:3000 para gerar o QR Code.
