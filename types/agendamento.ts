export type AgendamentoStatus = 'pendente' | 'confirmado';

export interface Agendamento {
  id: string;
  nome_cliente: string;
  data_hora_anterior: string;
  data_hora_nova: string;
  status: AgendamentoStatus;
  link_expira_em: string | null;
}

export interface AgendamentoPublico extends Agendamento {
  expirado: boolean;
}
