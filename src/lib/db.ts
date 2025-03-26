"use client"; // Required if using Next.js 13+ App Router and this file is imported by a Client Component

import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";

// Optional plugin to enable .find() queries
PouchDB.plugin(PouchDBFind);

// 1) Create or open a local DB
const db = new PouchDB("shopping_lists_db");

// 2) (Optional) Setup remote sync
//    Replace the URL with your actual CouchDB/Cloudant endpoint if you have one
//    or comment out this entire section if you don't need sync right now.
const remoteDB = new PouchDB("http://admin:admin@localhost:5984/shopping_lists");

// Live sync with retry on failure
db.sync(remoteDB, { live: true, retry: true })
  .on("change", (info) => console.log("[Sync] change:", info))
  .on("paused", (err) => console.log("[Sync] paused:", err))
  .on("active", () => console.log("[Sync] active"))
  .on("denied", (err) => console.error("[Sync] denied:", err))
  .on("complete", (info) => console.log("[Sync] complete:", info))
  .on("error", (err) => console.error("[Sync] error:", err));

// ----------------------------------------------------
// Helper / CRUD functions
// ----------------------------------------------------

/**
 * Creates a new shopping list document in PouchDB.
 * @param name        - Name of the list (e.g. "Groceries")
 * @param description - Optional description for the list
 * @returns The newly created document
 */
export async function createShoppingList(name: string, description = "") {
  // Generate a unique ID. You could also use e.g. `uuidv4()` or another approach
  const docId = `shopping_list:${Date.now()}`;

  const doc = {
    _id: docId,
    type: "shopping_list",
    name,
    description,
    // Start with an empty array of items, or structure as needed
    items: [],
    createdAt: new Date().toISOString(),
  };

  await db.put(doc);
  return doc;
}

/**
 * Fetches all shopping list documents from the local DB.
 * Filters by `type === "shopping_list"`.
 * @returns An array of shopping list documents
 */
export async function getAllShoppingLists() {
  const result = await db.allDocs({ include_docs: true });
  // Filter to only those docs that match our "shopping_list" type
  return result.rows
    .map((row) => row.doc)
    .filter((doc: any) => doc.type === "shopping_list");
}

/**
 * Retrieves a single shopping list document by its `_id`.
 * @param id - The document _id
 * @returns The found doc or null if not found
 */
export async function getShoppingListById(id: string) {
  try {
    const doc = await db.get(id);
    return doc;
  } catch (error) {
    console.error("[DB] getShoppingListById error:", error);
    return null;
  }
}

/**
 * Updates a shopping list document by merging in partial fields.
 * @param id - The document _id
 * @param updates - Partial fields to update
 * @returns The updated doc
 */
export async function updateShoppingList(
  id: string,
  updates: Partial<{ name: string; description: string; items: any[] }>
) {
  try {
    const existingDoc = await db.get(id);
    const updatedDoc = { ...existingDoc, ...updates, _id: id };
    const response = await db.put(updatedDoc);
    return { ...updatedDoc, _rev: response.rev };
  } catch (error) {
    console.error("[DB] updateShoppingList error:", error);
    return null;
  }
}

/**
 * Deletes a shopping list document by its `_id`.
 * @param id - The document _id
 * @returns `true` if deletion succeeded
 */
export async function deleteShoppingList(id: string) {
  try {
    const doc = await db.get(id);
    await db.remove(doc);
    return true;
  } catch (error) {
    console.error("[DB] deleteShoppingList error:", error);
    return false;
  }
}

export default db;
