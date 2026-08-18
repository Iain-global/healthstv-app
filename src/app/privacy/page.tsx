import React from 'react';

export const metadata = {
  title: 'Privacy Policy | HealthSummits.tv',
  description: 'Privacy Policy for HealthSummits.tv',
};

export default function PrivacyPage() {
  return (
    <div className="py-16 px-4 bg-[#fafcfb] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-[#e0e8e2]">
        <h1 className="text-4xl font-black text-[#1f2e22] mb-8 border-b border-[#e0e8e2] pb-6">
          Privacy Policy
        </h1>

        <div className="prose prose-emerald max-w-none text-[#5e6d62]">
          <p className="lead text-lg font-medium text-[#1f2e22] mb-8">
            At HealthSummits.tv, we are committed to protecting your privacy and ensuring your personal data is handled securely and transparently.
          </p>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">1. Information We Collect</h2>
          <p className="mb-6">
            We collect information that you provide directly to us when you register for an account, subscribe to our premium services, or contact our support team. This may include your name, email address, payment information (processed securely via Stripe), and viewing history.
          </p>
          <p className="mb-6">
            We also automatically collect certain technical data when you use our platform, such as IP addresses, browser types, and device information, to help us optimize video playback and improve security.
          </p>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">2. How We Use Your Data</h2>
          <p className="mb-6">
            We use your personal data to:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Provide, maintain, and improve the HealthSummits.tv platform.</li>
            <li>Process transactions and send related information, including confirmations and receipts.</li>
            <li>Send technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">3. Data Sharing with Organisers</h2>
          <p className="mb-6">
            When you register for a specific summit or event hosted by an independent organiser on our platform, we may share your basic registration details (such as your name and email) with that specific organiser so they can manage event attendance and follow-up communications. We do not sell your data to third-party data brokers.
          </p>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">4. Data Security</h2>
          <p className="mb-6">
            We implement robust technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted and processed by PCI-compliant third-party providers. We do not store your full credit card details on our servers.
          </p>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">5. Your Rights</h2>
          <p className="mb-6">
            Depending on your location (e.g., under GDPR or CCPA), you may have the right to access, correct, or delete your personal data. You may also have the right to object to or restrict certain processing of your data. To exercise these rights, please contact our support team via the Contact page.
          </p>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">6. Cookies</h2>
          <p className="mb-6">
            We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent, though some parts of the service may not function properly without them.
          </p>
        </div>
      </div>
    </div>
  );
}
