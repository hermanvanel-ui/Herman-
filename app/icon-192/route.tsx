import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0B",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 64 64" fill="none">
          <path d="M52 32a20 20 0 1 1-8.5-16.4" stroke="#F5F5F7" strokeWidth="6" strokeLinecap="round" />
          <circle cx="49" cy="13" r="6.5" fill="#22D3EE" />
        </svg>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
