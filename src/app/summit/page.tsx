import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Human Garage Summit | Interactive Video Presentation',
  description: 'Interactive 5-Day Summit Presentation with customizable background, day tabs, and 4K Cinema Player.'
};

export default function SummitPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-black">
      <iframe 
        src="/mediazilla/index.html" 
        className="w-full h-full border-none"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </main>
  );
}
