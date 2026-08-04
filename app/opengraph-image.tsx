import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const alt = "a.SYNC — Agence digitale : prospection, sites, réseaux sociaux";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0B",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "radial-gradient(circle at 50% 35%, rgba(34,211,238,0.28), transparent 60%)",
          }}
        />
        <svg width="110" height="110" viewBox="0 0 64 64" fill="none" style={{ marginBottom: 36 }}>
          <path d="M52 32a20 20 0 1 1-8.5-16.4" stroke="#F5F5F7" strokeWidth="5" strokeLinecap="round" />
          <circle cx="49" cy="13" r="5.5" fill="#22D3EE" />
        </svg>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 600, color: "#F5F5F7", letterSpacing: -1 }}>
          a<span style={{ color: "#22D3EE" }}>.</span>SYNC
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#A1A1AA", display: "flex", maxWidth: 820, textAlign: "center" }}>
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
