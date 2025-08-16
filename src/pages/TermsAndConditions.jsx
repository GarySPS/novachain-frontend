import React from "react";

export default function TermsAndConditions() {
  return (
    <div
      className="min-h-screen w-full text-gray-200"
      style={{
        background: 'url("/novachain.jpg") no-repeat center center fixed',
        backgroundSize: "cover",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(120deg, #15192ae0 0%, #181c25bb 70%, #101622cc 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-5 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 mb-6">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Last updated: 12 Jan 2025
        </p>

        <div className="bg-[#151c2e]/80 border border-[#24314a] rounded-2xl p-6 md:p-8 space-y-6 text-sm leading-6">
          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              These Terms &amp; Conditions (“Terms”) govern your access to and
              use of the NovaChain platform and services that enable BTC/USDT
              and BTC/USD–denominated binary options trading (“Services”). By
              creating an account, accessing, or using the Services, you agree
              to be bound by these Terms and our Privacy Policy. If you do not
              agree, do not use the Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              2. Eligibility &amp; Compliance
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                You must be at least 18 years old and have the capacity to
                enter into a binding contract.
              </li>
              <li>
                You are solely responsible for ensuring that using the Services
                is legal in your jurisdiction. We may restrict access in certain
                regions at our discretion.
              </li>
              <li>
                You agree to provide accurate information and promptly update it
                when it changes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              3. Risk Disclosure
            </h2>
            <p className="mb-2">
              Binary options involve a high level of risk. Price volatility can
              result in rapid losses, including the loss of your entire stake.
              You should trade only with funds you can afford to lose. Past
              performance is not indicative of future results, and there is no
              guarantee of profit.
            </p>
            <p>
              You acknowledge that you understand the nature of the products,
              the associated risks, and that NovaChain does not provide
              personalized financial, investment, tax, or legal advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              4. No Advice &amp; Educational Content
            </h2>
            <p>
              Market data, prices, charts, news, notifications, tutorials, or
              any other content provided through the Services are for general
              information only and should not be construed as investment advice
              or a recommendation. You are solely responsible for your trading
              decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              5. Account Registration, Security &amp; KYC
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                You must register an account and complete any required identity
                verification (KYC) and sanctions screening before accessing
                certain features.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                credentials and for all activity that occurs under your account.
              </li>
              <li>
                We may suspend or terminate accounts that fail verification, are
                suspected of fraud, or violate these Terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              6. Deposits, Withdrawals &amp; Balances
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Supported payment rails and settlement assets are shown in-app
                and may change without notice.
              </li>
              <li>
                All deposits are credited after network/payment confirmations.
                Withdrawals may require additional review and processing time.
              </li>
              <li>
                Fees, limits, and minimums are displayed in-app and form part of
                these Terms.
              </li>
              <li>
                Fiat conversions (if any) are executed at the rates and methods
                indicated at the time of the transaction.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              7. Binary Options Trading Rules
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Products: short-duration “Up/Down” contracts on BTC price
                versus USDT or USD references over a predefined expiry.
              </li>
              <li>
                Entry: you choose direction (e.g., “Up”/“Down”), stake size, and
                expiry. Orders are accepted only after confirmation.
              </li>
              <li>
                Reference Price: unless otherwise specified, the strike and
                settlement are determined by aggregated price feeds from one or
                more third-party sources/venues at our discretion.
              </li>
              <li>
                Payout: if your prediction is correct at expiry, the contract
                pays the advertised payout; otherwise, your stake is lost.
              </li>
              <li>
                Cancellations/Amendments: once confirmed, contracts cannot be
                canceled or amended except where required due to a technical
                error identified by NovaChain.
              </li>
              <li>
                Limits: we may set or modify trade size, exposure, frequency, or
                risk limits without notice.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              8. Pricing, Market Data &amp; Errors
            </h2>
            <p className="mb-2">
              Prices and market data are provided on a best-effort basis and may
              be delayed or unavailable. In the event of manifest error,
              out-of-market prints, data feed failures, or misquotes, NovaChain
              may void or adjust affected contracts to the fair value we
              reasonably determine.
            </p>
            <p>
              You agree that our records (including logs and price snapshots) are
              final and binding absent clear evidence of error.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              9. Fees
            </h2>
            <p>
              Trading fees, spreads, funding/rollover (if any), deposit/withdraw
              fees, and network fees are displayed in the app at the time of the
              transaction and may change without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              10. Prohibited Use
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Money laundering, terrorist financing, or sanctions evasion</li>
              <li>Market manipulation or abusive trading practices</li>
              <li>Use of bots or unauthorized automation that harms platform stability</li>
              <li>Interference with the Services, reverse engineering, or scraping</li>
              <li>Impersonation or use of another person’s account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              11. AML/CTF, Sanctions &amp; Reporting
            </h2>
            <p>
              We maintain anti–money laundering, counter–terrorist financing, and
              sanctions controls. Transactions may be monitored, blocked, or
              reported to competent authorities where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              12. Service Availability &amp; Maintenance
            </h2>
            <p>
              We may suspend or limit access for maintenance, security, market
              volatility, or force majeure events. We are not liable for
              unavailability, delays, or failures beyond our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              13. Intellectual Property
            </h2>
            <p>
              All content, software, trademarks, logos, and data are the
              property of NovaChain or its licensors. You receive a limited,
              revocable, non-transferable license to use the Services for their
              intended purpose in accordance with these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              14. Limitation of Liability
            </h2>
            <p className="mb-2">
              To the maximum extent permitted by law, NovaChain and its
              affiliates will not be liable for indirect, incidental, special,
              consequential, or punitive damages, loss of profits, data, or
              goodwill, or for trading losses arising from your use of the
              Services.
            </p>
            <p>
              Our aggregate liability for any claim shall not exceed the fees you
              paid to NovaChain for the Service(s) giving rise to the claim in
              the three (3) months preceding the event.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              15. Indemnity
            </h2>
            <p>
              You agree to indemnify and hold harmless NovaChain, its affiliates,
              directors, employees, and agents from any claims, damages, losses,
              liabilities, and expenses arising out of your use of the Services
              or violation of these Terms or applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              16. Suspension &amp; Termination
            </h2>
            <p>
              We may suspend or terminate your access immediately for suspected
              breach, fraud, or unlawful activity. You may close your account at
              any time subject to completing outstanding obligations. We may
              retain information as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              17. Dormant Accounts
            </h2>
            <p>
              Accounts with no login or trading activity for twelve (12) months
              may be deemed dormant. We may charge reasonable dormancy fees or
              deactivate features until you re-authenticate, subject to
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              18. Communications &amp; Electronic Records
            </h2>
            <p>
              You consent to receive communications electronically and to the use
              of electronic signatures and records for all purposes related to
              the Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              19. Governing Law &amp; Disputes
            </h2>
            <p>
              These Terms are governed by the laws of Singapore. Any dispute
              shall be submitted to the exclusive jurisdiction of the courts of
              Singapore, unless mandatory law provides otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              20. Changes to the Terms
            </h2>
            <p>
              We may update these Terms at any time. The updated version becomes
              effective when posted in-app or on our website. Continued use of
              the Services constitutes acceptance of the changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-teal-300 mb-2">
              21. Contact
            </h2>
            <p>
              Support:{" "}
              <a
                href="https://wa.me/16627053615"
                className="text-blue-400 underline"
              >
                WhatsApp +1 662 705 3615
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
