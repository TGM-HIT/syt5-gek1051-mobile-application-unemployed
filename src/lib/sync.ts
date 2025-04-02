"use client"

import { Address, BaseType, List, ShoppingListEntry } from '@/types/shoppinglist';

import PouchDB from 'pouchdb-browser';

export const localDB = new PouchDB('shopping_lists');

export async function getLists(): Promise<List[]> {
    try {
        const result = await localDB.allDocs<BaseType>({ include_docs: true });
        const lists = result.rows.map(row => row.doc).filter(doc => doc && doc.type === "list");
        return lists as unknown as List[]
    } catch (error) {
        console.error('Error fetching lists:', error);
        return []
    }
}

export async function addList(name: string,
    description: string,
    address: Address
): Promise<void> {
    try {
        await localDB.put({
            _id: crypto.randomUUID(),
            type: 'list',
            name,
            description,
            address,
            entries: {}
        });
    } catch (error) {
        console.error('Error adding list:', error);
    }
}

export async function updateList(list: List): Promise<void> {
    try {
        const existing = await localDB.get(list._id);
        await localDB.put({ ...existing, ...list, updatedAt: new Date() });
    } catch (error) {
        console.error('Error updating list:', error);
    }
}

export async function deleteList(id: string): Promise<void> {
    try {
        const doc = await localDB.get(id);
        await localDB.remove(doc);
    } catch (error) {
        console.error('Error deleting list:', error);
    }
}

export async function getEntries(listId: string): Promise<ShoppingListEntry[]> {
    try {
        const list: List = await localDB.get(listId)
        return Object.keys(list.entries).map((e) => {
            return {
                ...list.entries[e],
                updatedAt: new Date(list.entries[e].updatedAt),
                createdAt: new Date(list.entries[e].createdAt)
            }
        })
    } catch (error) {
        console.error('Error while retrieving list:', error);
        return []
    }
}

export async function addOrUpdateEntry(listId: string, entry: ShoppingListEntry): Promise<void> {
    try {
        const list: List = await localDB.get(listId);
        list.entries[entry.id] = entry
        await localDB.put(list);
    } catch (error) {
        console.error('Error adding entry:', error);
    }
}

export async function deleteEntry(listId: string, entryId: string): Promise<void> {
    try {
        const list: List = await localDB.get(listId);
        delete list.entries[entryId]
        await localDB.put(list);
    } catch (error) {
        console.error('Error deleting entry:', error);
    }
}

export function syncDatabase(remoteURL: string, auth?: { username: string, password: string }) {
    const remoteDB = new PouchDB(remoteURL, {
        auth
    });
    localDB.sync(remoteDB, { live: true, retry: true })
        .on('change', (info) => console.log('Sync Change:', info))
        .on('paused', (err) => console.log('Sync Paused:', err))
        .on('active', () => console.log('Sync Active'))
        .on('denied', (err) => console.error('Sync Denied:', err))
        .on('complete', (info) => console.log('Sync Complete:', info))
        .on('error', (err) => console.error('Sync Error:', err));
}

// Listen for real-time changes and update UI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function listenForChanges(updateUI: (data: any) => void) {
    localDB.changes({
        since: 'now',
        live: true,
        include_docs: true
    }).on('change', (change) => {
        console.log('Database Change:', change);
        updateUI(change.doc);
    }).on('error', (err) => console.error('Change Listener Error:', err));
}
