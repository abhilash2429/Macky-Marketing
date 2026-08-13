import { createHash } from "crypto";
import { readFileSync } from "fs";
import path from "path";

/** Content-hashed public URL so replaced files don't stay stuck in cache. */
export function publicAssetSrc(publicPath: string) {
  const relative = publicPath.replace(/^\//, "");
  const file = path.join(process.cwd(), "public", relative);
  const hash = createHash("md5").update(readFileSync(file)).digest("hex").slice(0, 10);
  return `/${relative}?v=${hash}`;
}
