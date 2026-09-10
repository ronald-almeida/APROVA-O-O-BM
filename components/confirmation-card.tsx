'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import type { Agendamento } from '@/types/agendamento';

function formatDateTime(value: string) {
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(date),
    time: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date),
  };
}

export default function ConfirmationCard({ id }: { id: string }) {
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/agendamento/${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Não foi possível carregar o agendamento.');
        return body.data as Agendamento;
      })
      .then(setAgendamento)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro inesperado.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function confirm() {
    setConfirming(true);
    setError(null);
    try {
      const res = await fetch(`/api/agendamento/${encodeURIComponent(id)}/confirmar`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Não foi possível confirmar o agendamento.');
      setAgendamento(body.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center px-5"><p className="text-sm text-slate-500">Carregando...</p></main>;
  }

  if (error || !agendamento) {
    return <main className="min-h-screen flex items-center justify-center px-5"><section className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-sm"><h1 className="text-xl font-bold">Agendamento não encontrado</h1><p className="mt-2 text-sm text-slate-500">O agendamento não está disponível ou o link expirou.</p></section></main>;
  }

  const horario = formatDateTime(agendamento.data_hora_nova);
  const confirmado = agendamento.status === 'confirmado';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CONTACT_NUMBER || '';
  const waHref = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá! Preciso falar com a equipe sobre meu agendamento. ID: ${agendamento.id}`)}` : '#';

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-5 py-8">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-sm sm:p-9">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">Olá, {agendamento.nome_cliente}!</h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            {confirmado ? 'Seu agendamento foi confirmado para' : 'Seu agendamento está marcado para'}:
          </p>

          <div className="mt-5 rounded-2xl bg-emerald-50 p-5">
            <p className="text-lg font-bold capitalize text-slate-900">{horario.date}</p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-700">{horario.time}</p>
          </div>

          {!confirmado && (
            <button
              onClick={confirm}
              disabled={confirming}
              className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-4 text-base font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {confirming ? 'Confirmando...' : 'Confirmar agendamento'}
            </button>
          )}

          {confirmado && (
            <p className="mt-6 text-sm font-semibold text-emerald-700">Agendamento confirmado com sucesso.</p>
          )}

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <a
            href={waHref}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <MessageCircle size={18} />
            Fale com a nossa equipe
          </a>
        </div>
      </section>
    </main>
  );
}
