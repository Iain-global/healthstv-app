import OrganiserRegisterClient from './OrganiserRegisterClient';

export const metadata = {
  title: 'Register as an Organiser | HealthSummits.tv',
  description: 'Join the HealthSummits.tv Expert Network',
};

export default function OrganiserRegisterPage() {
  return (
    <main className="min-h-screen bg-[#fafcfb] pb-20">
      <OrganiserRegisterClient />
    </main>
  );
}
