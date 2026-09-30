import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Demo storage: submissions are appended to .data/<collection>.json so you can
// see the form working end to end. Swap this for your CRM, database or email
// service before going live — serverless hosts have a read-only filesystem.

const DATA_DIR = path.join(process.cwd(), ".data");

export async function saveSubmission(collection, record) {
  const file = path.join(DATA_DIR, `${collection}.json`);
  try {
    await mkdir(DATA_DIR, { recursive: true });
    let existing = [];
    try {
      existing = JSON.parse(await readFile(file, "utf8"));
    } catch {
      existing = [];
    }
    existing.push(record);
    await writeFile(file, JSON.stringify(existing, null, 2));
    return true;
  } catch (error) {
    console.warn(`[submissions] could not persist ${collection}:`, error.message);
    return false;
  }
}
