import { readFile, mkdir, writeFile } from "node:fs/promises";

// A real nested HTML entry lets static hosts serve /craftflow without SPA rewrites.
const root = new URL("../dist/", import.meta.url);
const title = "Craftflow by Grenwall | Independent Design Studio";
const description =
  "Different looks good on you. Craftflow is an independent Grenwall studio for brand strategy, visual identity, websites and campaigns.";
let html = await readFile(new URL("index.html", root), "utf8");
html = html
  .replace(
    /<title>.*?<\/title>/,
    `<title>${title.replaceAll("&", "&amp;")}</title>`,
  )
  .replace(
    /(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*(")/g,
    `$1${description}$2`,
  )
  .replace(
    /(<meta\s+(?:name|property)="(?:og:title|twitter:title)"\s+content=")[^"]*(")/g,
    `$1${title.replaceAll("&", "&amp;")}$2`,
  )
  .replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    "$1https://grenwall.org/craftflow$2",
  )
  .replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    "$1https://grenwall.org/craftflow$2",
  )
  .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
await mkdir(new URL("craftflow/", root), { recursive: true });
await writeFile(new URL("craftflow/index.html", root), html);
console.log("Created dist/craftflow/index.html");
