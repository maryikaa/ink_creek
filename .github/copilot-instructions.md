# Copilot Instructions for Ink Creek Studio

## Project Overview
This is a modern HTML project using Tailwind CSS for rapid, responsive UI development. The codebase is organized for clarity and maintainability, with a focus on static site generation and minimal JavaScript.

## Architecture & Key Components
- **HTML Pages**: All main content lives in the `pages/` directory. Each file is a standalone HTML page for a specific feature (e.g., contact, portfolio, pricing calculator).
- **Styling**: Tailwind CSS is configured in `tailwind.config.js`. Source styles are in `css/tailwind.css`; compiled output is in `css/main.css`.
- **Assets**: Images and static files are stored in `assets/images/` and `public/`.
- **Entry Point**: `index.html` is the main landing page.

## Developer Workflows
- **Install dependencies**: `npm install` or `yarn install`
- **Start development server**: `npm run dev` or `yarn dev` (if configured)
- **Build CSS for production**: `npm run build:css` or `yarn build:css`
- **Edit Tailwind config**: Update `tailwind.config.js` for custom utilities or breakpoints

## Project-Specific Conventions
- **Minimal JavaScript**: Most interactivity is handled via HTML and CSS. If adding JS, keep it modular and place in a dedicated folder (e.g., `js/`).
- **Utility-First Styling**: Use Tailwind utility classes directly in HTML. Avoid custom CSS unless necessary; place overrides in `css/tailwind.css`.
- **Responsive Design**: Use Tailwind's breakpoint classes (`sm`, `md`, `lg`, `xl`, `2xl`) for layout adjustments.
- **Page Naming**: HTML files in `pages/` use descriptive, underscore-separated names reflecting their purpose.

## Integration Points & Dependencies
- **Tailwind CSS**: Core dependency, configured via `tailwind.config.js`.
- **Node.js & npm**: Used for managing dependencies and build scripts.
- **No backend/server code**: This is a static site; all logic is client-side.

## Examples
- To add a new page, create an HTML file in `pages/` and link it from `index.html`.
- To add a new image, place it in `assets/images/` and reference it in your HTML.
- To customize styles, edit `css/tailwind.css` and rebuild with `npm run build:css`.

## References
- `README.md`: General project info and setup
- `tailwind.config.js`: Tailwind customization
- `css/tailwind.css`, `css/main.css`: Source and compiled styles
- `pages/`: All feature pages

---

For questions or unclear conventions, review `README.md` or ask for clarification. Please suggest improvements if you find missing or outdated instructions.
