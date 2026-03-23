/** CA — copy to clipboard + selectable text */
(function initCaCopy() {
  const btn = document.getElementById("ca-copy-btn");
  const display = document.getElementById("ca-copy-display");
  if (!btn || !display) return;

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      return true;
    } finally {
      document.body.removeChild(ta);
    }
  }

  btn.addEventListener("click", async () => {
    const text = btn.dataset.copyText || display.textContent.trim();
    try {
      await copyText(text);
      btn.classList.add("is-copied");
      const action = btn.querySelector(".btn-ca-action");
      if (action) action.textContent = "Copied";
      window.setTimeout(() => {
        btn.classList.remove("is-copied");
        if (action) action.textContent = "Copy";
      }, 2000);
    } catch {
      /* user can still select text manually */
    }
  });
})();

/** Buy + footer pump → pump.fun; set data-pump-mint on #buy-link for /coin/{mint} */
(function initPumpLinks() {
  const buy = document.getElementById("buy-link");
  const footer = document.getElementById("footer-pump-link");
  const mint = (buy?.dataset.pumpMint || "").trim();
  const href = mint
    ? `https://pump.fun/coin/${encodeURIComponent(mint)}`
    : "https://pump.fun";
  if (buy) buy.href = href;
  if (footer) footer.href = href;
})();

/** DexScreener — iframe always shows dexscreener.com; with data-dex-address → token page */
(function initLiveChart() {
  const root = document.getElementById("live-chart-root");
  const iframe = document.getElementById("dex-chart-iframe");
  const openFull = document.getElementById("chart-open-full");
  if (!root || !iframe) return;

  const chain = (root.dataset.dexChain || "solana").trim().toLowerCase();
  const addr = (root.dataset.dexAddress || "").trim();

  const defaultUrl = "https://dexscreener.com";
  const chartUrl = addr
    ? `https://dexscreener.com/${encodeURIComponent(chain)}/${encodeURIComponent(addr)}`
    : defaultUrl;

  iframe.src = chartUrl;
  if (openFull) openFull.href = chartUrl;
})();

/** Timeline — scroll-reveal */
(function initTimelineReveal() {
  const items = document.querySelectorAll(".timeline-item");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("timeline-item--in"));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("timeline-item--in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach((el) => obs.observe(el));
})();

// Show hero video layer when you add <source> or src
(function initHeroVideo() {
  const video = document.querySelector(".hero-video");
  const layer = document.querySelector(".hero-video-layer");
  if (!video || !layer) return;

  function check() {
    const hasSrc =
      Boolean(video.currentSrc) ||
      Boolean(video.getAttribute("src")) ||
      Boolean(video.querySelector("source[src]"));
    layer.classList.toggle("has-video", hasSrc);
  }

  check();
  video.addEventListener("loadeddata", check);
})();
