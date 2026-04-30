import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-xs text-blue-500 hover:underline">
            ← Back to Contract Analyser
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400">
            Contract Analyser · Demo Application · Last updated: 30 April 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. About This Application</h2>
            <p>
              Contract Analyser is a demonstration application developed by Marco Costa solely
              for portfolio and recruitment purposes. It is not a commercial product and does
              not provide professional legal services.
            </p>
            <p className="mt-2">
              For any privacy-related enquiries, please contact:{' '}
              <a href="mailto:marcoalexandre.sc@gmail.com" className="text-blue-500 underline">
                marcoalexandre.sc@gmail.com
              </a>
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. Data We Collect</h2>
            <p className="font-medium text-gray-800 mb-1">Access data</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
              <li>Professional email address</li>
              <li>Organisation domain name</li>
              <li>Date, time and number of analyses performed</li>
            </ul>
            <p className="font-medium text-gray-800 mb-1 mt-3">Document data</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
              <li>PDF file of submitted contracts</li>
              <li>Text content extracted from submitted contracts</li>
              <li>AI-generated analysis results</li>
            </ul>
            <p className="font-medium text-gray-800 mb-1 mt-3">Technical data</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Date and time of each request</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. How We Use Your Data</h2>
            <p>Your data is used exclusively to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2 mt-2">
              <li>Generate and deliver your access code</li>
              <li>Provide AI-assisted contract analysis</li>
              <li>Maintain access logs for security purposes</li>
            </ul>
            <p className="mt-2">
              We do not sell, rent, or share your data with any third party for commercial purposes.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. Data Processing and Storage</h2>
            <p className="font-medium text-gray-800 mb-1">AI Processing</p>
            <p>
              Submitted contracts are processed by Claude, an AI system developed by Anthropic PBC,
              headquartered in San Francisco, California, USA. By using this application, you
              explicitly consent to your submitted documents being transferred to and processed
              in the United States.
            </p>
            <p className="mt-2">
              Anthropic's privacy policy is available at:{' '}
              <a href="https://www.anthropic.com/privacy" target="_blank" className="text-blue-500 underline">
                anthropic.com/privacy
              </a>
            </p>
            <p className="font-medium text-gray-800 mb-1 mt-3">Data Storage</p>
            <p>
              All personal data and submitted documents are stored on Supabase, with servers
              located in Ireland (EU), in compliance with GDPR.
            </p>
            <p className="font-medium text-gray-800 mb-1 mt-3">Operator Notifications</p>
            <p>
              For quality assurance purposes, the operator receives an email notification upon
              each completed analysis. This notification includes the AI-generated analysis result
              and the professional email address associated with the access code. It does not
              include the original contract file. By using this application, you consent to
              this notification.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. Data Retention</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Data</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Professional email address', '30 days from last access'],
                    ['Access logs', '30 days from last access'],
                    ['Submitted contract (PDF)', '3 days from submission'],
                    ['Extracted contract text', '3 days from submission'],
                    ['AI-generated analysis', '3 days from submission'],
                  ].map(([data, retention], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-gray-700">{data}</td>
                      <td className="px-4 py-3 text-gray-500">{retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-gray-500 text-xs">
              All data is permanently and irreversibly deleted upon expiry of the applicable
              retention period.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">6. Your Rights Under GDPR</h2>
            <p>Under Regulation (EU) 2016/679, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2 mt-2">
              <li><strong>Access</strong> — obtain a copy of your personal data</li>
              <li><strong>Rectification</strong> — request correction of inaccurate data</li>
              <li><strong>Erasure</strong> — request immediate deletion of your data</li>
              <li><strong>Restriction</strong> — request that we limit processing of your data</li>
              <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
              <li><strong>Object</strong> — object to processing based on legitimate interests</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:marcoalexandre.sc@gmail.com" className="text-blue-500 underline">
                marcoalexandre.sc@gmail.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">7. AI Act Compliance</h2>
            <p>
              This application uses artificial intelligence to assist in the analysis of legal
              documents. In accordance with Regulation (EU) 2024/1689 (AI Act):
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2 mt-2">
              <li>This tool is classified as <strong>limited risk</strong> under the AI Act</li>
              <li>All outputs are clearly identified as AI-generated</li>
              <li>This tool does not make autonomous legal decisions</li>
              <li>
                All AI-generated outputs are intended to assist the recipient's own review
                and must be independently verified. The operator does not review or validate
                individual outputs prior to delivery.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">8. Important Notice</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-700 text-xs leading-relaxed">
                We strongly recommend that you <strong>do not submit contracts containing
                highly confidential, privileged, or sensitive personal data</strong>. If you
                choose to submit such documents, you do so at your own risk and with full
                awareness of the data processing described in this policy. For testing purposes,
                we recommend using sample contracts or documents with redacted sensitive information.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">9. Cookies</h2>
            <p>
              This application does not use cookies for advertising or tracking purposes.
              Session cookies are used exclusively to maintain authenticated access during
              a single visit and are deleted upon browser closure.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">10. Complaints</h2>
            <p>
              If you believe your data protection rights have been violated, you have the right
              to lodge a complaint with the competent data protection authority in your country
              of residence or establishment within the European Union.
            </p>
            <p className="mt-2">
              For further information on identifying your competent authority, visit:{' '}
              <a href="https://www.edpb.europa.eu" target="_blank" className="text-blue-500 underline">
                edpb.europa.eu
              </a>
            </p>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              This Privacy Policy was drafted in accordance with Regulation (EU) 2016/679 (GDPR)
              and Regulation (EU) 2024/1689 (AI Act).
            </p>
          </div>

        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 underline">
            ← Back to Contract Analyser
          </Link>
        </div>

      </div>
    </main>
  )
}