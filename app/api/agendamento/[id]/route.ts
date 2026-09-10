import { NextResponse } from 'next/server';
import { getAgendamento, isExpired } from '@/lib/agendamento';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const agendamento = await getAgendamento(id);
    if (!agendamento || isExpired(agendamento)) {
      return NextResponse.json({ error: 'Agendamento não encontrado ou link expirado.' }, { status: 404 });
    }
    return NextResponse.json({ data: agendamento }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET /api/agendamento/[id]', error);
    return NextResponse.json({ error: 'Não foi possível carregar o agendamento.' }, { status: 500 });
  }
}
