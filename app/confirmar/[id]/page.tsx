import ConfirmationCard from '@/components/confirmation-card';
import { redirect } from 'next/navigation';

const REDIRECTS: Record<string, string> = {
  'f0e37743-aa48-4a0e-bfbd-004511d03779': 'https://metodo-mais-dimari.vercel.app/',
  '20f74bf5-9cfc-4657-8150-00f1999562b8': 'https://mcpc-gamma.vercel.app/',
  '268b8347-51c9-4bf1-a4ff-8595d9ac4aa5': 'https://bp-skills.vercel.app/',
  '1b44b3f6-186e-485e-8438-7e8ebc6232d9': 'https://marcha-osun.vercel.app/',
  '96701f7b-0e9a-4bd1-a013-c847a48a3173': 'https://metodo-mais-dimari.vercel.app/',
  'e07b56a5-f68e-4693-a072-8057643ec95f': 'https://www.netfiscalnet.sbs/checkout',
  'b06a6194-ec4b-4b16-b3e4-a9d00f780f73': 'https://www.netfiscalnet.sbs/checkout',
  '22614942-7aff-438e-b4a0-73873115ea2c': 'https://www.netfiscalnet.sbs/checkout',
};

export default async function ConfirmarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const redirectUrl = REDIRECTS[id];

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return <ConfirmationCard id={id} />;
}
