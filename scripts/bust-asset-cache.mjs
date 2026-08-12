#!/usr/bin/env node
/**
 * Stamp /assets/* URLs in CSS with file mtimes so in-place image replacements
 * bust browser caches (especially Safari) without renaming files.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const cssPath = path.join(root, "app", "globals.css");
const publicDir = path.join(root, "public");

let css = fs.readFileSync(cssPath, "utf8");
const seen = new Map();

css = css.replace(
  /([("'])(\/assets\/[^"'?\s)]+)(?:\?v=\d+)?([)"'])/g,
  (match, open, assetPath, close) => {
    const filePath = path.join(publicDir, assetPath.replace(/^\//, ""));
    if (!fs.existsSync(filePath)) return match;

    let version = seen.get(assetPath);
    if (!version) {
      version = String(Math.floor(fs.statSync(filePath).mtimeMs / 1000));
      seen.set(assetPath, version);
    }

    return `${open}${assetPath}?v=${version}${close}`;
  }
);

fs.writeFileSync(cssPath, css);

if (seen.size) {
  console.log(`Asset cache bust: updated ${seen.size} URL(s)`);
  for (const [asset, version] of seen) {
    console.log(`  ${asset}?v=${version}`);
  }
} else {
  console.log("Asset cache bust: no /assets URLs found");
}
