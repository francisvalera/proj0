// scripts/collect-admin-context.mjs
import { promises as fs } from "fs";
import path from "path";
const cwd = process.cwd();

const tryRead = async (p) => {
  try { return await fs.readFile(p, "utf8"); } catch { return null; }
};
const exists = async (p) => !!(await fs.stat(p).catch(() => null));

const pick = (obj, keys) =>
  Object.fromEntries(keys.filter(k => k in (obj ?? {})).map(k => [k, obj[k]]));

async function readJSON(p) {
  const txt = await tryRead(p);
  if (!txt) return null;
  try { return JSON.parse(txt); } catch { return { __raw: txt.slice(0, 2000) }; }
}

async function walk(dir, depth = 0, maxDepth = 2, acc = []) {
  if (depth > maxDepth) return acc;
  let entries = [];
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (["node_modules", ".next", ".git", "dist", "coverage"].includes(e.name)) continue;
      acc.push({ type: "dir", path: full });
      await walk(full, depth + 1, maxDepth, acc);
    } else {
      acc.push({ type: "file", path: full });
    }
  }
  return acc;
}

async function main() {
  const report = {};

  // Basic configs
  report.packageJson = pick(await readJSON(path.join(cwd, "package.json")), ["name","version","scripts","dependencies","devDependencies"]);
  for (const f of ["next.config.ts","next.config.mjs","next.config.js","tsconfig.json","tailwind.config.ts","tailwind.config.js","postcss.config.js","eslint.config.mjs",".eslintrc.json",".eslintrc.js"]) {
    if (await exists(path.join(cwd, f))) {
      report[f] = (await tryRead(path.join(cwd, f)))?.slice(0, 20000);
    }
  }

  // App structure (shallow)
  for (const base of ["src/app","app","src/components","components","src/lib","lib"]) {
    const p = path.join(cwd, base);
    if (await exists(p)) {
      report[`tree:${base}`] = (await walk(p, 0, base.endsWith("app") ? 3 : 2)).map(x => x.path.replace(cwd + path.sep, ""));
    }
  }

  // Admin pages & guards
  for (const p of [
    "middleware.ts",
    "src/app/(admin)/admin/layout.tsx",
    "src/app/(admin)/admin/page.tsx",
  ]) {
    if (await exists(path.join(cwd, p))) {
      report[p] = (await tryRead(path.join(cwd, p)))?.slice(0, 20000);
    }
  }

  // Auth
  const authCandidates = [
    "src/app/api/auth/[...nextauth]/route.ts",
    "pages/api/auth/[...nextauth].ts",
    "src/lib/auth.ts",
  ];
  for (const p of authCandidates) {
    if (await exists(path.join(cwd, p))) {
      report[p] = (await tryRead(path.join(cwd, p)))?.slice(0, 20000);
    }
  }

  // Data layer
  if (await exists(path.join(cwd, "prisma/schema.prisma"))) {
    report["prisma/schema.prisma"] = await tryRead(path.join(cwd, "prisma/schema.prisma"));
  }
  // Common mongoose model locations (sample)
  for (const dir of ["src/models","models"]) {
    if (await exists(path.join(cwd, dir))) {
      report[`tree:${dir}`] = (await walk(path.join(cwd, dir), 0, 2)).map(x => x.path.replace(cwd + path.sep, ""));
    }
  }

  // API routes (shallow trees)
  for (const base of ["src/app/api","app/api","pages/api"]) {
    const p = path.join(cwd, base);
    if (await exists(p)) {
      report[`tree:${base}`] = (await walk(p, 0, 3)).map(x => x.path.replace(cwd + path.sep, ""));
    }
  }

  // Styling + globals
  for (const p of ["src/app/globals.css","app/globals.css","src/styles/globals.css","styles/globals.css"]) {
    if (await exists(path.join(cwd, p))) report[p] = (await tryRead(path.join(cwd, p)))?.slice(0, 20000);
  }

  // Save
  const out = path.join(cwd, "admin-integration-report.json");
  await fs.writeFile(out, JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${out} with ${Object.keys(report).length} sections.`);
}

main().catch(e => { console.error(e); process.exit(1); });
