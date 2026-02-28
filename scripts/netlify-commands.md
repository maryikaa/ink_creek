# Netlify CLI – Local dev & deploy

Run these in your project root in a terminal (Node.js must be installed).

## 1. Install Netlify CLI (once)

```bash
npm install -g netlify-cli
```

If you prefer not to install globally:

```bash
npx netlify-cli dev
npx netlify-cli deploy --prod
```

## 2. Local test (site + serverless functions)

```bash
netlify dev
```

Then open the URL shown (e.g. http://localhost:8888). The `/api/ss-products` proxy will work locally.

## 3. Deploy to production

```bash
netlify deploy --prod
```

- First time: run `netlify login` and authorize in the browser.
- If the site isn’t linked yet: run `netlify init` and follow the prompts.
