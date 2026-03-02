# RSVP API

This server receives form submissions, emails them to you, and saves each response to a JSON file.

## Setup

1. **Install dependencies**

   ```bash
   cd api
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   - **TO_EMAIL** – Your email address (where RSVPs are sent).
   - **SMTP_*** – Your email provider’s SMTP settings.  
     For Gmail: use an [App Password](https://support.google.com/accounts/answer/185833) (not your normal password).

3. **Run the server**

   ```bash
   npm start
   ```

   Then open **http://localhost:3000** – the form is served from the project root and submits to `/api/rsvp`.

## Where things are saved

- **File:** `api/data/rsvps.json`  
  Each submission is appended there with: `name`, `email`, `attending`, `bringing_guest`, `guest_name` (if any), `dietary`, `received_at`, and an `id`.

- **Email:** One email per RSVP is sent to `TO_EMAIL` (if SMTP is set in `.env`).

## Deploying

- Run the same commands on your host (e.g. Railway, Render, Fly.io): `npm install` and `npm start`.
- Set `PORT` and all `TO_EMAIL` / `SMTP_*` variables in the host’s environment.
- If the frontend is on a different domain, set the form’s `data-api` attribute to your API URL, e.g. `data-api="https://your-app.up.railway.app/api/rsvp"`.

## Without email

If you leave `SMTP_USER` / `SMTP_PASS` unset, the server still runs and saves every RSVP to `api/data/rsvps.json`; it just won’t send email.
