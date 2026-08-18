import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | HealthSummits.tv',
  description: 'Terms and Conditions for HealthSummits.tv',
};

export default function TermsPage() {
  return (
    <div className="py-16 px-4 bg-[#fafcfb] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-[#e0e8e2]">
        <h1 className="text-4xl font-black text-[#1f2e22] mb-8 border-b border-[#e0e8e2] pb-6">
          Terms & Conditions
        </h1>

        <div className="prose prose-emerald max-w-none text-[#5e6d62]">
          <p className="lead text-lg font-medium text-[#1f2e22] mb-8">
            Welcome to HealthSummits.tv. By accessing or using our platform, you agree to be bound by the following terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">1. Medical Disclaimer</h2>
          <p className="mb-6">
            The content provided on HealthSummits.tv, including but not limited to videos, live streams, text, graphics, and other material, is intended for informational and educational purposes only. It is <strong>not intended to be a substitute for professional medical advice, diagnosis, or treatment</strong>. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have watched or read on this platform.
          </p>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">2. Organiser Liability & Content Responsibility</h2>
          <p className="mb-6">
            HealthSummits.tv acts solely as a hosting and broadcasting platform for independent summit organisers, clinical practitioners, and institutions. <strong>Organisers are strictly and solely responsible for the content, accuracy, and legality of the materials they broadcast or upload.</strong>
          </p>
          <p className="mb-6">
            HealthSummits.tv does not pre-screen, verify, or endorse the clinical claims made by independent organisers. We accept absolutely no liability for any actions taken by viewers based on the content broadcasted by organisers. Any opinions expressed by speakers or organisers are their own and do not reflect the views of HealthSummits.tv.
          </p>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">3. Intellectual Property & Copyright</h2>
          <p className="mb-6">
            All content on HealthSummits.tv is protected by international copyright and intellectual property laws. As a viewer, you are granted a limited, non-exclusive, non-transferable license to stream the content for personal, non-commercial use.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>You may not copy, reproduce, distribute, or publicly display any content without explicit written permission from the respective organiser or HealthSummits.tv.</li>
            <li><strong>Downloading, ripping, or screen-recording videos is strictly prohibited.</strong> Any attempt to bypass our digital rights management (DRM) or download restrictions will result in immediate account termination.</li>
            <li>You may not use our content to train artificial intelligence models without written consent.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">4. User Accounts & Subscriptions</h2>
          <p className="mb-6">
            If you create an account on our platform, you are responsible for maintaining the security of your account credentials. Subscription fees (such as the £1/month premium pass) are billed as outlined during checkout. We reserve the right to suspend or terminate accounts that violate these terms, share login credentials, or engage in disruptive behavior.
          </p>

          <h2 className="text-2xl font-bold text-[#1f2e22] mt-10 mb-4">5. Modifications to the Service</h2>
          <p className="mb-6">
            We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
          </p>
        </div>
      </div>
    </div>
  );
}
