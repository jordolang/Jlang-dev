# Client review workflow setup

The review request page is intentionally absent from the main navigation. You manage it at `/studio`, and clients only reach a request through a unique `/review/<token>` link.

## 1. Configure Sanity

1. Create or select a Sanity project and add the values shown in `env-example` to `.env.local`.
2. Create a Sanity API token with Editor permissions and save it as `SANITY_API_WRITE_TOKEN`. Never use a `NEXT_PUBLIC_` prefix for this token.
3. Add `http://localhost:3000` and `https://jlang.dev` to the project's CORS origins with credentials enabled.
4. Open `/studio`, sign in through Sanity, and create a **Review Request** document.

## 2. Configure automatic email delivery

1. Add a Resend API key and verified sender to `.env.local`.
2. In Sanity project settings, create a webhook pointing to:
   `https://jlang.dev/api/webhooks/sanity/review-request`
3. Trigger it for create/update events using this GROQ filter:
   `_type == "reviewRequest" && status == "queued"`
4. Set the webhook projection to:
   `{_id, _type, clientName, company, role, email, token, status}`
5. Add an HTTP Authorization header containing `Bearer ` followed by the exact `SANITY_WEBHOOK_SECRET` value.

In Studio, fill in the required client details, publish the document, then choose **Send review request**. The action creates the private token and queues the webhook. Resend emails the client and the record changes to `sent`.

## 3. Review submission behavior

- The client name, company, and role are locked and prefilled from the request.
- Clicking a star fills that star and every star to its left.
- A submitted review is stored as an approved Sanity testimonial, appears on the homepage, and updates the displayed site-wide average.
- Each link can only create one testimonial.
- Google does not allow third-party software to publish a customer review through the Business Profile API. After submitting, the client receives a separate link to Google's own review form. Set `NEXT_PUBLIC_GOOGLE_REVIEW_URL` to your Google Business Profile review link.

To hide a submitted review, open **Testimonials** in Studio and disable **Show on website**.
