const SOURCE = "https://raw.githubusercontent.com/ReclaimSeoul/Reclaimed-Design-Catalog/main/";
const REMOTE_CATALOG = `${SOURCE}catalog.json`;
const catalogRoot = document.querySelector("#catalog");
const dialog = document.querySelector("#design-dialog");
const detail = document.querySelector("#design-detail");

const assetUrl = (path) => /^https?:\/\//i.test(path) ? path : SOURCE + path;
const label = (key) => key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[char]);

function renderAsset(path) {
  const url = assetUrl(path);
  const name = path.split("/").pop();
  if (/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(path)) return `<figure class="asset"><a href="${url}" target="_blank" rel="noreferrer"><img src="${url}" alt="${escapeHtml(name)}" loading="lazy"></a><figcaption>${escapeHtml(name)}</figcaption></figure>`;
  if (/\.(mp4|webm|mov)$/i.test(path)) return `<figure class="asset"><video src="${url}" controls preload="metadata"></video><figcaption>${escapeHtml(name)}</figcaption></figure>`;
  return `<a class="asset-link" href="${url}" target="_blank" rel="noreferrer">Open ${escapeHtml(name)}</a>`;
}

function openDesign(design) {
  const systemSlug = design.system?.id || design.system?.name;
  const atlasUrl = systemSlug ? `https://reclaimseoul.github.io/Atlas/build/${encodeURIComponent(systemSlug)}` : "https://reclaimseoul.github.io/Atlas/";
  detail.innerHTML = `<div class="detail-hero"><img src="${assetUrl(design.thumbnail)}" alt="${escapeHtml(design.title)}"><div><span class="eyebrow">${escapeHtml(label(design.group || "Ungrouped"))}</span><h2 id="detail-title">${escapeHtml(design.title || design.id)}</h2><p class="description">${escapeHtml(design.description || "")}</p>${design.tags?.length ? `<div class="tags">${design.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}<a class="atlas-button" href="${atlasUrl}">Try this system in Wasp Atlas</a></div></div>${design.assets?.length ? `<section class="assets"><h3>Additional assets</h3><div class="asset-grid">${design.assets.map(renderAsset).join("")}</div></section>` : ""}`;
  dialog.showModal();
  document.body.style.overflow = "hidden";
}

function renderCatalog(data) {
  const designs = data.systems.flatMap((system) => system.designs || []);
  const groups = designs.reduce((result, design) => {
    (result[design.group || "ungrouped"] ||= []).push(design);
    return result;
  }, {});
  catalogRoot.innerHTML = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, undefined, {numeric:true})).map(([group, entries]) => `<section class="group"><div class="group-head"><h2>${escapeHtml(label(group))}</h2><span class="count">${entries.length} design${entries.length === 1 ? "" : "s"}</span></div><div class="grid">${entries.map((design) => `<button class="card" type="button" data-id="${escapeHtml(design.id)}"><img class="thumb" src="${assetUrl(design.thumbnail)}" alt="" loading="lazy"><span class="card-copy"><span class="system">${escapeHtml(design.system?.name || "Design")}</span><h3>${escapeHtml(design.title || design.id)}</h3></span></button>`).join("")}</div></section>`).join("") || `<p class="status">No designs are currently published.</p>`;
  catalogRoot.addEventListener("click", (event) => { const card = event.target.closest(".card"); if (card) openDesign(designs.find((design) => design.id === card.dataset.id)); });
}

dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => { document.body.style.overflow = ""; });

async function loadCatalog() {
  try {
    const response = await fetch(`${REMOTE_CATALOG}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}`);
    return await response.json();
  } catch (remoteError) {
    console.warn("Could not load the live design catalog; using the local snapshot.", remoteError);
    const response = await fetch("catalog.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Local fallback returned HTTP ${response.status}`);
    return await response.json();
  }
}

loadCatalog()
  .then(renderCatalog)
  .catch((error) => {
    catalogRoot.innerHTML = `<p class="status">The design catalog could not be loaded. ${escapeHtml(error.message)}</p>`;
  });
