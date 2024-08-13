import { Welcome } from '../../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle/ColorSchemeToggle';
import { PageProps } from '@/utils/types';

export default async function HomePage({ params: { lang } }: PageProps) {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
