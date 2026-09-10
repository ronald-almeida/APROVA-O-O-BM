import { NextResponse } from 'next/server';
import { criarAgendamento, listarAgendamentos } from '@/lib/admin-agendamento';

export async function GET() {
  try {
    const data = await listarAgendamentos();
    return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Não foi possível carregar os agendamentos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nome = typeof body.nome_cliente === 'string' ? body.nome_cliente.trim() : '';
    const anterior = typeof body.data_hora_anterior === 'string' ? body.data_hora_anterior : '';
    const nova = typeof body.data_hora_nova === 'string' ? body.data_hora_nova : '';
    const expira = typeof body.link_expira_em === 'string' && body.link_expira_em ? body.link_expira_em : null;

    if (!nome || !anterior || !nova) {
      return NextResponse.json({ error: 'Nome, data/horário anterior e novo horário são obrigatórios.' }, { status: 400 });
    }

    const data = await criarAgendamento({
      nome_cliente: nome,
      data_hora_anterior: anterior,
      data_hora_nova: nova,
      link_expira_em: expira,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Não foi possível criar o agendamento.' }, { status: 500 });
  }
}
