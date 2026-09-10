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
3. Preencha todas as variáveis de ambiente.
4. Execute o SQL de `supabase.sql` no Supabase.
5. `npm run dev`

## Painel administrativo

Acesse `/admin`. O painel é protegido por autenticação Basic Auth usando `ADMIN_USERNAME` e `ADMIN_PASSWORD`.

No painel é possível cadastrar um novo agendamento informando nome, data/horário anterior, novo horário e, opcionalmente, validade do link. O sistema gera automaticamente o link `/confirmar/[id]` e permite copiar o link ou abrir o WhatsApp com uma mensagem pronta.

A lista mostra exatamente os dados operacionais: nome do cliente, data do agendamento com horário, status e botão de WhatsApp.

## Rotas

- `/admin` — painel administrativo.
- `/confirmar/[id]` — página pública de confirmação.
- `/api/admin/agendamentos` — criação e listagem administrativa.
- `/api/agendamento/[id]` — consulta pública do agendamento.
- `/api/agendamento/[id]/confirmar` — confirmação via POST.

## Variáveis de ambiente

- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` — chave privada usada somente no servidor.
- `NEXT_PUBLIC_WHATSAPP_CONTACT_NUMBER` — número da equipe, em formato internacional, sem `+`, espaços ou pontuação.
- `NEXT_PUBLIC_APP_URL` — URL pública da aplicação; opcional para a interface atual.
- `ADMIN_USERNAME` — usuário do painel administrativo.
- `ADMIN_PASSWORD` — senha forte do painel administrativo.

## Deploy na Vercel

Conecte este repositório à Vercel e configure as mesmas variáveis de ambiente. Em produção, substitua `NEXT_PUBLIC_APP_URL` pela URL definitiva, se quiser utilizá-la para geração de URLs no futuro.

## Supabase

Execute `supabase.sql` no SQL Editor do Supabase para criar a tabela `agendamentos`. A chave `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser exposta ao cliente.

## Link enviado ao cliente

O link público tem o formato:

`https://SEU-DOMINIO.com/confirmar/ID-DO-AGENDAMENTO`

Na página, o cliente vê seu nome, a nova data e o horário, pode confirmar a presença e encontra o botão **Fale com a nossa equipe** para contato via WhatsApp.
