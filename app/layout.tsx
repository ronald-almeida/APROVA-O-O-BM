import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Confirmação de agendamento',
  description: 'Confirme o novo horário do seu atendimento.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
