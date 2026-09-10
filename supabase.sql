create extension if not exists pgcrypto;

create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  nome_cliente text not null,
  data_hora_anterior timestamptz not null,
  data_hora_nova timestamptz not null,
  status text not null default 'pendente' check (status in ('pendente','confirmado')),
  link_expira_em timestamptz,
  confirmado_em timestamptz,
  criado_em timestamptz not null default now()
);

create index if not exists agendamentos_status_idx on public.agendamentos(status);
create index if not exists agendamentos_expira_idx on public.agendamentos(link_expira_em);

alter table public.agendamentos enable row level security;

-- Exemplo:
-- insert into public.agendamentos (nome_cliente, data_hora_anterior, data_hora_nova, link_expira_em)
-- values ('João da Silva', '2026-09-10 14:00:00-03', '2026-09-12 16:30:00-03', '2026-09-12 23:59:59-03');
