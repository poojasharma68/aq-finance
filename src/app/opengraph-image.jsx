import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand, offices } from "@/data/site";

// The preview card shown when the site is shared on WhatsApp, Facebook,
// LinkedIn and the like, and that Google can use alongside search results.
export const alt = `${brand.full} — loans from 250+ banks and NBFCs`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = await readFile(join(process.cwd(), "public/brand/sbft-emblem.png"));
const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 88px",
          background: "#04234c",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: 320,
            height: 340,
            borderRadius: 40,
            background: "#ffffff",
            flexShrink: 0,
          }}
        >
          <img src={logoSrc} width={220} height={209} alt="" />
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#04234c",
              textTransform: "uppercase",
            }}
          >
            {brand.full}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", fontSize: 30, color: "#e8841a", letterSpacing: 4 }}>{brand.short}</div>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 700, lineHeight: 1.05, marginTop: 12 }}>
            {brand.full}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#c9d4e4", flexWrap: "wrap", marginTop: 24, lineHeight: 1.3 }}>
            Personal, home &amp; business loans from 250+ banks and NBFCs
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#e8841a", marginTop: 28 }}>{offices[0].address}</div>
        </div>
      </div>
    ),
    size,
  );
}
