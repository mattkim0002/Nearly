import { useState } from 'react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export default function PrivacyPolicyModal({ onClose }: PrivacyPolicyModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-slate-900">Privacy Policy</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-3xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-slate-600">Last updated: January 17, 2026</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="prose max-w-none">
            
            {/* Introduction */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Commitment to Your Privacy</h3>
              <p className="text-slate-700 mb-0">
                Nearly ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our 
                platform that connects clients with independent local workers for commissions and services.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">1. Information We Collect</h3>
            
            <h4 className="text-lg font-bold text-slate-900 mb-2">Information You Provide to Us</h4>
            <p className="text-slate-600 mb-4">
              We collect information you voluntarily provide when using Nearly:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, profile photo, location (city/zip code), and account type (client or independent worker)</li>
              <li><strong>Profile Information:</strong> For independent workers - portfolio images, skills, certifications, bio, languages, pricing, and work examples</li>
              <li><strong>Commission Information:</strong> Commission titles, descriptions, budgets, categories, timelines, and related files or images</li>
              <li><strong>Payment Information:</strong> Payment method details (processed securely through our payment processor), billing address, and transaction history</li>
              <li><strong>Communications:</strong> Messages sent through our platform, proposals, reviews, ratings, and support inquiries</li>
              <li><strong>Identity Verification:</strong> When you choose profile verification, we may collect government-issued ID, business licenses, or other verification documents</li>
            </ul>

            <h4 className="text-lg font-bold text-slate-900 mb-2">Information Collected Automatically</h4>
            <p className="text-slate-600 mb-4">
              When you access Nearly, we automatically collect:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, and mobile network information</li>
              <li><strong>Usage Information:</strong> Pages viewed, features used, search queries, commission views, clicks, and time spent on pages</li>
              <li><strong>Location Information:</strong> General location based on IP address and precise location if you grant permission</li>
              <li><strong>Cookies and Tracking:</strong> We use cookies, web beacons, and similar technologies to track activity and store preferences</li>
            </ul>

            <h4 className="text-lg font-bold text-slate-900 mb-2">Information from Third Parties</h4>
            <p className="text-slate-600 mb-6">
              We may receive information from third-party services you connect to your Nearly account, 
              such as social media login providers (e.g., Google, Facebook) or payment processors. 
              We only receive information you authorize these services to share.
            </p>

            {/* 2. How We Use Your Information */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. How We Use Your Information</h3>
            
            <p className="text-slate-600 mb-4">
              Nearly uses your information to facilitate connections between clients and independent workers. 
              Specifically, we use your information to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li><strong>Provide Our Services:</strong> Create and manage accounts, process commissions, facilitate messaging, handle payments through escrow, and enable reviews</li>
              <li><strong>Match and Connect:</strong> Show relevant commission opportunities to workers and help clients find workers with appropriate skills</li>
              <li><strong>Process Payments:</strong> Facilitate secure payment processing and escrow services (payments held per agreed terms)</li>
              <li><strong>Communicate with You:</strong> Send commission updates, proposal notifications, payment confirmations, and platform updates</li>
              <li><strong>Improve Our Platform:</strong> Analyze usage patterns, conduct research, develop new features, and improve user experience</li>
              <li><strong>Ensure Safety and Security:</strong> Detect and prevent fraud, enforce our Terms of Service, and protect users from abuse</li>
              <li><strong>Provide Customer Support:</strong> Respond to inquiries, resolve disputes, and assist with technical issues</li>
              <li><strong>Marketing and Promotions:</strong> Send promotional emails about new features or services (you can opt out anytime)</li>
              <li><strong>Legal Compliance:</strong> Comply with legal obligations, respond to legal requests, and protect our rights</li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-900 mb-0">
                <strong>Important:</strong> Nearly facilitates connections and payment processing only. We do not 
                employ workers, guarantee work quality, control how services are performed, or vet workers beyond 
                optional identity verification. Reviews and ratings are provided by other users, not Nearly.
              </p>
            </div>

            {/* 3. How We Share Your Information */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">3. How We Share Your Information</h3>
            
            <p className="text-slate-600 mb-4">
              We share your information in the following circumstances:
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">With Other Users</h4>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li>When you post a commission, your name, location (city/zip), and commission details are visible to workers</li>
              <li>When you submit a proposal, your profile information is shared with the client</li>
              <li>When you message another user, your profile information and messages are shared with that user</li>
              <li>Reviews and ratings you leave are public and associated with your account</li>
            </ul>

            <h4 className="text-lg font-bold text-slate-900 mb-2">With Service Providers</h4>
            <p className="text-slate-600 mb-6">
              We share information with trusted third-party service providers who help us operate Nearly, including:
              payment processors, cloud hosting providers, email service providers, analytics services, and 
              customer support tools. These providers are contractually obligated to protect your information 
              and only use it to provide services to us.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">For Legal Reasons</h4>
            <p className="text-slate-600 mb-6">
              We may disclose your information if required by law, court order, or government request, or if 
              necessary to protect our rights, prevent fraud, ensure platform safety, or comply with legal processes.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">Business Transfers</h4>
            <p className="text-slate-600 mb-6">
              If Nearly is acquired, merged, or sells assets, your information may be transferred as part of 
              that transaction. We will notify you of any such change.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-emerald-900 mb-0">
                <strong>We Never Sell Your Personal Information:</strong> Nearly does not and will never sell your 
                personal information to third parties for their marketing purposes.
              </p>
            </div>

            {/* 4. Cookies and Tracking Technologies */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">4. Cookies and Tracking Technologies</h3>
            
            <p className="text-slate-600 mb-4">
              Nearly uses cookies and similar technologies to improve your experience:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the platform to function (login, security, session management)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with Nearly</li>
              <li><strong>Advertising Cookies:</strong> Deliver relevant ads and measure campaign effectiveness</li>
            </ul>
            
            <p className="text-slate-600 mb-6">
              You can control cookies through your browser settings. Note that disabling certain cookies may 
              limit platform functionality.
            </p>

            {/* 5. Your Privacy Rights */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">5. Your Privacy Rights</h3>
            
            <p className="text-slate-600 mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails or opt out of certain data processing</li>
              <li><strong>Restrict Processing:</strong> Request that we limit how we use your information</li>
              <li><strong>Object:</strong> Object to certain types of processing (e.g., direct marketing)</li>
            </ul>

            <p className="text-slate-600 mb-6">
              To exercise these rights, contact us at <a href="mailto:privacy@nearly.com" className="text-orange-500 hover:text-orange-600 font-semibold">privacy@nearly.com</a>. 
              We will respond within 30 days.
            </p>

            {/* 6. Data Security */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">6. Data Security</h3>
            
            <p className="text-slate-600 mb-6">
              We implement industry-standard security measures to protect your information, including encryption, 
              secure servers, firewalls, and access controls. However, no method of transmission over the internet 
              is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>

            {/* 7. Data Retention */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">7. Data Retention</h3>
            
            <p className="text-slate-600 mb-6">
              We retain your information for as long as necessary to provide our services, comply with legal 
              obligations, resolve disputes, and enforce our agreements. When you delete your account, we will 
              delete or anonymize your personal information, except where retention is required by law or for 
              legitimate business purposes (e.g., fraud prevention, financial records).
            </p>

            {/* 8. Children's Privacy */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">8. Children's Privacy</h3>
            
            <p className="text-slate-600 mb-6">
              Nearly is not intended for users under 18 years of age. We do not knowingly collect personal 
              information from children under 18. If you believe we have collected information from a child 
              under 18, please contact us immediately at <a href="mailto:privacy@nearly.com" className="text-orange-500 hover:text-orange-600 font-semibold">privacy@nearly.com</a>, 
              and we will delete such information.
            </p>

            {/* 9. International Data Transfers */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">9. International Data Transfers</h3>
            
            <p className="text-slate-600 mb-6">
              Nearly is based in the United States. If you access our platform from outside the U.S., your 
              information may be transferred to, stored, and processed in the U.S. or other countries. By using 
              Nearly, you consent to the transfer of your information to countries that may have different data 
              protection laws than your country of residence.
            </p>

            {/* 10. Third-Party Links */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">10. Third-Party Links</h3>
            
            <p className="text-slate-600 mb-6">
              Nearly may contain links to third-party websites or services. We are not responsible for the 
              privacy practices of these third parties. We encourage you to review their privacy policies before 
              providing any information to them.
            </p>

            {/* 11. California Privacy Rights */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">11. California Privacy Rights (CCPA)</h3>
            
            <p className="text-slate-600 mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li>Right to know what personal information we collect, use, and disclose</li>
              <li>Right to request deletion of your personal information</li>
              <li>Right to opt out of the sale of personal information (note: we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>

            <p className="text-slate-600 mb-6">
              To exercise these rights, email us at <a href="mailto:privacy@nearly.com" className="text-orange-500 hover:text-orange-600 font-semibold">privacy@nearly.com</a> with 
              "California Privacy Rights" in the subject line.
            </p>

            {/* 12. European Privacy Rights (GDPR) */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">12. European Privacy Rights (GDPR)</h3>
            
            <p className="text-slate-600 mb-4">
              If you are in the European Economic Area (EEA), United Kingdom, or Switzerland, you have rights 
              under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
              <li>Legal basis for processing: We process your data based on consent, contractual necessity, legal obligations, and legitimate interests</li>
              <li>Right to withdraw consent at any time</li>
              <li>Right to lodge a complaint with your local data protection authority</li>
              <li>All rights listed in Section 5 (Your Privacy Rights)</li>
            </ul>

            {/* 13. Changes to This Privacy Policy */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">13. Changes to This Privacy Policy</h3>
            
            <p className="text-slate-600 mb-6">
              We may update this Privacy Policy from time to time. When we make changes, we will update the 
              "Last updated" date at the top of this policy and notify you via email or a prominent notice on 
              our platform. Your continued use of Nearly after changes become effective constitutes acceptance 
              of the updated Privacy Policy.
            </p>

            {/* 14. Contact Us */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">14. Contact Us</h3>
            
            <p className="text-slate-600 mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, 
              please contact us:
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
              <p className="text-slate-900 mb-2"><strong>Nearly Privacy Team</strong></p>
              <p className="text-slate-600 mb-1">Email: <a href="mailto:privacy@nearly.com" className="text-orange-500 hover:text-orange-600 font-semibold">privacy@nearly.com</a></p>
              <p className="text-slate-600 mb-1">Support: <a href="mailto:support@nearly.com" className="text-orange-500 hover:text-orange-600 font-semibold">support@nearly.com</a></p>
              <p className="text-slate-600">Mailing Address: [Your Company Address]</p>
            </div>

            {/* Summary Box */}
            <div className="bg-sky-50 border-2 border-orange-400 rounded-xl p-6 mt-8">
              <h4 className="text-lg font-bold text-slate-900 mb-3">Privacy in Plain English</h4>
              <ul className="space-y-2 text-sm text-slate-700 mb-0">
                <li>✓ We collect information you provide and data about how you use Nearly</li>
                <li>✓ We use your information to connect clients with independent workers and process payments</li>
                <li>✓ We share information with other users when necessary (commissions, proposals, messages)</li>
                <li>✓ We NEVER sell your personal information to third parties</li>
                <li>✓ You can access, correct, or delete your information anytime</li>
                <li>✓ We use industry-standard security to protect your data</li>
                <li>✓ Contact us at privacy@nearly.com with any questions or concerns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}