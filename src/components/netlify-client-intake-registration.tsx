import {
  NETLIFY_CLIENT_INTAKE_FORM_NAME,
  NETLIFY_CLIENT_INTAKE_HONEYPOT,
} from "@/lib/netlify-client-intake"

/**
 * Server-rendered form so Netlify can register fields at deploy.
 * The visible form lives in `site-landing.tsx` and POSTs the same field names.
 */
export function NetlifyClientIntakeRegistration() {
  return (
    <form
      name={NETLIFY_CLIENT_INTAKE_FORM_NAME}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot={NETLIFY_CLIENT_INTAKE_HONEYPOT}
      hidden
      aria-hidden
    >
      <input type="hidden" name="form-name" value={NETLIFY_CLIENT_INTAKE_FORM_NAME} />
      <input type="text" name={NETLIFY_CLIENT_INTAKE_HONEYPOT} tabIndex={-1} autoComplete="off" />
      <input type="hidden" name="businessName" />
      <input type="hidden" name="contactName" />
      <input type="hidden" name="titleRole" />
      <input type="hidden" name="phone" />
      <input type="hidden" name="email" />
      <input type="hidden" name="businessAddress" />
      <input type="hidden" name="currentWebsite" />
      <input type="hidden" name="industry" />
      <input type="hidden" name="selectedPackage" />
      <input type="hidden" name="desiredLaunchDate" />
      <input type="hidden" name="mainGoals" />
      <input type="hidden" name="branding" />
      <input type="hidden" name="features" />
      <input type="hidden" name="contentSupply" />
      <input type="hidden" name="inspiration1" />
      <input type="hidden" name="inspiration2" />
      <input type="hidden" name="inspiration3" />
      <input type="hidden" name="additionalNotes" />
    </form>
  )
}
