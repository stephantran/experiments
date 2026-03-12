/**
 * Territory Tags — Webflow CMS Nested List Workaround
 *
 * Parses a comma-separated plain text field of territories
 * (e.g., "Washington (Western), California (Northern), Idaho")
 * and renders them as styled, grouped tags inside each rep card.
 *
 * SETUP:
 *   1. Add a plain text field "Territory List" to your REPS collection
 *      Format: "Washington (Western), Washington (Eastern), Idaho (Northern)"
 *      For whole-state coverage, just use the state name: "Colorado, Wyoming, Montana"
 *
 *   2. In Webflow, inside each rep Collection Item, add:
 *      - A hidden Text Block bound to "Territory List"
 *        → Add custom attribute: data-territories=""  (value will be CMS-bound)
 *      - An empty Div Block where the tags will render
 *        → Add custom attribute: data-territory-target=""
 *
 *   3. Paste this script (and territories.css) into your page or project custom code.
 */

(function () {
  "use strict";

  // ---- CONFIG ----
  const GROUPED = true; // true = group regions by state, false = flat tag list

  // ---- HELPERS ----

  /**
   * Parse "Washington (Western)" → { state: "Washington", region: "Western" }
   * Parse "Colorado"             → { state: "Colorado",   region: null }
   */
  function parseTerritory(raw) {
    const trimmed = raw.trim();
    const match = trimmed.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (match) {
      return { state: match[1].trim(), region: match[2].trim() };
    }
    return { state: trimmed, region: null };
  }

  /**
   * Group an array of { state, region } by state name.
   * Returns: [ { state: "Washington", regions: ["Western", "Eastern"] }, ... ]
   */
  function groupByState(territories) {
    const map = new Map();
    territories.forEach(function (t) {
      if (!map.has(t.state)) {
        map.set(t.state, []);
      }
      if (t.region) {
        map.get(t.state).push(t.region);
      }
    });
    var groups = [];
    map.forEach(function (regions, state) {
      groups.push({ state: state, regions: regions });
    });
    return groups;
  }

  // ---- RENDERERS ----

  /** Render grouped tags: "Washington  Western · Eastern" */
  function renderGrouped(groups, container) {
    groups.forEach(function (group) {
      var tag = document.createElement("div");
      tag.className = "territory-tag";

      var stateName = document.createElement("span");
      stateName.className = "territory-state";
      stateName.textContent = group.state;
      tag.appendChild(stateName);

      if (group.regions.length > 0) {
        var regionList = document.createElement("span");
        regionList.className = "territory-regions";
        regionList.textContent = group.regions.join(" · ");
        tag.appendChild(regionList);
      }

      container.appendChild(tag);
    });
  }

  /** Render flat tags: one tag per territory */
  function renderFlat(territories, container) {
    territories.forEach(function (t) {
      var tag = document.createElement("div");
      tag.className = "territory-tag";

      var label = t.region ? t.state + " (" + t.region + ")" : t.state;
      tag.textContent = label;

      container.appendChild(tag);
    });
  }

  // ---- MAIN ----

  function init() {
    var sources = document.querySelectorAll("[data-territories]");

    sources.forEach(function (source) {
      var raw = source.textContent.trim();
      if (!raw) return;

      // Find the nearest target container (sibling or within same parent)
      var parent = source.parentElement;
      var target = parent.querySelector("[data-territory-target]");
      if (!target) {
        // Fallback: insert right after the source element
        target = document.createElement("div");
        target.setAttribute("data-territory-target", "");
        source.after(target);
      }

      // Parse territories
      var entries = raw.split(",").filter(function (s) {
        return s.trim().length > 0;
      });
      var territories = entries.map(parseTerritory);

      // Render
      target.classList.add("territory-container");
      if (GROUPED) {
        var groups = groupByState(territories);
        renderGrouped(groups, target);
      } else {
        renderFlat(territories, target);
      }

      // Hide the raw text source
      source.style.display = "none";
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
