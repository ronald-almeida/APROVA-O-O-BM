import { supabaseAdmin } from './supabase';
import type { Agendamento } from '@/types/agendamento';

export async function getAgendamento(id: string): Promise<Agendamento | null> {
  const { data, error } = await supabaseAdmin
    .from('agendamentos')
    .select('id,nome_cliente,data_hora_anterior,data_hora_nova,status,link_expira_em')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Agendamento | null;
}

export async function confirmarAgendamento(id: string): Promise<Agendamento | null> {
  const { data, error } = await supabaseAdmin
    .update({ status: 'confirmado', confirmado_em: new Date().toISOString() })
    .from('agendamentos')
    .eq('id', id)
    .neq('status', 'confirmado')
    .select('id,nome_cliente,data_hora_anterior,data_hora_nova,status,link_expira_em')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Agendamento | null;
}

export function isExpired(agendamento: Agendamento): boolean {
  return !!agendamento.link_expira_em && new Date(agendamento.link_expira_em).getTime() <= Date.now();
}
