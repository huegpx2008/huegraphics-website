import {
  DocumentSection,
  PublicDocumentLayout,
} from "@/components/PublicDocumentLayout";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Hue HQ Privacy Policy",
  description:
    "Privacy policy for Hue HQ, including how Hue Graphics & Apparel, LLC handles business information and authorized QuickBooks data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PublicDocumentLayout
      eyebrow="Effective August 6, 2026"
      title="Hue HQ Privacy Policy"
      introduction="This policy explains how Hue Graphics & Apparel, LLC collects, uses, protects, shares, retains, and deletes information handled through the private Hue HQ business-management application."
    >
      <DocumentSection title="Operator and contact information">
        <p>
          Hue HQ is operated by Hue Graphics &amp; Apparel, LLC (&ldquo;Hue
          Graphics,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;), 741 Harry McCarty Road, Suite 101, Bethlehem,
          Georgia 30620.
        </p>
        <p>
          Privacy questions and deletion requests may be sent to{" "}
          <a
            href="mailto:jason@huegraphics.cc"
            className="font-bold text-accent underline decoration-accent/35 underline-offset-4 hover:text-[#07111f]"
          >
            jason@huegraphics.cc
          </a>
          . Our public website is{" "}
          <a
            href="https://www.huegraphics.cc"
            className="font-bold text-accent underline decoration-accent/35 underline-offset-4 hover:text-[#07111f]"
          >
            www.huegraphics.cc
          </a>
          .
        </p>
      </DocumentSection>

      <DocumentSection title="1. Scope of this policy">
        <p>
          This policy applies to information processed through Hue HQ and its
          authorized integrations. Hue HQ is primarily a private internal
          business application, not a generally available consumer product.
          Separate websites and third-party services may have their own privacy
          policies.
        </p>
      </DocumentSection>

      <DocumentSection title="2. Information collected directly">
        <p>
          We may collect information that authorized users enter, submit, or
          generate through Hue HQ, including names, business contact details,
          project requirements, estimates, orders, communications, notes,
          production status, payment references, and related operational
          records.
        </p>
      </DocumentSection>

      <DocumentSection title="3. Account and authentication information">
        <p>
          Hue HQ may process account identifiers, names, email addresses,
          assigned roles, authentication status, login and security events, and
          information needed to confirm that a user is authorized. Passwords
          and access credentials are handled through protected authentication
          systems and are not displayed to other users.
        </p>
      </DocumentSection>

      <DocumentSection title="4. Customer and business information">
        <p>
          Depending on the functions used, Hue HQ may process customer names,
          contact information, company details, order and invoice references,
          products and services requested, artwork or project files, payment
          status, communications, production details, and reconciliation
          records. Authorized users should enter only information reasonably
          needed for legitimate business operations.
        </p>
      </DocumentSection>

      <DocumentSection title="5. QuickBooks information accessed after authorization">
        <p>
          Hue HQ accesses a QuickBooks Online company only after an authorized
          user completes Intuit&apos;s authorization process. Depending on the
          approved permissions and available records, Hue HQ may access:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>QuickBooks company information;</li>
          <li>customers;</li>
          <li>invoices;</li>
          <li>payments;</li>
          <li>products and service items; and</li>
          <li>totals and reconciliation information.</li>
        </ul>
        <p>
          The current QuickBooks integration is read-only. It is used to
          preview records, match information, identify differences, support
          reconciliation, and produce audit results. Any future ability to
          create or update QuickBooks records would be enabled intentionally,
          disclosed before use, and used only with the user&apos;s authorization.
        </p>
        <p>
          To maintain and operate the connection, Hue HQ may retain the
          QuickBooks company or realm identifier, encrypted OAuth credentials,
          connection status, reconciliation and synchronization metadata, and
          audit results. QuickBooks access credentials are kept server-side and
          protected from ordinary client-side access.
        </p>
      </DocumentSection>

      <DocumentSection title="6. How information is used">
        <p>We use information to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>provide the requested Hue HQ business-management functions;</li>
          <li>authenticate users and manage authorized access;</li>
          <li>organize customers, projects, production, payments, and communications;</li>
          <li>preview, match, synchronize, reconcile, and audit authorized records;</li>
          <li>maintain security, reliability, troubleshooting, and support;</li>
          <li>comply with legal, accounting, contractual, and recordkeeping obligations; and</li>
          <li>improve Hue HQ&apos;s usability and business workflows.</li>
        </ul>
        <p>
          Hue Graphics does not sell QuickBooks data or customer data. We use
          this information to operate Hue HQ and provide the business-management
          functions requested by authorized users.
        </p>
      </DocumentSection>

      <DocumentSection title="7. Storage and security">
        <p>
          Hue Graphics uses reasonable administrative, technical, and physical
          safeguards appropriate to the nature of the information. These may
          include access controls, role restrictions, encryption in transit,
          protected server-side credentials, monitoring, backups, and service
          providers designed for secure application operations.
        </p>
        <p>
          No system can guarantee absolute security. Authorized users should
          protect their accounts, use secure devices and networks, and report
          suspected unauthorized activity promptly.
        </p>
      </DocumentSection>

      <DocumentSection title="8. When information is shared">
        <p>
          We do not share QuickBooks or customer data for unrelated advertising
          or sale. Information may be shared only as reasonably necessary:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>with authorized users and the business they represent;</li>
          <li>with service providers that operate, secure, host, communicate, store, or support Hue HQ;</li>
          <li>when directed or authorized by the applicable user or business;</li>
          <li>to comply with law, legal process, or enforceable governmental requests; or</li>
          <li>to protect rights, safety, security, and prevent fraud or abuse.</li>
        </ul>
        <p>
          Relevant service providers may include Intuit, Vercel, Supabase,
          Resend, GoDaddy Payments/Poynt, and approved storage providers. These
          providers may process information only as necessary to deliver their
          services, support Hue HQ, or satisfy applicable legal obligations.
        </p>
      </DocumentSection>

      <DocumentSection title="9. Data retention">
        <p>
          We retain information only for as long as reasonably necessary to
          operate Hue HQ, provide requested services, maintain business and
          security records, resolve disputes, enforce agreements, and satisfy
          legal, accounting, tax, or backup obligations.
        </p>
        <p>
          Active QuickBooks OAuth credentials are retained only while needed to
          maintain an authorized connection. After disconnection, future API
          access stops and credentials are revoked, deleted, or rendered
          unusable as part of the normal disconnection process. Company
          identifiers, connection history, reconciliation metadata, and audit
          results may be retained when needed for legitimate records, security,
          compliance, or requested business functions. Information that is no
          longer needed is deleted or de-identified, subject to reasonable
          backup cycles and legal retention duties.
        </p>
      </DocumentSection>

      <DocumentSection title="10. Disconnecting QuickBooks and revoking access">
        <p>
          An authorized user may disconnect QuickBooks through Hue HQ or revoke
          the app through Intuit. Disconnecting stops future QuickBooks API
          access unless and until the connection is authorized again. It does
          not automatically erase every prior audit or reconciliation record;
          those records remain subject to the retention and deletion practices
          described above.
        </p>
      </DocumentSection>

      <DocumentSection title="11. Privacy rights and requests">
        <p>
          Depending on applicable law and the user&apos;s relationship with Hue
          Graphics, a person may request access to, correction of, or deletion
          of personal information, or ask questions about its use. Requests may
          be sent to jason@huegraphics.cc. We may verify identity and authority
          before responding. Some information may be retained where required or
          permitted for legal, security, accounting, contractual, or legitimate
          business purposes.
        </p>
      </DocumentSection>

      <DocumentSection title="12. Children&apos;s privacy">
        <p>
          Hue HQ is a business application and is not directed to children under
          13. We do not knowingly collect personal information from children
          through Hue HQ. If we learn that such information was submitted
          inappropriately, we will take reasonable steps to delete it.
        </p>
      </DocumentSection>

      <DocumentSection title="13. Updates to this policy">
        <p>
          We may update this policy as Hue HQ, its integrations, or applicable
          requirements change. The current version will be posted here with its
          effective date. Material changes may also be communicated through Hue
          HQ or another appropriate channel.
        </p>
      </DocumentSection>

      <DocumentSection title="14. Contact information">
        <p>
          Hue Graphics &amp; Apparel, LLC
          <br />
          741 Harry McCarty Road, Suite 101
          <br />
          Bethlehem, Georgia 30620
          <br />
          Email: jason@huegraphics.cc
          <br />
          Website: https://www.huegraphics.cc
        </p>
      </DocumentSection>
    </PublicDocumentLayout>
  );
}
