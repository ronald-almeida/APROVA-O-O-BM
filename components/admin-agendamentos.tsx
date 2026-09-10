'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Copy, Link2, Loader2, MessageCircle, Plus, RefreshCw, Users } from 'lucide-react';
import type { Agendamento } from '@/types/agendamento';

function formatDateTime(value: string) {
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(date),
    time: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date),
  };
}

function toIso(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Selecione datas e horários válidos.');
  return date.toISOString();
}

export default function AdminAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: '', anterior: '', novo: '', expira: '' });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const pending = useMemo(() => agendamentos.filter((item) => item.status === 'pendente').length, [agendamentos]);
  const confirmed = useMemo(() => agendamentos.filter((item) => item.status === 'confirmado').length, [agendamentos]);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/agendamentos', { cache: 'no-store' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.detail ? `${body.error} (${body.detail})` : body.error || 'Erro ao carregar.');
      setAgendamentos(body.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setError(null);
    try {
      if (!form.nome || !form.anterior || !form.novo) throw new Error('Preencha todos os campos obrigatórios.');
      const res = await fetch('/api/admin/agendamentos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_cliente: form.nome,
          data_hora_anterior: toIso(form.anterior),
          data_hora_nova: toIso(form.novo),
          link_expira_em: form.expira ? toIso(form.expira) : null,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.detail ? `${body.error} (${body.detail})` : body.error || 'Não foi possível criar.');
      setAgendamentos((current) => [...current, body.data].sort((a, b) => new Date(a.data_hora_nova).getTime() - new Date(b.data_hora_nova).getTime()));
      setForm({ nome: '', anterior: '', novo: '', expira: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally { setSaving(false); }
  }

  async function copyLink(id: string) {
    const link = `${baseUrl}/confirmar/${id}`;
    await navigator.clipboard.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  function whatsappLink(agendamento: Agendamento) {
    const link = `${baseUrl}/confirmar/${agendamento.id}`;
    const message = `Olá, ${agendamento.nome_cliente}! Segue o link para confirmar sua presença no novo horário do atendimento: ${link}`;
    const number = process.env.NEXT_PUBLIC_WHATSAPP_CONTACT_NUMBER || '';
    return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  return <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Painel</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">Agendamentos</h1><p className="mt-1 text-sm text-slate-500">Crie o agendamento e envie o link de confirmação pelo WhatsApp.</p></div>
        <button onClick={load} className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"><RefreshCw size={16}/> Atualizar</button>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-slate-400"><Users size={17}/><span className="text-xs font-semibold">Total</span></div><p className="mt-2 text-2xl font-extrabold text-slate-900">{agendamentos.length}</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-amber-500"><Clock3 size={17}/><span className="text-xs font-semibold">Pendentes</span></div><p className="mt-2 text-2xl font-extrabold text-slate-900">{pending}</p></div>
        <div className="col-span-2 rounded-2xl bg-white p-4 shadow-sm sm:col-span-1"><div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={17}/><span className="text-xs font-semibold">Confirmados</span></div><p className="mt-2 text-2xl font-extrabold text-slate-900">{confirmed}</p></div>
      </section>

      <section className="mb-7 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Plus size={19}/></div><div><h2 className="font-bold text-slate-900">Novo agendamento</h2><p className="text-xs text-slate-500">O link será gerado automaticamente pelo ID.</p></div></div>
        <form onSubmit={create} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="sm:col-span-2 lg:col-span-4"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Nome do cliente *</span><input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: João da Silva" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
          <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Data/horário anterior *</span><input type="datetime-local" value={form.anterior} onChange={(e) => setForm({ ...form, anterior: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
          <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Novo horário *</span><input type="datetime-local" value={form.novo} onChange={(e) => setForm({ ...form, novo: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
          <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Expiração do link</span><input type="datetime-local" value={form.expira} onChange={(e) => setForm({ ...form, expira: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
          <div className="flex items-end"><button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60">{saving ? <Loader2 className="animate-spin" size={18}/> : <Plus size={18}/>} {saving ? 'Criando...' : 'Criar agendamento'}</button></div>
        </form>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Agendamentos cadastrados</h2></div>
        {loading ? <div className="space-y-3 p-5">{[1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div> : agendamentos.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">Nenhum agendamento cadastrado.</div> : <div className="divide-y divide-slate-100">
          {agendamentos.map((item) => { const dt = formatDateTime(item.data_hora_nova); const link = `${baseUrl}/confirmar/${item.id}`; return <div key={item.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1"><p className="truncate font-bold text-slate-900">{item.nome_cliente}</p><div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500"><span className="inline-flex items-center gap-1.5"><CalendarDays size={15}/>{dt.date}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={15}/>{dt.time}</span></div></div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${item.status === 'confirmado' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.status === 'confirmado' ? 'Confirmado' : 'Pendente'}</span>
            <div className="flex flex-wrap gap-2"><button onClick={() => copyLink(item.id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"><Copy size={15}/>{copied === item.id ? 'Copiado!' : 'Copiar link'}</button><a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"><Link2 size={15}/> Abrir</a><a href={whatsappLink(item)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"><MessageCircle size={15}/> WhatsApp</a></div>
          </div>; })}
        </div>}
      </section>
    </div>
  </main>;
