import { supabaseAdmin } from './supabase';
import type { Agendamento } from '@/types/agendamento';

const SELECT = 'id,nome_cliente,data_hora_anterior,data_hora_nova,status,link_expira_em';

export async function listarAgendamentos(): Promise<Agendamento[]> {
  const { data, error } = await supabaseAdmin.from('agendamentos').select(SELECT).order('data_hora_nova', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Agendamento[];
}

export async function criarAgendamento(input: {
  nome_cliente: string;
  data_hora_anterior: string;
  data_hora_nova: string;
  link_expira_em: string | null;
}): Promise<Agendamento> {
  const { data, error } = await supabaseAdmin.from('agendamentos').insert({
    nome_cliente: input.nome_cliente.trim(),
    data_hora_anterior: input.data_hora_anterior,
    data_hora_nova: input.data_hora_nova,
    status: 'pendente',
    link_expira_em: input.link_expira_em,
  }).select(SELECT).single();
  if (error) throw new Error(error.message);
  return data as Agendamento;
}
