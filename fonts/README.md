# Parfumerie Script Pro

Use **Parfumerie Script Pro** (long, elegant cursive) for this project in one of two ways:

## Option 1: Adobe Fonts (recommended)

1. Go to [fonts.adobe.com](https://fonts.adobe.com/fonts/parfumerie-script).
2. Sign in with your Adobe ID (Creative Cloud).
3. Click **Add to Web Project** and create or choose a web project.
4. Copy the kit URL (e.g. `https://use.typekit.net/xxxxx.css`).
5. In **index.html**, uncomment the Adobe Fonts link and replace `YOUR_KIT_ID` with your kit ID:
   ```html
   <link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css">
   ```

## Option 2: Self-hosted font files

If you have a license for Parfumerie Script Pro (e.g. from [MyFonts](https://www.myfonts.com/collections/parfumerie-script-pro-font-typesenses/) or [Typesenses](https://typesenses.com/)):

1. Place your font files in this `fonts/` folder:
   - `ParfumerieScriptPro.woff2` (preferred)
   - and/or `ParfumerieScriptPro.woff`
2. The CSS in **style.css** will load them automatically via `@font-face`.

If the font files are named differently, update the `url()` paths in the `@font-face` block at the top of **style.css**.
