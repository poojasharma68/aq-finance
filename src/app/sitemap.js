import { siteUrl } from "@/data/site";

const pages = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/loans", changeFrequency: "monthly", priority: 0.9 },
  { path: "/apply", changeFrequency: "monthly", priority: 0.9 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
];

export default function sitemap() {
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
