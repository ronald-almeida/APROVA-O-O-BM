import { NextResponse } from 'next/server';
import { criarAgendamento, listarAgendamentos } from '@/lib/admin-agendamento';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Erro inesperado no servidor.';
}

export async function GET() {
  try {
    const data = await listarAgendamentos();
    return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[GET /api/admin/agendamentos]', error);
    return NextResponse.json(
      { error: 'Não foi possível carregar os agendamentos.', detail: errorMessage(error) },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: 'Nome, data/horário anterior e novo horário são obrigatórios.' },
        { status: 400 }
      );
    }

    const anteriorDate = new Date(anterior);
    const novaDate = new Date(nova);
    const expiraDate = expira ? new Date(expira) : null;

    if (Number.isNaN(anteriorDate.getTime()) || Number.isNaN(novaDate.getTime())) {
      return NextResponse.json(
        { error: 'Data/horário inválido. Selecione novamente os horários.' },
        { status: 400 }
      );
    }

    if (expiraDate && Number.isNaN(expiraDate.getTime())) {
      return NextResponse.json(
        { error: 'A data de expiração do link é inválida.' },
        { status: 400 }
      );
    }

    const data = await criarAgendamento({
      nome_cliente: nome,
      data_hora_anterior: anteriorDate.toISOString(),
      data_hora_nova: novaDate.toISOString(),
      link_expira_em: expiraDate ? expiraDate.toISOString() : null,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/agendamentos]', error);
    return NextResponse.json(
      {
        error: 'Não foi possível criar o agendamento.',
        detail: errorMessage(error),
      },
      { status: 500 }
    );
  }
}
