# RSVP Form

A single-page RSVP form with a cream, botanical, vintage style. Submissions are sent via **Formspree** so you get emails and can view responses in the Formspree dashboard.

## Formspree setup

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Click **New form** and name it (e.g. “Wedding RSVP”).
3. Copy your form’s endpoint (e.g. `https://formspree.io/f/xpwnqkzw`).
4. Open `index.html` and find the form’s `data-api` attribute. Replace `YOUR_FORM_ID` with your form ID:

   ```html
   data-api="https://formspree.io/f/YOUR_FORM_ID"
   ```

   So if your endpoint is `https://formspree.io/f/xpwnqkzw`, use:

   ```html
   data-api="https://formspree.io/f/xpwnqkzw"
   ```

5. In the Formspree dashboard, set the email address where you want to receive RSVPs. Submissions will be emailed to you and listed under your form.

No backend or server is required: open `index.html` in a browser or host the folder on any static host (GitHub Pages, Netlify, etc.).
