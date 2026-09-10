import ConfirmationCard from '@/components/confirmation-card';

export default async function ConfirmarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConfirmationCard id={id} />;
}
