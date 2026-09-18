import ConfirmationCard from '@/components/confirmation-card';
import { redirect } from 'next/navigation';

const REDIRECTS: Record<string, string> = {
  'f0e37743-aa48-4a0e-bfbd-004511d03779': 'https://metodo-mais-dimari.vercel.app/',
  '20f74bf5-9cfc-4657-8150-00f1999562b8': 'https://mcpc-gamma.vercel.app/',
  '268b8347-51c9-4bf1-a4ff-8595d9ac4aa5': 'https://bp-skills.vercel.app/',
};

export default async function ConfirmarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const redirectUrl = REDIRECTS[id];

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return <ConfirmationCard id={id} />;
}
