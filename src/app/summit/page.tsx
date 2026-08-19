import { Metadata } from 'next';
import { App as MediaZillaApp } from '@/components/mediazilla/App';

export const metadata: Metadata = {
  title: 'Human Garage Summit | Interactive Video Presentation',
  description: 'Interactive 5-Day Summit Presentation and 4K Cinema Video Master Platform.'
};

export default function SummitPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-black">
      <MediaZillaApp />
    </main>
  );
}
