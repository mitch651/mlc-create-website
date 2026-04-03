/** Netlify Forms name — must match `public/__forms.html` and `form-name` in POST body. */
export const NETLIFY_CLIENT_INTAKE_FORM_NAME = "client-intake"

/** Honeypot field name — must match `data-netlify-honeypot` in `public/__forms.html`. */
export const NETLIFY_CLIENT_INTAKE_HONEYPOT = "bot-field"

/**
 * Static file used for deploy-time form detection with @netlify/plugin-nextjs v5+ (OpenNext).
 * @see https://opennext.js.org/netlify/forms
 */
export const NETLIFY_FORMS_POST_PATH = "/__forms.html"
