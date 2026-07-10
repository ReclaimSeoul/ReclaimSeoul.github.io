class SiteNav extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute("base") || "";
    const current = this.getAttribute("current") || "";
    const resolvePath = (path) => {
      if (/^https?:\/\//.test(path)) {
        return path;
      }

      if (!path) {
        return base || "./";
      }

      return `${base}${path}`;
    };
    const isCurrent = (page) => current === page;

    this.innerHTML = `
      <style>
        .site-header {
          position: sticky;
          top: 0;
          z-index: 10;
          border-bottom: 1px solid var(--line);
          background: rgba(243, 245, 239, 0.92);
          backdrop-filter: blur(14px);
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 14px 0;
        }

        .brand {
          display: grid;
          gap: 1px;
          min-width: 160px;
          text-decoration: none;
        }

        .brand strong {
          font-size: 0.95rem;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .brand strong::after {
          content: "";
          display: block;
          width: 44px;
          height: 3px;
          margin-top: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--hive-green), var(--hive-cyan));
        }

        .brand span {
          color: var(--muted);
          font-size: 0.78rem;
        }

        .nav-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .nav-links a,
        .nav-links span,
        .page-link[aria-current="page"] {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          border: 1px solid rgba(16, 18, 20, 0.28);
          border-radius: 6px;
          padding: 0 13px;
          background: rgba(255, 255, 255, 0.86);
          color: var(--ink);
          font-size: 0.86rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        .page-link:not([aria-current="page"]) {
          border-color: transparent;
          background: transparent;
        }

        .page-link:not([aria-current="page"]):hover,
        .page-link:not([aria-current="page"]):focus-visible {
          border-color: rgba(16, 18, 20, 0.18);
          background: rgba(255, 255, 255, 0.54);
        }

        .nav-links a.live {
          border-color: rgba(0, 208, 132, 0.58);
          background: var(--dark-panel);
          color: white;
          box-shadow: 0 0 0 1px rgba(52, 226, 228, 0.12);
        }

        .nav-links span {
          color: rgba(17, 19, 24, 0.46);
          cursor: not-allowed;
        }

        @media (max-width: 920px) {
          .nav {
            align-items: flex-start;
            flex-direction: column;
          }

          .nav-links {
            justify-content: flex-start;
          }
        }

        @media (max-width: 560px) {
          .nav-links {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
          }

          .nav-links a,
          .nav-links span,
          .page-link[aria-current="page"] {
            justify-content: center;
            padding: 0 9px;
            text-align: center;
            white-space: normal;
          }
        }
      </style>
      <header class="site-header">
        <nav class="nav" aria-label="Site navigation">
          <a class="brand" href="${resolvePath("")}">
            <strong>Reclaim Seoul</strong>
            <span>AAVS Seoul 2026 / Unit 3</span>
          </a>
          <div class="nav-links">
            <a class="live" href="${resolvePath("UrbanMiningMap/")}" aria-label="Open Urban Mining Map">Urban Mining Map</a>
            <span aria-disabled="true" title="Coming soon">Material Bank</span>
            <a class="live" href="${resolvePath("Atlas/")}" aria-label="Open Wasp Atlas">Wasp Atlas</a>
            <a class="live" href="https://hivelens.thecomputationalhive.com/" title="Open HiveLens">HiveLens</a>
            <a class="page-link" href="${resolvePath("about/")}"${isCurrent("about") ? ' aria-current="page"' : ""}>About</a>
          </div>
        </nav>
      </header>
    `;
  }
}

customElements.define("site-nav", SiteNav);
