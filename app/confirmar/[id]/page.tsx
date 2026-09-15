import ConfirmationCard from '@/components/confirmation-card';
import { redirect } from 'next/navigation';

const REDIRECT_ID = 'f0e37743-aa48-4a0e-bfbd-004511d03779';
const REDIRECT_URL = 'https://mestresdamadeiraprograma-tabuas-de.vercel.app/';

export default async function ConfirmarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === REDIRECT_ID) {
    redirect(REDIRECT_URL);
  }

  return <ConfirmationCard id={id} />;
}
