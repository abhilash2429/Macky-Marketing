"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "macky-hero-placement-mobile";

export type HeroPlacement = {
  titleTop: number;
  descTop: number;
  ctaTop: number;
  titleSize: number;
  descSize: number;
  ctaSize: number;
  titleParallax: number;
  descParallax: number;
  ctaParallax: number;
};

export const DEFAULT_HERO_PLACEMENT: HeroPlacement = {
  titleTop: 23.5,
  descTop: 48,
  ctaTop: 65.5,
  titleSize: 52,
  descSize: 15,
  ctaSize: 13,
  titleParallax: 0.12,
  descParallax: 0.06,
  ctaParallax: 0.02,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function readStored(): HeroPlacement | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HeroPlacement>;
    return {
      titleTop: clamp(Number(parsed.titleTop ?? DEFAULT_HERO_PLACEMENT.titleTop), 0, 90),
      descTop: clamp(Number(parsed.descTop ?? DEFAULT_HERO_PLACEMENT.descTop), 0, 90),
      ctaTop: clamp(Number(parsed.ctaTop ?? DEFAULT_HERO_PLACEMENT.ctaTop), 0, 95),
      titleSize: clamp(Number(parsed.titleSize ?? DEFAULT_HERO_PLACEMENT.titleSize), 28, 72),
      descSize: clamp(Number(parsed.descSize ?? DEFAULT_HERO_PLACEMENT.descSize), 11, 22),
      ctaSize: clamp(Number(parsed.ctaSize ?? DEFAULT_HERO_PLACEMENT.ctaSize), 12, 20),
      titleParallax: clamp(Number(parsed.titleParallax ?? DEFAULT_HERO_PLACEMENT.titleParallax), 0, 0.4),
      descParallax: clamp(Number(parsed.descParallax ?? DEFAULT_HERO_PLACEMENT.descParallax), 0, 0.4),
      ctaParallax: clamp(Number(parsed.ctaParallax ?? DEFAULT_HERO_PLACEMENT.ctaParallax), 0, 0.4),
    };
  } catch {
    return null;
  }
}

function applyStyles(values: HeroPlacement) {
  const root = document.documentElement;
  root.style.setProperty("--hero-title-top", `${values.titleTop}%`);
  root.style.setProperty("--hero-desc-top", `${values.descTop}%`);
  root.style.setProperty("--hero-cta-top", `${values.ctaTop}%`);
  root.style.setProperty("--hero-title-size", `${values.titleSize}px`);
  root.style.setProperty("--hero-desc-size", `${values.descSize}px`);
  root.style.setProperty("--hero-cta-size", `${values.ctaSize}px`);
  root.dataset.heroPlacement = "on";
}

function applyParallax(values: HeroPlacement, scrollY: number) {
  const root = document.documentElement;
  root.style.setProperty("--hero-title-shift", `${-(scrollY * values.titleParallax)}px`);
  root.style.setProperty("--hero-desc-shift", `${-(scrollY * values.descParallax)}px`);
  root.style.setProperty("--hero-cta-shift", `${-(scrollY * values.ctaParallax)}px`);
}

function clearPlacement() {
  const root = document.documentElement;
  delete root.dataset.heroPlacement;
  [
    "--hero-title-top",
    "--hero-desc-top",
    "--hero-cta-top",
    "--hero-title-size",
    "--hero-desc-size",
    "--hero-cta-size",
    "--hero-title-shift",
    "--hero-desc-shift",
    "--hero-cta-shift",
  ].forEach((key) => root.style.removeProperty(key));
}

function toCssSnippet(values: HeroPlacement) {
  return `@media (max-width: 720px) {
  :root {
    --hero-title-top: ${values.titleTop}%;
    --hero-desc-top: ${values.descTop}%;
    --hero-cta-top: ${values.ctaTop}%;
    --hero-title-size: ${values.titleSize}px;
    --hero-desc-size: ${values.descSize}px;
    --hero-cta-size: ${values.ctaSize}px;
  }
}`;
}

type FieldKey = keyof HeroPlacement;

const FIELD_GROUPS: Array<{
  title: string;
  fields: Array<{
    key: FieldKey;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
  }>;
}> = [
  {
    title: "Position",
    fields: [
      { key: "titleTop", label: "Title top", min: 4, max: 70, step: 0.5, unit: "%" },
      { key: "descTop", label: "Body top", min: 10, max: 80, step: 0.5, unit: "%" },
      { key: "ctaTop", label: "CTA top", min: 20, max: 92, step: 0.5, unit: "%" },
    ],
  },
  {
    title: "Size",
    fields: [
      { key: "titleSize", label: "Title size", min: 28, max: 64, step: 1, unit: "px" },
      { key: "descSize", label: "Body size", min: 12, max: 20, step: 0.5, unit: "px" },
      { key: "ctaSize", label: "CTA size", min: 12, max: 18, step: 0.5, unit: "px" },
    ],
  },
  {
    title: "Parallax",
    fields: [
      { key: "titleParallax", label: "Title parallax", min: 0, max: 0.35, step: 0.01, unit: "" },
      { key: "descParallax", label: "Body parallax", min: 0, max: 0.35, step: 0.01, unit: "" },
      { key: "ctaParallax", label: "CTA parallax", min: 0, max: 0.35, step: 0.01, unit: "" },
    ],
  },
];

/**
 * Live mobile hero placement editor.
 * Open with `/?edit=hero` (phone viewport recommended).
 */
export function HeroPlacementEditor() {
  const [enabled, setEnabled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [values, setValues] = useState<HeroPlacement>(DEFAULT_HERO_PLACEMENT);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const active = params.get("edit") === "hero";
    setEnabled(active);
    if (!active) return;

    const initial = readStored() ?? DEFAULT_HERO_PLACEMENT;
    setValues(initial);
    applyStyles(initial);
    applyParallax(initial, window.scrollY);

    return () => clearPlacement();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    applyStyles(values);
    applyParallax(values, window.scrollY);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));

    const onScroll = () => applyParallax(values, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, values]);

  const snippet = useMemo(() => toCssSnippet(values), [values]);

  if (!enabled) return null;

  const update = (key: FieldKey, raw: string) => {
    const next = Number(raw);
    if (Number.isNaN(next)) return;
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const formatValue = (key: FieldKey, unit: string, step: number) => {
    const value = values[key];
    const decimals = step < 1 ? 1 : 0;
    if (!unit) return value.toFixed(2);
    return `${value.toFixed(decimals)}${unit}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className={`hero-placement-editor${collapsed ? " is-collapsed" : ""}`} aria-label="Hero placement editor">
      <header className="hero-placement-editor-header">
        <strong>Hero placement</strong>
        <button type="button" onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? "Open" : "Hide"}
        </button>
      </header>

      {!collapsed && (
        <>
          <p className="hero-placement-editor-hint">
            Position, size, and parallax for mobile hero copy.
          </p>

          <div className="hero-placement-editor-fields">
            {FIELD_GROUPS.map((group) => (
              <div key={group.title} className="hero-placement-editor-group">
                <p className="hero-placement-editor-group-title">{group.title}</p>
                {group.fields.map((field) => (
                  <label key={field.key} className="hero-placement-editor-field">
                    <span>
                      {field.label}
                      <em>{formatValue(field.key, field.unit, field.step)}</em>
                    </span>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={values[field.key]}
                      onChange={(event) => update(field.key, event.target.value)}
                    />
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="hero-placement-editor-actions">
            <button type="button" onClick={() => setValues(DEFAULT_HERO_PLACEMENT)}>
              Reset
            </button>
            <button type="button" className="is-primary" onClick={copy}>
              {copied ? "Copied" : "Copy CSS"}
            </button>
          </div>

          <pre className="hero-placement-editor-code">{snippet}</pre>
        </>
      )}
    </aside>
  );
}
