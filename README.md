# Confirmação de Agendamento

Aplicação Next.js para confirmação de mudança de horário de atendimento via link enviado pelo WhatsApp Business.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase / PostgreSQL
- Vercel

## Setup

1. `npm install`
2. Copie `.env.example` para `.env.local`.
3. Preencha `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `NEXT_PUBLIC_WHATSAPP_NUMBER`.
4. Execute o SQL de `supabase.sql` no Supabase.
5. `npm run dev`

## Rotas

- `/confirmar/[id]` — página pública de confirmação.
- `/api/agendamento/[id]` — consulta o agendamento.
- `/api/agendamento/[id]/confirmar` — confirma o agendamento via POST.

## Deploy na Vercel

Conecte este repositório à Vercel, configure as mesmas variáveis de ambiente e faça o deploy. O projeto não depende de arquivos locais persistentes.

## Segurança

A chave `SUPABASE_SERVICE_ROLE_KEY` é usada exclusivamente no servidor e nunca deve ser exposta ao cliente.
