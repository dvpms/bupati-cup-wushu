# Prototypes folder

Drop your pure HTML prototypes here. We'll convert each into a Next.js page.

Guidelines:

- Name files with kebab-case and `.html`, e.g. `beranda.html`, `pendaftaran-atlet.html`, `dashboard-panitia.html`.
- Keep assets (images/css/js) alongside each HTML or in `prototypes/assets/`. Relative paths are fine; we'll remap during conversion.
- Avoid inline scripts that depend on external CDNs without noting them in a comment at the top.

Optional structure (recommended untuk dua sisi):

```text
prototypes/
	public/
		beranda.html
		pendaftaran-atlet.html
	admin/
		dashboard-panitia.html
		verifikasi-pembayaran.html
```

What to include in each HTML file header comment (optional, helpful):

```text
Side: public|admin
Route: /target-url
Title: Page title
Purpose: Brief purpose
Notes: any special interactions, modals, validation, APIs
```

When ready, ping me and I'll convert them to real Next.js routes under `src/app` with React components and shared layout.
