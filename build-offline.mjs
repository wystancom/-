import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const sourceHtml = fs.readFileSync(path.join(projectDir, "index.html"), "utf8");
const css = fs.readFileSync(path.join(projectDir, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(projectDir, "game.js"), "utf8");

let offlineHtml = sourceHtml
  .replace("  <!-- OFFLINE_STYLE -->\n", `  <style>\n${css}\n  </style>\n`)
  .replace(/\s*<link rel="stylesheet" href="styles\.css(?:\?[^\"]*)?">\n/, "")
  .replace("  <!-- OFFLINE_SCRIPT -->\n", `  <script>\n${js}\n  </script>\n`)
  .replace(/\s*<script src="game\.js(?:\?[^\"]*)?" defer><\/script>\n/, "");

for (const filename of [
  "xiaoche-v7.jpg",
  "qiaoan-v7.jpg",
  "jibai-v7.jpg",
  "xiaokui-v7.jpg",
  "lingyin-v3.jpg",
  "tangmo-v3.jpg",
  "baiyu-v3.jpg",
  "xialan-v3.jpg",
  "songyao-v3.jpg"
]) {
  const assetPath = path.join(projectDir, "assets", "characters", filename);
  const encoded = fs.readFileSync(assetPath).toString("base64");
  offlineHtml = offlineHtml.replaceAll(`assets/characters/${filename}`, `data:image/jpeg;base64,${encoded}`);
}

const outputPath = path.join(projectDir, "START_GAME.html");
fs.writeFileSync(outputPath, offlineHtml, "utf8");

const externalScriptCount = (offlineHtml.match(/<script\s+[^>]*src=/gi) || []).length;
const externalStyleCount = (offlineHtml.match(/<link\s+[^>]*rel=["']stylesheet["']/gi) || []).length;
const remoteUrlCount = (offlineHtml.match(/https?:\/\//gi) || []).length;

if (externalScriptCount || externalStyleCount || remoteUrlCount) {
  throw new Error(`Offline audit failed: scripts=${externalScriptCount}, styles=${externalStyleCount}, urls=${remoteUrlCount}`);
}

console.log(`OFFLINE_BUILD_OK ${outputPath}`);
console.log(`bytes=${Buffer.byteLength(offlineHtml)} externalScripts=0 externalStyles=0 remoteUrls=0`);
