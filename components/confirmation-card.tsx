'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, MessageCircle, AlertCircle } from 'lucide-react';
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
  const [justConfirmed, setJustConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/agendamento/${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Não foi possível carregar o agendamento.');
        return body.data as Agendamento;
      })
      .then((data) => active && setAgendamento(data))
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Erro inesperado.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  async function confirm() {
    setConfirming(true); setError(null);
    try {
      const res = await fetch(`/api/agendamento/${encodeURIComponent(id)}/confirmar`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Não foi possível confirmar.');
      setAgendamento(body.data);
      setJustConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally { setConfirming(false); }
  }

  if (loading) return <main className="min-h-screen px-5 py-10 flex items-center justify-center"><div className="w-full max-w-md animate-pulse rounded-3xl bg-white p-7 shadow-sm"><div className="h-10 w-10 rounded-full bg-slate-200"/><div className="mt-6 h-5 w-32 rounded bg-slate-200"/><div className="mt-3 h-4 w-3/4 rounded bg-slate-200"/><div className="mt-7 h-28 rounded-2xl bg-slate-200"/><div className="mt-6 h-12 rounded-xl bg-slate-200"/></div></main>;

  if (error || !agendamento) return <main className="min-h-screen px-5 py-10 flex items-center justify-center"><section className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600"><AlertCircle size={28}/></div><h1 className="mt-5 text-xl font-bold">Agendamento não encontrado</h1><p className="mt-2 text-sm leading-6 text-slate-500">Agendamento não encontrado ou link expirado.</p></section></main>;

  const newDate = formatDateTime(agendamento.data_hora_nova);
  const confirmed = agendamento.status === 'confirmado';
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CONTACT_NUMBER || '';
  const waMessage = `Olá! Preciso falar com a equipe sobre meu atendimento. ID: ${agendamento.id}`;
  const waHref = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}` : '#';

  return <main className="min-h-screen px-5 py-8 sm:py-12 flex items-center justify-center"><section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-8">
    <div className="flex justify-center"><div className={`flex h-14 w-14 items-center justify-center rounded-full ${confirmed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-700'}`}>{confirmed ? <CheckCircle2 size={30}/> : <CalendarDays size={28}/>}</div></div>
    <div className="mt-5 text-center"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Confirmação de atendimento</p><h1 className="mt-2 text-2xl font-bold tracking-tight">Olá, {agendamento.nome_cliente}!</h1></div>
    <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5"><p className="text-sm font-medium text-slate-500">{confirmed ? 'Seu atendimento está confirmado para:' : 'Seu novo horário de atendimento:'}</p><p className="mt-2 text-lg font-bold capitalize text-slate-900">{newDate.date}</p><div className="mt-2 flex items-center gap-2 text-emerald-700"><Clock3 size={20}/><span className="text-3xl font-extrabold">{newDate.time}</span></div></div>
    {justConfirmed ? <><h2 className="mt-6 text-center text-xl font-extrabold text-emerald-700">Presença confirmada!</h2><p className="mt-2 text-center text-sm leading-6 text-slate-600">Te esperamos no dia <strong>{newDate.date}</strong> às <strong>{newDate.time}</strong>.</p></> : confirmed ? <><p className="mt-6 text-center text-sm leading-6 text-slate-600">Você já confirmou sua presença para <strong>{newDate.date}</strong> às <strong>{newDate.time}</strong>.</p><div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 size={18}/> Presença confirmada</div></> : <><p className="mt-6 text-center text-sm leading-6 text-slate-600">Houve uma alteração no horário do seu atendimento. Confira acima e confirme sua presença.</p><button onClick={confirm} disabled={confirming} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{confirming ? 'Confirmando...' : <><CheckCircle2 size={19}/> Confirmar presença</>}</button></>}
    <a href={waHref} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><MessageCircle size={18}/> Fale com a nossa equipe</a>
    <p className="mt-5 text-center text-xs text-slate-400">Precisa remarcar ou tirar alguma dúvida? Fale conosco pelo WhatsApp.</p>
  </section></main>;
}
