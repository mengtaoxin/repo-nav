// This file is just for SEO
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Repo Nav - Repository Navigation Tool";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: "bold",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            backgroundClip: "text",
            color: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Repo Nav
        </div>
        <div style={{ fontSize: 32, color: "#cbd5e1" }}>
          Bookmark & Organize Your Git Repositories
        </div>
      </div>
    ),
    { ...size }
  );
}
