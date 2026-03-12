/**
 * Territory Tags — Webflow CMS Nested List Workaround
 *
 * Parses a comma-separated plain text field of territories and renders
 * them as styled, grouped tags inside each rep card.
 *
 * Accepts TWO formats:
 *   Display names:  "Washington (Western), California (Northern), Idaho"
 *   CMS slugs:      "western-washington, northern-california, idaho"
 *
 * SETUP:
 *   1. Add a plain text field "Territory List" to your REPS collection
 *   2. In Webflow, inside each rep Collection Item, add:
 *      - A Text Block bound to "Territory List"
 *        → Add custom attribute: data-territories
 *      - An empty Div Block where the tags will render
 *        → Add custom attribute: data-territory-target
 *      (The target div is optional — the script will create one if missing)
 *   3. Paste this script + the CSS into your page custom code.
 */

(function () {
  "use strict";

  // ---- CONFIG ----
  var GROUPED = true; // true = group regions by state, false = flat tag list

  // ---- SLUG-TO-NAME CONVERSION ----

  // Known region prefixes that appear BEFORE the state name in CMS slugs.
  // Order matters: longer prefixes first so "southeastern" matches before "south".
  var REGION_PREFIXES = [
    "northeastern", "northwestern", "southeastern", "southwestern",
    "northern", "southern", "eastern", "western", "central",
    "ne", "nw", "se", "sw"
  ];

  // Multi-word US states (slug form → proper name)
  var MULTI_WORD_STATES = {
    "new-hampshire": "New Hampshire",
    "new-jersey": "New Jersey",
    "new-mexico": "New Mexico",
    "new-york": "New York",
    "north-carolina": "North Carolina",
    "north-dakota": "North Dakota",
    "rhode-island": "Rhode Island",
    "south-carolina": "South Carolina",
    "south-dakota": "South Dakota",
    "west-virginia": "West Virginia",
    "district-of-columbia": "District of Columbia",
    "puerto-rico": "Puerto Rico"
  };

  // Short region abbreviations that should be fully uppercased
  var UPPERCASE_REGIONS = ["ne", "nw", "se", "sw"];

  /** Title-case a single word: "washington" → "Washington", "sw" → "SW" */
  function titleCase(str) {
    if (UPPERCASE_REGIONS.indexOf(str.toLowerCase()) > -1) {
      return str.toUpperCase();
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /** Convert a hyphenated slug to a proper name: "new-york" → "New York" */
  function slugToName(slug) {
    if (MULTI_WORD_STATES[slug]) return MULTI_WORD_STATES[slug];
    return slug.split("-").map(titleCase).join(" ");
  }

  /**
   * Detect if a string looks like a CMS slug (lowercase + hyphens, no parens).
   */
  function isSlug(str) {
    return /^[a-z0-9-]+$/.test(str.trim());
  }

  /**
   * Parse a CMS slug like "western-washington" → { state: "Washington", region: "Western" }
   * Or a plain state slug like "oregon" → { state: "Oregon", region: null }
   */
  function parseSlug(slug) {
    slug = slug.trim();

    // Try each region prefix
    for (var i = 0; i < REGION_PREFIXES.length; i++) {
      var prefix = REGION_PREFIXES[i];
      if (slug.indexOf(prefix + "-") === 0) {
        var stateSlug = slug.slice(prefix.length + 1); // everything after "prefix-"
        if (stateSlug.length > 0) {
          return {
            state: slugToName(stateSlug),
            region: titleCase(prefix)
          };
        }
      }
    }

    // No region prefix found — whole-state coverage
    return { state: slugToName(slug), region: null };
  }

  // ---- DISPLAY NAME PARSING ----

  /**
   * Parse "Washington (Western)" → { state: "Washington", region: "Western" }
   * Parse "Colorado"             → { state: "Colorado",   region: null }
   */
  function parseDisplayName(raw) {
    var trimmed = raw.trim();
    var match = trimmed.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (match) {
      return { state: match[1].trim(), region: match[2].trim() };
    }
    return { state: trimmed, region: null };
  }

  // ---- UNIFIED PARSER ----

  /**
   * Auto-detect format and parse a single territory entry.
   */
  function parseTerritory(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return null;
    if (isSlug(trimmed)) {
      return parseSlug(trimmed);
    }
    return parseDisplayName(trimmed);
  }

  // ---- GROUPING ----

  /**
   * Group an array of { state, region } by state name.
   * Returns: [ { state: "Washington", regions: ["Western", "Eastern"] }, ... ]
   */
  function groupByState(territories) {
    var map = new Map();
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
        regionList.textContent = group.regions.join(" \u00b7 ");
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

      // Don't match the parent itself if it has the attribute
      if (target === parent) target = null;

      if (!target) {
        // Create a target container right after the source element
        target = document.createElement("div");
        target.setAttribute("data-territory-target", "");
        source.after(target);
      }

      // Clear any previously rendered tags (in case of re-run)
      target.innerHTML = "";

      // Parse territories
      var entries = raw.split(",").filter(function (s) {
        return s.trim().length > 0;
      });
      var territories = entries.map(parseTerritory).filter(Boolean);

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
