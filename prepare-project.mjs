import { copyFile, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const mappings = [
  ["page.tsx", "app/page.tsx"],
  ["layout.tsx", "app/layout.tsx"],
  ["globals.css", "app/globals.css"],
  ["PosterStudio.tsx", "components/PosterStudio.tsx"],
  ["ControlPanel.tsx", "components/editor/ControlPanel.tsx"],
  ["PosterCanvas.tsx", "components/canvas/PosterCanvas.tsx"],
  ["amount.ts", "lib/amount.ts"],
  ["defaultPoster.ts", "lib/defaultPoster.ts"],
  ["storage.ts", "lib/storage.ts"],
  ["poster.ts", "types/poster.ts"],
];

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

const restored = [];
const missing = [];

for (const [flatName, destination] of mappings) {
  const destinationPath = path.join(root, destination);
  if (await exists(destinationPath)) continue;

  const flatPath = path.join(root, flatName);
  if (!(await exists(flatPath))) {
    missing.push(`${flatName} → ${destination}`);
    continue;
  }

  await mkdir(path.dirname(destinationPath), { recursive: true });
  await copyFile(flatPath, destinationPath);
  restored.push(destination);
}

const nextEnvPath = path.join(root, "next-env.d.ts");
if (!(await exists(nextEnvPath))) {
  await writeFile(
    nextEnvPath,
    '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n',
    "utf8",
  );
  restored.push("next-env.d.ts");
}

if (missing.length) {
  console.error("\nProject source files are incomplete. Missing:");
  for (const item of missing) console.error(`- ${item}`);
  console.error("\nUpload every file from the complete GitHub upload package, then redeploy.\n");
  process.exit(1);
}

if (restored.length) {
  console.log(`Restored ${restored.length} project files into the required Next.js folders.`);
} else {
  console.log("Project folder structure is ready.");
}
