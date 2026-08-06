import {
  DocumentSection,
  PublicDocumentLayout,
} from "@/components/PublicDocumentLayout";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Hue HQ End-User License Agreement and Terms of Use",
  description:
    "Terms of use and end-user license agreement for the private Hue HQ business-management application operated by Hue Graphics & Apparel, LLC.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PublicDocumentLayout
      eyebrow="Effective August 6, 2026"
      title="Hue HQ End-User License Agreement and Terms of Use"
      introduction="These terms govern authorized access to Hue HQ, a private business-management application operated by Hue Graphics & Apparel, LLC."
    >
      <DocumentSection title="Operator and contact information">
        <p>
          Hue HQ is operated by Hue Graphics &amp; Apparel, LLC (&ldquo;Hue
          Graphics,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;), located at 741 Harry McCarty Road, Suite 101,
          Bethlehem, Georgia 30620.
        </p>
        <p>
          Questions may be sent to{" "}
          <a
            href="mailto:jason@huegraphics.cc"
            className="font-bold text-accent underline decoration-accent/35 underline-offset-4 hover:text-[#07111f]"
          >
            jason@huegraphics.cc
          </a>{" "}
          or submitted through{" "}
          <a
            href="https://www.huegraphics.cc"
            className="font-bold text-accent underline decoration-accent/35 underline-offset-4 hover:text-[#07111f]"
          >
            www.huegraphics.cc
          </a>
          .
        </p>
      </DocumentSection>

      <DocumentSection title="1. Acceptance of these terms">
        <p>
          By accessing or using Hue HQ, you agree to these terms. If you are
          using Hue HQ for a business or other organization, you represent that
          you are authorized to accept these terms on its behalf. If you do not
          agree, do not access or use Hue HQ.
        </p>
      </DocumentSection>

      <DocumentSection title="2. Purpose of Hue HQ">
        <p>
          Hue HQ supports business operations such as customer and project
          management, production workflows, communications, estimates,
          payments, reporting, and reconciliation. It is primarily a private
          internal business application for Hue Graphics and specifically
          authorized users. Hue HQ is not a generally available consumer
          software product or a public accounting service.
        </p>
      </DocumentSection>

      <DocumentSection title="3. Authorized users and account security">
        <p>
          Access is limited to users approved by Hue Graphics or by an
          organization Hue Graphics has authorized. You must provide accurate
          account information, keep credentials and authentication methods
          secure, and promptly report suspected unauthorized access. You are
          responsible for activity performed through your account unless caused
          by Hue Graphics&apos; failure to use reasonable security measures.
        </p>
        <p>
          Account access may not be shared with an unauthorized person. Hue
          Graphics may require password changes, additional verification, or
          other reasonable security steps.
        </p>
      </DocumentSection>

      <DocumentSection title="4. Limited license">
        <p>
          Subject to these terms, Hue Graphics grants each authorized user a
          limited, non-exclusive, non-transferable, non-sublicensable, and
          revocable license to access and use Hue HQ solely for approved
          business purposes. No ownership interest is transferred. The license
          ends when access is withdrawn, the user&apos;s role ends, or these
          terms are terminated.
        </p>
      </DocumentSection>

      <DocumentSection title="5. Acceptable use and prohibited activity">
        <p>You agree to use Hue HQ lawfully and only as authorized. You may not:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>access data or functions you are not authorized to use;</li>
          <li>share credentials or attempt to bypass access controls;</li>
          <li>introduce malicious code or disrupt the application or connected services;</li>
          <li>scrape, copy, reverse engineer, or probe Hue HQ except where applicable law expressly permits it;</li>
          <li>use Hue HQ for fraud, harassment, unlawful activity, or infringement;</li>
          <li>upload information you do not have the right to use; or</li>
          <li>use automated tools in a way that places an unreasonable load on the application.</li>
        </ul>
      </DocumentSection>

      <DocumentSection title="6. Business information entered into Hue HQ">
        <p>
          You and the applicable business retain ownership of information
          entered into Hue HQ. You grant Hue Graphics permission to host,
          process, transmit, back up, and display that information as reasonably
          necessary to operate, secure, support, and improve the requested Hue
          HQ functions.
        </p>
        <p>
          You are responsible for the accuracy, legality, and appropriate use of
          information you submit. Hue HQ records may assist business operations,
          but users should verify material financial, tax, payment, production,
          and customer decisions against the appropriate source records.
        </p>
      </DocumentSection>

      <DocumentSection title="7. Third-party services and integrations">
        <p>
          Hue HQ may connect with third-party services, including Intuit
          QuickBooks, payment providers, email services, hosting providers, and
          approved storage services. Use of a third-party service may also be
          governed by that provider&apos;s terms and privacy practices.
        </p>
        <p>
          A QuickBooks connection is established only after an authorized user
          approves access through Intuit. The current integration is read-only
          and supports previewing, matching, and reconciliation. Hue Graphics
          does not control the availability, accuracy, or independent operation
          of third-party services and is not responsible for outages or changes
          originating with those providers.
        </p>
      </DocumentSection>

      <DocumentSection title="8. Ownership of Hue HQ">
        <p>
          Hue Graphics and its licensors own Hue HQ, including its software,
          workflows, interface, branding, documentation, and other materials,
          excluding business information supplied by users or third parties.
          All rights not expressly granted in these terms are reserved.
        </p>
      </DocumentSection>

      <DocumentSection title="9. Service availability and changes">
        <p>
          Hue Graphics may maintain, update, add, remove, or change Hue HQ
          features as business and security needs evolve. We aim to keep the
          application available, but uninterrupted or error-free service is not
          guaranteed. Access may be limited during maintenance, emergencies,
          provider outages, or security events.
        </p>
      </DocumentSection>

      <DocumentSection title="10. Disclaimers">
        <p>
          To the fullest extent permitted by law, Hue HQ is provided &ldquo;as
          is&rdquo; and &ldquo;as available.&rdquo; Hue Graphics disclaims
          warranties that are not expressly stated in these terms, including
          implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </p>
        <p>
          Hue HQ is a business operations tool and does not provide legal, tax,
          accounting, or financial advice. QuickBooks and other source systems
          remain authoritative for their records, and users should review
          important results before relying on them.
        </p>
      </DocumentSection>

      <DocumentSection title="11. Limitation of liability">
        <p>
          To the fullest extent permitted by law, Hue Graphics will not be
          liable for indirect, incidental, special, consequential, exemplary,
          or punitive damages, or for lost profits, lost revenue, loss of data,
          or business interruption arising from Hue HQ or a connected service.
        </p>
        <p>
          Hue Graphics&apos; total liability for claims relating to Hue HQ will
          not exceed the greater of one hundred U.S. dollars or the amount paid
          directly for access to Hue HQ during the twelve months before the
          event giving rise to the claim. These limitations do not apply where
          prohibited by law or to liability that cannot legally be limited.
        </p>
      </DocumentSection>

      <DocumentSection title="12. Suspension or termination">
        <p>
          Hue Graphics may suspend or terminate access when authorization ends,
          these terms are violated, security or legal risks arise, payment or
          provider requirements are not met, or continued access could harm Hue
          Graphics, a user, a customer, or a third party. When practical, we
          will provide notice and a reasonable opportunity to address the issue.
        </p>
      </DocumentSection>

      <DocumentSection title="13. Changes to these terms">
        <p>
          We may update these terms to reflect application, legal, security, or
          business changes. The updated version will be posted here with a new
          effective date. Continued use after an update becomes effective means
          you accept the revised terms.
        </p>
      </DocumentSection>

      <DocumentSection title="14. Governing law">
        <p>
          These terms are governed by the laws of the State of Georgia, without
          regard to conflict-of-law rules. Any dispute must be brought in a
          court of competent jurisdiction serving Barrow County, Georgia, unless
          applicable law requires another location.
        </p>
      </DocumentSection>

      <DocumentSection title="15. Contact and legal review notice">
        <p>
          Questions about these terms may be sent to jason@huegraphics.cc or to
          Hue Graphics &amp; Apparel, LLC, 741 Harry McCarty Road, Suite 101,
          Bethlehem, Georgia 30620.
        </p>
        <p className="rounded-md border border-accent/25 bg-accent/[0.06] p-4 font-semibold text-[#25394e]">
          These terms are provided as practical business terms for Hue HQ and
          may be reviewed or revised by legal counsel later.
        </p>
      </DocumentSection>
    </PublicDocumentLayout>
  );
}
