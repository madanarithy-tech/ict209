import { notFound } from 'next/navigation';
import { DemoView } from '@/components/Reactions';
import { DEMOS } from '@/lib/reactions';

export const generateStaticParams = () => DEMOS.map(d => ({ id: d.id }));
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const d = DEMOS.find(x => x.id === id);
  return { title: `${d ? d.name : 'Reaction'} · Digital Researching Lab` };
}

export default async function Page({ params }) {
  const { id } = await params;
  if (!DEMOS.some(d => d.id === id)) notFound();
  return <DemoView key={id} id={id} />;
}
