import Image from "next/image";

export function MackyLogo({
  size = 36,
  glow = false,
  loading = "lazy",
}: {
  size?: number;
  glow?: boolean;
  loading?: "eager" | "lazy";
}) {
  return (
    <span
      className={`macky-logo ${glow ? "macky-logo-glow" : ""}`}
      style={{ width: size, height: Math.round(size * 0.76), borderRadius: Math.round(size * 0.18) }}
      aria-hidden="true"
    >
      <Image className="macky-logo-image" src="/assets/macky-logo.png" alt="" width={414} height={414} loading={loading} />
    </span>
  );
}
