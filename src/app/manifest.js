import { brand } from "@/data/site";

export default function manifest() {
  return {
    name: brand.full,
    short_name: brand.short,
    description: "Compare and secure loans from 250+ partner banks and NBFCs, with one advisor from application to disbursal.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#04234c",
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
