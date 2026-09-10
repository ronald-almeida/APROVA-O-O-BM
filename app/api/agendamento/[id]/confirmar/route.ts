import { NextResponse } from 'next/server';
import { confirmarAgendamento, getAgendamento, isExpired } from '@/lib/agendamento';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const atual = await getAgendamento(id);
    if (!atual || isExpired(atual)) {
      return NextResponse.json({ error: 'Agendamento não encontrado ou link expirado.' }, { status: 404 });
    }
    if (atual.status === 'confirmado') {
      return NextResponse.json({ data: atual, alreadyConfirmed: true }, { status: 200 });
    }
    const confirmado = await confirmarAgendamento(id);
    if (!confirmado) {
      const final = await getAgendamento(id);
      if (final?.status === 'confirmado') return NextResponse.json({ data: final, alreadyConfirmed: true });
      return NextResponse.json({ error: 'Não foi possível confirmar o agendamento.' }, { status: 409 });
    }
    return NextResponse.json({ data: confirmado }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('POST /api/agendamento/[id]/confirmar', error);
    return NextResponse.json({ error: 'Ocorreu um erro ao confirmar. Tente novamente.' }, { status: 500 });
  }
}
