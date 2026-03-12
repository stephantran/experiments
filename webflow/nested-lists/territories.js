/**
 * Territory Tags — Webflow CMS Nested List Workaround
 *
 * Parses a comma-separated plain text field of territories and renders
 * them as styled, grouped tags inside each rep card.
 *
 * TEMPLATE MODE (recommended):
 *   Style the tags visually in Webflow Designer, then the script clones
 *   your styled elements. No custom CSS needed in <head>.
 *
 *   Build this structure ONCE anywhere on the page (outside the collection list):
 *
 *     Div Block → attribute: data-territory-template
 *     └── Div Block → class: territory-tag
 *         ├── Text Block → class: territory-state   (placeholder: "State")
 *         └── Text Block → class: territory-regions  (placeholder: "Region")
 *
 *   Style .territory-tag, .territory-state, .territory-regions visually
 *   in the Designer. The template wrapper is auto-hidden by the script.
 *
 * FALLBACK MODE:
 *   If no template is found, the script creates elements with those same
 *   class names. You'd then style them via custom CSS in <head>.
 *
 * DATA SETUP:
 *   1. Add a plain text field "Territory List" to your REPS collection
 *      Accepts display names: "Washington (Western), Idaho"
 *      Or CMS slugs:         "western-washington, idaho"
 *
 *   2. Inside each rep Collection Item, add:
 *      - A Text Block bound to "Territory List"
 *        → attribute: data-territories
 *      - A Div Block where the tags will render
 *        → attribute: data-territory-target
 *        (Optional — script creates one if missing)
 */

(function () {
  "use strict";

  // ---- CONFIG ----
  var GROUPED = true; // true = group regions by state, false = flat tag list

  // ---- SLUG-TO-NAME CONVERSION ----

  var REGION_PREFIXES = [
    "northeastern", "northwestern", "southeastern", "southwestern",
    "northern", "southern", "eastern", "western", "central",
    "ne", "nw", "se", "sw"
  ];

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

  var UPPERCASE_REGIONS = ["ne", "nw", "se", "sw"];

  function titleCase(str) {
    if (UPPERCASE_REGIONS.indexOf(str.toLowerCase()) > -1) return str.toUpperCase();
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function slugToName(slug) {
    if (MULTI_WORD_STATES[slug]) return MULTI_WORD_STATES[slug];
    return slug.split("-").map(titleCase).join(" ");
  }

  function isSlug(str) {
    return /^[a-z0-9-]+$/.test(str.trim());
  }

  function parseSlug(slug) {
    slug = slug.trim();
    for (var i = 0; i < REGION_PREFIXES.length; i++) {
      var prefix = REGION_PREFIXES[i];
      if (slug.indexOf(prefix + "-") === 0) {
        var stateSlug = slug.slice(prefix.length + 1);
        if (stateSlug.length > 0) {
          return { state: slugToName(stateSlug), region: titleCase(prefix) };
        }
      }
    }
    return { state: slugToName(slug), region: null };
  }

  function parseDisplayName(raw) {
    var trimmed = raw.trim();
    var match = trimmed.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (match) return { state: match[1].trim(), region: match[2].trim() };
    return { state: trimmed, region: null };
  }

  function parseTerritory(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return null;
    return isSlug(trimmed) ? parseSlug(trimmed) : parseDisplayName(trimmed);
  }

  // ---- GROUPING ----

  function groupByState(territories) {
    var map = new Map();
    territories.forEach(function (t) {
      if (!map.has(t.state)) map.set(t.state, []);
      if (t.region) map.get(t.state).push(t.region);
    });
    var groups = [];
    map.forEach(function (regions, state) {
      groups.push({ state: state, regions: regions });
    });
    return groups;
  }

  // ---- TEMPLATE HANDLING ----

  /**
   * Look for a Webflow-designed template on the page.
   * Returns { tag, stateEl, regionEl } or null if not found.
   */
  function findTemplate() {
    var wrapper = document.querySelector("[data-territory-template]");
    if (!wrapper) return null;

    var tag = wrapper.querySelector(".territory-tag");
    if (!tag) return null;

    var stateEl = tag.querySelector(".territory-state");
    var regionEl = tag.querySelector(".territory-regions");

    // Hide the template wrapper so it doesn't show on the page
    wrapper.style.display = "none";

    return {
      tag: tag,
      stateEl: stateEl,
      regionEl: regionEl
    };
  }

  // ---- RENDERERS ----

  /**
   * Create a tag element — clones from template if available,
   * otherwise creates plain elements.
   */
  function createTag(template, stateName, regionText) {
    var tag, stateEl, regionEl;

    if (template) {
      // Clone the Webflow-styled template
      tag = template.tag.cloneNode(true);
      stateEl = tag.querySelector(".territory-state");
      regionEl = tag.querySelector(".territory-regions");
    } else {
      // Fallback: create plain elements (styled via custom CSS)
      tag = document.createElement("div");
      tag.className = "territory-tag";
      stateEl = document.createElement("span");
      stateEl.className = "territory-state";
      tag.appendChild(stateEl);
      regionEl = document.createElement("span");
      regionEl.className = "territory-regions";
      tag.appendChild(regionEl);
    }

    // Fill in the text content
    if (stateEl) stateEl.textContent = stateName;

    if (regionText) {
      if (regionEl) {
        regionEl.textContent = regionText;
        regionEl.style.display = "";
      }
    } else {
      // No region — hide the region element
      if (regionEl) regionEl.style.display = "none";
    }

    return tag;
  }

  function renderGrouped(groups, container, template) {
    groups.forEach(function (group) {
      var regionText = group.regions.length > 0
        ? group.regions.join(" \u00b7 ")
        : null;
      var tag = createTag(template, group.state, regionText);
      container.appendChild(tag);
    });
  }

  function renderFlat(territories, container, template) {
    territories.forEach(function (t) {
      var tag = createTag(template, t.state, t.region);
      container.appendChild(tag);
    });
  }

  // ---- MAIN ----

  function init() {
    // Find the optional Webflow-designed template
    var template = findTemplate();

    var sources = document.querySelectorAll("[data-territories]");

    sources.forEach(function (source) {
      var raw = source.textContent.trim();
      if (!raw) return;

      // Find the target container (sibling within same parent)
      var parent = source.parentElement;
      var target = parent.querySelector("[data-territory-target]");
      if (target === parent) target = null;

      if (!target) {
        target = document.createElement("div");
        target.setAttribute("data-territory-target", "");
        source.after(target);
      }

      // Clear any previously rendered tags
      target.innerHTML = "";

      // Parse territories
      var entries = raw.split(",").filter(function (s) {
        return s.trim().length > 0;
      });
      var territories = entries.map(parseTerritory).filter(Boolean);

      // Add the container class (for flex layout if using CSS fallback)
      target.classList.add("territory-container");

      // Render
      if (GROUPED) {
        renderGrouped(groupByState(territories), target, template);
      } else {
        renderFlat(territories, target, template);
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
